const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
});

const planetModel = mongoose.model('planet', planetSchema)

module.exports = planetModel