const bcrypt = require('bcryptjs')
const express = require('express')
const { check, validationResult } = require('express-validator')
const admin = require('firebase-admin');

const auth = require('../middleware/auth')
const Branch = require('../models/Branch')
const User = require('../models/User')
const MUser = require('../models/MUser')
const serviceAccount = require('../config/foodtopia-4232d-firebase-adminsdk-lnivg-e086d5ba27.json')
const router = express.Router()

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	//   databaseURL: "https://Foodtopia-mobile-e8daf.firebaseio.com"
})

const defaultMessaging = admin.messaging()

router.delete('/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		if (!user || user.username !== 'admin') {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let branch = await Branch.findById(req.params.id)
		if (!branch) {
			return res.status(400).json({ msg: 'Branch does not exist' })
		}

		await Branch.findByIdAndRemove(req.params.id)

		res.send({ msg: 'Removed' })
	} catch (err) {
		console.error(err)
		res.status(500).send('Server Error')
	}
})

router.get('/list', auth, async (req, res) => {
	try {
		const branches = await Branch.find().select('-password')
		res.json(branches)
	} catch (err) {
		console.error(err)
		res.status(500).send('Server Error')
	}
})

router.post(
	'/',
	[
		auth,
		[
			check('location', 'Location is empty')
				.not()
				.isEmpty(),
			check('location', 'Invalid location').matches(/^[0-9a-zA-Z-, ]*$/),
			check('name', 'Name is empty')
				.not()
				.isEmpty(),
			check('name', 'Invalid name').matches(/^[0-9a-zA-Z- ]*$/),
			check('password', 'Password is empty')
				.not()
				.isEmpty(),
			check('password', 'Invalid password').isAlphanumeric(),
			check('phoneNumber', 'Phone number is empty')
				.not()
				.isEmpty(),
			check('phoneNumber', 'Invalid phone number').isNumeric()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			let msgs = ''
			errors.array().map(({ msg }) => (msgs += msg + '\n'))
			return res.status(400).json({ msg: msgs })
		}

		const { location, name, password, phoneNumber } = req.body

		try {
			const user = await User.findById(req.user.id)
			if (!user || user.username !== 'admin') {
				return res.status(401).json({ msg: 'Not authorised' })
			}

			let branch = await Branch.exists({ name, location })
			if (branch) {
				return res.status(400).json({ msg: 'Branch exists' })
			}

			branch = new Branch({
				location,
				name,
				password,
				phoneNumber
			})

			const salt = await bcrypt.genSalt(10)
			branch.password = await bcrypt.hash(password, salt)

			let { id } = await branch.save()

			res.send(id)
		} catch (err) {
			console.error(err)
			res.status(500).send('Server Error')
		}
	}
)

router.post('/notify', auth, async (req, res) => {
	try {

		const { message, title, phoneNumber } = req.body
		
		const user = await MUser.findOne({ phoneNumber })
		
		if(!user){
			return res.status(400).send({msg: 'Phone number doesn\'t belong to any user!'})
		}

		const { fcmToken } = user

		const notif = {
			notification: {
				title,
				body: message
			},
			android: {
				ttl: 3600 * 1000,
				notification: {
					icon: 'stock_ticker_update',
					color: '#f45342'
				}
			},
			apns: {
				payload: {
					aps: {
						badge: 42,
					}
				}
			},
			data: {
				title,
				message
			},
			token: fcmToken
		}

		await admin.messaging().send(notif)
		return res.status(200).send()
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({msg: 'Server error, try again.'})
	}
})

router.put(
	'/:id',
	[
		auth,
		[
			check('location', 'Invalid location').matches(/^[0-9a-zA-Z-, ]*$/),
			check('name', 'Invalid name').matches(/^[0-9a-zA-Z- ]*$/),
			check('password', 'Invalid password').matches(/^[0-9a-zA-Z]*$/),
			check('phoneNumber', 'Invalid phone number').matches(/^[0-9]*$/)
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			let msgs = ''
			errors.array().map(({ msg }) => (msgs += msg + '\n'))
			return res.status(400).json({ msg: msgs })
		}

		const { location, name, password, phoneNumber } = req.body

		try {
			const user = await User.findById(req.user.id)
			if (!user || user.username !== 'admin') {
				return res.status(401).json({ msg: 'Not authorised' })
			}

			let branch = await Branch.findById(req.params.id)
			if (!branch) {
				return res.status(400).json({ msg: 'Branch does not exist' })
			}

			branch = {}

			if (location) branch.location = location
			if (name) branch.name = name
			if (password) {
				const salt = await bcrypt.genSalt(10)
				branch.password = await bcrypt.hash(password, salt)
			}
			if (phoneNumber) branch.phoneNumber = phoneNumber

			await Branch.findByIdAndUpdate(
				req.params.id,
				{ $set: branch },
				{ new: true }
			)

			res.send({ msg: 'Updated' })
		} catch (err) {
			console.error(err)
			res.status(500).send('Server Error')
		}
	}
)

router.put('/block/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		if (!user || user.username !== 'admin') {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let branch = await Branch.findById(req.params.id)
		if (!branch) {
			return res.status(400).json({ msg: 'Branch does not exist' })
		}

		branch = {
			blocked: true
		}

		await Branch.findByIdAndUpdate(
			req.params.id,
			{ $set: branch },
			{ new: true }
		)

		res.send({ msg: 'Blocked' })
	} catch (err) {
		console.error(err)
		res.status(500).send('Server Error')
	}
})

router.put('/unblock/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		if (!user || user.username !== 'admin') {
			return res.status(401).json({ msg: 'Not authorised' })
		}

		let branch = await Branch.findById(req.params.id)
		if (!branch) {
			return res.status(400).json({ msg: 'Branch does not exist' })
		}

		branch = {
			blocked: false
		}

		await Branch.findByIdAndUpdate(
			req.params.id,
			{ $set: branch },
			{ new: true }
		)

		res.send({ msg: 'Unblocked' })
	} catch (err) {
		console.error(err)
		res.status(500).send('Server Error')
	}
})

module.exports = router
