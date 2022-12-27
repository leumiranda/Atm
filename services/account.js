const { CustomError } = require('../utils/customError');
const {
  Account, Operation, Atm, sequelize, OperationTransfer,
} = require('../models');

class AccountService {
  async deposit({ balance, number, atm_id }) {
    const t = await sequelize.transaction();
    const [findAccount, findAtm] = await Promise.all([
      Account.findOne({
        where: { number },
        attributes: ['id', 'balance'],
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
          account_id: findAccount.id,
          atm_id,
        });

        await t.commit();
        await operation.save();
      } catch (error) {
        await t.rollback();
      }
    } else {
      throw new CustomError('Invalid Balance', 400, 'O balance depositado precisa ser maior que zero.');
    }
  }

  async withdraw({ amount, number, atm_id }) {
    const t = await sequelize.transaction();
    const [findAccount, findAtm] = await Promise.all([
      Account.findOne({
        where: { number },
        attributes: ['id', 'balance'],
      }),
      Atm.findOne({
        where: { id: atm_id },
        attributes: ['balance'],
      }),
    ]);
    if (amount > 0) {
      if (amount <= findAtm.balance) {
        if (amount <= findAccount.balance) {
          try {
            await Promise.all([
              Account.update({
                balance: findAccount.balance - amount,
              }, {
                where: { number },
                transaction: t,
              }),
              Atm.update({
                balance: findAtm.balance - amount,
              }, {
                where: { id: atm_id },
                transaction: t,
              }),
            ]);
            const operation = new Operation({
              balance: amount,
              type: 'W',
              account_id: findAccount.id,
              atm_id,
            });

            await t.commit();
            await operation.save();
          } catch (error) {
            await t.rollback();
          }
        } else {
          throw new CustomError('Invalid Withdraw', 404, 'Verifique seu saldo.');
        }
      } else {
        throw new CustomError('Invalid Withdraw', 404, 'Sem notas disponíveis, diriga-jse a outro caixa eletrônico.');
      }
    } else {
      throw new CustomError('Invalid Withdraw', 400, 'O valor solicitado precisa ser maior que zero.');
    }
  }

  async balanceAccount({ id }) {
    try {
      const balanceAcc = await Account.findOne({
        where: { id },
        attributes: ['balance'],
      });
      return balanceAcc;
    } catch (error) {
      throw new CustomError('Invalid Account', 404, 'O ID inserido não está listado.');
    }
  }

  async transfer({
    amount, myNumber, targetNumber, atm_id,
  }) {
    const t = await sequelize.transaction();
    const [findAccount, findAtm, findTargetAccount] = await Promise.all([
      Account.findOne({
        where: { number: myNumber },
        attributes: ['id', 'balance'],
      }),
      Atm.findOne({
        where: { id: atm_id },
        attributes: ['id', 'balance', 'bank_id'],
      }),
      Account.findOne({
        where: { number: targetNumber },
        attributes: ['id', 'balance'],
      }),
    ]);
    if (amount > 0) {
      try {
        await Promise.all([
          Account.update({
            balance: findAccount.balance - amount,
          }, {
            where: { number: myNumber },
            transaction: t,
          }),
          Account.update({
            balance: findTargetAccount.balance + amount,
          }, {
            where: { number: targetNumber },
            transaction: t,
          }),
        ]);

        const operation = new Operation({
          balance: amount,
          type: 'T',
          account_id: findAccount.id,
          atm_id: findAtm.id,
        });
        await t.commit();
        await operation.save();
        const findOperation = await Operation.findOne({
          where: { account_id: findAccount.id },
          attributes: ['id'],
        });

        const transfer = new OperationTransfer({
          target_bank_id: findAtm.bank_id,
          target_account_id: findTargetAccount.id,
          operations_id: findOperation.id,
        });

        transfer.save();
      } catch (error) {
        await t.rollback();
      }
    }
  }
}

module.exports = AccountService;
