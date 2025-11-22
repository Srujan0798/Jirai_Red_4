
import { test, expect } from '@playwright/test';

test.describe('Jirai Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application and default nodes', async ({ page }) => {
    await expect(page).toHaveTitle(/Jirai/);
    await expect(page.getByText('Jirai Workspace')).toBeVisible();
  });

  test('should create a new node via shortcut', async ({ page }) => {
    // Ctrl+N shortcut
    await page.keyboard.press('Control+n');
    
    // Check if new node appears (default title "New Topic")
    await expect(page.getByText('New Topic')).toBeVisible();
    
    // Check if details panel opens for the new node
    await expect(page.getByText('Info')).toBeVisible();
    await expect(page.locator('input[value="New Topic"]')).toBeVisible();
  });

  test('should edit node title', async ({ page }) => {
    // Click the root node to select/edit it
    await page.getByText('Jirai Workspace').dblclick();
    
    // Edit title in panel
    const input = page.locator('input[value="Jirai Workspace"]');
    await input.fill('Updated Workspace');
    
    // Verify change on canvas
    await expect(page.getByText('Updated Workspace')).toBeVisible();
  });

  test('should switch view modes', async ({ page }) => {
    await page.getByRole('button', { name: 'Management' }).click();
    
    // Timeline view specific element
    await expect(page.getByText('Timeline')).toBeVisible();
    
    await page.getByRole('button', { name: 'Workflow' }).click();
    // Calendar view specific element
    await expect(page.getByText('Month View')).toBeVisible();
  });

  test('should persist data after reload', async ({ page }) => {
    // Modify something
    await page.getByText('Jirai Workspace').dblclick();
    const input = page.locator('input[value="Jirai Workspace"]');
    await input.fill('Persisted Title');
    
    // Reload
    await page.reload();
    
    // Verify persistence
    await expect(page.getByText('Persisted Title')).toBeVisible();
  });
});
