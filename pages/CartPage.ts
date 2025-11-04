import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('.shopping_cart_link, a[href*="cart"]');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"], button:has-text("Continue Shopping"), a:has-text("Continue Shopping")');
  }

  async goto() {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(/.*cart.*/);
  }

  async verifyProductInCart(productName: string) {
    const productItem = this.cartItems.filter({ hasText: productName }).first();
    await expect(productItem).toBeVisible();
  }

  async getProductPriceInCart(productName: string): Promise<number> {
    // Encontra o item do carrinho pelo nome
    const cartItem = this.cartItems.filter({ hasText: productName }).first();
    await expect(cartItem).toBeVisible();
    
    // Obtém o preço do item no carrinho
    const priceText = await cartItem.locator('.inventory_item_price').textContent();
    if (priceText) {
      const price = parseFloat(priceText.replace('$', '').trim());
      return price;
    }
    throw new Error(`Preço não encontrado no carrinho para o produto: ${productName}`);
  }

  async verifyProductPriceInCart(productName: string, expectedPrice: number) {
    const actualPrice = await this.getProductPriceInCart(productName);
    expect(actualPrice).toBe(expectedPrice);
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async verifyCartBadgeCount(expectedCount: number) {
    if (expectedCount > 0) {
      await expect(this.cartBadge).toBeVisible();
      const badgeText = await this.cartBadge.textContent();
      const count = parseInt(badgeText || '0', 10);
      expect(count).toBe(expectedCount);
    } else {
      // Se o count for 0, o badge não deve estar visível
      await expect(this.cartBadge).not.toBeVisible();
    }
  }

  async removeProductFromCart(productName: string) {
    // Encontra o item do carrinho pelo nome
    const cartItem = this.cartItems.filter({ hasText: productName }).first();
    await expect(cartItem).toBeVisible();
    
    // Encontra e clica no botão "Remove" do item
    const removeButton = cartItem.locator('button[data-test*="remove"], button:has-text("Remove")');
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toBeEnabled();
    await removeButton.click();
  }

  async verifyProductNotInCart(productName: string) {
    // Verifica que o produto não está mais no carrinho
    const productItem = this.cartItems.filter({ hasText: productName });
    await expect(productItem).toHaveCount(0);
  }

  async verifyCartIsEmpty() {
    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(0);
  }

  async clickContinueShopping() {
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeEnabled();
    await this.continueShoppingButton.click();
    // Aguarda retornar para a página de produtos
    await expect(this.page).toHaveURL(/.*inventory.*/);
  }

  async verifyMultipleProductsInCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.verifyProductInCart(productName);
    }
  }

  async clickCheckout() {
    const checkoutButton = this.page.locator('[data-test="checkout"], button:has-text("Checkout")');
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();
    // Aguarda navegar para a página de checkout
    await expect(this.page).toHaveURL(/.*checkout-step-one.*/);
  }
}

