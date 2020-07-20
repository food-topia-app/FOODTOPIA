const mongoose = require('mongoose')

const mUserSchema = mongoose.Schema({
	phoneNumber: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	pincode: {
		type: String,
		required: false
	},
	fcmToken: {
		type: String,
		required: false
	}
})

module.exports = mongoose.model('MUser', mUserSchema)
