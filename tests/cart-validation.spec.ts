import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Validação de carrinho', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    // Navega para a página de login e realiza login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verifica se foi redirecionado para a página de produtos
    await productsPage.verifyPageUrl();
  });

  // Helper function para adicionar produto ao carrinho sem navegar para o carrinho
  async function addProductToCart(page: Page, productName: string, expectedBadgeCount: number) {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await productsPage.addProductToCartByName(productName);
    await cartPage.verifyCartBadgeCount(expectedBadgeCount);
    
    return { productsPage, cartPage };
  }

  // Helper function para adicionar produto ao carrinho e validar (navega para o carrinho)
  async function addProductToCartAndValidate(
    page: Page,
    productName: string,
    expectedItemCount: number = 1
  ) {
    const { productsPage, cartPage } = await addProductToCart(page, productName, expectedItemCount);
    
    // Navega para o carrinho
    await cartPage.goto();
    
    // Valida que o produto está presente no carrinho
    await cartPage.verifyProductInCart(productName);
    
    // Valida que há exatamente o número esperado de itens no carrinho
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(expectedItemCount);
    
    return { productsPage, cartPage };
  }

  test('deve adicionar produto "Bike Light" ao carrinho e validar presença e preço', async ({ page }) => {
    const productName = 'Bike Light';
    const expectedPrice = 9.99;
    
    // Adiciona produto ao carrinho e valida presença
    const { cartPage } = await addProductToCartAndValidate(page, productName);
    
    // Valida que o preço do produto no carrinho é 9.99
    await cartPage.verifyProductPriceInCart(productName, expectedPrice);
  });

  test('deve adicionar produto ao carrinho, remover e validar remoção', async ({ page }) => {
    const productName = 'Bike Light';
    
    // Adiciona produto ao carrinho e valida presença
    const { cartPage } = await addProductToCartAndValidate(page, productName);
    
    // Remove o produto do carrinho
    await cartPage.removeProductFromCart(productName);
    
    // Valida que o produto não está mais no carrinho
    await cartPage.verifyProductNotInCart(productName);
    
    // Valida que o carrinho está vazio
    await cartPage.verifyCartIsEmpty();
    
    // Valida que o badge do carrinho não está mais visível (carrinho vazio)
    await cartPage.verifyCartBadgeCount(0);
    
    // Valida que não há mais itens no carrinho
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });

  test('deve adicionar produto, continuar comprando, adicionar outro produto e validar ambos no carrinho', async ({ page }) => {
    const firstProduct = 'Bike Light';
    const secondProduct = 'Backpack';
    
    // Adiciona o primeiro produto ao carrinho e valida
    const { cartPage, productsPage } = await addProductToCartAndValidate(page, firstProduct, 1);
    
    // Clica em "Continue Shopping" para voltar à página de produtos
    await cartPage.clickContinueShopping();
    
    // Verifica que está na página de produtos
    await productsPage.verifyPageUrl();
    
    // Adiciona o segundo produto ao carrinho
    await addProductToCart(page, secondProduct, 2);
    
    // Navega para o carrinho novamente
    await cartPage.goto();
    
    // Valida que ambos os produtos estão presentes no carrinho
    await cartPage.verifyMultipleProductsInCart([firstProduct, secondProduct]);
    
    // Valida que há exatamente 2 itens no carrinho
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });
});

