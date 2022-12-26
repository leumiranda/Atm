const express = require('express');

const app = express();

const BankService = require('./services/bank');
const AtmService = require('./services/atm');
const CustomerService = require('./services/customer');

const bankService = new BankService();
const atmService = new AtmService();
const customerService = new CustomerService();

// Banco de dados

const db = require('./models'); // importa todos os modelos criados com sequelize

app.use(express.json()); // Isso é um middleware

// ------------- Banco

app.post('/banks', async (req, res) => {
  const { nome } = req.body;
  await bankService.register({ nome });
  return res.sendStatus(201);
});

app.get('/banks', async (req, res) => {
  const bank = await bankService.list();
  return res.json(bank);
});

app.get('/banks/:id', async (req, res) => {
  const { id } = req.params;
  const bank = await bankService.find(id);
  return res.json(bank);
});

app.put('/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    await bankService.edit(id, nome);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
  return res.sendStatus(204);
});

// -------------- Atm

app.post('/atms', async (req, res) => {
  const { id, balance } = req.body;
  await atmService.register({ id, balance });
  return res.sendStatus(201);
});

app.get('/atms', async (req, res) => {
  const atm = await atmService.list();
  return res.json(atm);
});

app.get('/atms/:id', async (req, res) => {
  const { id } = req.params;
  const atm = await atmService.find(id);
  return res.json(atm);
});

app.put('/atms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bank_id, balance } = req.body;
    await atmService.edit(id, bank_id, balance);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
  return res.sendStatus(204);
});

app.delete('/atms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await atmService.del(id);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
  return res.sendStatus(204);
});

// -------------- Account

app.post('/customers', async (req, res) => {
  const { customer, account } = req.body;
  await customerService.register({ ...customer, account });
  return res.sendStatus(201);
});

app.get('/customers', async (req, res) => {
  const customer = await customerService.list();
  return res.json(customer);
});

// -------------- Servidor
db.sequelize.sync()
  .then(() => {
    app.listen(3333, () => console.log('Server iniciado com sucesso'));
  })
  .catch((error) => {
    console.log(error);
  });
