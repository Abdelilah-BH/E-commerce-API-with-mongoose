const router = require('express-promise-router')()
const userController = require('../controllers/user')
const { validatedBody, validatedParams } = require('../helpers/routeHelper')
const { userSchemas, paramsSchemas } = require('../helpers/schemas')
const passport = require('passport')
const LocalAuthenticate = passport.authenticate('local', { session: false })
const JWTAuthenticate = passport.authenticate('jwt', { session: false })
const FacebookAuthenticate = passport.authenticate('facebook', { session: false })
const GoogleAuthenticate = passport.authenticate('google', { session: false })

router.route('/signup')
  .post(validatedBody(userSchemas.userSchemaCreate), userController.signUp)

router.route('/signin')
  .post(validatedBody(userSchemas.userSchemaSignIn), LocalAuthenticate, userController.signIn)

router.route('/oauth/facebook')
  .post(FacebookAuthenticate, userController.signIn)

router.route('/oauth/google')
  .post(GoogleAuthenticate, userController.signIn)

router.route('/jwt-token')
  .post(userController.getNewJwtToken)

router.route('/user/:_id/token')
  .get(validatedParams(paramsSchemas._idSchema, '_id'), userController.sendTokenViaEmail)

router.route('/user/activate/:_id/:token')
  .get([
    validatedParams(paramsSchemas._idSchema, '_id'),
    validatedParams(paramsSchemas.tokenSchema, 'token')],
  userController.validateAccount
  )

router.route('/profile')
  .get(JWTAuthenticate, userController.profile)

router.route('/profile/:_id')
  .patch(JWTAuthenticate, userController.editProfile)

module.exports = router
