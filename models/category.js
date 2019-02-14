const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  slug: String,
  ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
})

module.exports = mongoose.model('Category', CategorySchema)
