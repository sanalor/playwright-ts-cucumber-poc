import { Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { takeScreenshot } from '../utils/helpers';
import { mkdirSync } from 'fs';
import path from 'path';

// Detectar si estamos en CI
const isCI = process.env.CI === 'true';

// Ruta para trazas
const tracesDir = 'traces';
mkdirSync(tracesDir, { recursive: true });

// Objeto exportado para compartir estado
export const playwright = {
  browser: null as Browser | null,
  context: null as BrowserContext | null,
  page: null as Page | null,
};

Before(async function ({ pickle }) {
  playwright.browser = await chromium.launch({
    headless: isCI,       // true en GitHub Actions, false en local
    slowMo: isCI ? 0 : 100, // ralentiza pasos en local para visualización
  });
  playwright.context = await playwright.browser.newContext();
  playwright.page = await playwright.context.newPage();

  await playwright.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
    title: pickle.name,
  });
});

After(async function ({ result, pickle }) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');

  if (playwright.context) {
    await playwright.context.tracing.stop({
      path: path.join(tracesDir, `${timestamp}_${scenarioName}.zip`),
    });
  }

  if (result?.status === 'FAILED' && playwright.page) {
    await takeScreenshot(playwright.page, `${timestamp}_${scenarioName}`, 'reports/failures');
  }

  await playwright.page?.close();
  await playwright.context?.close();
  await playwright.browser?.close();
});
