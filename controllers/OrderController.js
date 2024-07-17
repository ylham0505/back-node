const Order = require('../models/Order')
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid')




const orderCreate = async (req, res) => {
    try {
        const { totalPrice, paymentInfo, address: addressBody, phone: phoneBody, items } = req.body
        const userId = req.userId
        const user = userId ? await User.findById(userId) : null

        const address = userId ? (user && user.address ? user.address : null) : (addressBody || null)
        const phone = userId ? (user && user.phone ? user.phone : null) : (phoneBody || null)

        const OrderData = {
            userId: userId || undefined,
            guestId: userId ? undefined : uuidv4(),
            totalPrice,
            paymentInfo,
            address,
            phone,
            items
        }

        const order = new Order(OrderData)
        await order.save()
        res.status(201).json({message: 'Order success', data: order})
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Order not success' });
    }
}

const orderDelete = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'You are not admin'})
        }
        const orderId = req.params.id 
        const order = await Order.findOneAndDelete({ _id: orderId })
        if (!order) {
            return res.status(404).json({ message: 'Order not found'})
        }
        res.status(200).json({ message: 'Order deleted'})
    } catch (err) {
        res.status(400).json({ error: 'Oops cto to poslo ne tak' });
    }
}

module.exports = { orderCreate, orderDelete }