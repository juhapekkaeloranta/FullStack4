const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

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
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
]

beforeAll(async () => {
  console.log('beforeAll:');
  await Blog.remove({})
  
  let blogObj = new Blog(testSetBlogs[0])
  await blogObj.save()

  blogObj = new Blog(testSetBlogs[1])
  await blogObj.save()
  
  blogObj = new Blog(testSetBlogs[2])
  await blogObj.save()
  
  console.log('3 blogs seeded to db');
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('new blog may be added', async () => {
  const newBlog =  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const blogTitles = response.body.map(r => r.title)

  expect(response.body.length).toBe(testSetBlogs.length + 1)
  expect(blogTitles).toContain('First class tests')
})

test('new blog: likes are set to 0 if empty', async () => {
  const blogWithoutLikes = {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')
  
  const newBlog = response.body.find(blog => 
    blog._id === "5a422ba71b54a676234d17fb"
  )

  console.log('new:');
  console.log(newBlog);
  console.log(newBlog.likes === 0);
  console.log('--END NEW');
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

afterAll(() => {
  console.log('closing server');
  server.close()
})