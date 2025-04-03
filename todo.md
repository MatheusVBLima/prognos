# TODO: Google Trends SaaS - Plano de Implementação

## 1. Setup Inicial
- [ ] Configurar Supabase
  - [ ] Criar projeto
  - [ ] Configurar autenticação
  - [ ] Configurar variáveis de ambiente
  - [ ] Instalar dependências (@supabase/supabase-js)
- [x] Configurar Puppeteer
  - [x] Instalar puppeteer
  - [x] Configurar para ambiente serverless
- [x] Adicionar dependências faltantes
  - [ ] @tanstack/react-query
  - [ ] date-fns
  - [ ] zod (validação)
  - [x] sonner (notificações)

## 2. Banco de Dados (Supabase)

### Estrutura de Tabelas
- [ ] users (gerenciada pelo Supabase Auth)
  ```sql
  -- Extensões da tabela auth.users
  subscription_status: string
  preferences: jsonb
  ```

- [ ] trend_data
  ```sql
  id: uuid primary key
  timestamp: timestamptz
  region: text
  category: text
  trends: jsonb
  search_volume: int
  related_queries: jsonb[]
  status: text
  ```

- [ ] search_history
  ```sql
  id: uuid primary key
  user_id: uuid references auth.users
  query_params: jsonb
  timestamp: timestamptz
  results_count: int
  ```

## 3. Servidor Central de Scraping

### Setup do Servidor (/app/api/cron)
- [x] Implementar endpoint para scraping agendado
- [ ] Configurar sistema de agendamento (Vercel Cron)
- [x] Sistema de validação de dados
- [x] Sistema de cache
- [x] Tratamento de erros e retry

### Funcionalidades do Scraping
- [x] Implementar puppeteer para Google Trends
  - [ ] Login handling (se necessário)
  - [x] Navegação e coleta de dados
  - [x] Parser dos resultados
  - [x] Sistema de retry

## 4. Frontend

### Componentes UI (/src/components)
- [x] Layout principal
  - [x] Navbar
  - [x] Sidebar
  - [x] Footer
- [x] Componentes de Dados
  - [x] TrendCard
  - [x] TrendChart
  - [x] SearchFilters
  - [ ] RegionSelector
- [x] Componentes de Feedback
  - [x] LoadingState
  - [x] ErrorBoundary
  - [x] Toast notifications (usando Sonner)

### Páginas (/src/app)
- [x] / (landing page)
- [x] /dashboard
  - [x] Visão geral das tendências
  - [x] Filtros e pesquisa
  - [x] Histórico
  - [x] Configurações
- [x] /history
- [x] /test (página de teste inicial)

## 5. API Routes (/app/api)

### Endpoints
- [x] /api/trends
  - [x] GET: buscar tendências
  - [x] POST: forçar atualização
- [x] /api/preferences
  - [x] GET: buscar preferências
  - [x] PUT: atualizar preferências
- [x] /api/history
  - [x] GET: histórico de buscas

## 6. Otimizações

### Performance
- [ ] Implementar cache no Edge
- [ ] Otimizar carregamento de componentes
- [ ] Implementar ISR para páginas estáticas
- [ ] Configurar Suspense boundaries

### Monitoramento
- [ ] Setup de logs
- [ ] Monitoramento de performance
- [ ] Alertas de falhas
- [ ] Analytics

## 7. Features Premium

### Funcionalidades
- [ ] Sistema de notificações (real-time)
- [ ] Análise comparativa
- [ ] Relatórios personalizados

## 8. Deploy

### Configuração
- [ ] Setup na Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Configurar domínio
- [ ] Monitoramento pós-deploy

## Notas de Implementação:
1. Usar Server Actions do Next.js para operações do servidor
2. Implementar rate limiting para proteção da API
3. Manter dados sensíveis em variáveis de ambiente
4. Seguir padrões do Next.js 14 (Server Components, etc)
5. Implementar error boundaries em componentes críticos

## Componentes UI

- [x] Layout Principal
  - [x] Navbar
  - [x] Sidebar
  - [x] Footer
- [x] TrendChart
- [x] SearchFilters
- [ ] RegionSelector
- [x] DataTable

## Páginas

- [x] Landing Page
- [x] Dashboard
  - [x] Visão geral das tendências
  - [x] Filtros e pesquisa
  - [x] Histórico
  - [x] Configurações
- [ ] Trends por Região
- [ ] Autenticação
  - [ ] Login
  - [ ] Registro
  - [ ] Recuperação de Senha

## Backend

- [x] API Routes
  - [ ] Autenticação
  - [x] Trends
  - [ ] Regiões
- [ ] Banco de Dados
  - [ ] Schema
  - [ ] Migrations
  - [ ] Seeds

## Infraestrutura

- [ ] Deploy
- [ ] CI/CD
- [ ] Monitoramento
- [ ] Logs 