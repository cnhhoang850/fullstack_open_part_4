const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialPosts = [
    {
        title: 'something',
        author: 'hoang huy',
        url:'www.www.www',
        likes: 1000
    },

    {
        title: 'kl;afdja',
        author: 'dsafewf',
        url: 'ccc.cccc.cc',
        likes: 241
    },

    {   
        title: 'adfad',
        author: 'fdsafa',
        url: 'grwe.grewg.com',
        likes: 213412 
    }
]

const initialUsers = [
    {
        username: "cnhhoang850",
        name: "hoang",
        passwordHash: "fvwefewrverbewrbr"
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const postsInDb = async () => {
    const posts = await Blog.find({})
    return posts.map(post => post.toJSON())
}

module.exports = {
    initialPosts, postsInDb, initialUsers, usersInDb
}