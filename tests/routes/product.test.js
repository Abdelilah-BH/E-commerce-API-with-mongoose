const { connection } = require('mongoose')
const app = require('../../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)
chai.use(require('chai-like'))

const product = {
  isbn: '9782226436739',
  title: 'Quatre-vingt-dix secondes',
  author: ['Daniel Picouly'],
  price: 19.50
}
const updatedProduct = {
  isbn: '9782226436734',
  title: 'Quatre-vingt-dix secondes - Broché',
  author: ['Daniel Picouly', 'iffakh'],
  price: 18.35
}
let productId = ''

describe('POST /products', () => {
  it('should to create product if isbn not found', done => {
    chai.request(app)
      .post('/products')
      .send(product)
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).like({
          success: true,
          product: {
            isbn: '9782226436739',
            title: 'Quatre-vingt-dix secondes',
            author: ['Daniel Picouly'],
            price: 19.50
          }
        })
        productId = res.body.product._id
        done()
      })
  })
  it('should to not create product if isbn found', done => {
    chai.request(app)
      .post('/products')
      .send(product)
      .end((_err, res) => {
        expect(res.status).to.equal(400)
        expect(res.body).like({ success: false })
        done()
      })
  })
})
describe('GET /products', () => {
  it('should to listed all products', done => {
    chai.request(app)
      .get('/products')
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({
          items: 1,
          products: [
            {
              _id: productId,
              isbn: '9782226436739',
              title: 'Quatre-vingt-dix secondes',
              author: ['Daniel Picouly'],
              price: 19.50
            }
          ]
        })
        done()
      })
  })
})
describe('GET /products/:id', () => {
  it('should to return product whene find by ID', done => {
    chai.request(app)
      .get(`/products/${productId}`)
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).like({ product:
          {
            _id: productId,
            isbn: '9782226436739',
            title: 'Quatre-vingt-dix secondes',
            author: ['Daniel Picouly'],
            price: 19.50
          }
        })
        done()
      })
  })
})
describe('POST /products/find', () => {
  it('should to return product whene find by isbn', done => {
    chai.request(app)
      .post('/products/find')
      .send({ field: '9782226436739' })
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).like({
          items: 1,
          products: [{
            _id: productId,
            isbn: '9782226436739',
            title: 'Quatre-vingt-dix secondes',
            author: ['Daniel Picouly'],
            price: 19.50
          }]
        })
        done()
      })
  })
  it('should to return product whene find by title', done => {
    chai.request(app)
      .post('/products/find')
      .send({ field: 'vingt-dix secondes' })
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).like({
          items: 1,
          products: [{
            _id: productId,
            isbn: '9782226436739',
            title: 'Quatre-vingt-dix secondes',
            author: ['Daniel Picouly'],
            price: 19.50
          }]
        })
        done()
      })
  })
  it('should to return product whene find by author', done => {
    chai.request(app)
      .post('/products/find')
      .send({ field: 'el Picouly' })
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).like({
          items: 1,
          products: [{
            _id: productId,
            isbn: '9782226436739',
            title: 'Quatre-vingt-dix secondes',
            author: ['Daniel Picouly'],
            price: 19.50
          }]
        })
        done()
      })
  })
})
describe('PATCH /products/:id', () => {
  it('should to update isbn of product', done => {
    chai.request(app)
      .patch(`/products/${productId}`)
      .send({ isbn: updatedProduct.isbn })
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({
          success: true,
          product:
            {
              _id: productId,
              isbn: '9782226436734',
              title: 'Quatre-vingt-dix secondes',
              author: ['Daniel Picouly'],
              price: 19.50
            }
        })
        done()
      })
  })
  it('should to update title of product', done => {
    chai.request(app)
      .patch(`/products/${productId}`)
      .send({ title: updatedProduct.title })
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({
          success: true,
          product:
            {
              _id: productId,
              isbn: '9782226436734',
              title: 'Quatre-vingt-dix secondes - Broché',
              author: ['Daniel Picouly'],
              price: 19.50
            }
        })
        done()
      })
  })
  it('should to update author of product', done => {
    chai.request(app)
      .patch(`/products/${productId}`)
      .send({ author: updatedProduct.author })
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({
          success: true,
          product:
            {
              _id: productId,
              isbn: '9782226436734',
              title: 'Quatre-vingt-dix secondes - Broché',
              author: ['Daniel Picouly', 'iffakh'],
              price: 19.50
            }
        })
        done()
      })
  })
  it('should to update price of product', done => {
    chai.request(app)
      .patch(`/products/${productId}`)
      .send({ price: updatedProduct.price })
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({
          success: true,
          product:
            {
              _id: productId,
              isbn: '9782226436734',
              title: 'Quatre-vingt-dix secondes - Broché',
              author: ['Daniel Picouly', 'iffakh'],
              price: 18.35
            }
        })
        done()
      })
  })
  it('should to update all fields product', done => {
    chai.request(app)
      .patch(`/products/${productId}`)
      .send(updatedProduct)
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({
          success: true,
          product:
            {
              _id: productId,
              isbn: '9782226436734',
              title: 'Quatre-vingt-dix secondes - Broché',
              author: ['Daniel Picouly', 'iffakh'],
              price: 18.35
            }
        })
        done()
      })
  })
  it('should to return product not found', done => {
    chai.request(app)
      .patch(`/products/5bccfa86798b914e87a76948`)
      .send(updatedProduct)
      .end((_err, res) => {
        expect(res.status).to.be.equal(400)
        expect(res.body).like({ success: false })
        done()
      })
  })
})
describe('DELETE /products/:id', () => {
  it('should to delete product', done => {
    chai.request(app)
      .del(`/products/${productId}`)
      .end((_err, res) => {
        expect(res.status).to.be.equal(200)
        expect(res.body).like({ success: true })
        done()
      })
  })
  it('should to return product not found', done => {
    chai.request(app)
      .patch(`/products/5bccfa86798b914e87a76948`)
      .end((_err, res) => {
        expect(res.status).to.be.equal(400)
        expect(res.body).like({ success: false })
        done()
      })
  })
})
after('droping test database', done => {
  connection.dropDatabase(() => {
    console.log('\nTest database dropped')
  })
  connection.close(() => {
    done()
  })
})
