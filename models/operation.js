module.exports = (sequelize, Sequelize) => {
  const Operation = sequelize.define('Operation', {
    balance: {
      type: Sequelize.REAL,
      allowNull: false,
    },
    type: {
      type: Sequelize.CHAR(1),
      allowNull: false,
    },
    number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    atm_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'operations',
  });

  Operation.associate = (models) => {
    Operation.hasOne(models.Account, {
      foreignKey: 'number',
      as: 'account',
    });
    Operation.belongsTo(models.Atm, {
      foreignKey: 'atm_id',
      as: 'atm',
    });
  };

  return Operation;
};
