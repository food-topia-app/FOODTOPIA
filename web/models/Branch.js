const mongoose = require('mongoose')

const BranchSchema = mongoose.Schema({
	blocked: {
		type: Boolean,
		default: false
	},
	location: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('branch', BranchSchema)
