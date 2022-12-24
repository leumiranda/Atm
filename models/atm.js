module.exports = (sequelize, Sequelize) => {
  const Atm = sequelize.define('Atm', {
    balance: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 10.000,
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
