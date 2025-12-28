import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to all pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Docs
    await page.getByRole('link', { name: 'Docs', exact: true }).click()
    await expect(page).toHaveURL('/docs')
    await expect(page.getByRole('heading', { name: /Documentation/i })).toBeVisible()

    // Navigate to Examples
    await page.getByRole('link', { name: 'Examples' }).click()
    await expect(page).toHaveURL('/examples')
    await expect(page.getByRole('heading', { name: /Examples/i })).toBeVisible()

    // Navigate to Playground
    await page.getByRole('link', { name: 'Playground' }).click()
    await expect(page).toHaveURL('/playground')
    await expect(page.getByRole('heading', { name: /Playground/i })).toBeVisible()

    // Navigate back to Home
    await page.getByRole('link', { name: 'FormKeeper' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('should have working header links', async ({ page }) => {
    await page.goto('/')

    // Check logo is visible
    await expect(page.getByRole('link', { name: /FormKeeper/i }).first()).toBeVisible()

    // Check navigation links
    await expect(page.getByRole('link', { name: 'Docs', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Examples' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Playground' })).toBeVisible()

    // Check GitHub link exists
    const githubLink = page.getByRole('link', { name: /GitHub/i })
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('href', /github\.com/)
  })

  test('should have working footer links', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check footer sections
    await expect(page.getByText('Zero-dependency headless form state manager')).toBeVisible()

    // Check footer links work
    const footerDocsLink = page.locator('footer').getByRole('link', { name: 'Getting Started' })
    await expect(footerDocsLink).toBeVisible()
  })

  test('should show 404 page for invalid route', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist')

    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Page Not Found/i })).toBeVisible()

    // Click back to home button
    await page.getByRole('link', { name: /Back to Home/i }).click()
    await expect(page).toHaveURL('/')
  })
})
