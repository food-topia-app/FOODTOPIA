const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const User = require('../models/User')
const db = config.get('mongoURI')

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})
		console.log('MongoDB Connected...')

		let admin = await User.findOne({ username: 'admin' })
		if (!admin) {
			admin = new User({
				username: 'admin',
				password: 'password'
			})

			const salt = await bcrypt.genSalt(10)
			admin.password = await bcrypt.hash(admin.password, salt)

			admin.save()
			console.log('Admin Created!')
		}

	} catch (err) {
		console.error(err.message)
		process.exit(1)
	}
}

module.exports = connectDB
