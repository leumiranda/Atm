const { apiError404 } = require('../utils/customError');
const { Account, Operation, Atm } = require('../models');

class AccountService {
  async deposit({ balance, number, atm_id }) {
    const balanceAccount = await Account.findOne({ where: { number } });
    const balanceAtm = await Atm.findOne({ where: { id: atm_id } });

    if (balance > 0) {
      Account.update({ balance: balanceAccount.balance + balance }, { where: { number } });
      const operation = new Operation({
        balance,
        type: 'D',
        number,
        atm_id,
      });
      Atm.update({ balance: balanceAtm.balance + balance }, { where: { id: atm_id } });
      operation.save();
    } else {
      throw apiError404;
    }
  }
}

module.exports = AccountService;
