const Blog = ({ blog, user, handleLike, handleDelete }) => {
  if(!blog) {
    return null
  }

  const canDelete = user?.username === blog.user.username

  return (
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <div>
        <a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => handleLike(blog)}>like</button>}
      </div>
      <div>Added by {blog.user.name}</div>
      {canDelete && <button onClick={() => handleDelete(blog)}>remove</button>}
    </div>
  )
}

export default Blog