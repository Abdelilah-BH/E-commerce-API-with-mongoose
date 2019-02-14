const router = require('express-promise-router')()
const orderController = require('../controllers/order')
const { validatedBody } = require('../helpers/routeHelper')
const { orderSchema } = require('../helpers/schemas')
const passport = require('passport')
const isLogin = passport.authenticate('jwt', { session: false })

router.route('/')
  .get(isLogin, orderController.getOrders)
  .post(isLogin, validatedBody(orderSchema.orderSchemaCreate), orderController.addOrder)

module.exports = router
