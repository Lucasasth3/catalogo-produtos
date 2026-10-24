# Catálogo de Produtos

Atividade prática de React: aplicação de página única (SPA) para consultar produtos de uma API REST, pesquisar por nome e visualizar detalhes sem recarregar a página.

Repositório: https://github.com/Lucasasth3/catalogo-produtos

## Funcionalidades

- Listagem de produtos em cartões, com nome e preço em reais.
- Pesquisa por nome sem diferenciar letras maiúsculas e minúsculas.
- Contador de produtos encontrados e mensagem para buscas sem resultado.
- Consulta de detalhes pelo identificador e botão para fechar o painel.
- Estados de carregamento e erro nas consultas da lista e dos detalhes.
- Cancelamento de requisições com `AbortController` e manutenção do `StrictMode`.

Cadastro, edição, exclusão e rotas de navegação não fazem parte do escopo desta interface.

## Pré-requisitos

- Node.js e npm compatíveis com as dependências do projeto; verificado com Node.js 24.
- API REST de produtos em execução. A API usada nesta atividade é o projeto `lab-spring-mvc-concluido`, com Spring Boot e MongoDB Atlas.
- Para executar o back-end: JDK compatível com o projeto (Java 17 ou superior) e conexão válida com o MongoDB.

## Executar a API

O back-end é um projeto separado. Na pasta dele, configure as variáveis no terminal PowerShell e execute o Maven Wrapper:

```powershell
$env:MONGODB_URI = 'SUA_URI_DE_CONEXAO_DO_MONGODB_ATLAS'
$env:MONGODB_DB = 'lab-mvc'
$env:PORT = '8081'
.\mvnw.cmd spring-boot:run
```

Substitua o marcador pela conexão real, com as credenciais do usuário do banco. Caracteres especiais na senha devem ser codificados para URL. A URI do MongoDB pertence ao ambiente do back-end e não deve ser colocada nos arquivos do React ou no repositório.

A porta 8081 foi escolhida porque a 8080 estava ocupada no ambiente utilizado. Mantenha o terminal da API aberto.

### Contrato da API utilizada

| Método | Endpoint | Resposta |
| --- | --- | --- |
| GET | `/api/produtos` | Array de produtos |
| GET | `/api/produtos/{id}` | Um produto; HTTP 404 se não existir |

Exemplo de produto retornado:

```json
{ "id": "identificador-do-produto", "nome": "Teclado mecanico", "preco": 249.9 }
```

O modelo desta API contém `id`, `nome` e `preco`. A interface também suporta `categoria` e `descricao`, exibindo esses campos somente quando fornecidos. O contrato foi adaptado à API existente conforme a orientação do exercício.

Se a coleção estiver vazia, a API retorna `[]` e o catálogo mostra a mensagem de nenhum produto encontrado. Para preparar dados de teste, é possível usar o cadastro já existente na API: `POST /api/produtos`, com JSON como `{"nome":"Teclado mecanico","preco":249.9}`.

## Executar o catálogo

Na pasta deste projeto:

```powershell
npm install
npm run dev
```

Abra o endereço `Local` informado pelo Vite, normalmente `http://localhost:5173`. Mantenha este terminal e o da API abertos.

### Configuração da API no React

O arquivo `.env`, na mesma pasta de `package.json`, contém:

```dotenv
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8081
```

O serviço usa `VITE_API_URL` como base. Durante o desenvolvimento, o proxy do Vite encaminha `/api/produtos` para `http://localhost:8081/api/produtos`, evitando uma chamada entre origens diferentes no navegador. Para mudar o servidor, altere `VITE_API_PROXY_TARGET` e reinicie `npm run dev`.

Para utilizar uma API em outro domínio sem o proxy, defina `VITE_API_URL` com a URL absoluta, incluindo o prefixo `/api`, e configure CORS no servidor. O proxy descrito acima é uma configuração de desenvolvimento.

## Árvore de componentes

```text
App
├── Header
├── ProductSearch
├── ProductList
│   └── ProductCard (um por produto)
└── ProductDetails (quando um produto é selecionado)
```

Os componentes ficam em `src/Components`; o acesso HTTP fica em `src/services/productsApi.js`. O arquivo `src/Data/products.js` mantém os exemplos locais da primeira parte do laboratório; a versão final consulta os dados da API.

## Fluxo dos dados

1. `App` guarda os estados da lista, da pesquisa e do produto selecionado, além de carregamento e erros.
2. Um `useEffect` consulta a lista com `fetch`, por meio do serviço `productsApi.js`.
3. `App` envia o texto da pesquisa e a função de alteração para `ProductSearch` por props.
4. Ao digitar, o callback atualiza o estado em `App`, que calcula o filtro e a contagem.
5. `ProductList` recebe a lista filtrada e usa `map` e uma `key` estável para renderizar `ProductCard`.
6. Ao clicar em um cartão, o callback informa o ID a `App`, acionando o efeito de consulta dos detalhes.
7. `App` passa o produto retornado, o carregamento, o erro e a função de fechar para `ProductDetails`.
8. Fechar ou trocar a seleção encerra o efeito anterior, cancelando a requisição com `AbortController`.

## Testes manuais e evidências

As quatro capturas de tela da entrega estão identificadas como `img1.png`, `img2.png`, `img3.png` e `img4.png`.

| Evidência | Ação realizada | Resultado observado |
| --- | --- | --- |
| `img1.png` | Abrir o catálogo com a API em execução. | O cartão de Teclado mecanico apareceu com preço de R$ 249,90 e contador de 1 produto. |
| `img2.png` | Digitar `teclado` no campo de pesquisa. | O produto Teclado mecanico permaneceu visível e o contador indicou 1 resultado. A busca encontrou o nome mesmo com diferença entre maiúsculas e minúsculas. |
| `img3.png` | Digitar `telefone`, que não corresponde ao produto cadastrado. | O contador passou para 0 e a mensagem “Nenhum produto encontrado.” foi exibida. |
| `img4.png` | Inspecionar a aba Network do navegador durante o carregamento. | A requisição `produtos` retornou HTTP 200 e o cartão foi exibido, inclusive na visualização de tela pequena. |

Na quarta captura também aparece uma consulta cancelada. Em desenvolvimento, o `StrictMode` pode executar uma configuração e limpeza adicionais do efeito; o `AbortController` cancela a primeira consulta, e a consulta seguinte é concluída com HTTP 200.

Essas imagens documentam os resultados acima. Elas não mostram o painel de detalhes, o Console ou a simulação de indisponibilidade da API.

## Verificações técnicas

```powershell
npm test
npm run lint
npm run build
```

Na revisão do projeto, os dois testes automatizados do serviço HTTP, o lint e o build passaram. Os endpoints reais de lista e detalhes do produto cadastrado retornaram HTTP 200. Também foram verificados no navegador, com respostas controladas, a pesquisa, a lista vazia, a abertura e fechamento de detalhes, a troca de seleção e o tratamento de erro HTTP.

## Entrega

Inclua o código-fonte, este README e as quatro imagens no arquivo ZIP da atividade. Não inclua `node_modules`, `.git` ou credenciais do MongoDB. A instalação das dependências deve ser feita com `npm install`.
