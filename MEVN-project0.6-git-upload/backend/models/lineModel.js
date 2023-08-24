const mongoose = require('mongoose')

const Link = require('./linkModel')

const Schema = mongoose.Schema

// schema for stop
const stopSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    arrivalOffset: {
        type: Number,
        required: true
    },
    departureOffset: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return this.arrivalOffset <= value
            },
            message: 'Arrival offset must be less than or equal to departure offset'
        }
    },
    isBlocking: {
        type: Boolean,
        required: false
    }
})

// schema for departure
const departureSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    departureTime: {
        type: Number,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    }
})

// schema for route
const routeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    stops: {
        type: [stopSchema],
        required: true,
        validate: {
            validator: function(array) {
                return array.length >= 2
            },
            message: 'At least two stops are required'
        }
    },
    path: {
        type: [String],
        required: true,
        validate: [
            {
                validator: async function(links) {
                    for(const [index, link] of links.entries()) {
                        if (index < links.length) {
                            const result = await Link.find({
                                $and: [
                                    {
                                        _id: link
                                    },
                                    {
                                    line: {
                                        $geoIntersects: links[index + 1]
                                    } 
                                    }
                                ]  
                            })
                            if (!result) {
                                return false
                            }
                        }
                    }

                    return true

                },
                message: 'Invalid path: path is not consecutive'
            },
            {
                validator: async function(links) {
                    if (links.length) {
                        return true
                    } else {
                        return false
                    }
                },
                message: 'Invalid path: path is empty'
            }
        ]
    },
    departures: {
        type: [departureSchema],
        required: true,
        validate: {
            validator: function(array) {
                return array.length
            },
            message: 'At least one departure is required for each route'
        }
    }
})

// schema for line
const lineSchema = new Schema({
    id: {
        type: String,
        required: [true, 'Line id is required']
    },
    scenario: {
        type: String,
        required: true
    },
    routes: {
        type: [routeSchema],
        required: true,
        // probably not working right -> need to check it when add line is completed
        validate: [
            {
                validator: function(array) {
                    const set = new Set(array.map(String))
                    return set.size === array.length
                },
                message: p => `The values provided for '${ p.path }', ` + `[${ p.value }], contains duplicates.`
            },
            {
                validator: function(array) {
                    return array.length
                },
                message: 'At least one route is required'
            }
        ]
    }
})
routeSchema.paths._id
lineSchema.index({ id: 1, scenario: 1}, { unique: true })

module.exports = mongoose.model('Line', lineSchema)