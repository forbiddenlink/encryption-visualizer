import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { lessons } from '../src/data/lessonCatalog';

async function capture(page: Page, name: string, width: number): Promise<void> {
  await mkdir('../design-research/screenshots/states', { recursive: true });
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `../design-research/screenshots/states/${name}-${width}.png`, fullPage: true });
}

for (const width of [1440, 390]) {
  test(`partial and completed curriculum, glossary recovery and about links at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => {
      if (!localStorage.getItem('cryptoviz-progress')) localStorage.setItem('cryptoviz-progress', JSON.stringify({ state: { completedAlgorithms: ['hashing', 'aes'], quizScores: {}, pathProgress: { fundamentals: ['retained-legacy-module'] }, achievements: [] }, version: 0 }));
    });
    await page.goto('/learn');
    await page.getByRole('button', { name: /Cryptography Fundamentals/ }).click();
    await expect(page.getByRole('button', { name: /Block Cipher Modes/ })).toBeEnabled();
    await capture(page, 'learn-partial', width);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Block Cipher Modes', exact: true })).toBeVisible();
    await page.evaluate((ids) => {
      const data = JSON.parse(localStorage.getItem('cryptoviz-progress')!);
      data.state.completedAlgorithms = ids;
      localStorage.setItem('cryptoviz-progress', JSON.stringify(data));
    }, lessons.map((lesson) => lesson.slug));
    await page.goto('/learn');
    await page.getByRole('button', { name: /Cryptography Fundamentals/ }).click();
    await expect(page.getByRole('button', { name: 'Review Path', exact: true })).toBeVisible();
    await capture(page, 'learn-complete', width);
    await page.getByRole('button', { name: 'Review Path', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Hash Functions Visualizer' })).toBeVisible();
    await page.goto('/glossary');
    await page.getByRole('searchbox').fill('missingconcept');
    await expect(page.getByText(/No terms found/)).toBeVisible();
    await capture(page, 'glossary-empty', width);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByRole('status')).toHaveText('17 of 17 terms');
    await page.getByRole('button', { name: 'Block Cipher', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Block Cipher', exact: true })).toBeVisible();
    await capture(page, 'glossary-related', width);
    await page.goto('/about');
    await expect(page.getByRole('link', { name: 'View on GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/forbiddenlink/EncryptionVisualizer');
    await expect(page.getByRole('link', { name: 'Report an Issue', exact: true })).toHaveAttribute('href', 'https://github.com/forbiddenlink/EncryptionVisualizer/issues');
  });

  test(`live shared-secret playground and HMAC empty validation at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/diffie-hellman');
    await page.getByRole('spinbutton', { name: 'Alice private key', exact: true }).fill('9');
    await page.getByRole('slider', { name: 'Bob private key slider' }).fill('11');
    await expect(page.getByText(/Both computed the same shared secret:/)).toBeVisible();
    await page.getByRole('button', { name: 'New Prime', exact: true }).click();
    await expect(page.getByText(/Both computed the same shared secret:/)).toBeVisible();
    await capture(page, 'diffie-hellman-playground', width);
    await page.goto('/hmac');
    await page.getByRole('textbox', { name: 'Message', exact: true }).fill('');
    await expect(page.getByRole('button', { name: 'Compute HMAC', exact: true })).toBeDisabled();
    await capture(page, 'hmac-empty-message', width);
  });

  test(`lesson loading and offline recovery at ${width}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.route('**/src/pages/AESPage.tsx*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      await route.continue();
    });
    const navigation = page.goto('/aes');
    await expect(page.getByText('Loading your lesson…', { exact: true })).toBeVisible();
    await capture(page, 'lesson-loading', width);
    await navigation;
    await expect(page.getByRole('heading', { name: 'AES Encryption Visualizer' })).toBeVisible();
    await context.setOffline(true);
    await expect(page.getByText(/You're offline/)).toBeVisible();
    await capture(page, 'offline', width);
    await context.setOffline(false);
    await expect(page.getByText(/You're offline/)).toHaveCount(0);
  });

  test(`visualization error boundary and retry at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/aes');
    await expect(page.getByRole('heading', { name: 'AES Encryption Visualizer' })).toBeVisible();
    await page.evaluate(async () => {
      const modulePath = performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => name.includes('/src/store/visualizationStore.ts')).at(-1)!;
      const { useVisualizationStore } = await import(modulePath);
      useVisualizationStore.setState({ steps: [{ state: null, type: 'initial', description: 'Deliberately malformed test frame' }], currentStep: 0 });
    });
    await expect(page.getByRole('heading', { name: 'Something went wrong', exact: true })).toBeVisible();
    await capture(page, 'visualization-error', width);
    await page.evaluate(async () => {
      const modulePath = performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => name.includes('/src/store/visualizationStore.ts')).at(-1)!;
      const { useVisualizationStore } = await import(modulePath);
      useVisualizationStore.setState({ steps: [], currentStep: 0 });
    });
    await page.getByRole('button', { name: 'Try Again', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Something went wrong', exact: true })).toHaveCount(0);
    await expect(page.getByText('Watch a block become ciphertext.', { exact: true })).toBeVisible();
  });
}
