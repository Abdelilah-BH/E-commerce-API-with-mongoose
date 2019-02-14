const Shipping = require('../models/shipping')

module.exports = {
  addShopping: async (req, res) => {
    const { name, phones, adress } = req.value.body
    const { _id } = req.user
    const newShipping = new Shipping({ user: _id, name, phones, adress })
    await newShipping.save()
    return res.status(200).json({ message: 'shipping has been created' })
  },

  updateShipping: async (req, res) => {
    const { id } = req.value.params
    const shipping = Shipping.findById(id)
    if (!shipping) {
      return res.status(400).json({ message: 'no shipping found' })
    }
    await Shipping.updateOne(shipping, req.value.body)
  }
}
