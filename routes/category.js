const router = require('express-promise-router')()
const categoryControler = require('../controllers/category')

router.route('/')
  .get(categoryControler.getAllCategory)
  .post(categoryControler.addCategory)

router.route('/:id')
  .patch(categoryControler.updateCategory)
  .delete(categoryControler.deleteCategory)
  .get(categoryControler.getCategory)

module.exports = router
