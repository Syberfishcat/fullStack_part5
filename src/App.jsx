import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loginedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }catch(e) {
      alert(e.message) 
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loginedUser')
    setUser(null)
  }

  if(!user) {
    return (
      <div>
        <h2>Log in to application</h2>
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
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <NewBlog 
        onBlogCreated = {createdBlog => {
          setBlogs(blog => blog.concat(createdBlog))
        }}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App