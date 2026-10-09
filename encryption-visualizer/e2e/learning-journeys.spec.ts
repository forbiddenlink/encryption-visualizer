import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { passwordHashingQuizQuestions } from '../src/data/quizzes/passwordHashingQuiz';
import { signaturesQuizQuestions } from '../src/data/quizzes/signaturesQuiz';
import { hmacQuizQuestions } from '../src/data/quizzes/hmacQuiz';
import { cryptanalysisQuizQuestions } from '../src/data/quizzes/cryptanalysisQuiz';
import { paddingQuizQuestions } from '../src/data/quizzes/paddingQuiz';
import { blockModesQuizQuestions } from '../src/data/quizzes/blockModesQuiz';
import { hashingQuizQuestions } from '../src/data/quizzes/hashingQuiz';
import { rsaQuizQuestions } from '../src/data/quizzes/rsaQuiz';
import { eccQuizQuestions } from '../src/data/quizzes/eccQuiz';
import { aesQuizQuestions } from '../src/data/quizzes/aesQuiz';
import { diffieHellmanQuizQuestions } from '../src/data/quizzes/diffieHellmanQuiz';
import { tlsQuizQuestions } from '../src/data/quizzes/tlsQuiz';

const quizzes = {
  'password-hashing': passwordHashingQuizQuestions,
  'signatures': signaturesQuizQuestions,
  'hmac': hmacQuizQuestions,
  'cryptanalysis': cryptanalysisQuizQuestions,
  'padding': paddingQuizQuestions,
  'block-modes': blockModesQuizQuestions,
  'hashing': hashingQuizQuestions,
  'rsa': rsaQuizQuestions,
  'ecc': eccQuizQuestions,
  'aes': aesQuizQuestions,
  'diffie-hellman': diffieHellmanQuizQuestions,
  'tls': tlsQuizQuestions,
};

for (const [slug, questions] of Object.entries(quizzes)) {
  test(`${slug} quiz saves completion and feedback`, async ({ page }) => {
    await page.goto(`/${slug}`);
    const quiz = page.locator('#lesson-quiz');
    for (let i = 0; i < 10; i++) {
      const text = await quiz.locator('h3').last().innerText();
      const question = questions.find((item) => item.question === text);
      expect(question, text).toBeDefined();
      const answer = question!.options[i === 0 ? (question!.correct + 1) % question!.options.length : question!.correct];
      await quiz.getByRole('button', { name: answer, exact: true }).click();
      await expect(quiz.getByRole('button', { name: question!.options[question!.correct], exact: true })).toBeDisabled();
      if (i < 9) {
        await quiz.getByRole('button', { name: 'Next Question', exact: true }).click();
        await expect(quiz.locator('h3').last()).not.toHaveText(text);
      } else await quiz.getByRole('button', { name: 'See Results', exact: true }).click();
    }
    await expect.poll(async () => page.evaluate((id) => JSON.parse(localStorage.getItem('cryptoviz-progress')!).state.completedAlgorithms.includes(id), slug)).toBe(true);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('cryptoviz-progress')!).state);
    expect(state.quizScores[slug].score).toBe(9);
    expect(state.quizScores[slug].total).toBe(10);
    await mkdir('../design-research/screenshots/states', { recursive: true });
    await quiz.screenshot({ path: `../design-research/screenshots/states/${slug}-quiz-result-1440.png` });
    await page.reload();
    await expect(page.getByText('Knowledge check passed', { exact: true })).toBeVisible();
  });
}

test('curriculum start, locked prerequisites, completion persistence and resume', async ({ page }) => {
  await page.goto('/learn');
  await page.getByRole('button', { name: /Cryptography Fundamentals/ }).click();
  await expect(page.getByRole('button', { name: /AES Symmetric Encryption/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Start Path', exact: true }).click();
  await expect(page).toHaveURL(/\/hashing$/);
  await expect(page.getByRole('heading', { name: 'Hash Functions Visualizer' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Continue learning' }).getByRole('link', { name: /Complete knowledge check/ })).toHaveAttribute('href', '#lesson-quiz');
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Resume learning' })).toHaveAttribute('href', '/hashing');
});

test('a completed standalone module remains available for review', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cryptoviz-progress', JSON.stringify({ state: {
      completedAlgorithms: ['ecc'], quizScores: {}, pathProgress: {}, achievements: [],
    }, version: 0 }));
  });
  await page.goto('/learn');
  await page.getByRole('button', { name: /Advanced Security/ }).click();
  const ecc = page.getByRole('button', { name: /Elliptic Curve Cryptography/ });
  await expect(ecc).toBeEnabled();
  await ecc.click();
  await expect(page).toHaveURL(/\/ecc$/);
});

test('glossary search, categories, related terms and empty recovery', async ({ page }) => {
  await page.goto('/glossary');
  await page.getByRole('button', { name: 'Hashing', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('3 of 17 terms');
  await page.getByRole('searchbox').fill('nonexistentconcept');
  await expect(page.getByText(/No terms found/)).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByRole('status')).toHaveText('17 of 17 terms');
  await page.getByRole('button', { name: 'Block Cipher', exact: true }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Block Cipher');
  await expect(page.getByRole('heading', { name: 'Block Cipher', exact: true })).toBeVisible();
});

test('client-side lesson switching clears incompatible visualization frames', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/aes');
  await page.getByRole('button', { name: 'Start Encryption Visualization', exact: true }).click();
  await page.getByRole('button', { name: /^(?:Go to )?Next step$/i }).click();
  const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
  await nav.locator('summary').click();
  await nav.getByRole('link', { name: 'Hash Functions', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hash Functions Visualizer', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hash It!', exact: true }).click();
  const pause = page.getByRole('button', { name: 'Pause', exact: true });
  if (await pause.count()) await pause.click();
  await nav.locator('summary').click();
  await nav.getByRole('link', { name: 'AES Encryption', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'AES Encryption Visualizer', exact: true })).toBeVisible();
  await expect(page.getByText('No visualization data available', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
