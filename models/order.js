const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  status: { enum: ['Verification', 'Processing', 'Shipped', 'Received', 'Canceled'] }
}, { timestamps: { createdAt: 'createdAt' } })

module.exports = mongoose.model('Order', orderSchema)
