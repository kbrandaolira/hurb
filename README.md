# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> API de Conversão de Moedas

## Solução
Construção de uma API, que responda JSON, para realizar conversões entre diferentes moedas com cotações de verdade e atuais.

## Tecnologias utilizadas:
1. Node JS
    - Nest JS (Framework MVC)
    - Type ORM (Mapeamento objeto-relacional)
    - Jest (Testes)
    - Typescript
2. MySQL
3. Docker
4. Awesome API (https://economia.awesomeapi.com.br) para cotação das moedas

## Como rodar o projeto?
1. Instale o Docker (sudo apt install docker.io)
2. Rode o comando `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up` (ambiente de desenvolvimento) ou `docker-compose -f docker-compose.yml -f docker-compose.test.yml up` (ambiente de teste)
- Pronto, a aplicação estará no ar na porta 3000 e o banco na 3306

## Rotas
Para acessar as rotas é necessário informar no header a `API_KEY` que está configurada nos arquivos `.env`.

1. POST /currency
Exemplo da Requisição:
```json
{
	"name": "Real",
	"code": "BRL"
}
```

Exemplo da Resposta:
Status 201
```json
{
	"name": "Real",
	"code": "BRL",
    "created_at": "2020-01-02 00:00:00"
}
```

2. DELETE /currency/{id}

Exemplo passando parâmetro id = 1

Exemplo da Resposta:
Status 200 
```json
{}
```

3. GET /currency/convert?codeFrom={codeFrom}&codeTo={codeTo}&amount={amount}

Exemplo passando parâmetro codeFrom = USD, codeTo = BRL e amount = 100 

Exemplo da Resposta:
Status 200 
```json
{
    "codeFrom": "USD",
    "amountFrom": 100,
    "codeTo": "BRL",
    "amountTo": 0.25
}
```

## Informações adicionais
- Foram criadas migrations para mantermos o histórico cronológico de todos scripts de alteração de estrutura de tabela.
- Dentro da pasta /test existe o arquivo `currency.e2e-spec.ts` que possui testes end to end.
- @AuthGuard intercepta as requisições e verifica se a `API_KEY` (configurada no `.env`) está presente no cabeçalho.
- Scripts que a aplicação possui:
    - `build`: build da aplicação.
    - `start`: roda a aplicação com hot deploy para o ambiente de desenvolvimento.
    - `test`: roda a aplicação com hot deploy para o ambiente de teste.
    - `migration:create`: Gera uma migration, basta definir o nome dela após o comando.
    - `migration:run`: Roda todas as migrations.
    - `migration:revert`: Reverte todas as migrations.
    - `fixture:run`: Roda os arquivos que geram dados iniciais para aplicação (./db/fixture)