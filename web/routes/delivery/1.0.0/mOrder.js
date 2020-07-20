const express = require('express')
const router = express.Router()

const auth = require('../../../middleware/auth')
const Order = require('../../../models/Order')

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order)
            return res.status(404).send({ msg: 'ORDER_NOT_FOUND' })

        if (order.status === 'Delivered')
            return res.status(500).send({ msg: 'ORDER_ALREADY_DELIVERED' })

        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
})

router.put('/', auth, async (req, res) => {
    try {
        const { id, status } = req.body
        const order = await Order.findById(id)
        order.status = status
        await order.save();
        res.status(200).send({ status: 'Delivered' })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router