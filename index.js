const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const userRoutes = require('./routes/user.js')
const adminRoutes = require('./routes/admin.js')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(express.static(path.join(__dirname,'public')))
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(userRoutes)
app.use(adminRoutes)


async function start() {
    try {
        await mongoose.connect('mongodb+srv://ylham:ylhamuseradmin@weterenariya.byg86mu.mongodb.net/?retryWrites=true&w=majority&appName=weterenariya', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}
start()