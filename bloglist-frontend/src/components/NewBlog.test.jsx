import { render, screen } from '@testing-library/react'
import NewBlog from './NewBlog'
import userEvent from '@testing-library/user-event'

test('<NewBlog /> calls onSubmit', async () => {
  const user = userEvent.setup()
  const onBlogCreated = vi.fn()

  render(<NewBlog onBlogCreated={onBlogCreated}/>)

  let input = screen.getByLabelText('title:')
  await user.type(input, 'testing create a blog')

  input = screen.getByLabelText('author:')
  await user.type(input, 'yqs')

  input = screen.getByLabelText('url:')
  await user.type(input, 'www.example.com')

  const button = screen.getByText('create')
  await user.click(button)

  expect(onBlogCreated.mock.calls).toHaveLength(1)
  expect(onBlogCreated.mock.calls[0][0]).toEqual({
    title: 'testing create a blog',
    author: 'yqs',
    url: 'www.example.com'
  })
})