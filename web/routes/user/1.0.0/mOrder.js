const express = require('express')
const router = express.Router()
const axios = require('axios')

const auth = require('../../../middleware/auth')
const Order = require('../../../models/Order')
const OrderId = require('../../../models/OrderId');
const Branch = require('../../../models/Branch');
const Product = require('../../../models/Product')

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 'mUserId': req.user.id });
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
})

router.post('/', auth, async (req, res) => {
    const { name, address, pincode, amount, items, date, time, branchId } = req.body;

    let savedItems = []

    try {

        // let stockError = false
        let stockErrorItem = undefined

        for (item of items) {
            const product = await Product.findById(item.item._id, 'stock')
            if (product.stock != null)
                if (product.stock > -1) {
                    if (item.count <= product.stock) {
                        product.stock -= item.count
                        product.save()
                        savedItems.push(item)
                    }
                    else {
                        stockErrorItem = item
                        // stockError = true
                        break
                    }
                }
        }

        if (stockErrorItem) {
            for (item of savedItems) {
                const product = await Product.findById(item.item._id, 'stock')
                if (product.stock != undefined) {
                    product.stock += item.count
                    product.save()
                }
            }
            return res.status(500).send({ msg: 'STOCK_ERROR', name: stockErrorItem.item.name })
        }

        let tmpDate = new Date();
        let year = tmpDate.getFullYear();
        let month = tmpDate.getMonth() + 1;
        if (month < 10)
            month = '0' + month;

        let orderId = await OrderId.findOne({ 'year': year, month: month });

        if (orderId === null) {
            orderId = new OrderId({
                year: year,
                month: month,
                count: 0
            });
        }

        let orderIdString = orderId.year + '-' + orderId.month + '-' + orderId.count;

        let tmpOrder = await Order.findOne({ orderId: orderIdString });
        while (tmpOrder !== null) {
            orderId.count = orderId.count + 1;
            orderIdString = orderId.year + '-' + orderId.month + '-' + orderId.count;
            tmpOrder = await Order.findOne({ orderId: orderIdString });
        }

        await orderId.save();

        let order = new Order({
            orderId: orderIdString,
            mUserId: req.user.id,
            name: name,
            address: address,
            pincode: pincode,
            amount: amount,
            items: items,
            status: "Pending Approval",
            date: date,
            time: time,
            branchId: branchId
        });


        const result = await order.save();
        res.json({ status: 'order-placed', id: result._id});

        let messageString = "";

        messageString = 'Order ID: ' + order.orderId;
        messageString += '\nName: ' + order.name;
        messageString += '\nAddress: ' + order.address;
        messageString += '\nPincode: ' + order.pincode;
        messageString += '\nTotal Amount: Rs ' + order.amount;
        messageString += '\nItems ->';
        let count = 1;
        order.items.some((element) => {
            messageString += '\n' + count + ". ";
            if (element.item.type)
                messageString += 'Product: ';
            else
                messageString += 'Service: ';
            messageString += element.item.name;
            messageString += '\nQTY: ' + element.count;
            messageString += '\nRs ' + element.item.rate + ' / ' + element.item.quantity + ' ' + element.item.unit;
            messageString += '\nAmount: ' + element.item.rate * element.count;

            count++;
        });

        let branchPhoneNumber = await Branch.findById(branchId, { phoneNumber: 1, _id: 0 });

        // let response = await axios.post(
        //     'https://api.msg91.com/api/v2/sendsms', {
        //     "sender": "FoodtopiaMOB",
        //     "route": "4",
        //     "country": "91",
        //     "sms": [
        //         {
        //             "message": messageString,
        //             "to": [branchPhoneNumber.phoneNumber]
        //         }
        //     ]
        // }, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'authkey': '317050AtD96E63Q4G5e3c243aP1'
        //     }
        // });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.put('/', auth, async (req, res) => {
    try {
        const { id } = req.body
        const order = await Order.findById(id);
        if (order.status === 'Pending Approval' || order.status === 'Pending Payment') {
            order.status = 'Cancelled';
            await order.save();
            for (item of order.items) {
                const product = await Product.findById(item.item._id)
                if (product.stock != null) {
                    product.stock += item.count
                    product.save()
                }
            }
            res.json({ status: 'order-cancelled' });
        }
        else
            res.json({ status: 'error' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router