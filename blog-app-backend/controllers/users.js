const usersRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.password || body.password.length < 3) {
        return response.status(400).json({error: "password must be longer than 3 chars"})
    } 

    const saltRounds = 10 
    
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', {title: 1, likes: 1, author: 1})

    response.json(users)
  })


module.exports = usersRouter