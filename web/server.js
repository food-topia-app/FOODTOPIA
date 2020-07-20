const express = require('express')
const connectDB = require('./config/db')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json({ extended: false }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/branch', require('./routes/branch'))
app.use('/api/order', require('./routes/order'))
app.use('/api/product', require('./routes/product'))
app.use('/img', require('./routes/image'))

app.use('/api/user/1.0.0/mauth', require('./routes/user/1.0.0/mAuth'))
app.use('/api/user/1.0.0/mbranch', require('./routes/user/1.0.0/mBranch'))
app.use('/api/user/1.0.0/morder', require('./routes/user/1.0.0/mOrder'))
app.use('/api/user/1.0.0/mproduct', require('./routes/user/1.0.0/mProduct'))

app.use('/api/delivery/1.0.0/mauth', require('./routes/delivery/1.0.0/mAuth'))
app.use('/api/delivery/1.0.0/morder', require('./routes/delivery/1.0.0/mOrder'))

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))
	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	)
}

let server = app.listen(PORT, () => console.log(`Server started on ${PORT}`))
