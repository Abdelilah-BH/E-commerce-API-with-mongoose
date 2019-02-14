const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()
require('./config/passport')

const app = express()

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useCreateIndex: true })
} else {
  mongoose.connect(process.env.DATABASE_URI_TEST, { useNewUrlParser: true })
}

// Middleware
app.use(cors('*'))
app.use(compression())
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } } }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// all routes
app.use('/', require('./routes/user'))
app.use('/products', require('./routes/product'))
app.use('/carts', require('./routes/cart'))
app.use('/shippings', require('./routes/shipping'))
app.use('/orders', require('./routes/order'))
app.use('/authors', require('./routes/author'))
app.use('/categorys', require('./routes/category'))
app.use('/uploads', express.static('uploads'))


const port = process.env.PORT || 3001

if (!module.parent) {
  app.listen(port, () => {
    console.log(`server runing : ${port} `)
  })
}

module.exports = app
