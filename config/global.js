const JWT = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const multer = require('multer')

const fileAccepted = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp']
const date = new Date().toISOString().replace(/:/g, '-')
const storage = (name) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./uploads/${name}`)
    },
    filename: function (req, file, cb) {
      cb(null, date + '-' + file.originalname) }
    })
}
const fileFilter = (req, file, cb) => {
  if (fileAccepted.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Please change the file format to JPEG | JPG | PNG | GIF | BMP'), false)
  }
}

module.exports = {
  isAdmin: (req, res, next) => {
    if (!req.user.admin) {
      return res.status(401).send('Unauthorized')
    }
    next()
  },
  generateJwtToken: (id, admin, secret, expireTime) => {
    return JWT.sign({
      iss: 'specialdes.com',
      sub: id,
      admin: admin,
      iat: Math.floor(Date.now() / 1000)
    }, secret, { expiresIn: expireTime })
  },
  generateRefreshJwtToken: (id, secret, expireTime) => {
    return JWT.sign({
      sub: id
    }, secret, { expiresIn: expireTime })
  },
  transporter: nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  }),
  uploadImagesAuthors: multer({ storage: storage('authors'), limits: { fileSize: 1024 * 1024 * 2 }, fileFilter }),
  uploadImagesProducts: multer({ storage: storage('products'), limits: { fileSize: 1024 * 1024 * 2 }, fileFilter }),
}
