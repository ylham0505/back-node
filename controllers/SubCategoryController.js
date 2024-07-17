const SubCategory = require('../models/SubCategory')



const subCategoryCreate = async (req, res) => {

    const { name, name_ru, name_en } = req.body;
    const subCategory = new SubCategory({ name, name_ru, name_en })
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        const doc = await subCategory.save()
        res.status(201).json(doc)
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
        const { name, name_ru, name_en } = req.body
        const subCategory = await SubCategory.findOneAndUpdate({_id: subCategoryId}, { name, name_ru, name_en })
        
        if (!subCategory) {
            return res.status(404).json({ error: 'Ne udalos nayti podkategoriyu'})
        }
        res.status(200).json({ message: 'Updated succsesfuly'})
    } catch (err) {
        res.status(400).json({ error: 'ne udalos obnowit product' });
    }
}

module.exports = { subCategoryCreate, subCategoryDelete, subCategoryUpdate }