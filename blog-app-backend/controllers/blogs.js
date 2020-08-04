const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const eJwt = require('express-jwt')
//used express-jwt instead of refractoring get token function
require('dotenv').config()



blogsRouter.get('/',  async (request, response) => {
  const posts = await Blog.find({}).populate('user', {username: 1, name: 1})

  response.json(posts.map (post => post.toJSON()))
})

blogsRouter.post('/'
  , eJwt({ secret: process.env.SECRET,  algorithms: ['HS256'] })
  , async (request, response) => {
  
  const body = request.body
  const token = request.user
  
  if (!(token || token.id)) {
    return response
      .status(401)
      .json({error: 'token missing or invalid'})
  }

  const users = await User.find({})
    
  const user = body.userId 
  ? await User.findById(token.id) 
  : users[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined? 0 : body.likes,
    user: user._id
  })
   
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id'
  , eJwt({ secret: process.env.SECRET,  algorithms: ['HS256'] })
  , async (request, response) => {

  const body = request.body
  const token = request.user
  
  if (!(token || token.id)) {
    return response
      .status(401)
      .json({error: 'token missing or invalid'})
  }

  const oldBlog = await Blog.findById(request.params.id)

  
  if (!(oldBlog.user.toString() === token.id.toString())) {
    return response
            .status(401)
            .json({error: 'object to change does not match object created by user id'})
  }

  const newBlog = {
    title: body.title ? body.title : oldBlog.title,
    author: body.author ? body.author : oldBlog.author,
    url: body.url ? body.url : oldBlog.url,
    likes: body.likes ? body.likes: oldBlog.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})

  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id'
  , eJwt({ secret: process.env.SECRET,  algorithms: ['HS256'] })
  , async (request, response) => {
  const id = request.params.id
  const tokenId = request.user.id

  if (!(tokenId)) {
    return response
      .status(401)
      .json({error: 'token missing or invalid'})
  }
  
  const blogToDel = await Blog.findById(id)
  
  if (blogToDel.user.toString() !== tokenId.toString()) {
    return response
            .status(401)
            .json({error: 'object to delete does not match object created by user id'})
  }

  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = blogsRouter
  