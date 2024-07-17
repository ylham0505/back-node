const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')



const register = async (req, res) => {
    const { username, email, password, address, phone, isAdmin, JWTtoken } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, address, phone, isAdmin, JWTtoken });
    const errors = validationResult(req)
    try {
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = await user.save()
        res.status(201).json({ username: doc.username })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Registration failed' });
    }
}

const login = async (req, res) => {

    try {
        const { username, password } = req.body
        const admin = await User.findOne({ username: "admin" })
        if (admin) {
            admin.isAdmin = true;
            await admin.save();
        }

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password or login' });
        }

        const token = jwt.sign({ _id: user._id, username: user.username, isAdmin: user.isAdmin }, 'your_secret_key', {
            expiresIn: '1h',
        });

        if (user.isAdmin && isPasswordValid) {
            return res.status(201).json({message: 'isAdmin', token})
        }

        const refreshToken = jwt.sign({userId: user._id}, 'your_secret_key')
        user.JWTtoken = refreshToken
        await user.save()


        res.status(201).json({ username: user.username, token, refreshToken })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Login failed' });
    }
}

const refreshToken = async (req, res) => {
    try {
        const user = await User.findOne({ JWTtoken: req.body.refreshToken });
        if (!user) {
            return res.status(404).json({ error: 'User not found or invalid refreshToken' });
        }

        jwt.verify(req.body.refreshToken, 'your_secret_key', (err, decode) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ error: 'Invalid or expired refreshToken' });
            } else {
                const newRefreshToken = jwt.sign({}, 'your_secret_key');
                user.JWTtoken = newRefreshToken;
                user.save();

                const token = jwt.sign({ userId: decode.userId }, 'your_secret_key', { expiresIn: '1h' });
                console.log(decode.userId);
                return res.status(200).json({
                    message: 'Token refreshed successfully',
                    token,
                    refreshToken: newRefreshToken
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        }
        
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { register, login, refreshToken, getMe }