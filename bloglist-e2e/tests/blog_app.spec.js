const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' }
    })
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Other User', username: 'other', password: 'secret' }
    })
    await page.goto('http://localhost:5173')
  })
  
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })
  
  test('succeeds with correct credentials', async ({ page }) => {
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
  
  test('fails with wrong credentials', async ({ page }) => {
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('wrong username or password')).toBeVisible()
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title:').fill('E2E testing with Playwright')
      await page.getByLabel('author:').fill('Test Author')
      await page.getByLabel('url:').fill('http://example.com')
      await page.getByRole('button', { name: 'create', exact: true }).click()
  
      await expect(page.getByText('E2E testing with Playwright Test Author')).toBeVisible()
    })

    test('blogs are ordered by likes, most likes first', async ({ page, request }) => {
      const response = await request.post('http://localhost:3003/api/login', {
        data: { username: 'mluukkai', password: 'salainen' }
      })
      const { token } = await response.json()
      const headers = { Authorization: `Bearer ${token}` }

      const blogs = [
        { title: 'few likes', author: 'A', url: 'http://a.com', likes: 1 },
        { title: 'most likes', author: 'B', url: 'http://b.com', likes: 10 },
        { title: 'some likes', author: 'C', url: 'http://c.com', likes: 5 },
      ]
      for (const blog of blogs) {
        await request.post('http://localhost:3003/api/blogs', { data: blog, headers })
      }

      await page.reload()

      const items = page.locator('.blog')
      await expect(items).toHaveCount(3)
      await expect(items.nth(0)).toContainText('most likes')
      await expect(items.nth(1)).toContainText('some likes')
      await expect(items.nth(2)).toContainText('few likes')
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel('title:').fill('Like me')
        await page.getByLabel('author:').fill('Test Author')
        await page.getByLabel('url:').fill('http://example.com')
        await page.getByRole('button', { name: 'create', exact: true }).click()
        await page.getByText('Like me Test Author').waitFor()
      })

      test('it can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('only the creator sees the remove button', async ({ page }) => {
        // Creator can see the remove button
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        
        // Change user
        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByLabel('username').fill('other')
        await page.getByLabel('password').fill('secret')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Other User logged in')).toBeVisible()

        // Other cannot see the remove button
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })


      test('it can be deleted by the user who added it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Like me Test Author')).not.toBeVisible()
      })
    })
  })
})
