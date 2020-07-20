const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const auth = require('../../../middleware/auth')
const router = express.Router()
const Branch = require('../../../models/Branch')

router.get('/', auth, async (req, res) => {
	try {
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
			let branch = await Branch.findOne({ name: username })

			if (branch) {
				const isMatch = await bcrypt.compare(password, branch.password)
				if (!isMatch) {
					return res.status(400).json({ msg: 'PASSWORD_ERROR' })
				}
			}

			if (branch) {
				const payload = {
					user: {
						id: branch.id
					}
				}

				jwt.sign(
					payload,
					config.get('jwtSecret'),
					(err, token) => {
						if (err) throw err
						res.json({ token, id: branch.id })
					}
				)
			} else {
				return res.status(400).json({ msg: 'USERNAME_ERROR' })
			}
		} catch (err) {
			console.error(err.message)
			res.status(500).send('SERVER_ERROR')
		}
	}
)

module.exports = router
