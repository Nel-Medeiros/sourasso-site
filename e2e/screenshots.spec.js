import { test } from '@playwright/test'
import path from 'path'

const dir = path.resolve('docs/screenshots')

test.describe('Screenshots for README', () => {
  test('home - pizzas desktop', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${dir}/home-pizzas-desktop.png`, fullPage: false })
  })

  test('home - pizzas mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${dir}/home-pizzas-mobile.png`, fullPage: false })
  })

  test('home - bebidas desktop', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Bebidas' }).click()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${dir}/home-bebidas-desktop.png`, fullPage: false })
  })

  test('home - bebidas mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Bebidas' }).click()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${dir}/home-bebidas-mobile.png`, fullPage: false })
  })
})
