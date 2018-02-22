const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const userHelper = require('./user_helper')

describe('blog tests', () => {
  const testSetBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    }
  ]

  beforeAll(async () => {
    console.log('beforeAll:');
    await Blog.remove({})

    let blogObj = new Blog(testSetBlogs[0])
    await api
      .post('/api/blogs/')
      .send(blogObj)

    blogObj = new Blog(testSetBlogs[1])
    await api
      .post('/api/blogs/')
      .send(blogObj)

    blogObj = new Blog(testSetBlogs[2])
    await api
      .post('/api/blogs/')
      .send(blogObj)

    console.log('3 blogs seeded to db');
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('new blog may be added', async () => {
    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    }

    const allBlogsBefore = await helper.allBlogs()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    const allBlogsAfter = await helper.allBlogs()

    expect(allBlogsAfter.length).toEqual(allBlogsBefore.length + 1)
    //expect(allBlogsAfter).toContainEqual(newBlog)
  })

  test('new blog: likes are set to 0 if empty', async () => {
    const blogWithoutLikes = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
    }

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlog = response.body

    expect(newBlog.likes).toEqual(0)
  })

  test('new blog: title and url compulsory', async () => {
    const badBlogObj = {
      author: "Robert C. Martin",
    }

    const response = await api
      .post('/api/blogs')
      .send(badBlogObj)
      .expect(400)
  })

  test('blog can be deleted', async () => {
    console.log('delete test')
    const allBlogsBefore = await helper.allBlogs()

    const firstBlogOnTheList = allBlogsBefore[0]

    await api
      .delete('/api/blogs/' + firstBlogOnTheList._id)
      .expect(204)

    const allBlogsAfter = await helper.allBlogs()

    expect(allBlogsAfter.length).toEqual(allBlogsBefore.length - 1)
  })

  test('test helper gets test set', async () => {
    console.log('fooTest');
    const allBlogs = await helper.allBlogs()
    console.log(allBlogs);
    expect(Array.isArray(allBlogs)).toBe(true)
    //expect(allBlogs.length).toEqual(testSetBlogs.length)
  })

  test('add like', async () => {
    console.log('add like test')
    const blogFromDB = (await helper.allBlogs())[0]

    const likesBefore = blogFromDB.likes
    blogFromDB.likes = blogFromDB.likes + 1

    const result = await api
      .put('/api/blogs/' + blogFromDB._id)
      .send(blogFromDB)

    const blogFromDBafter = await helper.findBlog(blogFromDB._id)

    console.log(likesBefore)
    console.log(blogFromDBafter.likes);
    expect(blogFromDBafter.likes).toEqual(likesBefore + 1)
  })

  afterAll(() => {
    console.log('closing server');
    server.close()
    console.log('end of afterAll');
  })
})

/*
describe('user tests', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await userHelper.usersInDb()

    console.log(usersBeforeOperation)

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await userHelper.usersInDb()

    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('adult defaults to true', async () => {
    const newUser = {
      username: 'alice',
      name: 'Alice from Wonderland',
      password: 'aceOfSpades'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
    
    const newUserFromDB = await userHelper.findUser('alice')

    expect(newUserFromDB.adult).toBe(true)
  })

  test('adult may be set to false', async () => {
    const newUser = {
      username: 'bob',
      name: 'Bob the Builder',
      password: 'tietenkin',
      adult: false
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
    
    const newUserFromDB = await userHelper.findUser('bob')

    expect(newUserFromDB.adult).toBe(false)
  })

  test('too short password rejected', async () => {
    const lazyUser = {
      username: 'herraFoo',
      name: 'Foo Herranen',
      password: '42'
    }

    const usersBeforeOperation = await userHelper.usersInDb()

    await api
      .post('/api/users')
      .send(lazyUser)
      .expect(403)

    const usersAfterOperation = await userHelper.usersInDb()

    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('username must be unique', async () => {
    const duplicateUser = {
      username: 'mluukkai',
      name: 'Masa Lukkarinen',
      password: 'topsecred'
    }

    const usersBeforeOperation = await userHelper.usersInDb()

    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(403)

    const usersAfterOperation = await userHelper.usersInDb()

    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  afterAll(() => {
    console.log('closing server');
    server.close()
    console.log('end of afterAll');
  })
})
*/

/*
describe('login tests', () => {
  test('with correct credentials', async () => {
    const realUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    const responseWithToken = await api
      .post('/api/login')
      .send(realUser)
      .expect(200)

    expect(responseWithToken.body.token).not.toBe(undefined)
  })

  test('with incorrect credentials', async () => {
    const fakeUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'hunter2'
    }

    await api
      .post('/api/login')
      .send(fakeUser)
      .expect(401)
  })

  test('respose must be same with wrong username and with wrong password', async () => {
    const userWithWrongPasswd = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'hunter2'
    }

    const nonExistingUser = {
      username: 'joulupukki',
      name: 'Matti Luukkainen',
      password: 'hunter2'
    }

    passwdError = await api
      .post('/api/login')
      .send(userWithWrongPasswd)
    
    usernameError = await api
      .post('/api/login')
      .send(nonExistingUser)

    expect(passwdError.error.text).toEqual(usernameError.error.text)
  })
})
*/