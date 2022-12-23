module.exports = (sequelize, Sequelize) => {
  const Operation = sequelize.define('Operation', {
    value: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    type: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.INTEGER,
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
    Operation.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
    Operation.belongsTo(models.Atm, {
      foreignKey: 'atm_id',
      as: 'atm',
    });
  };

  return Operation;
};
