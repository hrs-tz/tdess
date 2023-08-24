const express = require('express')
const {
    getStatistics,
    runMatsim,
    recommendScenarios,
    runFirstRecommendation,
    runSecondRecommendation,
    runThirdRecommendation,
    runForthRecommendation,
    getRecommended,
    getDepartures
} = require('../controllers/homeController')

const router = express.Router()

// GET statistics
router.get('/get-statistics', getStatistics)

// GET recommended scenarios
router.get('/get-recommended', getRecommended)

// POST matsim application run for root scenario
router.post('/run-matsim', runMatsim)

// GET recommend scenarios
router.get('/recommend-scenarios', recommendScenarios)

// GET departures
router.get('/get-departures', getDepartures)

// POST run 1st recommended scenario
router.post('/run-first-recommendation', runFirstRecommendation)

// POST run 2nd recommended scenario
router.post('/run-second-recommendation', runSecondRecommendation)

// POST run 3rd recommended scenario
router.post('/run-third-recommendation', runThirdRecommendation)

// POST run 4th recommended scenario
router.post('/run-forth-recommendation', runForthRecommendation)

module.exports = router