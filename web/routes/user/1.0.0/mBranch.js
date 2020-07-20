const express = require('express')

const auth = require('../../../middleware/auth')
const Branch = require('../../../models/Branch')
const router = express.Router()

router.get('/', auth, async (req, res) => {
    try {
        const branches = await Branch.find().select('-password');
        res.json(branches);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
})

module.exports = router