const { Router } = require('express')
const router = Router()
const multer = require('multer')
const { brandCreate, brandDelete, brandUpdate} = require('../controllers/BrandController')
const { categoryCreate, categoryDelete, categoryUpdate } = require('../controllers/CategoryController')
const { subCategoryCreate, subCategoryDelete, subCategoryUpdate } = require('../controllers/SubCategoryController')
const { productCreate, productDelete, productUpdate } = require('../controllers/ProductController')
const jwt = require('jsonwebtoken')
const { brandCreateValidation, categoryCreateValidation, productCreateValidation } = require('../validations/Validations')
const { orderDelete } = require('../controllers/OrderController')

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

const Admin = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        const user = jwt.verify(token.replace('Bearer ', ''), 'your_secret_key');
        req.isAdmin = user.isAdmin;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

//image
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

// brand crud
router.post('/secret/brand', Admin, brandCreateValidation, brandCreate )
router.delete('/secret/brand/:id', Admin, brandDelete )
router.patch('/secret/brand/:id', Admin, brandUpdate)

// category crud
router.post('/secret/category', Admin, categoryCreateValidation, categoryCreate )
router.delete('/secret/category/:id', Admin, categoryDelete )
router.patch('/secret/category/:id', Admin, categoryUpdate)

// subCategory crud
router.post('/secret/subcategory', Admin, subCategoryCreate )
router.delete('/secret/subcategory/:id', Admin, subCategoryDelete )
router.patch('/secret/subcategory/:id', Admin, subCategoryUpdate)

// product crud 
router.post('/secret/product', Admin, productCreateValidation, productCreate )
router.delete('/secret/product/:id', Admin, productDelete )
router.patch('/secret/product/:id', Admin, productUpdate )

// order
router.delete('/order/:id', Admin, orderDelete)


module.exports = router