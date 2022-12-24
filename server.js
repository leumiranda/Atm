const express = require('express');

const app = express();

const BankService = require('./services/bank');
const AtmService = require('./services/atm');

const bankService = new BankService();
const atmService = new AtmService();

// Banco de dados

const db = require('./models'); // importa todos os modelos criados com sequelize

app.use(express.json()); // Isso é um middleware

// ------------- Banco

app.post('/bank', async (req, res) => {
  const nome = req.body;
  await bankService.register(nome);
  return res.sendStatus(201);
});

app.get('/bank', async (req, res) => {
  const bank = await bankService.list();
  return res.json(bank);
});

app.get('/bank/:id', async (req, res) => {
  const { id } = req.params;
  const bank = await bankService.find(id);
  return res.json(bank);
});

app.get('/bank/', async (req, res) => { // Está em desenvolvimento
  const { banco } = req.query[{ banco: 'banco' }];
  if (banco) {
    const bankSelect = await bankService.search(banco);
    return res.json(bankSelect);
  }
  const allBanks = await bankService.list();
  return res.json(allBanks);
});

app.put('/bank/:id', async (req, res) => {
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

app.post('/atm', async (req, res) => {
  const { banks } = req.body;
  await atmService.register({ banks });
  return res.sendStatus(201);
});

// -------------- Servidor
db.sequelize.sync()
  .then(() => {
    app.listen(3333, () => console.log('Server iniciado com sucesso'));
  })
  .catch((error) => {
    console.log(error);
  });
