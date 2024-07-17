const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Product = require('../models/Product')
const { validationResult } = require('express-validator')

// const getAllCategories = async (req, res) => {
//     try {
//         const categories = await Category.find()
//         if (!categories) {
//             return res.status(404).json({ message: 'Kategoriya ne nayden'})
//         }
//         res.json(categories)
//     } catch (err) {
//         console.log(err)
//         res.status(400).json({ error: 'Ne udalos polucit kategoriyi' });
//     }
// }

const getOneCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }
        const products = await Product.find({ category_id: categoryId })
        if (!products) {
            return res.status(404).json({ message: 'Netu towara'})
        }
        res.json({category, products})
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Ne udalos polucit kategoriyi' });
    }
}

const categoryCreate = async (req, res) => {

    const { name, name_ru, name_en, image } = req.body;
    const category = new Category({ name, name_ru, name_en, image })
    const errors = validationResult(req)
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const doc = await category.save()
        res.status(201).json(doc)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos sozdat kategoriyu' });
    }
}

const categoryDelete = async (req, res) => {
    try {
        const categoryId = req.params.id
        const category = await Category.findOnedAndDelete({ _id: categoryId })
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        if (!category) {
            return res.status(404).json({ error: 'Ne udalos nayti kategoriyu'})
        }
        res.status(200).json({ message: 'Deleted succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos udalit kategoriyu' });
    }
}

const categoryUpdate = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        const categoryId = req.params.id
        const { name, name_ru, name_en, image } = req.body
        const category = await Category.findOnedAndUpdate( {categoryId}, { name, name_ru, name_en, image })
        
        if (!category) {
            return res.status(404).json({ error: 'Ne udalos nayti categoriyu'})
        }
        res.status(200).json({ message: 'Updated succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos obnowit kategoriyu' });
    }
}

module.exports = { getOneCategory, categoryCreate, categoryDelete, categoryUpdate }