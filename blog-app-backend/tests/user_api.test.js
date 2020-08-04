const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    console.log("cleared")

    for (let user of helper.initialUsers) {
        let userObject = new User(user)
        await userObject.save()
        console.log(userObject.username, 'is saved')
    }
    console.log('cleared and initiated DB')
})

describe('invalid users are not created', () => {
    
    test('missing username', async () => {
        const newUser = new User({
            name: "hoang",
            password: "21321321"
        })

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        const response = await helper.usersInDb()
        expect(response).toHaveLength(helper.initialUsers.length)
    })

    test('missing password', async () => {
        const newUser = new User({
            name: "hoang",
            username: "something"
        })

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        const response = await helper.usersInDb()
        expect(response).toHaveLength(helper.initialUsers.length)
    })

    test('non unique username', async () => {
        const newUser = {
            name: "hoang",
            username: "cnhhoang850",
            password: "Hoangpro123"
        }

        const response = await api
        .post('/api/users')
        .send(newUser)
        
        expect(response.body.error).toEqual("User validation failed: username: Error, expected `username` to be unique. Value: `cnhhoang850`")
        const nresponse = await helper.usersInDb()
        expect(nresponse).toHaveLength(helper.initialUsers.length)
    })

})

afterAll(() => {
    mongoose.connection.close()
})