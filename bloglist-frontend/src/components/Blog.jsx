import { Card, CardContent, Typography, Button, Box } from '@mui/material'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  if(!blog) {
    return null
  }

  const canDelete = user?.username === blog.user.username

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {blog.title}
        </Typography>
        <Typography color='text.secondary' gutterBottom>
          by {blog.author}
        </Typography>
        <Typography gutterBottom>
          <a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a>
        </Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{blog.likes} likes</Typography>
          {user && (
            <Button variant='outlined' size='small' onClick={() => handleLike(blog)}>
              like
            </Button>
          )}
          {canDelete && (
            <Button variant='outlined' size='small' color='error' onClick={() => handleDelete(blog)}>
              remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog