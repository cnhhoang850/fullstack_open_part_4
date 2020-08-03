const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let result = 0
  blogs.forEach(blog => result += blog.likes)
  return result
}

const favoriteBlog = (blogs) => {
  let cur = 0
  let favorite = {}

  blogs.forEach(blog => {
    if (blog.likes > cur) {
      cur = blog.likes
      favorite = blog
    }
  })

  return favorite
}

const mostBlogs = (blogs) => {
  let result = {
    author: '',
    blogs: 0
  }

  let mapAuthors = blogs.map(blog => blog.author)
  let authors = []

  mapAuthors.forEach(author => {
    if (!authors.includes(author)) {
      authors.push(author)
    }
  })
  
  let count = 0
  authors.forEach(author => {
    for (i = 0; i < mapAuthors.length; i ++) {
      if (mapAuthors[i] === author) {
        count += 1
      }
    }
    if (result.blogs < count) {
      result.author = author
      result.blogs = count
    }
    count = 0
  })

  return result
}

const mostLikes = (blogs) => {
  let result = {
    author: '',
    likes: 0
  }

  let mapAuthors = blogs.map(blog => blog.author)
  let authors = []

  mapAuthors.forEach(author => {
    if (!authors.includes(author)) {
      authors.push(author)
    }
  })
  
  let count = 0
  authors.forEach(author => {
    for (i = 0; i < mapAuthors.length; i ++) {
      if (mapAuthors[i] === author) {
        count += blogs[i].likes
      }
    }
    if (result.likes < count) {
      result.author = author
      result.likes = count
    }
    count = 0
  })

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}