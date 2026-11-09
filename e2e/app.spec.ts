import { expect, test } from '@playwright/test';

test('loads the home page with title and segment filters', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ion-title')).toContainText('FindIt');
  await expect(page.locator('ion-segment-button[value="All"]')).toBeVisible();
  await expect(page.locator('ion-segment-button[value="Lost"]')).toBeVisible();
  await expect(page.locator('ion-segment-button[value="Found"]')).toBeVisible();
  await expect(page.locator('ion-segment-button[value="Claimed"]')).toBeVisible();
});

test('renders the campus overview map container', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#map')).toBeVisible();
});

test('navigates to post item page and displays form fields', async ({ page }) => {
  await page.goto('/post-item');
  await expect(page.locator('ion-title')).toContainText('Report Lost or Found');
  await expect(page.getByText('Item Information')).toBeVisible();
  await expect(page.getByText('Visual Evidence')).toBeVisible();
  await expect(page.getByText('Location Pin')).toBeVisible();
  await expect(page.locator('ion-button.submit-btn')).toBeVisible();
});
