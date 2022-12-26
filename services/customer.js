const utils = require('../utils/utils');
const { Customer, Account, sequelize } = require('../models');
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
      const bankId = bank_id;
      const accounts = account.map((acc) => {
        const newAccount = {
          balance: 50,
          number: utils.generateNumberAccount(),
          password: acc.password,
          bank_id: bankId,
          customer_id: customer.id,
        };
        return newAccount;
      });
      await Account.bulkCreate(accounts, { transaction: t, individualHooks: true });
      await t.commit();
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
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
}

module.exports = CustomerService;
