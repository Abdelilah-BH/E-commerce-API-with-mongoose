const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let expireDate = Date.now() + 3600000
expireDate = new Date(expireDate)

const userSchema = new mongoose.Schema({
  method: { type: String, enum: ['local', 'google', 'facebook'], required: true },
  local: {
    username: String,
    email: String,
    password: String,
    token: String,
    isActivated: { type: Boolean, default: false },
    expireToken: { type: Date, default: expireDate }
  },
  google: {
    id: String,
    username: String,
    email: String
  },
  facebook: {
    id: String,
    username: String,
    email: String
  },
  thmubnail: { type: String, default: 'uploads/profile-placeholder.jpeg' },
  admin: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt' } })

userSchema.pre('save', async function (next) {
  try {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('local.password')) {
      return next()
    }
    const hash = await bcrypt.hash(this.local.password, 10)
    this.local.password = hash
    next()
  } catch (err) {
    next(err)
  }
})

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.local.password)
  return compare
}

module.exports = mongoose.model('User', userSchema)
