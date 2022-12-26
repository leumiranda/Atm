const utils = require('../utils/utils');
const { Customer, Account, sequelize } = require('../models');
const { apiError404 } = require('../utils/customError');
// const { apiError404, apiError403 } = require('../utils/customError');

class CustomerService {
  async register({
    name, cpf, rg, bank_id, account,
  }) {
    const t = await sequelize.transaction();
    try {
      const customer = new Customer({
        name, cpf, rg, bank_id,
      });
      await customer.save({ transaction: t });
      const accounts = account.map((acc) => {
        return {
          balance: 50,
          number: utils.generateNumberAccount(),
          password: acc.password,
          bank_id,
          customer_id: customer.id,
        };
      });
      await Account.bulkCreate(accounts, { transaction: t, individualHooks: true });
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async registerAccount({ bank_id, password, customer_id }) {
    const t = await sequelize.transaction();
    try {
      const balance = 50;
      const number = utils.generateNumberAccount();
      const acc = new Account({
        balance, number, password, bank_id, customer_id,
      });
      await acc.save({ transaction: t });
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }

  async listAccount(id) {
    const account = await Account.findAll({
      where: { customer_id: id },
      attributes: ['id', 'bank_id', 'number', 'balance'],
    });
    return account;
  }

  async list() {
    const customer = await Customer.findAll({
      attributes: ['id', 'name', 'cpf', 'rg', 'bank_id'],
      include: [{
        model: Account,
        as: 'accounts',
        attributes: ['id', 'balance', 'number'],
      }],
    });
    return customer;
  }

  async find(id) {
    const customer = await Customer.findOne({
      where: { id },
      attributes: ['id', 'name', 'cpf', 'rg', 'bank_id'],
      include: [{
        model: Account,
        as: 'accounts',
        attributes: ['id', 'balance', 'number'],
      }],
    });
    if (!customer) {
      throw apiError404;
    } else {
      return customer;
    }
  }

  async edit(id, name, cpf, rg) {
    const findCustomer = await Customer.findOne({ where: { id } });
    const t = await sequelize.transaction();
    if (!findCustomer) {
      throw apiError404;
    } else {
      try {
        await Customer.update({ name, cpf, rg }, { where: { id }, transaction: t });
        t.commit();
      } catch (error) {
        console.log(error);
        await t.rollback();
      }
    }
  }

  async del(id) {
    const t = await sequelize.transaction();
    try {
      await Account.destroy({ where: { customer_id: id }, transaction: t });
      await Customer.destroy({ where: { id }, transaction: t });
      t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  }
}

module.exports = CustomerService;
