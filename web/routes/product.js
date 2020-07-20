const express = require('express')
const { check, validationResult } = require('express-validator')

const auth = require('../middleware/auth')
const Product = require('../models/Product')
const productUpload = require('../middleware/productUpload')
const Branch = require('../models/Branch')
const router = express.Router()

router.delete('/:id', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let product = await Product.findById(req.params.id)
		if (!product) {
			return res.status(400).json({ msg: 'Product does not exist' })
		} else if (product.branch.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		await Product.findByIdAndRemove(req.params.id)

		res.send({ msg: 'Removed' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.get('/list', auth, async (req, res) => {
	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		const products = await Product.find({ branch: req.user.id }).select(
			'-pic -picMime'
		)
		res.json(products)
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.post(
	'/',
	[
		auth,
		[
			check('description', 'Description is empty').not().isEmpty(),
			check('name', 'Name is empty').not().isEmpty(),
			check('rate', 'Rate is empty').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			let msgs = ''
			errors.array().map(({ msg }) => (msgs += msg + '\n'))
			return res.status(400).json({ msg: msgs })
		}

		const {
			category,
			description,
			name,
			quantity,
			rate,
			sellerName,
			sellerNumber,
			stock,
			type,
			unit,
		} = req.body

		try {
			const branch = await Branch.findById(req.user.id)
			if (!branch) {
				return res.status(401).json({ msg: 'Not authorised' })
			}

			let product = await Product.exists({ name })
			if (product) {
				return res.status(400).json({ msg: 'Product exists' })
			}

			product = new Product({
				branch: req.user.id,
				category,
				description,
				// name: name
				// 	.split(' ')
				// 	.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
				// 	.join(' '),
				name,
				quantity,
				rate,
				stock,
				sellerName,
				sellerNumber,
				type,
				unit,
			})

			let { id } = await product.save()

			res.send(id)
		} catch (err) {
			console.error(err)
			res.status(500).send({ msg: 'Server Error' })
		}
	}
)

router.post(
	'/pic',
	[auth, productUpload],
	async (req, res) => {
		try {
			const branch = await Branch.findById(req.user.id)
			if (!branch) {
				return res.status(401).json({ msg: 'Not authorised' })
			}

			let product = await Product.findById(req.body.id)
			if (!product) {
				return res.status(400).json({ msg: 'Product does not exist' })
			}

			let productChanges = {
				pic: req.file.buffer.toString('base64'),
				picMime: req.user.picMime,
			}

			await Product.findByIdAndUpdate(
				product.id,
				{ $set: productChanges },
				{ new: true }
			)

			res.send({ msg: 'Uploaded' })
		} catch (err) {
			console.error(err)
			res.status(500).send({ msg: 'Server Error' })
		}
	},
	(error, req, res, next) => {
		if (error) {
			console.error(error)
			res.status(500).send({ msg: error.message })
		}
	}
)

router.put('/:id', auth, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		let msgs = ''
		errors.array().map(({ msg }) => (msgs += msg + '\n'))
		return res.status(400).json({ msg: msgs })
	}

	const {
		category,
		description,
		name,
		quantity,
		rate,
		stock,
		sellerName,
		sellerNumber,
		type,
		unit,
	} = req.body

	try {
		const branch = await Branch.findById(req.user.id)
		if (!branch) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let product = await Product.findById(req.params.id)
		if (!product) {
			return res.status(400).json({ msg: 'Product does not exist' })
		} else if (product.branch.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		productChanges = {}

		if (category) productChanges.category = category
		if (description) productChanges.description = description
		if (name) productChanges.name = name
		if (quantity) productChanges.quantity = quantity
		if (rate) productChanges.rate = rate
		if (stock) productChanges.stock = stock
		if (sellerName) productChanges.sellerName = sellerName
		if (sellerNumber) productChanges.sellerNumber = sellerNumber
		if (type !== undefined && type !== product.type) productChanges.type = type
		if (unit) productChanges.unit = unit

		await Product.findByIdAndUpdate(
			req.params.id,
			{ $set: productChanges },
			{ new: true }
		)

		res.send({ msg: 'Updated' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

module.exports = router
