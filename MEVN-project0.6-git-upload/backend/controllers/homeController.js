const fs = require('fs')
const { glob } = require('glob')
const util = require('util')

const Departure = require('../models/departureModel')
const Trip = require('../models/tripModel')
const Scenario = require('../models/scenarioModel')
const StopFacility = require('../models/stopFacilityModel')
const Link = require('../models/linkModel')
const { runScenario, analyzeScenario } = require('../utils/runScenario')
const { recommend } = require('../utils/recommend')
const { findShortestPathSubset } = require('../utils/findShortestPath')
const { calculateOffset } = require('../utils/calculateOffset')

const handleErrors = (err) => {

    const errors = { _id: '', description: '', longitude: '', latitude: '', linkRef: '', seats: '', standingCapacity: '', length: '', width: '', id: '', routes: '', departures: '', general: '' }
    console.log(err)

    // duplicate error code
    if (err.code === 11000) {
        errors._id = 'This id is already used'
    } // validation errors
    else if (err.message.toLowerCase().includes('validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    } else if (err.message.toLowerCase().includes('geo keys')) {
        errors.longitude = 'Invalid longitude'
        errors.latitude = 'Invalid latitude'
    } else if (err.message === 'No links available for the selected coordinates' ) {
        errors.linkRef = err.message
    } else
    // general errors
    {
        errors.general = 'Unexpected error: ' + err.message
    }

    return errors
}

/* -------------------------- controllers -------------------------- */

// get statistics
const getStatistics = async (req, res) => {

    const scoreJson = { id: null, score: 0, avgTravelTime: 0, avgTransits: 0, numberOfVehicles: 0 }
    try {    
        // get the avg score of the scenario
        // read file with avg score/iteration
        const scoresPath = await glob('services/MATSim/scenarios/cottbus/output/*scorestats.txt')
        fs.readFile(scoresPath[0], 'utf8', (error, data) => {
            // split it by line
            let line = data.split('\n');
            // split last line by tabs to get avg score of last iteration (splice(-2) -> get the second from the end line, since last line is empty)
            let row = line.slice(-2)[0].split('\t')

            scoreJson.score = parseFloat(row[1])
        })

        // get the 3 different criteria for improvement
        // 1. avg travel time (travel + wait)
        const avgTravelTime = await Trip.aggregate([
            {
                $group: {
                    _id: null,
                    avgTravelTime: { $avg: "$travelTime" }
                }
            },
            {
                $project: {
                    _id: 0,
                    avgTravelTime: 1
                }
            }
        ])

        scoreJson.avgTravelTime = avgTravelTime[0].avgTravelTime

        // 2. avg transits
        // const avgTransits = await Leg.aggregate([
        //     {
        //         $match: {
        //             transitLine: { $ne: "" }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$tripId",
        //             transits: { $sum: 1 },
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             avgTransits: { $avg: "$transits" }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             avgTransits: 1
        //         }
        //     }
        // ])

        // scoreJson.avgTransits = avgTransits[0].avgTransits

        // 3. number of vehicles
        const vehicles = await Departure.distinct("vehicle")
        const numberOfVehicles = vehicles.length

        scoreJson.numberOfVehicles = numberOfVehicles
        
        // get departures serving less than 5 passengers
        const ineffectiveDepartures = await Departure.aggregate([
            {
                $match: {
                    lineId: 
                    {
                        $ne: "Wenden"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    //departureId: 1,
                    numberOfPassengers: {
                        $size: {
                            $filter: {
                                input: "$events",
                                as: "event",
                                cond: {
                                    $eq: [ "$$event.type", "PersonEntersVehicle"]
                                }
                            }
                        }
                    }
                } 
            },
            {
                $match: {
                    numberOfPassengers: 
                    {
                        $lt: 5 // less than 5 passengers
                    }
                }
            }
        ])
        
        res.status(200).json({ ineffectiveDepartures, avgTravelTime, avgTransits, numberOfVehicles})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

// run and analyze scenario
const runMatsim = async (req, res) => {

    try {
        const scenarioId = req.body.scenarioId
        // const properties = req.body.properties
        // properties.outputPath = process.cwd() + properties.outputPath

        const iters = req.body.iters

        // run properties
        const properties = {
            matsimApplication: 'services/MATSim/src/matsim.jar',
            inputPath: 'services/MATSim/scenarios/cottbus/input',
            outputPath: process.cwd() + '/services/MATSim/scenarios/cottbus/output',
            iters: iters
        }

        // form rootScenario
        let rootScenario = {
            _id: scenarioId,
            score: 0,
            avgTravelTime: 0,
            avgTransits: 0,
            numberOfVehicles: 0
        }
        
        // run root scenario ---> works, but slow upload to db (maybe internet connection not good??)
        await runScenario(rootScenario, properties)
        await analyzeScenario(rootScenario, properties, 0)
        // temporal score assignment
        //rootScenario.score =57.3678849507915
        console.log('Root scenario analysis finished')

        res.status(200).json(rootScenario)
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// form recommendations for root scenario
const recommendScenarios = async (req, res) => {
    try {
        const rootScenario = req.body
        // find possible recommendations
        const recommendations = await recommend(rootScenario)
        console.log('Root scenario recommendation finished')
        res.status(200).json(recommendations)
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
}

// run and analyze 1st recommendation scenario
const runFirstRecommendation = async (req,res) => {
    console.log('Ineffective departures recommendations processing')

    try {
        const rootScenario = req.body.rootScenario
        const recommendations = req.body.recommendations
        const properties = req.body.properties

        properties.outputPath = process.cwd() + properties.outputPath

        // run properties
        // const properties = {
        //     matsimApplication: 'services/MATSim/src/matsim.jar',
        //     inputPath: 'services/MATSim/scenarios/cottbus/input',
        //     outputPath: process.cwd() + '/services/MATSim/scenarios/cottbus/output',
        //     iters: iters
        // }

        // counter for naming recommendation scenarios
        let recommendationsCounter = 0

        for (const ineffectiveDeparture of recommendations.ineffectiveDepartures) {
            console.log('Creating new recommendation scenario')
            const configuration = { command: '--remove-departure', arguments: `${ineffectiveDeparture.lineId},${ineffectiveDeparture.routeId},${ineffectiveDeparture.departureId}` }
            let scenario = {
                _id: 'id-' + rootScenario._id,
                score: 0,
                type: 'id',
                recommendedFor: rootScenario._id,
                avgTravelTime: 0,
                avgTransits: 0,
                numberOfVehicles: 0
            }

            // run scenario
            await runScenario(scenario, properties, configuration)
            if (scenario.score >= rootScenario.score) {
                console.log('Score is better. Analysis pending...')
                recommendationsCounter++
                // analyze scenario
                await analyzeScenario(scenario, properties, recommendationsCounter)
            }
        }
        res.status(200).json( { message: '1st recommendation scenario ran and analyzed successfully' } )
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
}

// run and analyze 2nd recommendation scenario
const runSecondRecommendation = async (req,res) => {
    console.log('Underused lines recommendations processing')

    try {
        const rootScenario = req.body.rootScenario
        const recommendations = req.body.recommendations
        const properties = req.body.properties

        properties.outputPath = process.cwd() + properties.outputPath

        // run properties
        // const properties = {
        //     matsimApplication: 'services/MATSim/src/matsim.jar',
        //     inputPath: 'services/MATSim/scenarios/cottbus/input',
        //     outputPath: process.cwd() + '/services/MATSim/scenarios/cottbus/output',
        //     iters: iters
        // }

        // counter for naming recommendation scenarios
        let recommendationsCounter = 0
        
        for (const underusedLine of recommendations.underusedLines) {
            console.log('Creating new recommendation scenario')
            const configuration = { command: '--remove-line', arguments: underusedLine._id }
            let scenario = {
                _id: 'ul-' + rootScenario._id,
                score: 0,
                type: 'ul',
                recommendedFor: rootScenario._id,
                avgTravelTime: 0,
                avgTransits: 0,
                numberOfVehicles: 0
            }
            // run scenario
            await runScenario(scenario, properties, configuration)
            if (scenario.score >= rootScenario.score) {
                console.log('Score is better. Analysis pending...')
                recommendationsCounter++
                // analyze scenario
                await analyzeScenario(scenario, properties, recommendationsCounter)
            }
        }
        res.status(200).json( { message: '2nd recommendation scenario ran and analyzed successfully' } )
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
}

// run and analyze 3rd recommendation scenario - !!under construction!!
const runThirdRecommendation = async (req,res) => {
    console.log('Overused lines recommendations processing')
    
    try {
        const rootScenario = req.body.rootScenario
        const recommendations = req.body.recommendations
        const properties = req.body.properties

        properties.outputPath = process.cwd() + properties.outputPath

        // run properties
        // const properties = {
        //     matsimApplication: 'services/MATSim/src/matsim.jar',
        //     inputPath: 'services/MATSim/scenarios/cottbus/input',
        //     outputPath: process.cwd() + '/services/MATSim/scenarios/cottbus/output',
        //     iters: iters
        // }

        // counter for naming recommendation scenarios
        let recommendationsCounter = 0
        
        for (const overusedLine of recommendations.overusedLines) {
            console.log('Creating new recommendation scenario')
            const configuration = { command: '--remove-line', arguments: overusedLine._id }
            let scenario = {
                _id: 'ul-' + rootScenario._id,
                score: 0,
                type: 'ul',
                recommendedFor: rootScenario._id,
                avgTravelTime: 0,
                avgTransits: 0,
                numberOfVehicles: 0
            }
            // run scenario
            await runScenario(scenario, properties, configuration)
            if (scenario.score > rootScenario.score) {
                console.log('Score is better. Analysis pending...')
                recommendationsCounter++
                // analyze scenario
                await analyzeScenario(scenario, properties, recommendationsCounter)
            }
        }
        res.status(200).json( { message: '3rd recommendation scenario ran and analyzed successfully' } )
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
}

// run and analyze 4th recommendation scenario
const runForthRecommendation = async (req,res) => {
    console.log('Express lines recommendations processing')
    
    try {
        const rootScenario = req.body.rootScenario
        const recommendations = req.body.recommendations
        const properties = req.body.properties

        properties.outputPath = process.cwd() + properties.outputPath

        // run properties
        // const properties = {
        //     matsimApplication: 'services/MATSim/src/matsim.jar',
        //     inputPath: 'services/MATSim/scenarios/cottbus/input',
        //     outputPath: process.cwd() + '/services/MATSim/scenarios/cottbus/output',
        //     iters: iters
        // }

        // counter for naming recommendation scenarios
        let recommendationsCounter = 0
        
        
        for (const [index, popularODPair] of recommendations.popularODPairs.entries()) {
            // vehicles needed for the line
            let vehicles = [{ id: `x${index+1}_0`, lastDepartureTime: 0 }]
            // get origin - destination stop facilities
            const origin = await StopFacility.findById(popularODPair._id.firstAccessStop)
            const destination = await StopFacility.findById(popularODPair._id.lastEgressStop)

            // get ref paths for origin and destination
            const startPath = await Link.findById(origin.linkRef)
            const endPath = await Link.findById(destination.linkRef)

            // get all available paths (only roads)
            const allPaths = await Link.find({ $or: [{ mode: 'car' }, { mode: 'pt' }] })

            // get shoertest path from start path to end path
            const shortestPathSubset = findShortestPathSubset(startPath, endPath, allPaths, 'pt')

            // check if there is actually a path between origin and destination
            if (shortestPathSubset.length == 0) {
                continue
            }

            // calculate offset from origin to destination
            const offset = await calculateOffset(shortestPathSubset)
            // convert seconds to hh:mm:ss time format // need to change to seconds -> reversedTimeConverter not needed!!
            const arrivalOffset = offset
            // vehicle stops for 20 seconds
            const departureOffset = offset + 20

            // get shoertest path from end path to start path
            const returningShortestPathSubset = findShortestPathSubset(endPath, startPath, allPaths, 'pt')
            const returnOffset = await calculateOffset(returningShortestPathSubset)
            // seconds needed for round trip - used for vehicle scheduling
            const totalOffset = offset + 20 + returnOffset

            const departures = []
            // create a departure for each departure time
            for (const departureTime of popularODPair.departureTimes) {
                let allVehiclesOccupied = true
                // check the vehicles for any spare vehicle and create the departure accordingly
                // a vehicle is seen as spare if it has completed the round trip 
                // by the time a new departure is needed
                for (const vehicle of vehicles) {
                    if (departureTime.departureTime >= (vehicle.lastDepartureTime + totalOffset)) {
                        vehicle.lastDepartureTime = departureTime.departureTime
                        departures.push({ 
                            id: `x${index+1}_${departureTime.departureTime}`,
                            departureTime: departureTime.departureTime.toString(),
                            vehicle: vehicle.id
                        })
                        // spare vehicle found
                        // no need to add extra vehicle or search any further for spare vehicles
                        allVehiclesOccupied = false
                        break
                    }
                }
                
                // if there is a need for extra vehicle, add one and use it for the current departure
                if (allVehiclesOccupied) {
                    vehicles.push({ id: `x${ index+1 }_${ vehicles.length-1 }`, lastDepartureTime: departureTime.departureTime })
                    departures.push({ 
                        id: `x${index+1}_${departureTime.departureTime}`,
                        departureTime: departureTime.departureTime.toString(),
                        vehicle: `x${ index+1 }_${ vehicles.length-1 }`
                    })
                }
            }

            // create the express line for the podp
            const expressLine = {
                lineId: `x${index+1}`,
                mode: 'pt',
                routes: [{
                    id: `x${index+1}`,
                    stops: [{
                        id: origin._id,
                        arrivalOffset: '0',
                        departureOffset: '0',
                    },
                    {
                        id: destination._id,
                        arrivalOffset: arrivalOffset.toString(),
                        departureOffset: departureOffset.toString(),
                    }
                    ],
                    links: shortestPathSubset,
                    departures: departures
                }]
            }

            console.log('Creating new recommendation scenario')
            const configuration = { command: '--add-line', arguments: JSON.stringify(expressLine) }
            let scenario = {
                _id: 'podp-' + rootScenario._id,
                score: 0,
                type: 'podp',
                recommendedFor: rootScenario._id,
                avgTravelTime: 0,
                avgTransits: 0,
                numberOfVehicles: 0
            }
            // run scenario
            await runScenario(scenario, properties, configuration)
            if (scenario.score > rootScenario.score) {
                console.log('Score is better. Analysis pending...')
                recommendationsCounter++
                // analyze scenario
                await analyzeScenario(scenario, properties, recommendationsCounter)
            }
        }
        res.status(200).json( { message: '4th recommendation scenario ran and analyzed successfully' } )
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
}

// get recommendation scenarios
const getRecommended = async (req, res) => {
    try {
        const rootScenario = req.body

        const recommended = await Scenario.find({ recommendedFor: rootScenario })
        res.status(200).json(recommended)
    } catch (error) {
        res.status(400).json( { error: error.message } )
    }
}

// get departures based on the scenario id
const getDepartures = async (req, res) => {

    const { scenarioId } = req.query

    try {
        // get departures
        const departures = await Departure.aggregate([
            {
              '$match': {
                'scenario': scenarioId
              }
            }, 
            {
              '$lookup': {
                    'from': 'links', 
                    'localField': 'events.location', 
                    'foreignField': '_id', 
                    'as': 'links'
                }
            },
            {
              '$lookup': {
                    'from': 'stop-facilities', 
                    'localField': 'events.location', 
                    'foreignField': '_id', 
                    'as': 'stop-facilities'
                }
            },
            {
                '$project': {
                    '_id': 0, 
                    'id': '$vehicle', 
                    'lineId': 1, 
                    'routeId': 1, 
                    'departureId': 1, 
                    'events': {
                        '$map': {
                            'input': '$events', 
                            'as': 'event', 
                            'in': {
                                'sfloc': {
                                    '$arrayElemAt': [
                                        {
                                            '$filter': {
                                                'input': '$stop-facilities', 
                                                'as': 's', 
                                                'cond': { '$eq': ['$$s._id', '$$event.location'] }
                                            }
                                        }, 
                                        0
                                    ]
                                }, 
                                'linkloc': {
                                    '$arrayElemAt': [
                                        {
                                            '$filter': {
                                                'input': '$links', 
                                                'as': 'l', 
                                                'cond': { '$eq': ['$$l._id', '$$event.location'] }
                                            }
                                        },
                                        0
                                    ]
                                }, 
                                'location': '$$event.location', 
                                'timestamp': '$$event.timestamp', 
                                'type': '$$event.type'
                            }
                        }
                    }
                }
            },
            {
                '$project': {
                    '_id': 0, 
                    'id': 1, 
                    'lineId': 1, 
                    'routeId': 1, 
                    'departureId': 1, 
                    'events': {
                        '$map': {
                            'input': '$events', 
                            'as': 'event', 
                            'in': {
                                'location': {
                                    '$cond': [
                                        { '$gt': ['$$event.sfloc', null]},
                                        '$$event.sfloc.location.coordinates',
                                        '$$event.linkloc.line.coordinates'
                                    ]
                                }, 
                                'timestamp': '$$event.timestamp', 
                                'type': '$$event.type'
                            }
                        }
                    }
                }
            }
        ])
        
        console.log(util.inspect(departures[0].events, { depth: null }))

        res.status(200).json({ departures: departures })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports = {
    getStatistics,
    runMatsim,
    recommendScenarios,
    runFirstRecommendation,
    runSecondRecommendation,
    runThirdRecommendation,
    runForthRecommendation,
    getRecommended,
    getDepartures
}