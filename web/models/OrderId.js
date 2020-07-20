const mongoose = require('mongoose')

const OrderIdSchema = mongoose.Schema({
	year: {
		type: String,
		required: true
	},
	month: {
		type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('orderId', OrderIdSchema)
