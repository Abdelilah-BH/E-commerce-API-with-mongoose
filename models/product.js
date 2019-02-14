const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  industryIdentifiers: {
    sku: String,
    isbn_13: String,
    isbn_10: String
  },
  title: { type: String, required: true },
  short_title: { type: String },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sub_category: String,
  price: { type: Number, min: 0, default: 0 },
  in_stock: { type: Boolean, default: false },
  format: {
    name: String,
    presentation: String
  },
  language: String,
  publisher: {
    name: String,
    date: Date
  },
  serie: String,
  age: {
    min: Number,
    max: Number
  },
  dimensions: {
    height: Number,
    length: Number,
    width: Number
  },
  weight: Number,
  pageCount: Number,
  thumbnail: [{ type: String, default: '/upload/product-placeholder.jpg' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
  }]
}, { timestamps: { createdAt: 'createdAt' } })

module.exports = mongoose.model('Product', productSchema)
