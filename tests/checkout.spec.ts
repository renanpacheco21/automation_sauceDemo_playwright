import { test, expect, Page } from '@playwright/test';
import { generateCheckoutData } from '../helpers/faker-helper';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Finalização de compra', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    // Navega para a página de login e realiza login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verifica se foi redirecionado para a página de produtos
    await productsPage.verifyPageUrl();
  });

  // Helper function para adicionar produto ao carrinho
  async function addProductToCart(page: Page, productName: string, expectedBadgeCount: number) {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    
    await productsPage.addProductToCartByName(productName);
    await cartPage.verifyCartBadgeCount(expectedBadgeCount);
    
    return { productsPage, cartPage };
  }

  // Helper function para navegar até o checkout
  async function navigateToCheckout(page: Page, productName: string) {
    const { cartPage } = await addProductToCart(page, productName, 1);
    await cartPage.goto();
    await cartPage.verifyProductInCart(productName);
    await cartPage.clickCheckout();
    return cartPage;
  }

  // Helper function para finalizar compra completa
  async function completeCheckout(
    page: Page,
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    const checkoutPage = new CheckoutPage(page);
    
    // Preenche informações do checkout
    await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
    
    // Valida que os dados foram preenchidos corretamente
    await checkoutPage.verifyFilledInformation(firstName, lastName, postalCode);
    
    // Continua para o overview
    await checkoutPage.clickContinue();
    
    // Verifica o overview do checkout
    await checkoutPage.verifyCheckoutOverview();
    
    // Finaliza a compra
    await checkoutPage.clickFinish();
    
    // Valida que a compra foi finalizada com sucesso
    await checkoutPage.verifyOrderComplete();
    
    return checkoutPage;
  }

  test('deve validar campos obrigatórios no checkout', async ({ page }) => {
    const productName = 'Bike Light';
    
    // Navega até o checkout
    await navigateToCheckout(page, productName);
    
    const checkoutPage = new CheckoutPage(page);
    
    // Valida que os campos obrigatórios estão presentes
    await checkoutPage.verifyRequiredFields();
    
    // Tenta continuar sem preencher os campos
    await checkoutPage.tryContinueWithoutFillingFields();
    
    // Valida mensagem de erro
    await checkoutPage.verifyErrorMessage('First Name is required');
  });

  test('deve validar preenchimento dos campos do checkout', async ({ page }) => {
    const productName = 'Bike Light';
    const checkoutData = generateCheckoutData();
    
    // Navega até o checkout
    await navigateToCheckout(page, productName);
    
    const checkoutPage = new CheckoutPage(page);
    
    // Preenche informações com dados do Faker
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    
    // Valida que os dados foram preenchidos corretamente
    await checkoutPage.verifyFilledInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
  });

  test('deve finalizar a compra com sucesso', async ({ page }) => {
    const productName = 'Bike Light';
    const checkoutData = generateCheckoutData();
    
    // Navega até o checkout
    await navigateToCheckout(page, productName);
    
    // Finaliza a compra usando helper function
    await completeCheckout(
      page,
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
  });

  test('deve finalizar compra com múltiplos produtos', async ({ page }) => {
    const firstProduct = 'Bike Light';
    const secondProduct = 'Backpack';
    const checkoutData = generateCheckoutData();
    
    // Adiciona primeiro produto ao carrinho
    await addProductToCart(page, firstProduct, 1);
    
    // Adiciona segundo produto ao carrinho
    const { cartPage } = await addProductToCart(page, secondProduct, 2);
    
    // Navega para o carrinho
    await cartPage.goto();
    
    // Valida que ambos os produtos estão presentes
    await cartPage.verifyMultipleProductsInCart([firstProduct, secondProduct]);
    
    // Inicia o checkout
    await cartPage.clickCheckout();
    
    // Finaliza a compra usando helper function
    const checkoutPage = await completeCheckout(
      page,
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    
    // Volta para a página inicial
    await checkoutPage.clickBackHome();
    
    // Verifica que está na página de produtos
    const productsPage = new ProductsPage(page);
    await productsPage.verifyPageUrl();
  });
});

