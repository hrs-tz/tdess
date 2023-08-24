const express = require('express')
const {
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
    deleteScenario,
    deleteLine
} = require('../controllers/scenariosController')

const router = express.Router()

// GET scenarios
router.get('/get-scenarios', getScenarios)

// GET scenario
router.get('/get-scenario', getScenario)

// GET lines
router.get('/get-lines', getLines)

// GET line
router.get('/get-line/:id', getLine)

// GET stop facilities
router.get('/get-stop-facilities', getStopFacilities)

// GET links
router.get('/get-links', getLinks)

// GET link
router.get('/get-link/:id', getLink)

// GET connected links
router.get('/get-connected-links/:id', getConnectedLinks)

// GET vehicle types
router.get('/get-vehicle-types', getVehicleTypes)

// POST scenario
router.post('/post-scenario', postScenario)

// POST line
router.post('/post-line', postLine)

// POST stop facility
router.post('/post-stop-facility', postStopFacility)

// POST vehicle type
router.post('/post-vehicle-type', postVehicleType)

// PATCH scenario
router.patch('/patch-scenario', patchScenario)

// DELETE scenario
router.delete('/delete-scenario', deleteScenario)

// DELETE line
router.delete('/delete-line', deleteLine)

module.exports = router