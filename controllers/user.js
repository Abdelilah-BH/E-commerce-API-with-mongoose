const User = require('../models/user')
const { generateJwtToken, generateRefreshJwtToken, transporter } = require('../config/global')
const JwtToken = require('../models/token')
const JWT = require('jsonwebtoken')
const randToken = require('rand-token')

module.exports = {
  signUp: async (req, res) => {
    const { username, email, password } = req.value.body
    const user = await User.findOne({ '$or': [{ 'local.email': email }, { 'local.username': username }] })
    if (user) {
      return res.status(400).json({ message: 'this user is already created.' })
    }
    const token = randToken.uid(50)
    await User({
      method: 'local',
      'local.username': username,
      'local.email': email,
      'local.password': password,
      'local.token': token
    }).save()
    return res.status(200).json({ message: 'your account has been created successfully, please activate your account, we sand you a link in your email.' })
  },
  signIn: async (req, res) => {
    if(Object.keys(req.user).length > 1){
      const { _id, admin } = req.user
      const jwtToken = generateJwtToken(_id, admin, process.env.SECRET_KEY_JWT, process.env.JWT_TOKEN_LIFE)
      const refreshJwtToken = generateRefreshJwtToken(_id, process.env.SECRET_KEY_REFRESH_JWT, process.env.REFRESH_JWT_TOKEN_LIFE)
      const response = await new JwtToken({ jwtToken, refreshJwtToken }).save()
      return res.status(200).json(response)  
    }
    return res.status(200).json(req.user)
  },
  getNewJwtToken: async (req, res) => {
    const refreshJwtToken = req.body.refreshJwtToken
    let jwtToken = req.headers['authorization']
    let userId = {}
    if (!refreshJwtToken || !jwtToken) {
      return res.status(401).send('you must be send a token and refresh token')
    }
    jwtToken = jwtToken.split(' ')[1]
    JWT.verify(refreshJwtToken, process.env.SECRET_KEY_REFRESH_JWT, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          await JwtToken.deleteOne({ refreshJwtToken })
        }
        return res.status(403).send('unaurhorized')
      }
      userId = decoded.sub
    })
    JWT.verify(jwtToken, process.env.SECRET_KEY_JWT, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          const findToken = await JwtToken.findOne({ jwtToken })
          console.log(findToken)
          if (!findToken) {
            return res.status(401).json({ message: 'Token not found' })
          }
          const user = await User.findById(userId)
          if (user) {
            const newAccessToken = generateJwtToken(userId, user.admin, process.env.SECRET_KEY_JWT, process.env.JWT_TOKEN_LIFE)
            await JwtToken.updateOne(findToken, { jwtToken: newAccessToken })
            return res.status(200).json({ newAccessToken })
          }
        }
        return res.status(404).json({ message: 'invalid signature' })
      }
      return res.status(203).json({ message: 'Token is still working' })
    })
  },
  sendTokenViaEmail: async (req, res) => {
    const user = await User.findById(req.value.params._id)
    if (!user) {
      return res.status(400).json({ message: 'bad request!' })
    }
    if (user.local.token === '' || !user.local.token) {
      return res.status(400).json({ message: 'this account is already activated' })
    }
    const mailOptions = {
      from: '"SpecialDES 😃" <specialdes@gmail.com>',
      to: user.local.email,
      subject: 'Activate Your Account',
      html: `
        <p>Hello <b>${user.local.username}</b>,</p>
        <p>Please go to the following page to confirm your registration:</p>
        <a href="http://localhost:3000/user/activate/${user._id}/${user.local.token}">
          http://localhost:3000/user/activate/${user._id}/${user.local.token}
        </a>
        <p>Thanks for using our site!</p>
      `
    }
    await transporter.sendMail(mailOptions, (err, done) => {
      if (err) {
        console.log(err)
        return res.status(403).json({ message: 'error happened', err })
      }
      console.log(done)
      return res.status(200).json({ message: 'Token has been send successfully' })
    })
  },
  validateAccount: async (req, res) => {
    const { _id, token } = req.value.params
    const user = await User.findById(_id)
    if (user) {
      const expireToken = user.local.expireToken.getTime()
      const date = new Date().getTime()
      if (user.local.token !== token || expireToken < date) {
        return res.status(400).json({ message: 'token invalid or expired or your account already activated' })
      }
      await User.updateOne(user, { 'local.token': '', 'local.isActivated': true })
      const jwtToken = generateJwtToken(user._id, user.admin, process.env.SECRET_KEY_JWT, process.env.JWT_TOKEN_LIFE)
      const refreshJwtToken = generateRefreshJwtToken(user._id, process.env.SECRET_KEY_REFRESH_JWT, process.env.REFRESH_JWT_TOKEN_LIFE)
      const jwtTokens = await new JwtToken({ jwtToken, refreshJwtToken }).save()
      return res.status(200).json({ message: 'your account has been activated successfully', jwtTokens })
    }
  },
  profile: async (req, res) => {
    res.status(200).json(req.user)
  },
  editProfile: async (req, res) => {
    const { _id } = req.params
    const newUser = req.body
    const user = await User.findById(_id)
    if(!user) {
      return res.status(403).json({ message: 'user is not find' })
    }
    if(user.method === 'local'){
      await User.updateOne({_id}, {'local': newUser })
    }
    if(user.method === 'facebook'){
      await User.updateOne(user, { 'facebook': { username }})
    }
    if(user.method === 'google'){
      await User.updateOne(user, { 'google': { username }})
    }
    return res.status(200).json({ message: 'user has ben updated' })
  }
}
