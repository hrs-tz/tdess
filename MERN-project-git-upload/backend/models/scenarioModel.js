const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for scenario
const scenarioSchema = Schema({
    _id: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    avgTravelTime: {
        type: Number,
        required: true
    },
    avgTransits: {
        type: Number,
        required: true
    },
    numberOfVehicles: {
        type: Number,
        required: true
    },
    recommendedFor: {
        type: String,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Scenario', scenarioSchema)