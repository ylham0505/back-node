const Product = require('../models/Product')
const { validationResult } = require('express-validator')

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category_id', '_id name name_ru name_en')
        if (!products) {
            return res.status(404).json({ message: 'Netu produktow'})
        }
        res.json(products)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Ne udalos polucit producty' });
    }
}

const getOneProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findOne({_id: productId}).populate('category_id subCategory_id brand_id', 'name name_ru name_en')
        if (!product) {
            return res.status(404).json({ message: 'product ne nayden'})
        }
        res.json(product)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos polucit producty' });
    }
}

const productCreate = async (req, res) => {
    console.log('Request body:', req.body);  
    console.log('Request file:', req.file);

    if (!req.isAdmin) {
        return res.status(403).json({ message: 'You are not admin'})
    }

    const { category_id, subCategory_id, brand_id, name, name_ru, name_en, description, description_ru, description_en, price } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    try {
        const product = new Product({ category_id, subCategory_id, brand_id, name, name_ru, name_en, description, description_ru, description_en, price, image})
        const doc = await product.save()
        res.status(201).json(doc)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos sozdat product' });
    }
}

const productDelete = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findOneAndDelete({_id: productId})
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        if (!product) {
            return res.status(404).json({ error: 'Ne udalos nayti product'})
        }
        res.status(200).json({ message: 'Deleted succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos udalit product' });
    }
}

const productUpdate = async (req, res) => {

    if (!req.isAdmin) {
        return res.status(403).json({ message: 'You are not admin'})
    }
    const productId = req.params.id
    const { category_id, subCategory_id, brand_id, name, name_ru, name_en, description, description_ru, description_en, price } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const products = await Product.findOneAndUpdate({_id: productId}, {category_id, subCategory_id, brand_id, name, name_ru, name_en, description, description_ru, description_en, price, image})
        
        if (!products) {
            return res.status(404).json({ error: 'Ne udalos nayti product'})
        }
        res.status(200).json({ message: 'Updated succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos obnowit product' });
    }
}

module.exports = { getAllProducts, getOneProduct, productCreate, productDelete, productUpdate }