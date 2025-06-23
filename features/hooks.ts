import { Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { takeScreenshot } from '../utils/helpers';
import { mkdirSync } from 'fs';
import path from 'path';

const tracesDir = 'traces';
mkdirSync(tracesDir, { recursive: true });

export let browser: Browser;
export let context: BrowserContext;
export let page: Page;

Before(async function ({ pickle }) {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true, title: pickle.name });
});

After(async function ({ result, pickle }) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
  await context.tracing.stop({ path: path.join(tracesDir, `${timestamp}_${scenarioName}.zip`) });

  if (result?.status === 'FAILED') {
    await takeScreenshot(page, `${timestamp}_${scenarioName}`, 'reports/failures');
  }
  await page.close();
  await context.close();
  await browser.close();
});
