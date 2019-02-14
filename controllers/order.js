const Order = require('../models/order')
const Cart = require('../models/cart')

module.exports = {

  addOrder: async (req, res) => {
    const { cart, shipping, status } = req.value.body
    const newOrder = new Order({ cart, shipping, status })
    await newOrder.save()
    await Cart.deleteOne(cart)
    return res.status(200).json({ message: 'Order has been Created' })
  },

  getOrders: async (req, res) => {
    const user = req.user
    const orders = await Order.find({ 'cart.user': user }).populate('cart shipping')
    if (orders.length === 0) {
      return res.status(400).json({ message: 'no Order found' })
    }
    const order = await orders.map(item => item)
    return res.status(200).json({ user: user.username, items: orders.length, orders: { order } })
  }

}
