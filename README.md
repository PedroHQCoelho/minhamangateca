# 📚 Minha Mangateca

<p align="center">
  <strong>Organize sua coleção. Acompanhe cada volume. Planeje suas próximas leituras.</strong>
  <br />
  Uma aplicação web para quem gosta de colecionar mangás e quer manter tudo organizado em um só lugar.
</p>

<p align="center">
  <a href="https://minhamangateca.netlify.app/"><strong>🌐 Acessar aplicação</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/PedroHQCoelho/minhamangateca"><strong>Ver código-fonte</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
</p>

---

## ✨ Sobre o projeto

**Minha Mangateca** é uma aplicação web criada para ajudar leitores e colecionadores a gerir suas coleções de mangás. Com ela, é possível cadastrar obras, acompanhar individualmente os volumes adquiridos e faltantes, organizar uma lista de desejos e visualizar estatísticas da coleção.

O projecto foi pensado para oferecer uma experiência simples e intuitiva, com interface responsiva, temas claro e escuro e armazenamento local dos dados.

## 🖥️ Prévia da aplicação

### 1. Minha Mangateca — Visão geral

Conheça a proposta da aplicação: um espaço para organizar sua coleção de mangás, acompanhar volumes adquiridos e planejar suas próximas leituras.

<p align="center">
  <img src="docs/images/01-capa-readme-1280x640.png" alt="Apresentação da Minha Mangateca, com destaque para a organização e o acompanhamento de coleções de mangás" width="100%" />
</p>

### 2. Dashboard — Acompanhe sua coleção

Tenha uma visão geral da sua biblioteca com indicadores de coleções cadastradas, obras completas, coleções atualizadas, volumes adquiridos e volumes que ainda faltam. Consulte também os mangás adicionados recentemente.

<p align="center">
  <img src="docs/images/02-dashboard-escuro-2880x2000.png" alt="Dashboard da Minha Mangateca no tema escuro, com estatísticas da coleção e mangás adicionados recentemente" width="100%" />
</p>

### 3. Minha Coleção — Pesquise e organize seus mangás

Visualize todas as obras cadastradas em um só lugar. Pesquise por título, filtre por editora e status de publicação, escolha a ordenação dos resultados e acompanhe o progresso de cada coleção.

<p align="center">
  <img src="docs/images/03-minha-colecao-claro-2880x2500.png" alt="Página Minha Coleção no tema claro, com pesquisa, filtros, ordenação e cartões de mangás" width="100%" />
</p>

### 4. Detalhes do mangá — Controle volume por volume

Acesse a página de cada obra para consultar a editora, o total de volumes publicados, os exemplares adquiridos e os que ainda faltam. Altere o status de cada volume individualmente e acompanhe o progresso da coleção.

<p align="center">
  <img src="docs/images/04-detalhes-do-manga-2880x2500.png" alt="Página de detalhes de Berserk, com progresso da coleção e grade interativa de volumes adquiridos e faltantes" width="100%" />
</p>

### 5. Relatórios em PDF — Consulte os volumes faltantes

Gere um relatório com as obras que ainda possuem volumes pendentes. O documento reúne os títulos, as editoras e os números dos volumes faltantes, facilitando o planeamento das próximas aquisições.

<p align="center">
  <img src="docs/images/05-relatorio-em-pdf-2880x1620.png" alt="Prévia de relatório em PDF da Minha Mangateca, com a relação de mangás e volumes faltantes" width="100%" />
</p>

### 6. Experiência responsiva — Use em diferentes dispositivos

Acesse as principais funcionalidades também pelo celular. O layout adapta o dashboard, a lista de mangás e o acompanhamento dos volumes a telas menores, mantendo a navegação e o gerenciamento da coleção acessíveis.

<p align="center">
  <img src="docs/images/06-celulares-2880x1620.png" alt="Demonstração da interface responsiva da Minha Mangateca em telas de smartphones" width="100%" />
</p>

---

## 🚀 Funcionalidades

- **Gestão da coleção:** cadastre, edite, pesquise e organize seus mangás.
- **Acompanhamento de volumes:** marque individualmente os volumes como adquiridos ou faltantes.
- **Progresso da coleção:** acompanhe quantidades e percentuais de conclusão por obra.
- **Capas personalizadas:** adicione imagens para identificar visualmente seus mangás.
- **Lista de desejos:** mantenha uma lista de títulos que pretende adquirir.
- **Transferência para a coleção:** mova um item da lista de desejos para a coleção quando o adquirir.
- **Dashboard:** consulte estatísticas e veja suas coleções recentes.
- **Relatório em PDF:** gere um relatório dos volumes que ainda faltam.
- **Backup e restauração:** exporte seus dados e recupere a coleção posteriormente.
- **Tema claro e escuro:** escolha a aparência da interface.
- **Interface responsiva:** utilize a aplicação em diferentes tamanhos de ecrã.

## 🧰 Tecnologias

| Tecnologia | Utilização |
|---|---|
| React 19 | Construção da interface |
| Vite 8 | Ambiente de desenvolvimento e build |
| JavaScript | Lógica e interacções da aplicação |
| Tailwind CSS 4 | Estilização e responsividade |
| React Router | Navegação entre páginas |
| Lucide React | Ícones da interface |
| jsPDF | Geração de relatórios em PDF |
| LocalStorage | Armazenamento dos dados da colecção |
| IndexedDB | Armazenamento das imagens das capas |

## ⚙️ Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão compatível com as dependências do projecto)
- npm

### Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/PedroHQCoelho/minhamangateca.git
   ```

2. Aceda à pasta do projecto:

   ```bash
   cd minhamangateca
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra no navegador o endereço local indicado pelo Vite.

### Build de produção

Para gerar os ficheiros optimizados para publicação:

```bash
npm run build
```

## 💾 Como os dados são armazenados

A aplicação utiliza o armazenamento do próprio navegador:

- **LocalStorage:** informações dos mangás, volumes e lista de desejos.
- **IndexedDB:** imagens das capas.

**Importante:** os dados ficam guardados no navegador e no dispositivo em que a aplicação é utilizada. Não existe sincronização automática entre dispositivos ou armazenamento numa conta online. Para evitar perder a coleção, utilize regularmente a funcionalidade de backup e mantenha uma cópia do ficheiro exportado.

## 🗺️ Possíveis melhorias futuras

- Sincronização da coleção entre diferentes dispositivos.
- Catálogo de mangás integrado para facilitar os cadastros.
- Mais opções de estatísticas e filtros.
- Histórico de leitura e acompanhamento de séries.

## 👨‍💻 Autor

**Pedro Coelho** · Engenheiro de Computação e Front-End Developer.

- **Portfólio:** [pedrohqcoelho.netlify.app](https://pedrohqcoelho.netlify.app/)
- **GitHub:** [PedroHQCoelho](https://github.com/PedroHQCoelho)
- **Aplicação:** [minhamangateca.netlify.app](https://minhamangateca.netlify.app/)

---

<p align="center">
  Feito com ❤️ para quem ama mangás.
</p>
