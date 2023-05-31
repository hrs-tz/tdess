const express = require('express')
const {
    getStatistics,
    runMatsim,
    postDeparturesFile,
    postLegsTripsFiles
} = require('../controllers/dashboardController')

const router = express.Router()

// GET statistics
router.get('/get-statistics', getStatistics)

// GET matsim application run
router.get('/run-matsim', runMatsim)

// POST departures
//router.get('/post-departures/:id', postDeparturesFile)

// POST legs file
router.post('/post-csv', postLegsTripsFiles)

module.exports = router