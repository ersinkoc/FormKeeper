import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/')

    // Open theme menu
    const themeButton = page.getByRole('button', { name: /Toggle theme/i })
    await themeButton.click()

    // Switch to light theme
    await page.getByRole('menuitem', { name: /Light/i }).click()

    // Check if light theme is applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/light/)

    // Open theme menu again
    await themeButton.click()

    // Switch to dark theme
    await page.getByRole('menuitem', { name: /Dark/i }).click()

    // Check if dark theme is applied
    await expect(html).toHaveClass(/dark/)
  })

  test('should persist theme selection', async ({ page }) => {
    await page.goto('/')

    // Set to light theme
    const themeButton = page.getByRole('button', { name: /Toggle theme/i })
    await themeButton.click()
    await page.getByRole('menuitem', { name: /Light/i }).click()

    // Reload page
    await page.reload()

    // Check if light theme persisted
    const html = page.locator('html')
    await expect(html).toHaveClass(/light/)

    // Switch back to dark
    await themeButton.click()
    await page.getByRole('menuitem', { name: /Dark/i }).click()

    // Reload again
    await page.reload()

    // Check if dark theme persisted
    await expect(html).toHaveClass(/dark/)
  })

  test('should have system theme option', async ({ page }) => {
    await page.goto('/')

    const themeButton = page.getByRole('button', { name: /Toggle theme/i })
    await themeButton.click()

    // Check system option exists
    await expect(page.getByRole('menuitem', { name: /System/i })).toBeVisible()
  })
})
