const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for leg
const legSchema = new Schema({
    departureTime: {
        type: Number,
        required: true
    },
    travelTime: {
        type: Number,
        required: true
    },
    waitTime: {
        type: Number,
        required: true
    },
    accessStop: {
        type: String,
        required: false
    },
    egressStop: {
        type: String,
        required: false
    },
    transitLine: {
        type: String,
        required: false
    },
    transitRoute: {
        type: String,
        required: false
    }
})

// schema for trip
const tripSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    scenario: {
        type: String,
        required: true
    },
    departureTime: {
        type: Number,
        required: true
    },
    travelTime: {
        type: Number,
        required: true
    },
    waitTime: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    firstAccessStop: {
        type: String,
        required: false
    },
    lastEgressStop: {
        type: String,
        required: false
    },
    legs: {
        type: [legSchema],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Trip', tripSchema)