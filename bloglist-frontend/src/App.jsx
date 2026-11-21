import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch, Navigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()

      setBlogs(
        [...blogs].sort((a, b) => b.likes - a.likes)
      )
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loginedUser')
    if(loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({
      message,
      type
    })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loginedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    }catch {
      showNotification(
        'wrong username or password',
        'error'
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loginedUser')
    setUser(null)
    navigate('/')
  }

  const handleCreate = async newBlog => {
    try {
      const createdNewBlog = await blogService.create(newBlog)
      setBlogs(blog => blog.concat(createdNewBlog))
      navigate('/')

      showNotification(
        `a new blog ${createdNewBlog.title} by ${createdNewBlog.author} added`,
        'success'
      )
    }catch(e) {
      showNotification(
        e.message,
        'error'
      )
    }
  }

  const handleLike = async blog => {
    try {
      const updatedBlog = await blogService.modify(blog.id, {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      })

      setBlogs(currentBlogs =>
        currentBlogs.map(item =>
          item.id === blog.id ? { ...item, ...updatedBlog } : item
        )
      )
    }catch(e) {
      showNotification(
        e.message,
        'error'
      )
    }
  }

  const handleDelete = async blog => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )

    if (!confirmed) {
      return
    }

    try{
      await blogService.deleteBlog(blog.id)

      setBlogs(blogs =>
        blogs.filter(item => item.id !== blog.id)
      )
      navigate('/')
    }catch(e) {
      showNotification(
        e.message,
        'error'
      )
    }
  }

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to='/'>blogs</Link>
        {user
          ? <>
            <Link style={padding} to='/create'>new blog</Link>
            <button onClick={handleLogout}>logout</button>
          </>
          : <Link style={padding} to='/login'>login</Link>}
      </div>

      <Notification notification={notification} />

      <Routes>
        <Route path='/' element={<BlogList blogs={blogs} />} />
        <Route path='/create' element={
          user ? <NewBlog onBlogCreated={handleCreate} /> : <Navigate replace to='/login' />
        } />
        <Route path='/login' element={
          <LoginForm
            username={username} password={password}
            setUsername={setUsername} setPassword={setPassword}
            handleLogin={handleLogin}
          />
        } />
        <Route path='/blogs/:id' element={
          <Blog blog={blog} user={user}
            handleLike={handleLike} handleDelete={handleDelete} />
        } />
      </Routes>
    </div>
  )
}

export default App