# 🧪 Automação de Testes - SauceDemo com Playwright

Projeto de testes automatizados end-to-end (E2E) para o site [SauceDemo](https://www.saucedemo.com/) utilizando Playwright e TypeScript.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Executando os Testes](#executando-os-testes)
- [Scripts NPM](#scripts-npm)
- [GitHub Actions](#github-actions)
- [Configuração](#configuração)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão LTS recomendada)
- **npm** (geralmente vem com o Node.js)

Para verificar se estão instalados:

```bash
node --version
npm --version
```

## 📦 Instalação

1. **Clone o repositório** (se aplicável):

```bash
git clone <url-do-repositorio>
cd automation_sauceDemo_playwright
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Instale os navegadores do Playwright**:

```bash
npx playwright install
```

> **Nota:** O comando acima instala os navegadores Chromium, Firefox e WebKit necessários para executar os testes.

## 📁 Estrutura do Projeto

```
automation_sauceDemo_playwright/
│
├── pages/                          # Page Object Model (POM)
│   ├── LoginPage.ts               # Página de login
│   └── ProductsPage.ts            # Página de produtos
│
├── tests/                          # Arquivos de teste
│   └── login-validation.spec.ts   # Testes de validação de login
│
├── .github/
│   └── workflows/
│       └── playwright.yml         # Configuração do GitHub Actions
│
├── playwright.config.ts           # Configuração do Playwright
├── package.json                    # Dependências do projeto
└── README.md                       # Este arquivo
```

### 📚 Padrão Page Object Model (POM)

O projeto utiliza o padrão **Page Object Model** para melhor organização e manutenibilidade do código:

- **`pages/LoginPage.ts`**: Encapsula todos os elementos e ações da página de login
- **`pages/ProductsPage.ts`**: Encapsula elementos e validações da página de produtos

Este padrão facilita a manutenção dos testes, centralizando os seletores e ações em classes reutilizáveis.

## 🚀 Executando os Testes

### Executar todos os testes

```bash
npx playwright test
```

### Executar um arquivo de teste específico

```bash
npx playwright test tests/login-validation.spec.ts
```

### Executar um teste específico

```bash
npx playwright test tests/login-validation.spec.ts -g "deve realizar login com sucesso"
```

### Executar em modo interativo (UI Mode)

```bash
npx playwright test --ui
```

### Executar em modo headed (com navegador visível)

Por padrão, os testes rodam em modo headless. Para ver o navegador durante a execução, use:

```bash
npx playwright test --headed
```

### Executar em um navegador específico

```bash
# Chromium (padrão)
npx playwright test --project=chromium

# Firefox
npx playwright test --project=firefox

# WebKit (Safari)
npx playwright test --project=webkit
```

### Gerar e visualizar relatório HTML

Após executar os testes, você pode visualizar o relatório:

```bash
npx playwright show-report
```

## 📦 Scripts NPM

O projeto possui scripts configurados no `package.json` para facilitar a execução de comandos comuns:

### Visualizar relatório HTML

Para visualizar o relatório HTML dos testes executados:

```bash
npm run report
```

Este comando é equivalente a `npx playwright show-report` e abre o relatório HTML no navegador padrão.

> **Nota:** Certifique-se de ter executado os testes antes (`npx playwright test`) para que o relatório esteja disponível.

## 🔄 GitHub Actions

O projeto está configurado para executar os testes automaticamente no **GitHub Actions** sempre que:

- Houver push para as branches `main` ou `master`
- Houver criação de Pull Request para `main` ou `master`

### Workflow configurado

O workflow (`.github/workflows/playwright.yml`) realiza as seguintes etapas:

1. ✅ Faz checkout do código
2. ✅ Configura Node.js (versão LTS)
3. ✅ Instala as dependências (`npm ci`)
4. ✅ Instala os navegadores do Playwright
5. ✅ Executa os testes
6. ✅ Faz upload do relatório HTML como artifact (disponível por 30 dias)

### Visualizar resultados no GitHub

1. Acesse a aba **Actions** no repositório
2. Clique na execução do workflow desejado
3. Baixe o artifact `playwright-report` para visualizar o relatório completo

## ⚙️ Configuração

### playwright.config.ts

Principais configurações:

- **baseURL**: `https://www.saucedemo.com` - URL base dos testes
- **testDir**: `./tests` - Diretório onde estão os testes
- **reporter**: `html` - Gera relatório HTML
- **workers**: Configurável (padrão: 1 para evitar conflitos)

### Modificar configurações

Edite o arquivo `playwright.config.ts` para ajustar:

- Navegadores a serem testados
- Timeout dos testes
- Configurações de retry
- Modo headless/headed

## 📝 Testes Implementados

### Validação de Mensagens de Erro no Login

1. ✅ **Login sem username**: Valida mensagem "Username is required"
2. ✅ **Login sem senha**: Valida mensagem "Password is required"
3. ✅ **Login com credenciais incorretas**: Valida mensagem de erro apropriada

### Login com Sucesso

4. ✅ **Login válido**: Valida redirecionamento para página de produtos e exibição do título

## 🛠️ Tecnologias Utilizadas

- **[Playwright](https://playwright.dev/)**: Framework de automação de testes
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem de programação
- **[Node.js](https://nodejs.org/)**: Ambiente de execução
- **[GitHub Actions](https://github.com/features/actions)**: CI/CD

## 📖 Documentação Adicional

- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

