const { Op } = require('sequelize');
const { Bank } = require('../models');
const { apiError500, apiError404 } = require('../utils/customError');

class BankService {
  async register({ nome }) {
    const bank = new Bank({ nome });
    await bank.save();
    return bank;
  }

  async list() {
    const bank = await Bank.findAll({
      attributes: ['id', 'nome'],
    });
    return bank;
  }

  async find(id) {
    const bank = await Bank.findOne({
      where: { id },
      attributes: ['id', 'nome'],
    });
    if (!bank) {
      throw apiError500;
    } else {
      return bank;
    }
  }

  async search(banco) {
    const bancos = await Bank.findAll({
      attributes: ['id', 'nome'],
      where: {
        nome: {
          [Op.iLike]: `${banco}%`,
        },
      },
    });
    return bancos;
  }

  async edit(id, nome) {
    const findBank = await Bank.findOne({ where: { id } });
    if (!findBank) {
      throw apiError404;
    } else {
      await Bank.update({ nome }, { where: { id } });
    }
  }

  async del(id) {
    await Bank.destroy({
      where: { id },
    });
  }
}

module.exports = BankService;
