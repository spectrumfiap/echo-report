# 📢 Echo Report - Plataforma Colaborativa de Alertas e Informações Comunitárias (Frontend) 🌍

## 📜 Índice
1.  [🌟 Visão Geral do Projeto](#1-visão-geral-do-projeto)
2.  [✨ Funcionalidades Implementadas](#2-funcionalidades-implementadas)
    * [🌐 Públicas](#públicas)
    * [⚙️ Área do Colaborador (Admin)](#área-do-colaborador-admin)
3.  [💻 Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4.  [📋 Pré-requisitos](#4-pré-requisitos)
5.  [🛠️ Configuração do Ambiente](#5-configuração-do-ambiente)
6.  [🚀 Como Rodar o Projeto](#6-como-rodar-o-projeto)
7.  [📁 Estrutura de Pastas (Principais)](#7-estrutura-de-pastas-principais)
8.  [🎨 Estilização](#8-estilização)
    * [🖌️ Tailwind CSS](#tailwind-css)
    * [🎨 Variáveis CSS Customizadas](#variáveis-css-customizadas)
    * [🖼️ Ícones (Heroicons)](#ícones-heroicons)
    * [🙂 Emojis](#emojis)
9.  [📡 Comunicação com Backend](#9-comunicação-com-backend)
10. [🧑‍💻 Autores](#10-autores)

### Link: https://echo-report-eight.vercel.app (O carregamento dos dados das páginas pode demorar devido o Render, por favor, tenha paciência 🙏)
---

## 1. 🌟 Visão Geral do Projeto

O Echo Report é uma plataforma web projetada para fortalecer a comunicação e a segurança comunitária através do reporte colaborativo de ocorrências, visualização de alertas oficiais, informações sobre abrigos e um mapa interativo de riscos. O sistema visa conectar cidadãos, administradores da plataforma e, potencialmente, órgãos como a Defesa Civil, para uma resposta mais rápida e eficiente a diversos eventos e perigos.

**🎯 Objetivos Principais:**
* Permitir que usuários reportem ocorrências em tempo real.
* Disponibilizar um mapa interativo com zonas de risco, alertas e abrigos.
* Oferecer uma interface administrativa para gerenciamento de usuários, alertas, abrigos, reportes e zonas de risco.
* Facilitar o acesso a informações cruciais para a segurança da comunidade.

**👥 Público-Alvo:**
* **Cidadãos:** Podem visualizar informações, alertas, mapa interativo, reportar ocorrências e se registrar para funcionalidades personalizadas.
* **Administradores da Plataforma:** Gerenciam todo o conteúdo, usuários e configurações do sistema.
* **(Potencial) Órgãos Públicos (Defesa Civil, etc.):** Podem consumir informações e emitir alertas oficiais.

---

## 2. ✨ Funcionalidades Implementadas

### 🌐 Públicas

* **🏠 Página Inicial (`/`)**: Apresentação da plataforma.
* **🗺️ Mapa Interativo (`/mapa`):**
    * Visualização de zonas de risco predefinidas (oficiais) com diferentes níveis (alto, medio, baixo) e cores correspondentes.
    * Visualização de reportes da comunidade (após aprovação/verificação do admin) como zonas no mapa, com geocodificação de endereços.
    * InfoWindow com detalhes ao clicar em uma zona de risco ou reporte (incluindo tipo de evento formatado e indicação "(Reporte Comunitário)").
    * Filtro para exibir zonas por nível de risco (com indicadores visuais de cor/emoji nas opções).
    * Funcionalidade de cálculo de rotas entre dois pontos.
    * Aviso visual/textual se a rota calculada cruza uma zona de risco.
    * Legenda explicativa dos níveis de risco e suas cores.
* **📢 Página de Alertas (`/alertas`):**
    * Listagem de alertas oficiais emitidos por administradores, buscando dados da API.
    * Exibição de detalhes como título, descrição, severidade, fonte, data.
* **🏠 Página de Abrigos (`/abrigos`):**
    * Listagem de abrigos e pontos de apoio disponíveis, buscando dados da API.
    * Exibição de informações detalhadas: nome, endereço, capacidade, serviços, contato, etc.
* **✍️ Reportar Ocorrência (`/reportar`):**
    * Formulário para usuários submeterem reportes de eventos ou riscos, com envio para API.
    * Campos: tipo de evento, localização (texto), descrição detalhada.
    * Opção de anexar imagem (upload `multipart/form-data`).
    * Permite reporte anônimo (se o nome não for preenchido e o usuário não estiver logado, é enviado como "Anônimo").
    * Se o usuário estiver logado, o nome é preenchido automaticamente.
    * Redirecionamento para a página inicial após submissão bem-sucedida.
* **📝 Registro de Usuário (`/registro`):**
    * Formulário para novos usuários criarem uma conta, com envio para API.
    * Campos: nome, email, senha, confirmação de senha.
    * Opções para definir preferências de localização e tipos de alerta a serem recebidos.
    * Após registro bem-sucedido, realiza o login automático do usuário (chamando a API de login) e redireciona.
* **🔑 Login de Usuário (`/login`):**
    * Formulário para usuários e administradores acessarem suas contas via API.
    * Login de administrador (a lógica de admin no `AuthContext` tem um fallback local, mas o login principal é apenas via API).

### ⚙️ Área do Colaborador (Admin)

## ⚠️⚠️⚠️ IMPORTANTE
### **PARA LOGAR COMO ADMIN, na página de login: E-mail: admin@echoreport.com Senha: admin**

* **🛡️ Autenticação e Proteção de Rotas:**
    * Verificação de `isAuthenticated` e `isAdmin` do `AuthContext` para proteger as rotas.
    * Redirecionamento para `/login` se não autenticado, ou para `/` se autenticado mas não for admin.
* **👤 Gerenciar Usuários (`/colaborador/usuarios`):**
    * Listagem de todos os usuários cadastrados (via API).
    * CRUD completo (Criar, Visualizar, Editar, Deletar) para usuários através de um modal na própria página, com chamadas à API.
* **🔔 Gerenciar Alertas (`/colaborador/alertas`):**
    * Listagem de todos os alertas oficiais (via API).
    * CRUD completo (Criar, Visualizar, Editar, Deletar) para alertas através de um modal, com chamadas à API.
    * Funcionalidade de "Enviar Agora" (modifica status e `publishedAt` via API).
* **🏘️ Gerenciar Abrigos (`/colaborador/abrigos`):**
    * Listagem de todos os abrigos cadastrados (via API).
    * CRUD completo (Criar, Visualizar, Editar, Deletar) para abrigos através de um modal, com chamadas à API.
* **📑 Gerenciar Reportes da Comunidade (`/colaborador/reportes`):**
    * Listagem de todos os reportes enviados por usuários (via API).
    * Visualização dos detalhes de cada reporte em um modal, incluindo imagem.
    * **Moderação de Reportes:**
        * Alteração do `status` do reporte (novo, verificado, em atendimento, resolvido, falso positivo) através de botões de ação rápida na tabela ou no modal (via API `PUT`).
        * Edição da `severity` (severidade avaliada pelo admin) e `adminNotes` (notas do administrador) no modal (via API `PUT`).
    * Remoção de reportes (via API `DELETE`).
    * Botão para "Adicionar Reporte (Admin)": Abre modal para admin criar um reporte.
* **📍 Gerenciar Zonas de Risco Oficiais (`/colaborador/mapas`):**
    * Listagem de todas as zonas de risco oficiais (entidades `Mapa`, via API `GET /mapas`).
    * CRUD completo (Criar, Visualizar, Editar, Deletar) para zonas de risco através de um modal, com chamadas à API.

---

## 3. 💻 Tecnologias Utilizadas

* **Next.js (v13+ com App Router):** Framework React para SSR, SSG, e funcionalidades modernas de desenvolvimento web.
* **React (v18+):** Biblioteca JavaScript para construção de interfaces de usuário.
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
* **Tailwind CSS:** Framework CSS utility-first para estilização.
* **`@react-google-maps/api`:** Biblioteca para integração com a API do Google Maps no React.
* **Heroicons:** Biblioteca de ícones SVG.
* **`fetch` API:** Para chamadas HTTP ao backend.
* **React Context API (`AuthContext`):** Para gerenciamento de estado de autenticação.

---

## 4. 📋 Pré-requisitos

* Node.js (versão 18.x ou superior).
* npm (v8+) ou yarn (v1.22+).
* Navegador web moderno.
* ⚠️ **Chave de API da Google Maps Platform:**
    * Essencial para o mapa e geocodificação.
    * APIs a serem ativadas: "Maps JavaScript API", "Geocoding API", "Directions API".

* 🚀 **Backend API Rodando:**
    * Dependência de uma API backend (Quarkus).
    * URL padrão: `http://localhost:8080`.
    * Requer header `X-API-Key: 1234` (configurado no frontend).

---

## 5. 🛠️ Configuração do Ambiente

1.  **Clone o Repositório (ou obtenha os arquivos):**
    ```bash
    # git clone https://github.com/spectrumfiap/echo-report

    # cd echo-report
    ```

2.  **Crie o Arquivo `.env.local`:**

    Na raiz do projeto, crie um arquivo chamado `.env.local`.

3.  **Adicione a minha Chave da API do Google Maps:**
    ```env
    NEXT_PUBLIC_Maps_API_KEY= SUA_CHAVE_AQUI
    ```

4.  **Instale as Dependências:**
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

---

## 6. 🚀 Como Rodar o Projeto

1.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    ou
    ```bash
    yarn dev
    ```

2.  **Acesse no Navegador:**
    Abra [http://localhost:3000](http://localhost:3000).

    Lembre-se que a API backend (Quarkus) precisa estar rodando.

---

## 7. 📁 Estrutura de Pastas (Principais)

A estrutura de pastas segue as convenções do Next.js App Router, utilizando grupos de rotas como `(auth)` e `(pages)`:

```text
ECHO-REPORT/
├── .next/                      # Pasta de build do Next.js
├── node_modules/               # Dependências do projeto
├── public/
│   └── assets/                 # Arquivos públicos (imagens, fontes, etc.)
├── src/
│   ├── app/
│   │   ├── (auth)/             # Grupo de rotas para autenticação
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Página de Login
│   │   │   └── registro/
│   │   │       └── page.tsx    # Página de Registro
│   │   ├── (pages)/            # Grupo de rotas para páginas principais da aplicação
│   │   │   ├── colaborador/    # Área de Administração (Colaborador)
│   │   │   │   ├── abrigos/
│   │   │   │   │   └── page.tsx # Gerenciar Abrigos
│   │   │   │   ├── alertas/
│   │   │   │   │   └── page.tsx # Gerenciar Alertas
│   │   │   │   ├── mapas/
│   │   │   │   │   └── page.tsx # Gerenciar Zonas de Risco (Mapas)
│   │   │   │   ├── reportes/
│   │   │   │   │   └── page.tsx # Gerenciar Reportes
│   │   │   │   └── usuarios/
│   │   │   │       └── page.tsx # Gerenciar Usuários
│   │   │   ├── abrigos/
│   │   │   │   └── page.tsx    # Página pública de Abrigos
│   │   │   ├── alertas/
│   │   │   │   └── page.tsx    # Página pública de Alertas
│   │   │   ├── mapa/
│   │   │   │   └── page.tsx    # Página pública do Mapa Interativo
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx    # Página de Perfil do Usuário
│   │   │   ├── quem-somos/
│   │   │   │   └── page.tsx    # Página "Quem Somos"
│   │   │   └── reportar/
│   │   │       └── page.tsx    # Página pública para submeter Reportes
│   │   ├── blog/
│   │   │   ├── comunidade-resiliente-echo/         
│   │   │   │   └── page.tsx
│   │   │   ├── entendendo-riscos-ondas-calor/         
│   │   │   │   └── page.tsx 
│   │   │   ├── guia-preparacao-enchentes/         
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx        # Página de listagem do Blog
│   │   ├── layout.tsx          # Layout raiz para src/app/
│   │   └── page.tsx            # Página Inicial (Home) da aplicação (src/app/page.tsx)
│   ├── components/             # Componentes React reutilizáveis
│   │   ├── AnimatedSection.tsx
│   │   ├── ArticleLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── MapDisplay.tsx
│   │   ├── ReportForm.tsx
│   │   ├── ShelterCard.tsx
│   │   └── ThemeSwitcher.tsx   # (e outros componentes)
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexto de Autenticação
│   └── styles/
│       └── globals.css         # Estilos globais e variáveis CSS customizadas
├── .env.local                  # Variáveis de ambiente locais (NÃO COMITAR, deve estar no .gitignore)
├── .gitignore                  # Arquivos e pastas ignorados pelo Git
├── eslint.config.mjs           # Configuração do ESLint (formato .mjs)
├── next-env.d.ts               # Definições de tipo para o Next.js
├── next.config.ts              # Configurações do Next.js (formato .ts)
├── package-lock.json           # Lockfile do npm
├── package.json                # Metadados e dependências do projeto
├── postcss.config.mjs          # Configuração do PostCSS (formato .mjs)
└── README.md                   # Este arquivo
```

---

## 8. 🎨 Estilização

### 🖌️ Tailwind CSS
O projeto usa [Tailwind CSS](https://tailwindcss.com/) para estilização. As classes são aplicadas diretamente no JSX.

### 🎨 Variáveis CSS Customizadas
Definidas em `src/styles/globals.css` (ex: `:root { --brand-header-bg: #1A365D; }`).
Exemplos:
* `--brand-header-bg`, `--brand-text-header`
* `--brand-text-primary`, `--brand-text-secondary`
* `--brand-card-background`
* `--alert-red`, `--alert-orange`, `--alert-yellow`, `--alert-blue`
* `--success-green`
* `--shadow-subtle`

### 🖼️ Ícones (Heroicons)
Da biblioteca [@heroicons/react](https://heroicons.com/), variante `outline` ou `solid`.
```tsx
import { UserCircleIcon } from '@heroicons/react/24/outline';
```
### 🙂 Emojis

Usados para indicadores visuais rápidos (ex: filtro do mapa, legenda).
🔴 Alto, 🟠 Médio, 🟡 Baixo


### 9. 📡 Comunicação com Backend
* fetch API para chamadas HTTP.

* URL base da API: http://localhost:8080 (constante API_BASE_URL).

* Autenticação da API: Header X-API-Key: 1234 (constante STATIC_API_KEY).

Tipos de Conteúdo: application/json para a maioria, multipart/form-data para envio de reportes com imagem.

### 10. 🧑‍💻 Autores

* **Arthur Thomas** - RM: 561061 - [GitHub](https://github.com/athomasmariano) - [LinkedIn](https://www.linkedin.com/in/arthur-thomas-941a97234/)
* **Luann Noqueli** - RM: 560313 - [GitHub](https://github.com/luannoq) - [LinkedIn](https://www.linkedin.com/in/luann-noqueli-60628a2b0/)
* **Jhonatta Lima** - RM: 560277 - [GitHub](https://github.com/JhonattaLimaSandesdeOLiveira) - [LinkedIn](https://www.linkedin.com/in/jhonatta-lima-732692332/)

*(Todos alunos da turma 1TDSPA FIAP)*

---