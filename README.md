# ATM Simulator




Este é um projeto em Node.js que simula um caixa eletrônico, permitindo que os usuários acessem API's e tracem rotas com validação de tokens e armazenamento por ORM sequelize.




### Funcionalidades




* Autenticação de usuários com validação de tokens.

* Consulta de saldo e histórico de transações.

* Depósito e saque de dinheiro com validação de limites de transações.

* Transferência de dinheiro entre contas com validação de existência de conta e saldo disponível.




### Tecnologias utilizadas




* Node.js

* Express.js

* Sequelize ORM

* JSON Web Tokens (JWT)

* Banco de dados PostgreSQL




### Como executar o projeto




*Clone o repositório:*

`git clone https://github.com/leumiranda/atm.git`




*Instale as dependências:*

`npm install`




Configure as variáveis de ambiente

criando um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:




* DB_HOST=seu_host

* DB_USER=seu_usuario

* DB_PASSWORD=sua_senha

* DB_NAME=seu_banco_de_dados

* JWT_SECRET=sua_chave_secreta




*Execute as migrations do banco de dados:*

`npx sequelize-cli db:migrate`




### Inicie o servidor:




`npm start`




Acesse o servidor em http://localhost:3000.




**Contribuindo**

Se você quiser contribuir para este projeto, sinta-se à vontade para enviar um pull request. Ficaremos felizes em receber contribuições para tornar este projeto ainda melhor!




**Licença**

Este projeto é licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.
