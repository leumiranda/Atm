module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cpf: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rg: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bank_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'customers',
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.Bank, {
      foreignKey: 'bank_id',
      as: 'bank',
    });
    Customer.hasMany(models.Account, {
      foreignKey: 'customer_id',
      as: 'accounts',
      ondeDelete: 'cascade',
    });
  };

  return Customer;
};
