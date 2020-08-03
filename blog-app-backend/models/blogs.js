const mongoose = require('mongoose')
require('dotenv').config()
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
 


const blogSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    author: String,
    url: {
        type: String,
        unique: true
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
  
