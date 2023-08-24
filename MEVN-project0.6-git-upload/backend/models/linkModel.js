const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for link
const linkSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    line: {
        type: {
          type: String,
          enum: ['LineString'],
          required: true
        },
        coordinates: {
          type: [[Number]],
          required: true
        }
    },
    length: {
        type: Number,
        required: true
    },
    freeSpeed: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    permLanes: {
        type: Number,
        required: true
    },
    mode: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Link', linkSchema)