const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
  jwtToken: { type: String, required: true },
  refreshJwtToken: { type: String, required: true }
}, { timestamps: { createdAt: 'createdAt' } })

module.exports = mongoose.model('Token', tokenSchema)
