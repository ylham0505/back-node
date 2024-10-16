const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    name_ru: {
        type: String,
        unique: true,
        default: null
    },
    name_en: {
        type: String,
        unique: true,
        default: null
    },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }]
})

module.exports = mongoose.model('Category', categorySchema)