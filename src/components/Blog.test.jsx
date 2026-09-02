import { render, screen } from '@testing-library/react'
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
