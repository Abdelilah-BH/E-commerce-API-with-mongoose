const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
  fullName: { type: String, require: true, index: { unique: true } },
  thumbnail: { type: String, default: 'uploads/profile-placeholder.jpeg' },
  biography: { type: String }
})

module.exports = mongoose.model('Author', AuthorSchema)
