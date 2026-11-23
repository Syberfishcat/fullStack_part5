import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const NewBlog = ({ onBlogCreated }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async event => {
    event.preventDefault()
    await onBlogCreated({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <TextField
          label='title' fullWidth margin='dense'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label='author' fullWidth margin='dense'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label='url' fullWidth margin='dense'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button variant='contained' type='submit' sx={{ mt: 1 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default NewBlog