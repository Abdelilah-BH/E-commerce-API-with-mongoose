const router = require('express-promise-router')()
const cartController = require('../controllers/cart')
const passport = require('passport')
const isLogedIn = passport.authenticate('jwt', { session: false })
const { validatedBody, validatedParams } = require('../helpers/routeHelper')
const { cartSchema, paramsSchemas } = require('../helpers/schemas')

router.route('/')
  .get(isLogedIn, cartController.getCarts)
  .post(isLogedIn, validatedBody(cartSchema.cartSchemaCreate), cartController.addCart)

router.route('/:idCart')
  .put(isLogedIn, validatedParams(paramsSchemas, 'idCart'), cartController.updateCart)

module.exports = router
