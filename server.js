const express = require('express');

const app = express();

const BankService = require('./services/bank');

const bankService = new BankService();

// Banco de dados

const db = require('./models'); // importa todos os modelos criados com sequelize

app.use(express.json()); // Isso é um middleware

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

app.delete('/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await bankService.del(id);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
  return res.sendStatus(204);
});

db.sequelize.sync()
  .then(() => {
    app.listen(3333, () => console.log('Server iniciado com sucesso'));
  })
  .catch((error) => {
    console.log(error);
  });
