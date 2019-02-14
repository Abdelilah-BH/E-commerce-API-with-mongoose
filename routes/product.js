const passport = require('passport')
const router = require('express-promise-router')()
const productController = require('../controllers/product')
const commentController = require('../controllers/comment')
const { validatedParams, validatedBody } = require('../helpers/routeHelper')
const { productSchemas, paramsSchemas } = require('../helpers/schemas')
const { isAdmin, uploadImagesProducts } = require('../config/global')
const isLogedIn = passport.authenticate('jwt', { session: false })

router.route('/')
  .get(productController.getAllProducts)
  .post(isLogedIn, isAdmin, uploadImagesProducts.array('thumbnail', 3), validatedBody(productSchemas.productSchema), productController.addProduct)

router.route('/:id')
  .get(validatedParams(paramsSchemas._idSchema, 'id'), productController.getProduct)
  .patch(isLogedIn, isAdmin, [
    validatedParams(paramsSchemas._idSchema, 'id'),
    validatedBody(productSchemas.productSchema)
  ], productController.updateProduct)
  .delete(isLogedIn, isAdmin, validatedParams(paramsSchemas._idSchema, 'id'), productController.deleteProduct)

router.route('/:id/comments')
  .post(isLogedIn, [
    validatedParams(paramsSchemas._idSchema, 'id'),
    validatedBody(productSchemas.productSchema)
  ], commentController.addComment)

router.route('/:idProduct/comments/:idComment')
  .delete(isLogedIn,[
    validatedParams(paramsSchemas._idSchema, 'idProduct'),
    validatedParams(paramsSchemas._idSchema, 'idComment')
  ], commentController.deleteComment)
  .patch(isLogedIn,[
    validatedParams(paramsSchemas._idSchema, 'idProduct'),
    validatedParams(paramsSchemas._idSchema, 'idComment'),
    validatedBody(productSchemas.productSchema)
  ], commentController.updateComment)

router.route('/find')
  .patch(productController.getProductByAnyField)

module.exports = router
