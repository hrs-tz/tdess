require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const homeRoutes = require('./routes/home')
const dashboardRoutes = require('./routes/dashboard')
const scenariosRoutes = require('./routes/scenarios')
const EventSequence = require('./models/departureModel')
const Trip = require('./models/tripModel')
const Scenario = require('./models/scenarioModel')
const Link = require('./models/linkModel')
const { findShortestPathSubset } = require('./utils/findShortestPath')
const cors = require("cors")

// initialize express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// enable cors
app.use(cors());

// // test db with dummy trips/legs
// app.get('/test-db', async (req, res) => {
//     try {
//         await Trip.deleteMany({})
//         await Leg.deleteMany({})

//         const trip1 = new Trip({
//             _id: "1ato1g",
//             departureTime: 8000,
//             travelTime: 1700,
//             waitTime: 300,
//             mode: "pt",
//             firstAccessStop: "1a",
//             lastEgressStop: "1g"
//         });
//         await trip1.save()

//         const leg11 = new Leg({
//             tripId: "1ato1g",
//             departureTime: 8000,
//             travelTime: 1200,
//             waitTime: 300,
//             accessStop: "1a",
//             egressStop: "1g",
//             transitLine: "1",
//             transitRoute: "atoz"
//         })

//         const leg12 = new Leg({
//             tripId: "1gtohome",
//             departureTime: 9200,
//             travelTime: 500,
//             waitTime: 0,
//             accessStop: "",
//             egressStop: "",
//             transitLine: "",
//             transitRoute: ""
//         })

//         await leg11.save()
//         await leg12.save()

//         const trip2 = new Trip({
//             _id: "1ato2l",
//             departureTime: 7000,
//             travelTime: 3000,
//             waitTime: 630,
//             mode: "pt",
//             firstAccessStop: "1a",
//             lastEgressStop: "2l"
//         })

//         await trip2.save()

//         const leg21 = new Leg({
//             tripId: "1ato2l",
//             departureTime: 7000,
//             travelTime: 1500,
//             waitTime: 300,
//             accessStop: "1a",
//             egressStop: "1c",
//             transitLine: "1",
//             transitRoute: "atoz"
//         })

//         const leg22 = new Leg({
//             tripId: "1ato2l",
//             departureTime: 8500,
//             travelTime: 1500,
//             waitTime: 330,
//             accessStop: "2c",
//             egressStop: "2l",
//             transitLine: "2",
//             transitRoute: "atoz"
//         })

//         await leg21.save()
//         await leg22.save()

//         const trip3 = new Trip({
//             _id: "1ato3b",
//             departureTime: 7000,
//             travelTime: 4000,
//             waitTime: 1800,
//             mode: "pt",
//             firstAccessStop: "1a",
//             lastEgressStop: "3b"
//         })

//         await trip3.save()

//         const leg31 = new Leg({
//             tripId: "1ato3b",
//             departureTime: 7000,
//             travelTime: 1500,
//             waitTime: 300,
//             accessStop: "1a",
//             egressStop: "1c",
//             transitLine: "1",
//             transitRoute: "atoz"
//         })

//         const leg32 = new Leg({
//             tripId: "1ato2l",
//             departureTime: 8500,
//             travelTime: 1500,
//             waitTime: 300,
//             accessStop: "2c",
//             egressStop: "2l",
//             transitLine: "2",
//             transitRoute: "atoz"
//         })

//         const leg33 = new Leg({
//             tripId: "1ato2l",
//             departureTime: 10000,
//             travelTime: 1000,
//             waitTime: 300,
//             accessStop: "3l",
//             egressStop: "3p",
//             transitLine: "3",
//             transitRoute: "atoz"
//         })

//         await leg31.save()
//         await leg32.save()
//         await leg33.save()

//         res.status(200).json({ message: 'Test case upload successful' })
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({error: error.message})
//     }
// });
// app.get('/sp', async (req, res) => {
//     try {
//         // Example usage
//         const startPath = await Link.findById('1')
//         const endPath = await Link.findById('1000')
//         const allPaths = await Link.find({})
//         const sp = findShortestPathSubset(startPath, endPath, allPaths, 'car')
//         res.status(200).json( {sp: sp} )
//     } catch (error) {
//         res.status(400).json( {error: error.message} )
//     }
// })

// routes
app.use('/api/home', homeRoutes)
//app.use('/api/dashboard', dashboardRoutes)
app.use('/api/scenarios', scenariosRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.error(error)
    })