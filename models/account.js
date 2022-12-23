module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define('Account', {
    balance: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bank_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'accounts',
  });

  Account.associate = (models) => {
    Account.belongsTo(models.Bank, {
      foreignKey: 'bank_id',
      as: 'bank',
    });
    Account.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
  };

  return Account;
};
