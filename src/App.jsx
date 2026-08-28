import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    ) 
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loginedUser');
    if(loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
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
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loginedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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
  }

  const handleCreate = async newBlog => {
    try {
        const createdNewBlog = await blogService.create(newBlog)
        setBlogs(blog => blog.concat(createdNewBlog))
        blogFormRef.current.toggleVisible()

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

  if(!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification}/>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type='text'
                value = {username}
                onChange={({target}) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type='text'
                value = {password}
                onChange={({target}) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type='submit'>
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      <p style={{ marginBottom: '2rem' }}>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <NewBlog onBlogCreated={handleCreate}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App