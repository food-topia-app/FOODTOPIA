const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
	mUserId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	pincode: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	items: {
		type: JSON,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	branchId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	orderId: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('Order', OrderSchema)
