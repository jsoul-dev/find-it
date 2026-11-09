import { expect, test } from '@playwright/test';

test('loads the home page with title and segment filters', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ion-title')).toContainText('FindIt');
  await expect(page.locator('ion-segment-button[value="All"]')).toBeVisible();
  await expect(page.locator('ion-segment-button[value="Lost"]')).toBeVisible();
  await expect(page.locator('ion-segment-button[value="Found"]')).toBeVisible();
  await expect(page.locator('ion-segment-button[value="Claimed"]')).toBeVisible();
});

test('renders the campus overview dashboard and metric cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Campus Overview')).toBeVisible();
  await expect(page.getByText('Total Items')).toBeVisible();
  await expect(page.getByText('Lost Items')).toBeVisible();
  await expect(page.getByText('Found Items')).toBeVisible();
  await expect(page.locator('.stat-claimed')).toBeVisible();
});

test('navigates to post item page and displays form fields', async ({ page }) => {
  await page.goto('/post-item');
  await expect(page.locator('ion-title')).toContainText('Report Lost or Found');
  await expect(page.getByText('Item Information')).toBeVisible();
  await expect(page.getByText('Visual Evidence')).toBeVisible();
  await expect(page.getByText('Location Pin')).toBeVisible();
  await expect(page.locator('ion-button.submit-btn')).toBeVisible();
});

test('filters items using the searchbar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ion-searchbar')).toBeVisible();
  const searchInput = page.locator('ion-searchbar input');
  await searchInput.fill('Calculator');
  await expect(page.locator('.items-list-wrapper')).toBeVisible();
});
