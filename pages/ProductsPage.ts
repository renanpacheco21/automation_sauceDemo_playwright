import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
  }

  async verifyPageUrl() {
    await expect(this.page).toHaveURL('/inventory.html');
  }

  async verifyPageTitle(expectedTitle: string) {
    await expect(this.title).toContainText(expectedTitle);
  }
}

