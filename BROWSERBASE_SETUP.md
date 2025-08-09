# Configuração do Browserbase

Para usar a funcionalidade de scraping em tempo real do Google Trends, você precisa configurar o Browserbase.

## 1. Criar conta no Browserbase

1. Acesse [https://browserbase.com](https://browserbase.com)
2. Crie uma conta gratuita
3. Obtenha sua API Key e Project ID

## 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto e adicione:

```env
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here
```

## 3. Como funciona

- **Toggle "Dados Reais"**: No dashboard, você pode alternar entre dados reais (scraped do Google Trends) e dados estáticos
- **Dados Reais (ON)**: Usa o Browserbase para fazer scraping ao vivo do Google Trends
- **Dados Estáticos (OFF)**: Usa dados de exemplo para demonstração

## 4. Funcionalidades

✅ **Scraping do Google Trends por país**
✅ **Pesquisa de contexto para cada tendência**
✅ **Dados estruturados com descrição e hints**
✅ **Fallback automático para dados estáticos em caso de erro**
✅ **Interface visual para alternar entre modos**

## 5. Limitações

- O scraping pode levar alguns segundos
- Sujeito aos limites da conta Browserbase
- Alguns países podem ter estruturas HTML diferentes

## 6. Troubleshooting

Se você encontrar erros:
1. Verifique se as variáveis de ambiente estão configuradas
2. Confirme que sua conta Browserbase está ativa
3. Use o modo "Dados Estáticos" como fallback
4. Verifique os logs do console para detalhes do erro 