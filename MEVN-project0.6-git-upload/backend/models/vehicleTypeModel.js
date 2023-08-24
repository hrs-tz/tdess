const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for vehicle type
const vehicleTypeSchema = new Schema({
    _id: {
        type: String,
        required: [true, 'Vehicle type id is required']
    },
    mode: {
        type: String,
        required: [true, 'Mode is required']
    },
    seats: {
        type: Number,
        required: [true, 'Number of seats is required']
    },
    standingCapacity: {
        type: Number,
        required: [true, 'Standing capacity is required']
    },
    length: {
        type: Number,
        required: [true, 'Length is required']
    },
    width: {
        type: Number,
        required: [true, 'Width is required']
    }
})

module.exports = mongoose.model('Vehicle-type', vehicleTypeSchema)