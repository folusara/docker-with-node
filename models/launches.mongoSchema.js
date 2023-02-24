const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
    flightNumber: {
    type: Number,
    required: true,
    unique: true
    },
    launchDate: {
        type: String,
        required: true
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },

}) 


const launchModel = mongoose.model('launch', launchesSchema)

module.exports = launchModel