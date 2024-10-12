const SubCategory = require('../models/SubCategory')
const Category = require('../models/Category')



const getAllSubCategories = async (req, res) => {
    try {
        const SubCategories = await SubCategory.find().populate('parentCategory')
        if (!SubCategories) {
            return res.status(404).json({ message: 'Podkategorii ne nayden'})
        }
        res.status(200).json(SubCategories)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Ne udalos polucit podkategorii' });
    }
}

const getOneSubCategory = async (req, res) => {
    try {
        const SubCategoryId = req.params.id
        const Subcategory = await SubCategory.findOne({ _id: SubCategoryId }).populate('parentCategory');
        if (!Subcategory) {
            return res.status(404).json({ message: 'Subcategory не найдена' });
        }
        res.json(Subcategory)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Ne udalos polucit kategoriyi' });
    }
}

const subCategoryCreate = async (req, res) => {

    const { name, name_ru, name_en, parentCategoryId } = req.body;
    const subCategory = new SubCategory({ name, name_ru, name_en, parentCategory: parentCategoryId })
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        await subCategory.save()
        const parentCategory = await Category.findById(parentCategoryId);
        if (!parentCategory) {
            return res.status(404).json({ error: 'Parent category not found' });
        }
        parentCategory.subcategories.push(subCategory);
        await parentCategory.save();
        res.status(201).json(subCategory)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'ne udalos sozdat podkategoriyu' });
    }
}

const subCategoryDelete = async (req, res) => {
    try {
        const subCategoryId = req.params.id
        const subCategory = await SubCategory.findOneAndDelete({ _id: subCategoryId })
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        if (!subCategory) {
            return res.status(404).json({ error: 'Ne udalos nayti podkategoriyu'})
        }
        await Category.findByIdAndUpdate(subCategory.parentCategory, { $pull: { subcategories: req.params.id } });
        res.status(200).json({ message: 'Deleted succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos udalit product' });
    }
}

const subCategoryUpdate = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        const subCategoryId = req.params.id
        const { name, name_ru, name_en, parentCategoryId } = req.body
        const subCategory = await SubCategory.findOneAndUpdate({_id: subCategoryId}, { name, name_ru, name_en, parentCategory: parentCategoryId })
        
        if (!subCategory) {
            return res.status(404).json({ error: 'Ne udalos nayti podkategoriyu'})
        }
        res.status(200).json({ message: 'Updated succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos obnowit product' });
    }
}

module.exports = { getAllSubCategories, getOneSubCategory, subCategoryCreate, subCategoryDelete, subCategoryUpdate }