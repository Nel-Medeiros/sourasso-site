import { test, expect } from '@playwright/test'

test.describe('Home', () => {
  test('loads the menu and shows pizza cards', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('Sourasso')
    await expect(page.getByRole('button', { name: 'Pizzas' })).toBeVisible()
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible()
  })

  test('switches between categories', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Bebidas' }).click()
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible()
  })

  test('switches pizza subcategories', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Especiais', exact: true }).click()
    await expect(page.getByText('Sourasso')).toBeVisible()
  })
})

test.describe('Cart', () => {
  test('navigates to cart page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /carrinho/i }).click()
    await expect(page).toHaveURL(/#\/cart/)
  })
})

test.describe('Contact', () => {
  test('navigates to contact page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /contato/i }).click()
    await expect(page).toHaveURL(/#\/contact/)
  })
})
