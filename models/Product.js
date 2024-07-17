const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    category_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    subCategory_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    }],
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },
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
    description: {
        type: String,
        required: true
    },
    description_ru: {
        type: String,
        default: null
    },
    description_en: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('Product', productSchema)