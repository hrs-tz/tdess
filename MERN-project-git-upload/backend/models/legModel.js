const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for leg
const legSchema = new Schema({
    tripId: {
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
}, { timestamps: true })

module.exports = mongoose.model('Leg', legSchema)


