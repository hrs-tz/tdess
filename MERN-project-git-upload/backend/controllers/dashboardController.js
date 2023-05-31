const fs = require('fs')
const csv = require('csv-parser')
const zlib = require("zlib")
const { spawn } = require("child_process");
const { glob } = require('glob')

const Departure = require('../models/departureModel')
const Leg = require('../models/legModel')
const Trip = require('../models/tripModel')
const { readCompressedCsv } = require('../utils/readCompressedCsv')
const { timeConverter }= require('../utils/timeConverter');

/* ---------------------- support functions ------------------------ */
// tranfered into utils folder for structure -> tested and working

// function to read compressed csv-s
// const readCompressedCsv = async (file) => {
//     try {
//         // table to keep json objects from csv
//         const results = []
//         // create reading stream, decompress and parse csv file
//         const csvReadStream = fs.createReadStream(file).pipe(zlib.createGunzip()).pipe(csv({ separator: ';' }))
            
//         // return a promise
//         return new Promise((resolve, reject) => {
//             csvReadStream.on("data", (data) => {
//                 results.push(data);
//             });
//             csvReadStream.on("end", () => {
//                 console.log("Parsing completed successfully");
//                 resolve(results);
//             });
//             csvReadStream.on("error", (err) => {
//                 reject(err);
//             });
//         });
//     } catch (err) {
//       throw err;
//     }
// }

// function to convert time from hh:mm:ss format to sec
// const timeConverter = (timeInHMS) => {

//     // split at colons
//     let formattedTime = timeInHMS.split(':');
//     // minutes are worth 60 seconds. Hours are worth 60 minutes.
//     let timeInSeconds = (+formattedTime[0]) * 60 * 60 + (+formattedTime[1]) * 60 + (+formattedTime[2]);

//     return timeInSeconds
// }

/* -------------------------- controllers -------------------------- */

// get statistics - checked with test case -> works fine
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

        scoreJson.avgTravelTime = avgTravelTime[0]

        // 2. avg transits
        const avgTransits = await Leg.aggregate([
            {
                $match: {
                    transitLine: { $ne: "" }
                }
            },
            {
                $group: {
                    _id: "$tripId",
                    transits: { $sum: 1 },
                }
            },
            {
                $group: {
                    _id: null,
                    avgTransits: { $avg: "$transits" }
                }
            },
            {
                $project: {
                    _id: 0,
                    avgTransits: 1
                }
            }
        ])

        scoreJson.avgTransits = avgTransits[0]

        // 3. number of vehicles
        const vehicles = await Departure.distinct("vehicle")
        const numberOfVehicles = vehicles.length

        scoreJson.numberOfVehicles = numberOfVehicles

        console.log(scoreJson)
        
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
                    _id: 0,
                    departureId: 1,
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

// run matsim
const runMatsim = async (req, res) => {

    const matsimApplication = 'services/MATSim/src/matsim.jar'
    const inputPath = 'services/MATSim/scenarios/cottbus/input'
    const outputPath = process.cwd() + '/services/MATSim/scenarios/cottbus/output'

    try {
        // prepare db (upload vehicle types and vehicles)
        //let child = spawn('java', ['-jar', matsimApplication, 'prepare', 'prepare-db', `--directory=${inputPath}`])

        // run MATSim with 1 iteration and large (1.4) population scale
        //let child = spawn('java', ['-jar', matsimApplication, `--config=${inputPath}/config.xml`, `--output=${outputPath}`, '--iterations=1', '--scale=LARGE','run']);
        
        // analize event sequences -> requires a lot of memory -> run application with command: node --max-old-space-size=5120 server.js
        let child = spawn('java', ['-jar', matsimApplication, 'analysis', 'analyze-event-sequence',`--directory=${outputPath}`])
  
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`)
        });
          
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`)
        });
          
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code == 0) {
                res.status(200).json( {message: "Matsim ran successfully"} )
            } else {
                res.status(400).json( {message: "Matsim failed to run"} )
            }
        })
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
}

// post json file with event sequences - checked with real case -> works fine
const postDeparturesFile = async (req, res) => {
    
    const data = JSON.parse(fs.readFileSync('./services/MATSim/scenarios/cottbus/output/analysis-event-sequences/all-event-sequences.json', 'utf-8'))

    // import data to MongoDB
    try {
        await Departure.deleteMany({})
        await Departure.insertMany(data)
        res.status(200).json({message: "Departures successfully imported"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

    // // import data to MongoDB
    // try {
    //     await mongoose.disconnect()
    //     // connect to scenario [id] db
    //     await mongoose.connect(process.env.MONGO_URI, {dbName: req.params.id})
    //     await Departure.deleteMany({})
    //     await Departure.insertMany(data)
    //     res.status(200).json({message: "Departures successfully imported"})
    // } catch (error) {
    //     res.status(400).json({error: error.message})
    // }
}

// post csv files (legs and trips) - checked with real case -> works fine
const postLegsTripsFiles = async (req, res) => {

    const legsPath = await glob('services/MATSim/scenarios/cottbus/output/*output_legs.csv.gz')
    const tripsPath = await glob('services/MATSim/scenarios/cottbus/output/*output_trips.csv.gz')

    try {

        let jsonObj = await readCompressedCsv(legsPath[0])

        let legs = [];
        for (let i = 0; i < jsonObj.length; i++){
            let leg = {}

            leg.tripId = jsonObj[i]['trip_id']

            // convert departure time from hh:mm:ss format to sec
            leg.departureTime = timeConverter(jsonObj[i]['dep_time'])

            // convert travel time time from hh:mm:ss format to sec
            leg.travelTime = timeConverter(jsonObj[i]['trav_time'])
            
            // convert wait time from hh:mm:ss format to sec
            leg.waitTime = timeConverter(jsonObj[i]['wait_time'])

            leg.accessStop = jsonObj[i]['access_stop_id']

            leg.egressStop = jsonObj[i]['egress_stop_id']

            leg.transitLine = jsonObj[i]['transit_line']

            leg.transitRoute = jsonObj[i]['transit_route']
            
            legs.push(leg);
        }

        jsonObj = await readCompressedCsv(tripsPath[0])

        let trips = [];
        // upload to db documents with the desirable fields only
        for (let i = 0; i < jsonObj.length; i++){
            let trip = {}

            trip._id = jsonObj[i]['trip_id']

            // convert departure time from hh:mm:ss format to sec
            trip.departureTime = timeConverter(jsonObj[i]['dep_time'])

            // convert travel time from hh:mm:ss format to sec
            trip.travelTime = timeConverter(jsonObj[i]['trav_time'])
            
            // convert wait time from hh:mm:ss format to sec
            trip.waitTime = timeConverter(jsonObj[i]['wait_time'])

            trip.mode = jsonObj[i]['longest_distance_mode']

            trip.firstAccessStop = jsonObj[i]['first_pt_boarding_stop']

            trip.lastEgressStop = jsonObj[i]['last_pt_egress_stop']
            
            trips.push(trip);
        }

        // fresh import to mongoDB

        // first import legs
        await Leg.deleteMany({})
        await Leg.insertMany(legs)

        // then import trips
        await Trip.deleteMany({})
        await Trip.insertMany(trips)

        res.status(200).json({ message: "Legs and trips successfully imported" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
    
}

module.exports = {
    getStatistics,
    runMatsim,
    postDeparturesFile,
    postLegsTripsFiles
}