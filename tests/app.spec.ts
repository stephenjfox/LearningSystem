import { test, expect } from '@playwright/test';
import path from 'path';

const fileUrl = `file://${path.resolve('tracker.html')}`;

test('dashboard loads and shows correct title', async ({ page }) => {
  await page.goto(fileUrl);
  
  // Check title
  await expect(page).toHaveTitle(/Mastery Optimization Tracker/);
  
  // Check if dashboard view is visible by default
  const dashboard = page.locator('#view-dashboard');
  await expect(dashboard).toBeVisible();
});

test('view switching works', async ({ page }) => {
  await page.goto(fileUrl);
  
  // Switch to Lecture Checklist
  await page.click('text=Lecture Checklist');
  const checklist = page.locator('#view-checklist');
  await expect(checklist).toBeVisible();
  
  // Switch to Pass History
  await page.click('text=Pass History');
  const history = page.locator('#view-history');
  await expect(history).toBeVisible();
  
  // Switch back to Topic Mastery
  await page.click('text=Topic Mastery');
  const dashboard = page.locator('#view-dashboard');
  await expect(dashboard).toBeVisible();
});

test('add topic modal opens and saves', async ({ page }) => {
  await page.goto(fileUrl);
  
  // Open modal
  await page.click('button:has-text("Add Topic")');
  const modal = page.locator('#topic-modal');
  await expect(modal).toBeVisible();
  
  // Fill form
  await page.fill('#topic-name', 'Playwright Test Topic');
  await page.fill('#topic-subject', 'Testing');
  await page.click('#topic-submit-btn');
  
  // Verify visibility in table
  await expect(page.locator('topic-mastery-view table')).toContainText('Playwright Test Topic');
  
  // Verify persistence after reload
  await page.reload();
  await expect(page.locator('topic-mastery-view table')).toContainText('Playwright Test Topic');
});

test('import lectures view shows content', async ({ page }) => {
  await page.goto(fileUrl);
  
  // Switch to Import Lectures
  await page.click('text=Import Lectures');
  const importView = page.locator('#view-import');
  await expect(importView).toBeVisible();
  
  // Check for wizard title
  await expect(importView).toContainText('Lecture Import Wizard');
  await expect(importView).toContainText('Step 1 of 4');
  
  // Check for textarea
  await expect(page.locator('#import-json-textarea')).toBeVisible();
});

test('mobile hamburger menu works', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(fileUrl);
  
  // Hamburger should be visible
  const hamburger = page.locator('button[onclick="toggleSidebar(true)"]');
  await expect(hamburger).toBeVisible();
  
  // Sidebar should be hidden initially (off-screen)
  const sidebar = page.locator('#sidebar');
  await expect(sidebar).not.toHaveClass(/open/);
  
  // Click hamburger
  await hamburger.click();
  
  // Sidebar should now have 'open' class
  await expect(sidebar).toHaveClass(/open/);
  
  // Navigation should be visible in sidebar
  await expect(page.locator('#sidebar app-navigation')).toBeVisible();
  
  // Click an item to close sidebar
  await page.locator('#sidebar').getByText('Lecture Checklist').click();
  
  // Sidebar should be closed
  await expect(sidebar).not.toHaveClass(/open/);
  await expect(page.locator('#view-checklist')).toBeVisible();
});
