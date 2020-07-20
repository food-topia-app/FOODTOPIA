const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
	branch: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	category: {
		type: String,
	},
	description: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	pic: {
		type: String,
	},
	picMime: {
		type: String,
	},
	quantity: {
		type: String,
	},
	rate: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		required: false,
	},
	sellerName: {
		type: String,
		required: false,
	},
	sellerNumber: {
		type: String,
		required: false,
	},
	type: {
		type: Boolean,
		required: true,
	},
	unit: {
		type: String,
	},
})

module.exports = mongoose.model('product', ProductSchema)
