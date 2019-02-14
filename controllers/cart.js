const Cart = require('../models/cart')

module.exports = {

  addCart: async (req, res) => {
    const products = req.value.body.products
    const user = req.user._id
    const cart = new Cart({ products, user })
    await cart.save()
    return res.status(200).json({ message: 'cart has been created' })
  },

  updateCart: async (req, res) => {
    const { idCart } = req.value.params
    const products = req.value.body.products
    const user = req.user._id
    await Cart.updateOne({ _id: idCart, products, user })
    return res.status(200).json({ message: 'cart has been updated' })
  },

  getCarts: async (req, res) => {
    const carts = await Cart.find({ user: req.user._id })
    .populate({ path:'products.product', select: 'industryIdentifiers title thumbnail price' })
    .populate({ path: 'user' })
    if (!carts) {
      return res.status(400).json({ message: 'cart is found' })
    }
    const cart = carts.map(item => item)
    return res.status(200).json({
      items: carts.length,
      carts: cart
    })
  }
}
