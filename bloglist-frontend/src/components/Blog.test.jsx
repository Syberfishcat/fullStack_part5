import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Blog renders test',
  author: 'yqs',
  url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
  likes: 5,
  user: {
    username: 'tester',
    name: 'testName'
  }
}

test('unauthenticated user sees blog info and likes but no buttons', () => {
  render(<Blog blog={blog} />)

  expect(screen.getByText('Blog renders test')).toBeVisible()
  expect(screen.getByText('by yqs')).toBeVisible()
  expect(screen.getByText(blog.url)).toBeVisible()
  expect(screen.getByText('5 likes')).toBeVisible()

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('authenticated non-creator sees only the like button', () => {
  const user = { username: 'other', name: 'Other User' }
  render(<Blog blog={blog} user={user} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('creator sees both like and remove buttons', () => {
  const user = { username: 'tester', name: 'testName' }
  render(<Blog blog={blog} user={user} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
})

test('clicking like twice calls event handler twice', async () => {
  const user = { username: 'other', name: 'Other User' }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} user={user} handleLike={mockHandler} />)

  const clicker = userEvent.setup()
  const button = screen.getByRole('button', { name: 'like' })
  await clicker.click(button)
  await clicker.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
