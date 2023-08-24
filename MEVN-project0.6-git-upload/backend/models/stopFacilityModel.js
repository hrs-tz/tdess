const mongoose = require('mongoose')

const Schema = mongoose.Schema

// schema for stop facility
const stopFacilitySchema = new Schema({
    _id: {
        type: String,
        required: [true, 'Stop facility id is required']
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    linkRef: {
        type: String,
        required: [true, 'Reference link is required']
    },
    isBlocking: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Stop-facility', stopFacilitySchema)