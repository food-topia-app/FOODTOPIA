const express = require('express')

const auth = require('../middleware/auth')
const Branch = require('../models/Branch')
const MUser = require('../models/MUser')
const Order = require('../models/Order')
const Product = require('../models/Product')
const router = express.Router()

router.get('/list', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let orders = await Order.find({ branchId: req.user.id })
		let MUsers = await MUser.find()
		orders = orders.map(order => {
			return {
				...order._doc,
				phoneNumber: MUsers.filter(
					user => user._id.toString() === order.mUserId.toString()
				)[0].phoneNumber
			}
		})
		res.json(orders)
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.put('/approve/:id', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let order = await Order.findById(req.params.id)
		if (!order) {
			return res.status(400).json({ msg: 'Order does not exist' })
		} else if (order.branchId.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: { status: 'Approved' } },
			{ new: true }
		)

		res.send({ msg: 'Approved' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.put('/cancel/:id', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let order = await Order.findById(req.params.id)
		if (!order) {
			return res.status(400).json({ msg: 'Order does not exist' })
		} else if (order.branchId.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		// await Order.findByIdAndUpdate(
		// 	req.params.id,
		// 	{ $set: { status: 'Cancelled' } },
		// 	{ new: true }
		// )

		order.status = 'Cancelled'
		await order.save()
		for (item of order.items) {
			const product = await Product.findById(item.item._id)
			if (product.stock != null)
				if (product.stock > 0) {
					product.stock += item.count
					product.save()
				}
		}

		res.send({ msg: 'Cancelled' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.put('/deliver/:id', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let order = await Order.findById(req.params.id)
		if (!order) {
			return res.status(400).json({ msg: 'Order does not exist' })
		} else if (order.branchId.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: { status: 'Delivered' } },
			{ new: true }
		)

		res.send({ msg: 'Delivered' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.put('/payment/:id', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let order = await Order.findById(req.params.id)
		if (!order) {
			return res.status(400).json({ msg: 'Order does not exist' })
		} else if (order.branchId.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: { status: 'Payed' } },
			{ new: true }
		)

		res.send({ msg: 'Payed' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

module.exports = router
