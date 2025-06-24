import { Given, When, Then } from '@cucumber/cucumber';
import { DuckDuckGoPage } from '../../pages/DuckDuckGoPage';
import { playwright } from '../hooks';

let ddg: DuckDuckGoPage;

Given('I open the browser and go to DuckDuckGo', async () => {
  ddg = new DuckDuckGoPage(playwright.page!);  // usamos non-null assertion porque el hook garantiza que estará definido
  await ddg.navigate();
});

When('I search for {string}', async (query: string) => {
  await ddg.search(query);
});

Then('I should see {string} in the results', async (expected: string) => {
  const visible = await ddg.isResultVisible(expected);
  if (!visible) throw new Error(`Expected "${expected}" not found in results`);
});
