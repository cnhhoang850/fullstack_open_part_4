const mongoose = require('mongoose')
require('dotenv').config()
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    author: String,
    url: {
        type: String,
        unique: true,
        required: true
    },
    likes: Number
})
  
blogSchema.set('toJSON', {
      transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString()
          delete returnedObject._id
          delete returnedObject.__v
      }
})

blogSchema.plugin(uniqueValidator)  
  
const Blog = mongoose.model('Blog', blogSchema)
  
module.exports = Blog
  
