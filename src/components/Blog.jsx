import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none': ''}
    const showWhenVisible = { display: visible ? '': 'none'}

    const toggleVisible = () => { setVisible(!visible)}

    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          &nbsp;
          <button style={hideWhenVisible} onClick={toggleVisible}>view</button>
          <button style={showWhenVisible} onClick={toggleVisible}>hide</button>
        </div>
        <div style={showWhenVisible}>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <div>
            {blog.user.name}
          </div>
        </div>
      </div>
    )
}

export default Blog