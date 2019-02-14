const Product = require('../models/product')

module.exports = {
  addProduct: async (req, res) => {
    const product = req.value.body
    if (typeof product.industryIdentifiers === 'undefined') {
      return res.status(400).json({ message: 'The product must have an industryIdentifiers like SKU or ISBN-13 or ISBN-10' })
    }
    let productFind = {}
    if (typeof product.industryIdentifiers.sku !== 'undefined') {
      productFind = await Product.findOne({ 'industryIdentifiers.sku': product.industryIdentifiers.sku })
    }
    if (typeof product.industryIdentifiers.isbn_10 !== 'undefined') {
      productFind = await Product.findOne({ 'industryIdentifiers.isbn_10': product.industryIdentifiers.isbn_10 })
    }
    if (typeof product.industryIdentifiers.isbn_13 !== 'undefined') {
      productFind = await Product.findOne({ 'industryIdentifiers.isbn_13': product.industryIdentifiers.isbn_13 })
    }
    if (productFind) {
      return res.status(400).json({ message: 'product is already in' })
    }
    if (typeof req.file !== 'undefined') {
      const path = req.file.path
      const newPath = path.replace(/\\/g, '/')
      product.thumbnail = newPath
    }
    const newProduct = new Product(product)
    await newProduct.save()
    return res.status(200).json({ newProduct })  
  },
  getAllProducts: async (req, res) => {
    const products = await Product.find().populate('authors')
    .populate({ path: 'comments.user', select: 'local.username google.username facebook.username' })
    const product = products.map(item => item)
    return res.status(200).json({
      items: products.length,
      products: product
    })
  },
  getProduct: async (req, res) => {
    const { id } = req.value.params
    const product = await Product.findById(id).populate('authors')
    .populate({ path: 'comments.user', select: 'local.username google.username facebook.username' })
    if (!product) {
      return res.status(400).json({ success: false })
    }
    res.status(200).json({ sucsess: true, product })
  },
  getProductByAnyField: async (req, res) => {
    const products = await Product.find({
      '$or': [
        { '$or': [
          { title: { '$regex': req.body.field, '$options': 'i' } },
          { 'authors.full_name': { '$regex': req.body.field, '$options': 'i' } }
        ] },
        { isbn: req.body.field }
      ]
    }).populate('authors')
    .populate({ path: 'comments.user', select: 'local.username google.username facebook.username' })
    const product = products.map(item => item)
    return res.status(200).json({
      items: products.length,
      products: product
    })
  },
  updateProduct: async (req, res) => {
    const { id } = req.value.params
    let updatedProduct = req.value.body
    const product = await Product.findById(id)
    if (!product) {
      return res.status(400).json({ success: false })
    }
    if (typeof req.file !== 'undefined') {
      updatedProduct.thumbnail = req.file.path
    }
    await Product.updateOne(product, updatedProduct)
    return res.status(200).json({ success: true })
  },
  deleteProduct: async (req, res) => {
    const { id } = req.value.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(400).json({ success: false })
    }
    await Product.deleteOne(product)
    return res.status(200).json({ success: true })
  },

}
