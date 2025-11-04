import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product_sort_container"], select.product_sort_container').first();
    this.addToCartButtons = page.locator('button[data-test*="add-to-cart"], button:has-text("Add to cart")');
  }

  async verifyPageUrl() {
    await expect(this.page).toHaveURL('/inventory.html');
  }

  async verifyPageTitle(expectedTitle: string) {
    await expect(this.title).toContainText(expectedTitle);
  }

  async getAllProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productNames.count();
    
    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  async verifyAllProductsStartWith(expectedPrefix: string) {
    const productNames = await this.getAllProductNames();
    
    expect(productNames.length).toBeGreaterThan(0);
    
    // Identifica produtos que não começam com o prefixo esperado
    const productsNotStartingWith = productNames.filter(
      (name) => !name.match(new RegExp(`^${expectedPrefix}`, 'i'))
    );
    
    // Se houver produtos que não começam com o prefixo, falha o teste
    if (productsNotStartingWith.length > 0) {
      throw new Error(
        `Encontrados ${productsNotStartingWith.length} produto(s) que não começam com "${expectedPrefix}": ${productsNotStartingWith.join(', ')}`
      );
    }
    
    // Verifica que todos os produtos começam com o prefixo
    for (const productName of productNames) {
      expect(productName).toMatch(new RegExp(`^${expectedPrefix}`, 'i'));
    }
  }

  async getProductsNotStartingWith(expectedPrefix: string): Promise<string[]> {
    const productNames = await this.getAllProductNames();
    return productNames.filter(
      (name) => !name.match(new RegExp(`^${expectedPrefix}`, 'i'))
    );
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async verifyProductCount(expectedCount: number) {
    const count = await this.getProductCount();
    expect(count).toBe(expectedCount);
  }

  async verifyAllAddToCartButtonsEnabled() {
    const buttonCount = await this.addToCartButtons.count();
    
    // Verifica que existem botões
    expect(buttonCount).toBeGreaterThan(0);
    
    // Verifica que todos os botões estão habilitados
    for (let i = 0; i < buttonCount; i++) {
      const button = this.addToCartButtons.nth(i);
      await expect(button).toBeEnabled();
      await expect(button).toBeVisible();
    }
  }

  async getAddToCartButtonsCount(): Promise<number> {
    return await this.addToCartButtons.count();
  }

  async addProductToCartByName(productName: string) {
    // Encontra o produto pelo nome
    const productItem = this.productItems.filter({ hasText: productName }).first();
    
    // Verifica se o produto foi encontrado
    await expect(productItem).toBeVisible();
    
    // Encontra e clica no botão "Add to cart" do produto
    const addToCartButton = productItem.locator('button[data-test*="add-to-cart"]');
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
  }

  async getProductPriceByName(productName: string): Promise<number> {
    // Encontra o produto pelo nome
    const productItem = this.productItems.filter({ hasText: productName }).first();
    await expect(productItem).toBeVisible();
    
    // Obtém o preço do produto
    const priceText = await productItem.locator('.inventory_item_price').textContent();
    if (priceText) {
      const price = parseFloat(priceText.replace('$', '').trim());
      return price;
    }
    throw new Error(`Preço não encontrado para o produto: ${productName}`);
  }

  async getAllProductPrices(): Promise<number[]> {
    const prices: number[] = [];
    const count = await this.productPrices.count();
    
    for (let i = 0; i < count; i++) {
      const priceText = await this.productPrices.nth(i).textContent();
      if (priceText) {
        // Remove o símbolo $ e converte para número
        const price = parseFloat(priceText.replace('$', '').trim());
        if (!isNaN(price)) {
          prices.push(price);
        }
      }
    }
    
    return prices;
  }

  async selectSortOption(optionValue: string) {
    // Aguarda o dropdown estar visível e habilitado
    await expect(this.sortDropdown).toBeVisible();
    await expect(this.sortDropdown).toBeEnabled();
    
    // Seleciona a opção pelo valor (sem objeto wrapper)
    await this.sortDropdown.selectOption(optionValue);
    
    // Aguarda um momento para a ordenação ser aplicada
    await this.page.waitForTimeout(1000);
  }

  async verifyProductsSortedByNameAscending() {
    const productNames = await this.getAllProductNames();
    const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
    expect(productNames).toEqual(sortedNames);
  }

  async verifyProductsSortedByNameDescending() {
    const productNames = await this.getAllProductNames();
    const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
    expect(productNames).toEqual(sortedNames);
  }

  async verifyProductsSortedByPriceAscending() {
    const prices = await this.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  }

  async verifyProductsSortedByPriceDescending() {
    const prices = await this.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  }
}

