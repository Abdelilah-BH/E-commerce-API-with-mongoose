const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    amount: { type: Number, default: 1 }
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: { createdAt: 'createdAt' } })

module.exports = mongoose.model('Cart', CartSchema)
