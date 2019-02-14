const mongoose = require('mongoose')

const ShippingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: {
    first: String,
    last: String
  },
  phones: {
    personal: String,
    home: String,
    work: String
  },
  adress: {
    street: String,
    region: String,
    zip: Number,
    city: String,
    country: String
  }
}, { timestamps: { createdAt: 'createdAt' } })

module.exports = mongoose.model('Shipping', ShippingSchema)
