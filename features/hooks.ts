import { Before, After, ITestCaseHookParameter, IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import { takeScreenshot } from '../utils/helpers';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  const isCI = process.env.CI === 'true';
  this.browser = await chromium.launch({ headless: isCI }); // Use headless mode in CI
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  await this.context.tracing.start({ screenshots: true, snapshots: true });
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const { result, pickle } = scenario;

  if (result?.status === 'FAILED' && this.page) {
    await takeScreenshot(this.page, `${Date.now()}-${pickle.name}`);
  }

  if (this.context?.tracing) {
    const traceName = new Date().toISOString().replace(/[:.]/g, '-') + `_${pickle.name}.zip`;
    await this.context.tracing.stop({ path: `traces/${traceName}` });
  }

  await this.context?.close();
  await this.browser?.close();
});
