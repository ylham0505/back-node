const Brand = require('../models/Brand')
const Product = require('../models/Product')
const { validationResult } = require('express-validator')

const getAllbrands = async (req, res) => {
    try {
        const brands = await Brand.find()
        if (!brands) {
            return res.status(404).json({ message: 'Brand ne nayden'})
        }
        res.status(200).json(brands)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos polucit brandy' });
    }
}

const getOnebrand = async (req, res) => {
    try {
        const brandId = req.params.id
        // const brandExists = await Brand.exists({ slug: brandSlug });
        const brand = await Brand.findOne({ _id: brandId }, 'name image')
        if (!brand) {
            return res.status(404).json({ message: 'Brand не найдена' });
        }
        
        const products = await Product.find({ brand_id: brandId})
        if (!products) {
            return res.status(404).json({ message: 'Netu towara'})
        }
        res.json({brand, products})
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos polucit brand' });
    }
}

const brandCreate = async (req, res) => {
    console.log('Request body:', req.body);  // Логирование тела запроса
    console.log('Request file:', req.file);
    if (!req.isAdmin) {
        return res.status(403).json({ message: 'You are not admin'})
    }
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     return res.status(400).json(errors.array())
    // }

    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    try {
        const brand = new Brand({ name, image})
        const doc = await brand.save()
        res.status(201).json(doc)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos sozdat brand' });
    }
}

const brandDelete = async (req, res) => {
    try {
        const brandId = req.params.id
        const brand = await Brand.findOneAndDelete({ _id: brandId })
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        if (!brand) {
            return res.status(404).json({ error: 'Ne udalos nayti brand'})
        }
        res.status(200).json({ message: 'Deleted succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos udalit brand' });
    }
}

const brandUpdate = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        const brandId = req.params.id
        const { name, image } = req.body
        const brand = await Brand.findOneAndUpdate({ _id: brandId }, {name, image} )
        if (!brand) {
            return res.status(404).json({ error: 'Ne udalos nayti brand'})
        }
        res.status(200).json({ message: 'Updated succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos obnowit brand' });
    }
}

module.exports = { brandCreate, getOnebrand, brandDelete, brandUpdate, getAllbrands }



