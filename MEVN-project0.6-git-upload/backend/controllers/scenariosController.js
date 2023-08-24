const { spawn } = require('child_process')
const { ObjectId } = require('mongodb')
const Scenario = require('../models/scenarioModel')
const Line = require('../models/lineModel')
const Link = require('../models/linkModel')
const StopFacility = require('../models/stopFacilityModel')
const VehicleType = require('../models/vehicleTypeModel')

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

const handleLineErrors = (err) => {
    const errors = { _id: '', description: '', general: '' }
    console.log(err)

    // duplicate error code
    if (err.code === 11000) {
        errors._id = 'This id is already used'
    } // validation errors
    else if (err.message.toLowerCase().includes('validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    } else
    // general errors
    {
        errors.general = 'Unexpected error: ' + err.message
    }

    return errors
}

// get custom scenarios from db
const getScenarios = async (req,res) => {
    try {
        const scenarios = await Scenario.find({
            _id: { $nin: ['ori', 'cus'] },
            recommendedFor: { $exists: false }
        })

        res.status(200).json({ scenarios: scenarios })
    } catch (error) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// get scenario from db based on its id
const getScenario = async (req, res) => {
    const { scenarioId } = req.query

    try {
        // get scenario
        const scenario = await Scenario.findById(scenarioId)

        res.status(200).json({ scenario: scenario })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// get lines associated with a scenario
const getLines = async (req, res) => {

    const { scenarioId } = req.query

    try {
        // get lines associated with the scenario
        const lines = await Line.find({scenario: scenarioId}, {
            id: 1,
            type: {
                $map: {
                    input: "$routes",
                    as: "route",
                    in: { $concat: ["$$route.type", ""] }
                }
            },
            stops: {
                $sum: {
                    $map: {
                        input: "$routes",
                        as: "route",
                        in: { $size: "$$route.stops" }
                    }
                }
            },
            departures: {
                $sum: {
                    $map: {
                        input: "$routes",
                        as: "route",
                        in: { $size: "$$route.departures" }
                    }
                }
            },
            routesSize: {
                $size: "$routes"
            }
        }).lean()
        
        // get number of vehicles per line
        for (const line of lines) {
            line.numberOfVehicles = (await Line.distinct("routes.departures.vehicle", { _id: new ObjectId(line._id) })).length
        }

        res.status(200).json({ lines: lines })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// const getLines = async (req, res) => {

//     const { scenarioId, lineId, types } = req.body
//     let query

//     try {
//         if (lineId) {
//             if (types) {
//                 // all search filters are applied
//                 query = { scenario: scenarioId, id: lineId, "routes.type": { $in: types } }
//             } else {
//                 // search by line id
//                 query = { scenario: scenarioId, id: lineId }
//             }
//         } else if (types) {
//             // search by types
//             query = { scenario: scenarioId, "routes.type": { $in: types } }
//         }
//         else {
//             // search for all lines associated with the scenario - no filters applied
//             query = { scenario: scenarioId }
//         }

//         // get lines associated with the scenario based on applied filters
//         const lines = await Line.find(query, {
//             id: 1,
//             type: {
//                 $map: {
//                     input: "$routes",
//                     as: "route",
//                     in: { type: "$$route.type" }
//                 }
//             },
//             stops: {
//                 $sum: {
//                     $map: {
//                         input: "$routes",
//                         as: "route",
//                         in: { $size: "$$route.stops" }
//                     }
//                 }
//             },
//             departures: {
//                 $sum: {
//                     $map: {
//                         input: "$routes",
//                         as: "route",
//                         in: { $size: "$$route.departures" }
//                     }
//                 }
//             },
//             routesSize: {
//                 $size: "$routes"
//             }
//         }).lean()
        
//         // get number of vehicles per line
//         for (const line of lines) {
//             line.numberOfVehicles = (await Line.distinct("routes.departures.vehicle", { _id: new ObjectId(line._id) })).length
//         }

//         res.status(200).json({ lines: lines })
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// }

// get line associated with a scenario
const getLine = async (req, res) => {

    const id = req.params.id
    const links = []

    try {
        const line = await Line.findById(new ObjectId(id))
        for (const route of line.routes) {
            for (const link of route.path) {
                links.push(await Link.findById(link))
            }
        }

        res.status(200).json({ line: line, links: links })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// get all stop facilities 
const getStopFacilities = async (req, res) => {

    try {
        const stopFacilities = await StopFacility.find({})

        res.status(200).json({ stopFacilities })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// get links in a specific radius (in meters)
const getLinks = async (req, res) => {

    const { longitude, latitude, radius } = req.query

    try {
        const links = await Link.find({
            line: { $geoWithin: { $centerSphere: [ [ Number(longitude), Number(latitude) ], radius / 6378100 ] } }
        })

        if (!links.length) {
            throw new Error('No links available for the selected coordinates')
        }

        res.status(200).json({ links })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// get link
const getLink = async (req, res) => {

    const linkId = req.params.id

    try {
        const link = await Link.findById(linkId)

        if (!link.length) {
            throw new Error('No link found')
        }
        
        res.status(200).json({ link })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// get links connected to a specific link
const getConnectedLinks = async (req, res) => {

    const linkId = req.params.id

    console.log(linkId)

    try {
        const link = await Link.findById(linkId)

        const links = await Link.find({
            'line.coordinates.0': link.line.coordinates[1]
        })
        console.log(links)

        if (!links.length) {
            throw new Error('No connected links available for the selected link')
        }

        res.status(200).json({ links })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// get all vehicle types from db -  in comments -> code for getting vehicle types based on specific mode
const getVehicleTypes = async (req, res) => {
    
    //const { mode } = req.query

    try {
        const vehicleTypes = await VehicleType.find({})
        // const vehicleTypes = await VehicleType.find({ mode: mode })

        res.status(200).json({ vehicleTypes })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// post scenario to db
const postScenario = async (req, res) => {

    const { scenarioId, description } = req.body

    try {
        // save scenario to db
        const scenario = new Scenario({
            _id: scenarioId,
            score: -1,
            avgTravelTime: -1,
            avgTransits: -1,
            numberOfVehicles: -1,
            description: description
        })
        await scenario.save()

        // prepare db for custom scenario - initialization - upload all lines from original scenario
        let child = spawn('java', ['-jar', 'services/MATSim/src/matsim.jar', 'prepare', 'prepare-custom-scenario','--directory=services/MATSim/scenarios/cottbus/input', `--scenario-id=${scenarioId}`])
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`)
        });
        
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`)
        });
        
        child.on('close', async (code) => {
            console.log(`child process exited with code ${code}`)
            if (code == 0) {
                res.status(200).json({ message: 'Initialization completed' })
            } else {
                throw Error('Initialization failed')
            }
        })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// post line associated with a scenario
const postLine = async (req, res) => {

    const {scenario, id, routes} = req.body
    console.log(scenario)
    console.log(id)
    console.log(routes)

    try {
        // save line to db
        const line = new Line({
            id: id,
            scenario: scenario,
            routes: routes
        })
        await line.save()

        res.status(200).json({ message: 'Upload completed' })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// post stop facility to db
const postStopFacility = async (req, res) => {

    const { _id, location, linkRef, isBlocking } = req.body

    try {
        // save line to db
        const stopFacility = new StopFacility({
            _id: _id,
            location: location,
            linkRef: linkRef,
            isBlocking: isBlocking
        })
        await stopFacility.save()
        res.status(200).json({ message: 'Upload completed' })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// post vehicle type to db
const postVehicleType = async (req, res) => {

    const { vehicleType } = req.body
    try {
        // save vehicle type to db
        const vType = new VehicleType(vehicleType)
        await vType.save()
        res.status(200).json({ message: 'Upload completed' })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// alter scenario
const patchScenario = async (req, res) => {

    const { _id, score, avgTravelTime, avgTransits, numberOfVehicles, description } = req.body
    
    try {
        await Scenario.findByIdAndUpdate(_id, { $set: { 
            "score": score,
            "avgTravelTime": avgTravelTime,
            "avgTransits": avgTransits,
            "numberOfVehicles": numberOfVehicles,
            "description": description 
        }})
        
        res.status(200).json({ message: 'Updated successfully' })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

// alter line associated with a scenario
const patchLine = async (req, res) => {

    const {scenario, id, routes} = req.body

    try {
        await Line.findOneAndUpdate({ $and: [{ id: id }, { scenario: scenario }] }, { $set: { 
            "id": id,
            "routes": routes
        }})
        
        res.status(200).json({ message: 'Updated successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete scenario from db (also deletes lines associated with the scenario - mongodb hook)
const deleteScenario = async (req, res) => {

    const scenarioId = req.body.scenarioId
    
    try {
        const deleted = await Scenario.findByIdAndDelete(scenarioId)
        if (!deleted) {
            throw new Error('Scenario not found')
        } else {
            res.status(200).json({ message: 'Deleted successfully' })
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete scenario from db (also deletes lines associated with the scenario - mongodb hook)
const deleteLine = async (req, res) => {

    const { scenarioId, lineId } = req.body
    
    try {
        const deleted = await Line.findOneAndDelete({ scenario: scenarioId, id: lineId })
        if (!deleted) {
            throw new Error('Line not found')
        } else {
            res.status(200).json({ message: 'Deleted successfully' })
        }
    } catch (err) {
        const errors = handleLineErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports = {
    getScenarios,
    getScenario,
    getLines,
    getLine,
    getStopFacilities,
    getLinks,
    getLink,
    getConnectedLinks,
    getVehicleTypes,
    postScenario,
    postLine,
    postStopFacility,
    postVehicleType,
    patchScenario,
    patchLine,
    deleteScenario,
    deleteLine
}