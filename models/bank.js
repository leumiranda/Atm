module.exports = (sequelize, Sequelize) => {
  const Bank = sequelize.define('Bank', {
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'banks',
  });

  Bank.associate = (models) => {
    Bank.hasMany(models.Customer, {
      foreignKey: 'bank_id',
      as: 'customers',
      ondeDelete: 'cascade',
    });
    Bank.hasMany(models.Account, {
      foreignKey: 'bank_id',
      as: 'accounts',
      ondeDelete: 'cascade',
    });
  };

  return Bank;
};
