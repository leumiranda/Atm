module.exports = (sequelize, Sequelize) => {
  const Atm = sequelize.define('Atm', {
    balance: {
      type: Sequelize.REAL,
      allowNull: false,
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
