import { Page, Locator, expect } from '@playwright/test';
import { waitForVisibility } from '../utils/helpers';

export class DuckDuckGoPage {
  private page: Page;
  private searchInput: Locator;
  private resultLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = this.page.locator("//input[@id='searchbox_input']");
    this.resultLinks = this.page.locator("//a[@data-testid='result-extras-url-link']");
  }

  async navigate() {
    await this.page.goto('https://duckduckgo.com');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await waitForVisibility(this.resultLinks.first());
  }

  async isResultVisible(text: string): Promise<boolean> {
    const hrefs = await this.resultLinks.evaluateAll(elements =>
      elements.map(el => el.getAttribute('href'))
    );
    return hrefs.some(href => href?.includes(text));
  }
}