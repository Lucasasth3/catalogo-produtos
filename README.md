# Catálogo de Produtos

SPA React do laboratório de componentes e consumo de API REST. A busca filtra por nome sem recarregar a página; o botão de cada cartão consulta os detalhes por ID.

## API usada

Este catálogo está configurado para a API em `D:\Desktop\entrega mongodb\lab-spring-mvc-concluido`. Ela utiliza Spring Boot e MongoDB e oferece `GET /api/produtos` e `GET /api/produtos/{id}`. O modelo atual devolve `id`, `nome` e `preco`; categoria e descrição são exibidas apenas quando a API as fornece.

Para executar essa API, configure `MONGODB_URI` no terminal conforme o `EXECUCAO.md` do projeto da API, defina `$env:PORT = '8081'` no PowerShell e rode `./mvnw.cmd spring-boot:run` na pasta dela. A porta 8080 está ocupada por outro serviço neste computador. A interface não cadastra produtos: se a coleção estiver vazia, crie ao menos um pela API existente para testar a lista e os detalhes.

## Rodar o catálogo

1. `npm install`
2. Confira `.env`: `VITE_API_URL=/api` e `VITE_API_PROXY_TARGET=http://localhost:8081`.
3. `npm run dev` e abra a URL indicada pelo Vite.

O proxy de desenvolvimento encaminha `/api` para o servidor Spring e evita problemas de CORS no navegador. Se a API estiver em outro endereço, altere `VITE_API_PROXY_TARGET` e reinicie o Vite. Para uma API de produção em outro domínio, use a URL absoluta em `VITE_API_URL` e configure CORS no servidor. Não coloque a URI do MongoDB no `.env` do React: ela pertence apenas ao back-end.

Para verificar o código: `npm test`, `npm run lint` e `npm run build`.

## Árvore de componentes

```text
App
├── Header
├── ProductSearch
├── ProductList
│   └── ProductCard (um por produto)
└── ProductDetails (quando um produto é selecionado)
```

## Fluxo dos dados

1. `App` inicia a consulta à API ao montar e guarda lista, carregamento e erro em estados.
2. `productsApi.js` faz `fetch`, verifica o status HTTP e valida os dados recebidos.
3. `App` passa o texto da busca e a função de alteração para `ProductSearch`.
4. O filtro por nome é calculado a partir da lista e do texto, sem um segundo estado.
5. `ProductList` recebe os produtos filtrados e cria os cartões com `map` e `key`.
6. Um clique em `ProductCard` envia o ID para `App` por uma função passada como prop.
7. `App` consulta `GET /api/produtos/{id}` e passa o resultado a `ProductDetails`.
8. Ao fechar ou trocar a seleção, o efeito anterior é cancelado com `AbortController`.
