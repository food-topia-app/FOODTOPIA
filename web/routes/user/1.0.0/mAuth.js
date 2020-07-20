const express = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

const router = express.Router()
const auth = require('../../../middleware/auth');
const MUser = require('../../../models/MUser')

router.get('/', auth, async (req, res) => {
    let user = await MUser.findById(req.user.id);

    try {
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/', [], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let msgs = '';
        errors.array().map(({ msg }) => (msgs += msg + '\n'));
        return res.status(400).json({ msg: msgs });
    }

    const { phoneNumber, fcmToken } = req.body;

    try {
        let user = await MUser.findOne({ phoneNumber })
        if (!user) {
            user = new MUser({
                phoneNumber: phoneNumber,
                fcmToken: fcmToken
            })
        }
        else
            user.fcmToken = fcmToken;
        user = await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            (err, token) => {
                if (err) throw err;
                res.json({ token: token, status: "user-verified" });
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.put('/', auth, async (req, res) => {
    const { name, address, pincode } = req.body;

    let user = await MUser.findById(req.user.id);
    user.name = name;
    user.address = address;
    user.pincode = pincode;

    try {
        user = await user.save();
        res.json({ status: 'updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router