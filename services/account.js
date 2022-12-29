const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { CustomError, apiError403, apiError404 } = require('../utils/customError');
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

        await operation.save({ transaction: t });
        await t.commit();
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

            await operation.save({ transaction: t });
            await t.commit();
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
    const [findAccount, findTargetAccount] = await Promise.all([
      Account.findOne({
        where: { number: myNumber },
        attributes: ['id', 'balance'],
      }),
      Account.findOne({
        where: { number: targetNumber },
        attributes: ['id', 'balance'],
      }),
    ]);
    if (amount > 0) {
      if (amount <= findAccount.balance) {
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
            atm_id,
          });
          await operation.save({ transaction: t });
          const transfer = new OperationTransfer({
            target_bank_id: findAccount.bank_id,
            target_account_id: findTargetAccount.id,
            operations_id: operation.id,
          });

          transfer.save({ transaction: t });
          await t.commit();
        } catch (error) {
          await t.rollback();
        }
      } else {
        throw new CustomError('Invalid Transfer', 404, 'Verifique o saldo disponível.');
      }
    } else {
      throw new CustomError('Invalid Transfer', 400, 'O valor da transferência precisa ser maior que zero.');
    }
  }

  async reportAccount({
    id, type, startDate, endDate,
  }) {
    try {
      const filter = {
        where: { account_id: id },
        attributes: ['id', 'balance', 'type', 'atm_id', 'createdAt'],
      };
      if (type !== undefined) {
        filter.where.type = type;
        const reportAccount = await Operation.findAll(filter);
        return reportAccount;
      }
      if (startDate !== undefined) {
        filter.where.createdAt = { [Op.and]: [{ [Op.gte]: startDate }] };
        let reportAccount = await Operation.findAll(filter);
        if (endDate !== undefined) {
          filter.where.createdAt = { [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }] };
          reportAccount = await Operation.findAll(filter);
          return reportAccount;
        }
        return reportAccount;
      }
      const reportAccount = await Operation.findAll(filter);
      return reportAccount;
    } catch (error) {
      throw apiError404;
    }
  }

  async login(number, password) {
    const account = await Account.findOne({
      where: { number },
    });
    if (!account) {
      throw apiError404;
    }
    const verify = await bcrypt.compare(password, account.password);
    if (!verify) {
      throw apiError403;
    }
    return {
      bank_id: account.bank_id,
      account: account.number,
      balance: account.balance,
    };
  }
}

module.exports = AccountService;
