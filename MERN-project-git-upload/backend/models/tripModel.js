const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for trip
const tripSchema = new Schema({
    _id: {
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
    }
}, { timestamps: true })

module.exports = mongoose.model('Trip', tripSchema)