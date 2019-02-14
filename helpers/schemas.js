const Joi = require('joi')

module.exports = {
  paramsSchemas: {
    _idSchema: Joi.object().keys({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    tokenSchema: Joi.object().keys({
      param: Joi.string().regex(/^[0-9a-zA-Z]{50}$/).required()
    })
  },
  userSchemas: {
    userSchemaCreate: Joi.object().keys({
      username: Joi.string().trim().min(3).max(20).required(),
      email: Joi.string().regex(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/).trim().required(),
      password: Joi.string().min(8).max(22).trim().required()
    }),
    userSchemaUpdate: Joi.object().keys({
      username: Joi.string().trim().min(3).max(20),
      email: Joi.string().regex(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/).required(),
      password: Joi.string().min(8).max(22).trim()
    }),
    userSchemaSignIn: Joi.object().keys({
      email: Joi.string().regex(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/).required(),
      password: Joi.string().min(8).max(22).trim().required()
    })
  },
  productSchemas: {
    productSchema: Joi.object().keys({
      industryIdentifiers: Joi.object().keys({
        sku: Joi.string().trim().min(3).max(20),
        isbn_13: Joi.string().trim().regex(/^[0-9]{13}$/),
        isbn_10: Joi.string().trim().regex(/^[0-9]{10}$/)
      }),
      title: Joi.string().trim().min(2).max(255),
      short_title: Joi.string().trim().min(2).max(255),
      authors: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
      sub_category: Joi.string().trim().min(2).max(50),
      description: Joi.string().trim(),
      price: Joi.number().max(1000).min(0).default(0),
      format: Joi.object().keys({
        name: Joi.string().trim().min(3).max(50),
        presentation: Joi.string().trim().min(3).max(50)
      }),
      language: Joi.string().trim().min(2).max(50),
      publisher: Joi.object().keys({
        name: Joi.string().min(3).max(50),
        date: Joi.date()
      }),
      serie: Joi.string().trim().min(2).max(50),
      age: Joi.object().keys({
        min: Joi.number().min(2).max(50),
        max: Joi.number().min(3).max(100)
      }),
      dimensions: Joi.object().keys({
        height: Joi.number().min(1),
        length: Joi.number().min(0.1),
        width: Joi.number().min(1)
      }),
      weight: Joi.number().min(0.1),
      pageCount: Joi.number().min(3),
      comments: Joi.object().keys({
        content: Joi.string().min(3).max(250).trim(),
        rating: Joi.number().min(0)
      })
    })
  },
  authorSchemas: {
    authorSchemaCreate: Joi.object().keys({
      fullName: Joi.string().min(3).max(50).required(),
      biography: Joi.string()
    }),
    authorSchemaUpdate: Joi.object().keys({
      fullName: Joi.string().trim().min(3).max(50),
      biography: Joi.string().trim()
    })
  },
  cartSchema: {
    cartSchemaCreate: Joi.object().keys({
      products: Joi.array().items({
        product: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        amount: Joi.number().min(1).required()
      }),
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    })
  },
  orderSchema: {
    orderSchemaCreate: Joi.object().keys({
      shipping: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      cart: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      status: Joi.string().trim()
    })
  },
  shippingSchema: {
    shippingSchemaCreate: Joi.object().keys({
      user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      name: Joi.object().keys({
        first: Joi.string().min(3).max(50).trim().required(),
        last: Joi.string().min(3).max(50).trim().required()
      }),
      phones: Joi.object().keys({
        personal: Joi.string().length(9).trim(),
        home: Joi.string().length(9).trim(),
        work: Joi.string().length(9).trim()
      }).required(),
      adress: Joi.object().keys({
        street: Joi.string().min(3).max(250).trim().required(),
        region: Joi.string().min(3).max(50).trim().required(),
        zip: Joi.number().required(),
        city: Joi.string().min(3).max(50).trim().required(),
        country: Joi.string().min(3).max(50).trim().required()
      }),
    })
  }
}
