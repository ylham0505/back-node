const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('Brand', brandSchema)