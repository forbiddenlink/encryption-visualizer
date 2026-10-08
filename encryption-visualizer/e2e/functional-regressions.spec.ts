import { test, expect } from '@playwright/test';
import { hashingQuizQuestions } from '../src/data/quizzes/hashingQuiz';

for (const width of [1440, 390]) {
  test(`comparison query, edits and history at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/compare?left=rsa&right=aes');
    const left = page.getByRole('region', { name: 'left experiment', exact: true });
    const right = page.getByRole('region', { name: 'right experiment', exact: true });
    await expect(left).toContainText('left / rsa');
    await expect(right).toContainText('right / aes');
    await page.getByRole('button', { name: 'Hashing', exact: true }).first().click();
    await expect(left).toContainText('left / hashing');
    await page.reload();
    await expect(left).toContainText('left / rsa');
    await page.goto('/compare?left=hashing&right=signatures');
    await expect(left).toContainText('left / hashing');
    await page.goBack();
    await expect(left).toContainText('left / rsa');
    await page.goForward();
    await expect(right).toContainText('right / signatures');
  });
  test(`missed practice preserves assessment after reload at ${width}`, async ({ page }) => {
    test.setTimeout(60000); // Fourteen answers plus animated transitions and a reload.
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/hashing');
    const quiz = page.locator('#lesson-quiz');
    for (let i = 0; i < 10; i++) {
      const text = await quiz.locator('h3').last().innerText();
      const question = hashingQuizQuestions.find((item) => item.question === text)!;
      expect(question).toBeDefined();
      await quiz.getByRole('button', { name: question.options[i < 4 ? (question.correct + 1) % question.options.length : question.correct], exact: true }).click();
      await quiz.getByRole('button', { name: i === 9 ? 'See Results' : 'Next Question', exact: true }).click();
      if (i < 9) await expect(quiz.locator('h3').last()).not.toHaveText(text);
    }
    await quiz.getByRole('button', { name: 'Review Missed Questions', exact: true }).click();
    for (let i = 0; i < 4; i++) {
      const heading = quiz.locator('h3').last();
      await expect(heading).not.toHaveText('Quiz Complete!');
      const text = await heading.innerText();
      const question = hashingQuizQuestions.find((item) => item.question === text)!;
      await quiz.getByRole('button', { name: question.options[question.correct], exact: true }).click();
      await quiz.getByRole('button', { name: i === 3 ? 'See Results' : 'Next Question', exact: true }).click();
      if (i < 3) await expect(heading).not.toHaveText(text);
    }
    await expect(quiz.getByRole('heading', { name: 'Review Complete!', exact: true })).toBeVisible();
    await expect(quiz.getByText(/Achievement Unlocked/)).toHaveCount(0);
    await page.reload();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('cryptoviz-progress')!).state);
    expect(state.quizScores.hashing).toMatchObject({ score: 6, total: 10 });
    expect(state.completedAlgorithms).not.toContain('hashing');
    expect(state.missedQuestions.hashing ?? []).toEqual([]);
  });
  test(`AES buttons retain native Space activation during playback at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/aes');
    await page.getByRole('button', { name: 'Start Encryption Visualization', exact: true }).click();
    const quiz = page.locator('#lesson-quiz');
    const answer = quiz.getByRole('button').filter({ hasNotText: /Next Question|See Results/ }).first();
    await answer.focus();
    await page.keyboard.press('Space');
    await expect(answer).toBeDisabled();
    await expect(quiz.getByRole('button', { name: 'Next Question', exact: true })).toBeVisible();
  });
}
