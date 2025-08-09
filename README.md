# Prognos - Dashboard de Tendências

Um dashboard avançado para análise de tendências do Google Trends em tempo real, powered by **Browserbase** para web scraping inteligente.

## 🚀 Funcionalidades

- ✅ **Scraping em tempo real** do Google Trends via Browserbase
- ✅ **Análise por país** (Brasil, EUA, Reino Unido, Alemanha, etc.)
- ✅ **Contexto inteligente** para cada tendência via pesquisa automatizada
- ✅ **Interface moderna** com Next.js 15 + React 19
- ✅ **Dados estruturados** com descrições e insights
- ✅ **Dashboard interativo** com gráficos e filtros

## 📋 Pré-requisitos

1. **Node.js 18+**
2. **Conta no Browserbase** (gratuita)
3. **API Key do Browserbase**

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone <repo-url>
cd prognos
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Browserbase:**
```bash
# Crie o arquivo .env.local baseado no exemplo
# Adicione suas credenciais:
BROWSERBASE_API_KEY=your_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here
```

4. **Teste a configuração:**
```bash
npm run test:browserbase
```

5. **Inicie o servidor:**
```bash
npm run dev
```

## 🎯 Como Usar

1. Acesse [http://localhost:3000](http://localhost:3000)
2. Vá para o Dashboard de Tendências
3. **Selecione os filtros** (país, período, categoria)
4. **Clique em "Aplicar Filtros"**
5. **Aguarde** o scraping dos dados reais (alguns segundos)
6. **Explore** as tendências com contexto inteligente!

## 🔧 Configuração do Browserbase

Veja o arquivo `BROWSERBASE_SETUP.md` para instruções detalhadas sobre:
- Como criar conta no Browserbase
- Configurar variáveis de ambiente
- Troubleshooting comum

## 🏗️ Tecnologias

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de UI
- **Browserbase** - Web scraping infrastructure
- **Puppeteer** - Browser automation
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives

## 📚 API Routes

- `GET /api/trends` - Buscar tendências (com/sem Browserbase)
- `POST /api/trends/scrape` - Scraping direto via Browserbase

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando Browserbase para web scraping inteligente**
