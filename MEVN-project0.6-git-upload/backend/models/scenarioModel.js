const mongoose = require('mongoose')
const Line = require('./lineModel')

const Schema = mongoose.Schema

// schema for scenario
const scenarioSchema = new Schema({
    _id: {
        type: String,
        required: [true, 'Scenario id is required']
    },
    type: {
        type: String,
        required: false
    },
    recommendedFor: {
        type: String,
        required: false
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
    description: {
        type: String,
        required: false,
        maxLength: [600, 'Description must contain less than 600 characters']
    }
}, { timestamps: true })

// pre hook for findOneAndUpdate to apply validators
scenarioSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

// post hook for findOneAndDelete to delete the lines associated with the deleted scenario
scenarioSchema.post('findOneAndDelete', async function(doc, next) {
    await Line.deleteMany({ scenario: doc._id })
    next()
})

module.exports = mongoose.model('Scenario', scenarioSchema)