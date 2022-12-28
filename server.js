const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

const BankService = require('./services/bank');
const AtmService = require('./services/atm');
const CustomerService = require('./services/customer');
const AccountService = require('./services/account');

const bankService = new BankService();
const atmService = new AtmService();
const customerService = new CustomerService();
const accountService = new AccountService();

// Banco de dados

const db = require('./models'); // importa todos os modelos criados com sequelize

app.use(express.json()); // Isso é um middleware

const checkToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(' ')[1];
  console.log('token', token);

  if (!token || token === 'undefined') {
    return res.sendStatus(403);
  }
  return next();
};

app.use((req, res, next) => {
  console.log('Request Type:', req.method, req.path);
  console.log(req.body);
  next();
});

// ------------- Banco

app.post('/banks', checkToken, async (req, res) => {
  const { nome } = req.body;
  await bankService.register({ nome });
  return res.sendStatus(201);
});

app.get('/banks', checkToken, async (req, res) => {
  const bank = await bankService.list();
  return res.json(bank);
});

app.get('/banks/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  const bank = await bankService.find(id);
  return res.json(bank);
});

app.put('/banks/:id', checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    await bankService.edit(id, nome);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
});

// -------------- Atm

app.post('/atms', checkToken, async (req, res) => {
  const { id, balance } = req.body;
  await atmService.register({ id, balance });
  return res.sendStatus(201);
});

app.get('/atms', checkToken, async (req, res) => {
  const atm = await atmService.list();
  return res.json(atm);
});

app.get('/atms/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  const atm = await atmService.find(id);
  res.json(atm);
});

app.put('/atms/:id', checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { bank_id, balance } = req.body;
    await atmService.edit(id, bank_id, balance);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
});

app.delete('/atms/:id', checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    await atmService.del(id);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.log('Request Type:', req.method, req.path);
  return res.sendStatus(204);
});

// -------------- Account

app.post('/accounts/', checkToken, async (req, res) => {
  const { bank_id, password, customer_id } = req.body;
  await customerService.registerAccount({ bank_id, password, customer_id });
  return res.sendStatus(201);
});

app.get('/accounts/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  const customer = await customerService.listAccount(id);
  res.json(customer);
});

// --------------- Customer

app.post('/customers', async (req, res) => {
  const { customer, account } = req.body;
  await customerService.register({ ...customer, account });
  return res.sendStatus(201);
});

app.get('/customers', checkToken, async (req, res) => {
  const customer = await customerService.list();
  return res.json(customer);
});

app.get('/customers/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  const customer = await customerService.find(id);
  return res.json(customer);
});

app.put('/customers/:id', checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cpf, rg } = req.body;
    await customerService.edit(id, name, cpf, rg);
    return res.sendStatus(201);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
});

app.delete('/customers/:id', checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    await customerService.del(id);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
});

// -------------- Operations

app.post('/accounts/login', async (req, res) => {
  try {
    const { number, password } = req.body;
    await accountService.login(number, password);
    const secret = process.env.SECRET;
    const token = jwt.sign({
      number,
    }, secret);
    return res.status(200).json({ token });
  } catch (error) { return res.status(error.statusCode).json({ error: error.message }); }
});

app.post('/accounts/deposit', checkToken, async (req, res) => {
  try {
    const { balance, number, atm_id } = req.body;
    console.log(req.body);
    await accountService.deposit({ balance, number, atm_id });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({ error: error.message });
  }
});

app.get('/accounts/:id/balance', checkToken, async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await accountService.balanceAccount({ id });
    return res.json(balance);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
});

app.post('/accounts/withdraw', checkToken, async (req, res) => {
  try {
    const { amount, number, atm_id } = req.body;
    await accountService.withdraw({ amount, number, atm_id });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({ error: error.message });
  }
});

app.post('/accounts/transfer', checkToken, async (req, res) => {
  try {
    const {
      amount, myNumber, targetNumber, atm_id,
    } = req.body;
    await accountService.transfer({
      amount, myNumber, targetNumber, atm_id,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({ error: error.message });
  }
});
// -------------- Servidor
db.sequelize.sync()
  .then(() => {
    app.listen(3333, () => console.log('Server iniciado com sucesso'));
  })
  .catch((error) => {
    console.log(error);
  });
