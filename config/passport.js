const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook-token')
const GoogleStrategy = require('passport-google-token').Strategy
const User = require('../models/user')

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY_JWT,
  issuer: 'specialdes.com'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (err) {
    done(err, false)
  }
}))

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ 'local.email': email })
    if (!user) {
      return done(null, { message: 'your email is invalid' })
    }
    const isvalid = await user.isValidPassword(password)
    if (!isvalid) {
      return done(null, { message: 'your password is invalid'})
    }
    return done(null, user)
  } catch (err) {
    done(err)
  }
}))

passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails } = profile
    const exsistUser = await User.findOne({ 'facebook.id': id })
    if (exsistUser) {
      return done(null, exsistUser)
    }
    const user = new User({ method: 'facebook', 'facebook.id': id, 'facebook.username': displayName, 'facebook.email': emails[0].value })
    await user.save()
    console.log(user)
    done(null, user)
  } catch (err) {
    done(err, false, err.message)
  }
}))

passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails } = profile
    const exsistUser = await User.findOne({ 'google.id': id })
    if (exsistUser) {
      console.log(exsistUser)
      return done(null, exsistUser)
    }
    const user = new User({ method: 'google', 'google.id': id, 'google.username': displayName, 'google.email': emails[0].value })
    await user.save()
    done(null, user)
  } catch (err) {
    done(err, false, err.message)
  }
}))
