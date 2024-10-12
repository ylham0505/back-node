const { Router } = require('express')
const router = Router()
const path = require('path');
const multer = require('multer')
const { brandCreate, brandDelete, brandUpdate} = require('../controllers/BrandController')
const { categoryCreate, categoryDelete, categoryUpdate } = require('../controllers/CategoryController')
const { subCategoryCreate, subCategoryDelete, subCategoryUpdate } = require('../controllers/SubCategoryController')
const { productCreate, productDelete, productUpdate } = require('../controllers/ProductController')
const jwt = require('jsonwebtoken')
const { orderDelete } = require('../controllers/OrderController')

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

// const storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

const upload = multer({ storage })

// const upload = multer({ dest: 'uploads/' })

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
router.post('/secret/brand', Admin, upload.single('brand-photo'), brandCreate )
router.delete('/secret/brand/:id', Admin, brandDelete )
router.patch('/secret/brand/:id', Admin, upload.single('brand-photo'), brandUpdate)

// category crud
router.post('/secret/category', Admin, categoryCreate )
router.delete('/secret/category/:id', Admin, categoryDelete )
router.patch('/secret/category/:id', Admin, categoryUpdate)

// subCategory crud
router.post('/secret/subcategory', Admin, subCategoryCreate )
router.delete('/secret/subcategory/:id', Admin, subCategoryDelete )
router.patch('/secret/subcategory/:id', Admin, subCategoryUpdate)

// product crud 
router.post('/secret/product', Admin, upload.single('product-photo'), productCreate )
router.delete('/secret/product/:id', Admin, productDelete )
router.patch('/secret/product/:id', Admin, upload.single('product-photo'), productUpdate )

// order
router.delete('/order/:id', Admin, orderDelete)


module.exports = router