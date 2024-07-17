const mongoose = require('mongoose')

const SubCategorySchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model('SubCategory', SubCategorySchema)