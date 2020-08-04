const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('database cleared')

    for (let post of helper.initialPosts) {
        let postObject = new Blog(post)
        await postObject.save()
        console.log(postObject.title, 'is saved')
    }
    console.log('done')
})

describe('getting blog posts', () => {
    
    test('all blog posts is returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialPosts.length)
    })
    
    test('blog posts are identified by id instead of _id', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body[0].id).toBeDefined()
    })
})

describe('saving blog posts', () => {
    
    test('can sucessfully save blog post', async () => {
        const newPost = new Blog({
            title: 'newpost',
            author: 'newauthor',
            url: 'new url'
        })
    
        await api
        .post('/api/blogs')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await helper.postsInDb()
    
        const content = response.map(post => post.title)
    
    
        expect(response).toHaveLength(helper.initialPosts.length + 1)
        expect(content).toContain(newPost.title)
    })
    
    test('can save blog posts with automatic likes fill', async () => {
        const newPost = new Blog({
            title: 'newpost',
            author: 'newauthor',
            url: 'new url'
        })
    
        await api
        .post('/api/blogs')
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await helper.postsInDb()
    
        const content = response.map(post => post.title)
    
        const likes = response.map(post => post.likes)
    
        expect(response).toHaveLength(helper.initialPosts.length + 1)
        expect(content).toContain(newPost.title)
        expect(likes[likes.length - 1]).toEqual(0)
    })
})

describe('validation works with correct status code', () => {
    
    test('no title results in 400', async () => {
        const newPost = new Blog({
            author: 'newauthor',
            likes:100,
            url: "fsafdsaf"
        })
    
        await api
            .post('/api/blogs')
            .send(newPost)
            .expect(400)
    
        const response = await helper.postsInDb()
    
        expect(response).toHaveLength(helper.initialPosts.length)
    })
    
    test('no url results in 400', async () => {
        const newPost = new Blog({
            author: 'newauthor',
            likes:100,
            title: "fdafweq"
        })
    
        await api
            .post('/api/blogs')
            .send(newPost)
            .expect(400)
    
        const response = await helper.postsInDb()
    
        expect(response).toHaveLength(helper.initialPosts.length)
    })
    
})


afterAll(() => {
    mongoose.connection.close()
})