const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const { getMe, register, login, refreshToken } = require('../controllers/UserController')
const { getOnebrand, getAllbrands } = require('../controllers/BrandController')
const { getOneCategory, getAllCategories } = require('../controllers/CategoryController')
const { getOneProduct, getAllProducts } = require('../controllers/ProductController')
const { orderCreate } = require('../controllers/OrderController')
const { registerValidation, loginValidation,  } = require('../validations/Validations')
const Category = require('../models/Category')
const SubCategory = require('../models/SubCategory')
const Product = require('../models/Product')
const Brand = require('../models/Brand')


const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        const user = jwt.verify(token.replace('Bearer ', ''), 'your_secret_key');
        req.userId = user._id;
        req.isAdmin = user.isAdmin
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const forPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    try {
        
        const skip = (page - 1) * limit
        const brands = await Brand.find({}, 'name')
        const categories = await Category.find({}, 'name name_ru name_en')
        const products = await Product.find().populate('category_id subCategory_id brand_id', '_id name name_ru name_en').skip(skip).limit(limit)
        if (!brands) {
            return res.status(404).json({ message: 'Brand ne nayden'})
        }
        if (!categories) {
            return res.status(404).json({ message: 'Категории не найдены' });
        }
        if (!products) {
            return res.status(404).json({ message: 'Продукты не найдены' });
        }
        res.status(200).json({brands, categories, products, currentPage: page,})
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Osybka w kode' });
    }
}

const CategoryAndSubcategory = async (req, res) => {
    try {
        const {categorySlug, subcategorySlug} = req.params;
        const category = await Category.findOne({ slug: categorySlug})
        const subcategory = await SubCategory.findOne({ slug: subcategorySlug})
        if (!category || !subcategory) {
            return res.status(404).json({ message: 'netu brenda ili podkategorii'})
        }
        const products = await Product.find({category_id: category._id, subCategory_id: subcategory._id })
        if (!products) {
            return res.status(404).json({ message: 'netu towara'})
        }
        res.json(products);
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Osybka w kode' });
    }
}

router.get('/', forPage)

router.get('/me', authenticateUser, getMe )

router.post('/refresh', refreshToken)

router.post('/register', registerValidation, register );

router.post('/login', loginValidation, login);

router.get('/brands',  getAllbrands)

router.get('/brand/:id', getOnebrand)  //authenticateUser

router.get('/categories', getAllCategories)

router.get('/category/:id',  getOneCategory)  //authenticateUser

router.get('/products', getAllProducts)

router.get('/product/:id', getOneProduct) //authenticateUser

router.get('/category/:id/subcategory/:id', CategoryAndSubcategory)

router.post('/order', orderCreate)

module.exports = router