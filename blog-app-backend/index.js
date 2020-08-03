const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Blog = require('./models/blogs')
const middleware = require('./middleware/error')
require('dotenv').config()

morgan.token('body', function (req,res) {return JSON.stringify(req.body)})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(middleware.requestLogger)

app.get('/api/blogs', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

app.post('/api/blogs', (request, respons, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})