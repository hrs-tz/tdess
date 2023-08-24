const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for event
const EventSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

// schema for event sequence
const departureSchema = new Schema({
    departureId: {
        type: String,
        required: true
    },
    scenario: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    lineId: {
        type: String,
        required: true
    },
    routeId: {
        type: String,
        required: true
    },
    events: {
        type: [EventSchema],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Departure', departureSchema)