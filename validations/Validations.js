const { body } = require('express-validator')

const registerValidation = [
    body('username','username will be 3 simbol').isLength({ min: 3}),
    body('email','is not email').isEmail(),
    body('password','min 5 simbol').isLength({ min: 5})
]

const loginValidation = [
    body('username','username will be 3 simbol').isLength({ min: 3}),
    body('password','min 5 simbol').isLength({ min: 5})
]

const brandCreateValidation = [
    body('name', 'brand name will be 3 simbol').isLength({ min: 3}).isString(),
    body('image', 'image not found bla bla uytgetmeli').optional().isString()
]

const categoryCreateValidation = [
    body('name', 'category name will be 3 simbol').isLength({ min: 3}).isString(),
    body('name_ru', 'category name will be 3 simbol').optional().isLength({ min: 3}).isString(),
    body('name_en', 'category name will be 3 simbol').optional().isLength({ min: 3}).isString(),
    body('image', 'image not found bla bla uytgetmeli').optional().isString()
]

const productCreateValidation = [
    body('name', 'product name will be 3 simbol').isLength({ min: 3}).isString(),
    body('name_ru', 'product name will be 3 simbol').optional().isLength({ min: 3}).isString(),
    body('name_en', 'product name will be 3 simbol').optional().isLength({ min: 3}).isString(),
    body('description', 'description will be 5 simbol').isLength({ min: 5}).isString(),
    body('description_ru', 'description will be 5 simbol').optional().isLength({ min: 5}).isString(),
    body('description_en', 'description will be 5 simbol').optional().isLength({ min: 5}).isString(),
    body('image', 'image not found bla bla uytgetmeli').optional().isString()
]

module.exports = { registerValidation, loginValidation, brandCreateValidation, categoryCreateValidation, productCreateValidation }