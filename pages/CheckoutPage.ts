import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly checkoutTitle: Locator;
  readonly checkoutSummary: Locator;
  readonly completeHeader: Locator;
  readonly completeMessage: Locator;
  readonly backHomeButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.checkoutTitle = page.locator('.title');
    this.checkoutSummary = page.locator('.summary_info');
    this.completeHeader = page.locator('.complete-header');
    this.completeMessage = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"], button:has-text("Back Home")');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await expect(this.page).toHaveURL(/.*checkout.*/);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async verifyFilledInformation(firstName: string, lastName: string, postalCode: string) {
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.postalCodeInput).toHaveValue(postalCode);
  }

  async verifyRequiredFields() {
    // Verifica que os campos estão visíveis e habilitados
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.firstNameInput).toBeEnabled();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeEnabled();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.postalCodeInput).toBeEnabled();
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async tryContinueWithoutFillingFields() {
    await this.continueButton.click();
  }

  async clickContinue() {
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
    // Aguarda navegar para a página de overview
    await expect(this.page).toHaveURL(/.*checkout-step-two.*/);
  }

  async verifyCheckoutOverview() {
    await expect(this.checkoutTitle).toBeVisible();
    await expect(this.checkoutSummary).toBeVisible();
  }

  async clickFinish() {
    await expect(this.finishButton).toBeVisible();
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
    // Aguarda navegar para a página de confirmação
    await expect(this.page).toHaveURL(/.*checkout-complete.*/);
  }

  async verifyOrderComplete() {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toContainText('Thank you for your order!');
    await expect(this.completeMessage).toBeVisible();
  }

  async clickBackHome() {
    await expect(this.backHomeButton).toBeVisible();
    await expect(this.backHomeButton).toBeEnabled();
    await this.backHomeButton.click();
    // Aguarda retornar para a página de produtos
    await expect(this.page).toHaveURL(/.*inventory.*/);
  }
}

