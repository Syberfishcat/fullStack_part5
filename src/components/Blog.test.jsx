import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog =  {
    title: 'Blog renders test',
    author: 'yqs',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    user: {
        username: 'tester',
        name: 'testName'
    }
  }

  render(<Blog blog={blog} />)

  let element = screen.getByText(
    'Blog renders test yqs'
  )
  expect(element).toBeVisible()

  element = screen.getByText('https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf')
  expect(element).not.toBeVisible()

  element = screen.getByText('like')
  expect(element).not.toBeVisible()
})

test('cliking the button change visibility', async () => {
    const blog =  {
        title: 'Blog renders test',
        author: 'yqs',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        user: {
            username: 'tester',
            name: 'testName'
        }
      }
    
      render(<Blog blog={blog} />)
    
      const user = userEvent.setup()
      const button = screen.getByText('view')
      await user.click(button)
    
      let element = screen.getByText('https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf')
      expect(element).toBeVisible()
    
      element = screen.getByText('like')
      expect(element).toBeVisible()
})

test('clicking the button calls event handler', async () => {
    const blog =  {
        title: 'Blog renders test',
        author: 'yqs',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        user: {
            username: 'tester',
            name: 'testName'
        }
      }

      const mockHandler = vi.fn()
    
      render(<Blog blog={blog} handleLike={mockHandler} />)
    
      const user = userEvent.setup()
      let button = screen.getByText('view')
      await user.click(button)
      button = screen.getByText('like')
      await user.click(button)
      await user.click(button)

      expect(mockHandler.mock.calls).toHaveLength(2)
})
