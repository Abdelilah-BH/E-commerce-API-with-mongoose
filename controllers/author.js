const Author = require('../models/author')

module.exports = {
  addAuthor: async (req, res) => {
    const { fullName, biography } = req.value.body
    let thumbnail = {}
    const author = await Author.findOne({ fullName })
    if (author) {
      return res.status(400).json({ message: 'Author is alrealy in' })
    }
    if (typeof req.file !== 'undefined') {
      const path = req.file.path
      const newPath = path.replace(/\\/g, '/')
      thumbnail = newPath
    }
    const newAuthor = new Author({ fullName, biography, thumbnail })
    await newAuthor.save()
    res.status(200).json({ Author: newAuthor })
  },
  updateAuthor: async (req, res) => {
    const { id } = req.value.params
    let updatedAuthor = req.value.body
    const author = await Author.findById(id)
    if (!author) {
      return res.status(400).json({ success: false })
    }
    if (typeof req.file !== 'undefined') {
      updatedAuthor.thumbnail = req.file.path
    }
    await Author.updateOne(author, updatedAuthor)
    return res.status(200).json({ success: true })
  },
  deleteAuthor: async (req, res) => {
    const { id } = req.value.params
    const author = await Author.findById(id)
    if (!author) {
      return res.status(400).json({ success: false })
    }
    await Author.deleteOne(author)
    return res.status(200).json({ success: true })
  },
  getAuthor: async (req, res) => {
    const { id } = req.value.params
    const author = await Author.findById(id)
    if (!author) {
      return res.status(400).json({ success: false })
    }
    res.status(200).json({ sucsess: true, author })
  },
  getAllAuthors: async (req, res) => {
    const authors = await Author.find()
    if (!authors) {
      return res.status(400).json({ message: 'author is found' })
    }
    const author = authors.map(item => item)
    return res.status(200).json({
      items: authors.length,
      authors: author
    })
  }
}
