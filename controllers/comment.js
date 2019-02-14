const Product = require('../models/product')

module.exports = {

  addComment: async (req, res) => {
    const { id } = req.value.params
    const { content, rating } = req.value.body.comments
    const product = await Product.findById(id)
    if (!product) {
      return res.status(400).json({ message: 'product is not found' })
    }
    product.comments.push({ user: req.user._id, content, rating })
    await product.save()
    return res.status(200).json({ message: 'comment has been created' })
  },

  updateComment: async (req, res) => {
    const { idComment } = req.value.params
    const { content, rating } = req.value.body.comments
    await Product.updateOne({'comments._id': idComment }, { '$set': {
      'comments.$.content': content,
      'comments.$.rating': rating,
      'comments.$.updatedAt': Date.now()
    } })
    return res.status(200).json({ message: 'comment has been updated' })  
  },

  deleteComment: async (req, res) => {
    const { idComment, idProduct } = req.value.params
    await Product.updateOne({ '_id': idProduct }, { '$pull': {
      'comments': { _id: idComment }
    } })
    return res.status(200).json({ message: 'comment has been deleted' })
  }

}
