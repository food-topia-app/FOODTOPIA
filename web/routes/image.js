const express = require('express')
const router = express.Router()

const Product = require('../models/Product')

router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		res.set('Content-Type', product.picMime)
		const img = Buffer.from(product.pic, 'base64')
		res.send(img)
	} catch (err) {
		console.error(err)
		res.status(500).send({ msg: 'Server Error' })
	}
})

module.exports = router
