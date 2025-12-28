import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/FormKeeper/i)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    const heading = page.getByRole('heading', { name: /Forms shouldn't be this easy/i })
    await expect(heading).toBeVisible()

    // Check tagline
    await expect(page.getByText(/Zero-dependency headless form state manager/i)).toBeVisible()

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Try Playground/i })).toBeVisible()
  })

  test('should display stats grid', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('<5KB')).toBeVisible()
    await expect(page.getByText('0', { exact: true })).toBeVisible()
    await expect(page.getByText('100%')).toBeVisible()
  })

  test('should display code example with IDE window', async ({ page }) => {
    await page.goto('/')

    // Check IDE window
    await expect(page.getByText('LoginForm.tsx')).toBeVisible()

    // Check code content
    await expect(page.getByText(/useForm/)).toBeVisible()

    // Check copy button
    const copyButton = page.getByRole('button', { name: /Copy/i })
    await expect(copyButton).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Why FormKeeper/i })).toBeVisible()

    // Check feature cards
    await expect(page.getByText('Zero Dependencies')).toBeVisible()
    await expect(page.getByText('Tiny Bundle')).toBeVisible()
    await expect(page.getByText('Type-Safe')).toBeVisible()
    await expect(page.getByText('Headless')).toBeVisible()
    await expect(page.getByText('Plugin System')).toBeVisible()
    await expect(page.getByText('Multi-Framework')).toBeVisible()
  })

  test('should display comparison table', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /How does it compare/i })).toBeVisible()

    // Check table headers
    await expect(page.getByText('FormKeeper', { exact: true })).toBeVisible()
    await expect(page.getByText('react-hook-form')).toBeVisible()
    await expect(page.getByText('Formik')).toBeVisible()
  })

  test('should have working scroll behavior', async ({ page }) => {
    await page.goto('/')

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check CTA section is visible
    await expect(page.getByRole('heading', { name: /Ready to get started/i })).toBeVisible()
  })
})
