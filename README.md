# Sourasso — Site de Cardápio e Pedidos

Site de cardápio digital e pedidos via WhatsApp para a pizzaria **Sourasso**.

## Funcionalidades

- Cardápio completo com categorias: Pizzas, Lanches, Porções e Bebidas
- Pizzas organizadas por subcategorias: Tradicionais, Especiais, Premium, Doces e Doces Especiais
- Imagens responsivas nos cards: versão mobile e versão desktop
- Seleção de tamanho, borda e observações por produto
- Carrinho com gerenciamento de quantidades
- Finalização de pedido via WhatsApp com resumo formatado
- Layout centralizado com largura máxima de 1280px

## Tecnologias

- [React 19](https://react.dev)
- [Vite 8](https://vite.dev)
- [Tailwind CSS 3](https://tailwindcss.com)
- [React Router 7](https://reactrouter.com)
- [Zustand 5](https://zustand-demo.pmnd.rs) — gerenciamento de estado do carrinho
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — testes

## Estrutura do projeto

```
src/
├── assets/          # Imagens dos produtos (mobile-view e pc-view)
├── components/      # Componentes reutilizáveis (ProductCard, CartItem, etc.)
├── data/            # JSON com dados de produtos e preços
├── pages/           # Páginas (Home, Cart, Contact)
├── store/           # Estado global com Zustand
└── utils/           # Utilitários (pizzaImages, whatsapp)
public/
└── favicon.png      # Ícone do site
```

## Dados dos produtos

Cada categoria tem seu próprio arquivo JSON em `src/data/`:

| Arquivo | Categoria |
|---|---|
| `pizzas.json` | Pizzas (agrupadas por subcategoria) |
| `lanches.json` | Lanches |
| `porcoes.json` | Porções |
| `bebidas.json` | Bebidas |

Produtos com imagens têm os campos `pcImage` e/ou `mobileImage` com o nome do arquivo (sem extensão) correspondente em `src/assets/`. Convenção de nomenclatura: `<sabor>-pc-view.png` e `<sabor>-mobile-view.png`.

## Imagens

As imagens são carregadas via `import.meta.glob` em `src/utils/pizzaImages.js`. Para adicionar imagens a um produto:

1. Adicione o arquivo em `src/assets/` seguindo a convenção de nomenclatura
2. Adicione o campo `pcImage` e/ou `mobileImage` ao item no JSON correspondente

## Comandos

```bash
npm install       # Instalar dependências
npm run dev       # Servidor de desenvolvimento (http://localhost:5173)
npm run build     # Build de produção
npm run preview   # Preview do build de produção
npm run test      # Rodar testes
npm run lint      # Lint com oxlint
```
