import { test, expect } from '@playwright/test'

test.describe('Code Block Features', () => {
  test('should display code with line numbers', async ({ page }) => {
    await page.goto('/')

    // Check line numbers are visible
    const lineNumbers = page.locator('.font-mono .tabular-nums')
    await expect(lineNumbers.first()).toBeVisible()

    // Check multiple line numbers exist
    const count = await lineNumbers.count()
    expect(count).toBeGreaterThan(5) // Code example should have more than 5 lines
  })

  test('should display filename in IDE window', async ({ page }) => {
    await page.goto('/')

    // Check filename is displayed
    await expect(page.getByText('LoginForm.tsx')).toBeVisible()

    // Check traffic lights (macOS style window controls)
    const trafficLights = page.locator('.rounded-full').filter({ hasText: '' })
    await expect(trafficLights).toHaveCount(3) // Red, yellow, green
  })

  test('should have copy button functionality', async ({ page }) => {
    await page.goto('/')

    // Find and click copy button
    const copyButton = page.getByRole('button', { name: /Copy/i })
    await expect(copyButton).toBeVisible()
    await copyButton.click()

    // Check "Copied!" feedback appears
    await expect(page.getByText('Copied!')).toBeVisible()

    // Wait for feedback to disappear (2 seconds)
    await page.waitForTimeout(2500)
    await expect(page.getByText('Copied!')).not.toBeVisible()
  })

  test('should apply syntax highlighting', async ({ page }) => {
    await page.goto('/')

    // Check code has Prism.js classes
    const codeBlock = page.locator('code[class*="language-"]')
    await expect(codeBlock).toBeVisible()

    // Check specific TypeScript keywords are highlighted
    await expect(page.getByText('import')).toBeVisible()
    await expect(page.getByText('from')).toBeVisible()
    await expect(page.getByText('function')).toBeVisible()
  })

  test('should have IDE sidebar in code window', async ({ page }) => {
    await page.goto('/')

    // Check sidebar with icon placeholders exists
    const sidebar = page.locator('.w-12.bg-zinc-900')
    await expect(sidebar).toBeVisible()

    // Check sidebar has icon placeholders
    const iconPlaceholders = sidebar.locator('.w-6.h-6.rounded.bg-zinc-800')
    await expect(iconPlaceholders).toHaveCount(3)
  })
})
