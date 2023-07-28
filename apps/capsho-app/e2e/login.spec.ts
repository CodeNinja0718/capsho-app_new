import { test, expect } from '@playwright/test'

test('Test router redirect if user exists', async ({ page }) => {
  // Go to http://localhost:8080/
  await page.goto('http://localhost:8080/')

  // Go to http://localhost:8080/auth/login
  await page.goto('http://localhost:8080/auth/login')

  // Click input[type="email"]
  await page.locator('input[type="email"]').click()

  // Fill input[type="email"]
  await page.locator('input[type="email"]').fill('beck@capsho.com')

  // Press Tab
  await page.locator('input[type="email"]').press('Tab')

  // Fill input[type="password"]
  await page.locator('input[type="password"]').fill('capsho123')

  // Click button:has-text("Sign In") >> nth=0
  await page.locator('button:has-text("Sign In")').first().click()

  await expect(page).toHaveURL('http://localhost:8080/podcast/upload')
})
