import Blog from './Blog'

const BlogList = ({ blogs, user, handleLike, handleDelete }) => (
  <div>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        canDelete={user?.username === blog.user.username}
      />
    )}
  </div>
)

export default BlogList
