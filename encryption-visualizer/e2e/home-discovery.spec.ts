import { test, expect } from '@playwright/test';

test('topic discovery combines search and category and recovers from no results', async ({ page }) => {
  await page.goto('/');
  const catalog = page.locator('#topics');
  await expect(catalog.getByRole('status')).toHaveText('12 of 12 topics');
  await catalog.getByRole('button', { name: 'Symmetric', exact: true }).click();
  await expect(catalog.getByRole('status')).toHaveText('3 of 12 topics');
  const search = page.getByRole('searchbox', { name: 'Search algorithm topics' });
  await search.fill('padding');
  await expect(catalog.getByRole('status')).toHaveText('1 of 12 topics');
  await expect(catalog.getByRole('link', { name: /Padding Schemes/ })).toBeVisible();
  await search.fill('nonexistent topic');
  await expect(catalog.getByRole('heading', { name: 'No matching topics' })).toBeVisible();
  await catalog.getByRole('button', { name: 'Clear filters' }).click();
  await expect(search).toHaveValue('');
  await expect(catalog.getByRole('status')).toHaveText('12 of 12 topics');
  await catalog.getByRole('link', { name: /AES Encryption/ }).click();
  await expect(page).toHaveURL(/\/aes$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AES');
});

test('desktop topic menu opens from the keyboard and Escape restores focus', async ({ page }) => {
  await page.goto('/');
  const menu = page.locator('.desktop-nav summary');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.desktop-nav .topic-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.desktop-nav .topic-menu')).toBeHidden();
  await expect(menu).toBeFocused();
});

test('mobile menu reaches the final topic and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByLabel('Open navigation menu').click();
  const panel = page.getByRole('navigation', { name: 'Mobile navigation' });
  await panel.getByRole('link', { name: 'Cryptanalysis', exact: true }).click();
  await expect(page).toHaveURL(/\/cryptanalysis$/);
  await expect(panel).toBeHidden();
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  const headingBox = await heading.boundingBox();
  const headerBox = await page.locator('.site-header').boundingBox();
  expect(headingBox!.y).toBeGreaterThan(headerBox!.y + headerBox!.height);
});

test('introductory lab handles empty input, stepping, playback and cipher changes', async ({ page }) => {
  await page.goto('/');
  const lab = page.getByRole('region', { name: 'Interactive cipher lab' });
  const message = lab.getByRole('textbox', { name: 'Plaintext to encrypt' });
  const scrubber = lab.getByRole('slider', { name: 'Scrub through cipher steps' });
  await message.fill('');
  await expect(lab.getByRole('status')).toContainText('Enter a message');
  await expect(lab.getByRole('button', { name: 'Play', exact: true })).toBeDisabled();
  await message.fill('abcdef');
  await lab.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(scrubber).toHaveValue('1');
  await lab.getByRole('button', { name: 'Previous step', exact: true }).click();
  await expect(scrubber).toHaveValue('0');
  await lab.getByRole('button', { name: 'Play', exact: true }).click();
  await lab.getByRole('button', { name: 'Pause', exact: true }).click();
  await lab.getByRole('button', { name: 'Reset cipher lab' }).click();
  await expect(scrubber).toHaveValue('0');
  await lab.getByRole('button', { name: /AES S-Box/ }).click();
  await expect(lab.getByRole('button', { name: /AES S-Box/ })).toHaveAttribute('aria-pressed', 'true');
  await lab.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(scrubber).toHaveValue('1');
  await lab.getByRole('button', { name: /Caesar Shift/ }).click();
  await expect(scrubber).toHaveValue('0');
  await expect(lab.getByRole('textbox', { name: /for cipher/ })).toBeVisible();
});
