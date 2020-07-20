const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const auth = require('../middleware/auth')
const router = express.Router()
const User = require('../models/User')
const Branch = require('../models/Branch')

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password')
		if (user) {
			return res.json({ username: user.username, id: req.user.id })
		}

		const branch = await Branch.findById(req.user.id).select('-password')
		if (branch) {
			return res.json({
				username: branch.name,
				id: req.user.id,
				branch: branch
			})
		}

		return res.status(400).json({ msg: 'User does not exist' })
	} catch (err) {
		console.error(err.message)
		res.status(500).send({ msg: 'Server Error' })
	}
})

router.post(
	'/',
	[
		check('username', 'Username is empty')
			.not()
			.isEmpty(),
		check('username', 'Invalid username').isAlphanumeric(),
		check('password', 'Password is empty')
			.not()
			.isEmpty(),
		check('password', 'Invalid password').isAlphanumeric()
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			let msgs = ''
			errors.array().map(({ msg }) => (msgs += msg + '\n'))
			return res.status(400).json({ msg: msgs })
		}

		const { username, password } = req.body

		try {
			
			let user = await User.findOne({ username })
			let branch = await Branch.findOne({ name: username })

			if (user) {
				const isMatch = await bcrypt.compare(password, user.password)
				if (!isMatch) {
					return res.status(400).json({ msg: 'Password does not match' })
				}
			}
			if (branch) {
				const isMatch = await bcrypt.compare(password, branch.password)
				if (!isMatch) {
					return res.status(400).json({ msg: 'Password does not match' })
				}
			}

			if (user || branch) {
				const payload = {
					user: {
						id: user ? user.id : branch.id
					}
				}

				jwt.sign(
					payload,
					config.get('jwtSecret'),
					{
						expiresIn: 86400
					},
					(err, token) => {
						if (err) throw err
						res.json({ token, id: user ? user.id : branch.id })
					}
				)
			} else {
				return res.status(400).json({ msg: 'Username does not exist' })
			}
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Server Error')
		}
	}
)

module.exports = router
