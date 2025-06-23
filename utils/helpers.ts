import { Locator, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export async function waitForVisibility(locator: Locator, timeout = 10000) {
  await expect(locator).toBeVisible({ timeout });
}

export function takeScreenshot(page: Page, name: string = 'screenshot', folder = 'screenshots') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${name}_${timestamp}.png`;
  const filePath = path.join(folder, fileName);
  fs.mkdirSync(folder, { recursive: true });
  return page.screenshot({ path: filePath });
}