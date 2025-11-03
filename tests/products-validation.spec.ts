import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Validação de produtos', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    // Navega para a página de login e realiza login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verifica se foi redirecionado para a página de produtos
    await productsPage.verifyPageUrl();
  });

  test.skip('deve verificar que todos os produtos iniciam com "Sauce Labs"', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Obtém produtos que não começam com "Sauce Labs"
    const productsNotStartingWith = await productsPage.getProductsNotStartingWith('Sauce Labs');
    
    // Verifica se algum produto não começa com "Sauce Labs"
    if (productsNotStartingWith.length > 0) {
      throw new Error(
        `Os seguintes produtos não começam com "Sauce Labs": ${productsNotStartingWith.join(', ')}`
      );
    }
    
    // Verifica que todos os produtos começam com "Sauce Labs"
    await productsPage.verifyAllProductsStartWith('Sauce Labs');
  });

  test('deve verificar que a quantidade de produtos exibidos é igual a 6', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Verifica que a quantidade de produtos é exatamente 6
    await productsPage.verifyProductCount(6);
  });

  test('deve verificar que todos os produtos estão disponíveis para compra (botão "Add to cart" habilitado)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Verifica que todos os botões "Add to cart" estão habilitados e visíveis
    await productsPage.verifyAllAddToCartButtonsEnabled();
    
    // Verifica que a quantidade de botões corresponde à quantidade de produtos
    const buttonCount = await productsPage.getAddToCartButtonsCount();
    const productCount = await productsPage.getProductCount();
    expect(buttonCount).toBe(productCount);
  });
});

