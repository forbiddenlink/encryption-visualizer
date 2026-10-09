import { test, expect } from '@playwright/test';

test.describe('Digital Signatures Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Open the topic menu and follow the lesson link.
    const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
    await nav.locator('summary').click();
    await nav.getByRole('link', { name: 'Digital Signatures', exact: true }).click();
  });

  test('should display signature input panel', async ({ page }) => {
    // Check for page title
    await expect(page.getByRole('heading', { name: /Digital Signatures Visualizer/i })).toBeVisible();

    // Check for message input
    await expect(page.getByRole('textbox', { name: /Message to Sign/i })).toBeVisible();

    // Check for sign button
    await expect(page.getByRole('button', { name: /Sign Message|Generate Keys & Sign/i })).toBeVisible();
  });

  test('should sign a message and show steps', async ({ page }) => {
    // Enter a message
    const messageInput = page.getByRole('textbox', { name: /Message to Sign/i });
    await messageInput.fill('Test message for signing');

    // Click sign button
    await page.getByRole('button', { name: /Sign Message|Generate Keys & Sign/i }).click();

    // Wait for step visualization - use first() to handle multiple matches
    await expect(page.getByText(/Step 1 of/i).first()).toBeVisible({ timeout: 5000 });

    // Should show signing steps
    await expect(page.getByText(/Input Message/i).first()).toBeVisible();
  });

  test('should complete signing process and show signature', async ({ page }) => {
    // Enter a message and sign
    const messageInput = page.getByRole('textbox', { name: /Message to Sign/i });
    await messageInput.fill('Complete signing test');
    await page.getByRole('button', { name: /Sign Message|Generate Keys & Sign/i }).click();

    // Wait for play to complete or skip to end
    await expect(page.getByText(/Step 1 of/i).first()).toBeVisible({ timeout: 5000 });

    // Click next until we reach the signature complete step
    const nextButton = page.getByRole('button', { name: 'Next step' });
    while (!(await page.getByText(/Signature Created|Signature Complete/i).isVisible().catch(() => false))) {
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(100);
      } else {
        break;
      }
    }

    // Should show the signature result
    await expect(page.getByText(/Your Digital Signature|Signature:/i).first()).toBeVisible();
  });

  test('should have interactive sign/verify panel after signing', async ({ page }) => {
    // Sign a message first
    const messageInput = page.getByRole('textbox', { name: /Message to Sign/i });
    await messageInput.fill('Test for verify panel');
    await page.getByRole('button', { name: /Sign Message|Generate Keys & Sign/i }).click();

    // Wait and skip to the end
    await expect(page.getByText(/Step 1 of/i).first()).toBeVisible({ timeout: 5000 });
    const nextButton = page.getByRole('button', { name: 'Next step' });
    while (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    // Check for the interactive panel
    await expect(page.getByText(/Interactive Sign & Verify/i)).toBeVisible({ timeout: 5000 });
  });

  test('should verify a valid signature', async ({ page }) => {
    // First sign a message
    const messageInput = page.getByRole('textbox', { name: /Message to Sign/i });
    await messageInput.fill('Verification test');
    await page.getByRole('button', { name: /Sign Message|Generate Keys & Sign/i }).click();

    // Skip to end
    await expect(page.getByText(/Step 1 of/i).first()).toBeVisible({ timeout: 5000 });
    const nextButton = page.getByRole('button', { name: 'Next step' });
    while (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    // Look for the Sign/Verify panel
    await expect(page.getByText(/Interactive Sign & Verify/i)).toBeVisible({ timeout: 5000 });

    // Use the quick sign feature in the panel
    const quickSignInput = page.locator('#quick-sign-message');
    await quickSignInput.fill('Quick sign test');
    await page.getByRole('button', { name: /Generate Signature/i }).click();

    // Wait for signature to be generated and click "Test Verification"
    await expect(page.getByText(/Generated Signature/i)).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /Test Verification/i }).click();

    // Verify the signature (use nth(1) to get the action button, not the tab)
    await page.getByRole('button', { name: /Verify Signature/i }).nth(1).click();

    // Should show valid
    await expect(page.getByText(/Signature Valid/i)).toBeVisible({ timeout: 5000 });
  });

  test('should detect invalid signature when message is tampered', async ({ page }) => {
    // Sign a message
    const messageInput = page.getByRole('textbox', { name: /Message to Sign/i });
    await messageInput.fill('Original message');
    await page.getByRole('button', { name: /Sign Message|Generate Keys & Sign/i }).click();

    // Skip to end
    await expect(page.getByText(/Step 1 of/i).first()).toBeVisible({ timeout: 5000 });
    const nextButton = page.getByRole('button', { name: 'Next step' });
    while (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }

    // Use the interactive panel
    await expect(page.getByText(/Interactive Sign & Verify/i)).toBeVisible({ timeout: 5000 });

    // Sign a message
    const quickSignInput = page.locator('#quick-sign-message');
    await quickSignInput.fill('Original message');
    await page.getByRole('button', { name: /Generate Signature/i }).click();

    // Copy signature to verify tab
    await expect(page.getByText(/Generated Signature/i)).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /Test Verification/i }).click();

    // Tamper with the message
    const verifyMessageInput = page.locator('#verify-message');
    await verifyMessageInput.fill('Tampered message');

    // Verify should fail (use nth(1) to get the action button, not the tab)
    await page.getByRole('button', { name: /Verify Signature/i }).nth(1).click();
    await expect(page.getByText(/Signature Invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test('should display educational content', async ({ page }) => {
    // Check for educational cards - use first() to handle multiple matches
    await expect(page.getByText(/What is a Digital Signature/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /How Signing Works/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /How Verification Works/i })).toBeVisible();
  });

  test('should have signing vs encrypting comparison', async ({ page }) => {
    // Check for the comparison section
    await expect(page.getByRole('button', { name: /Signing vs Encrypting/i })).toBeVisible();
  });

  test('should have quiz section', async ({ page }) => {
    // Check for quiz
    await expect(page.getByText(/Signatures Knowledge Check/i)).toBeVisible();
  });

  test('should navigate from homepage', async ({ page }) => {
    // Go back to home
    await page.goto('/');

    // Find and click the Signatures card
    await page.getByRole('link', { name: /Digital Signatures/i }).click();

    // Should be on signatures page
    await expect(page.getByRole('heading', { name: /Digital Signatures Visualizer/i })).toBeVisible();
  });
});
