const { apiError404 } = require('../utils/customError');
const {
  Account, Operation, Atm, sequelize,
} = require('../models');

class AccountService {
  async deposit({ balance, number, atm_id }) {
    const t = await sequelize.transaction();
    const [findAccount, findAtm] = await Promise.all([
      Account.findOne({
        where: { number },
        attributes: ['balance'],
      }),
      Atm.findOne({
        where: { id: atm_id },
        attributes: ['balance'],
      }),
    ]);
    if (balance > 0) {
      try {
        await Promise.all([
          Account.update({
            balance: findAccount.balance + balance,
          }, {
            where: { number },
            transaction: t,
          }),
          Atm.update({
            balance: findAtm.balance + balance,
          }, {
            where: { id: atm_id },
            transaction: t,
          }),
        ]);

        const operation = new Operation({
          balance,
          type: 'D',
          number,
          atm_id,
        });

        t.commit();
        operation.save();
      } catch (error) {
        await t.rollback();
      }
    } else {
      throw apiError404;
    }
  }

  async balanceAccount({ id }) {
    const balanceAcc = await Account.findOne({ where: { id } });
    return balanceAcc.balance;
  }
}

module.exports = AccountService;
