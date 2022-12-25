module.exports = (sequelize, Sequelize) => {
  const Atm = sequelize.define('Atm', {
    balance: {
      type: Sequelize.REAL,
      allowNull: false,
      defaultValue: 10000.00,
    },
    bank_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'atms',
  });

  Atm.associate = (models) => {
    Atm.belongsTo(models.Bank, {
      foreignKey: 'bank_id',
      as: 'bank',
    });
  };

  return Atm;
};
