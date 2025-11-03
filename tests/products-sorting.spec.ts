import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Validação de ordenação de produtos', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    // Navega para a página de login e realiza login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verifica se foi redirecionado para a página de produtos
    await productsPage.verifyPageUrl();
  });

  test('deve ordenar produtos por nome (A a Z)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Seleciona ordenação por nome (A a Z)
    await productsPage.selectSortOption('az');
    
    // Verifica se os produtos estão ordenados corretamente
    await productsPage.verifyProductsSortedByNameAscending();
  });

  test('deve ordenar produtos por nome (Z a A)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Seleciona ordenação por nome (Z a A)
    await productsPage.selectSortOption('za');
    
    // Verifica se os produtos estão ordenados corretamente
    await productsPage.verifyProductsSortedByNameDescending();
  });

  test('deve ordenar produtos por preço (menor para maior)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Seleciona ordenação por preço (menor para maior)
    await productsPage.selectSortOption('lohi');
    
    // Verifica se os produtos estão ordenados corretamente
    await productsPage.verifyProductsSortedByPriceAscending();
  });

  test('deve ordenar produtos por preço (maior para menor)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Seleciona ordenação por preço (maior para menor)
    await productsPage.selectSortOption('hilo');
    
    // Verifica se os produtos estão ordenados corretamente
    await productsPage.verifyProductsSortedByPriceDescending();
  });

  test('deve verificar que o dropdown de ordenação está visível', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Verifica se o dropdown de ordenação está visível
    await expect(productsPage.sortDropdown).toBeVisible();
  });

  test('deve verificar que todos os produtos têm preço', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    
    // Obtém todos os preços
    const prices = await productsPage.getAllProductPrices();
    const productNames = await productsPage.getAllProductNames();
    
    // Verifica que o número de preços corresponde ao número de produtos
    expect(prices.length).toBe(productNames.length);
    
    // Verifica que todos os preços são válidos (maiores que 0)
    prices.forEach((price, index) => {
      expect(price).toBeGreaterThan(0);
    });
  });
});

