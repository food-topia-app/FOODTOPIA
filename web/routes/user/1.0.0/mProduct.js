const express = require('express')
const router = express.Router()

const MUser = require('../../../models/MUser')
const Product = require('../../../models/Product');
const auth = require('../../../middleware/auth');

router.post('/', auth, async (req, res) => {

    const { branchId, fcmToken, updateFcmToken } = req.body
    const { id } = req.user

    try {
        let user = await MUser.findById(id);
        if (user !== null) {

            if (updateFcmToken) {
                user.fcmToken = fcmToken;
                user = await user.save();
            }

            let products;
            if (branchId === undefined)
                products = await Product.find({}, '-pic -picMime')
            else
                products = await Product.find({ branch: branchId },  '-pic -picMime')

            res.json(products);
        }
        else {
            res.status(401).json({ msg: 'INVALID_USER' })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/stock/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const stock = await Product.findById(id, 'stock')
        res.status(200).send(stock)
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: 'Server Error' })
    }
})

module.exports = router