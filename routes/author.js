const router = require('express-promise-router')()
const passport = require('passport')
const authorController = require('../controllers/author')
const { validatedBody, validatedParams } = require('../helpers/routeHelper')
const { authorSchemas, paramsSchemas } = require('../helpers/schemas')
const { isAdmin, uploadImagesAuthors } = require('../config/global')
const isLogedIn = passport.authenticate('jwt', { session: false })

router.route('/')
  .post(isLogedIn, isAdmin, uploadImagesAuthors.single('thumbnail'), validatedBody(authorSchemas.authorSchemaCreate), authorController.addAuthor)
  .get(authorController.getAllAuthors)
router.route('/:id')
  .get(authorController.getAuthor)
  .patch(isLogedIn, isAdmin, [
    validatedParams(paramsSchemas._idSchema, 'id'),
    validatedBody(authorSchemas.authorSchemaUpdate)
  ], authorController.updateAuthor)
  .delete(isLogedIn, isAdmin, validatedBody(authorSchemas.authorSchemaCreate),  authorController.deleteAuthor)

module.exports = router
