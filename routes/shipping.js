const router = require('express-promise-router')()
const shippingController = require('../controllers/shipping')
const { validatedBody, validatedParams } = require('../helpers/routeHelper')
const { shippingSchema, paramsSchemas } = require('../helpers/schemas')
const passport = require('passport')
const isLogin = passport.authenticate('jwt', { session: false })

router.route('/')
  .post(isLogin, validatedBody(shippingSchema.shippingSchemaCreate), shippingController.addShopping)

router.route('/:id')
  .patch(isLogin, [
    validatedParams(paramsSchemas, 'id'),
    validatedBody(shippingSchema.shippingSchemaUpdate)
  ], shippingController.updateShipping)

module.exports = router
