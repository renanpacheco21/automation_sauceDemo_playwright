import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Validação de mensagens de erro no login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('deve exibir mensagem de erro ao submeter login sem username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Submete login apenas com senha
    await loginPage.loginWithOnlyPassword('secret_sauce');
    
    // Verifica mensagem de erro
    await loginPage.verifyErrorMessage('Username is required');
  });

  test('deve exibir mensagem de erro ao submeter login sem senha', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Submete login apenas com username
    await loginPage.loginWithOnlyUsername('standard_user');
    
    // Verifica mensagem de erro
    await loginPage.verifyErrorMessage('Password is required');
  });

  test('deve exibir mensagem de erro ao submeter login com username e senha incorretos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Submete login com credenciais incorretas
    await loginPage.login('usuario_incorreto', 'senha_incorreta');
    
    // Verifica mensagem de erro
    await loginPage.verifyErrorMessage('Username and password do not match any user in this service');
  });
});

test.describe('Login com sucesso', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('deve realizar login com sucesso e redirecionar para a página de produtos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    
    // Realiza login com credenciais corretas
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verifica redirecionamento e conteúdo da página de produtos
    await productsPage.verifyPageUrl();
    await productsPage.verifyPageTitle('Products');
  });
});
