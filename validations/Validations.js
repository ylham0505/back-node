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

module.exports = { registerValidation, loginValidation }