module.exports = (sequelize, Sequelize) => {
  const OperationTransfer = sequelize.define('OperationTransfer', {
    target_bank_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    target_account_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    operations_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'operations_transfer',
    timestamps: false,
  });

  OperationTransfer.associate = (models) => {
    OperationTransfer.belongsTo(models.Account, {
      foreignKey: 'target_account_id',
      as: 'account',
    });
    OperationTransfer.belongsTo(models.Bank, {
      foreignKey: 'target_bank_id',
      as: 'bank',
    });
    OperationTransfer.belongsTo(models.Operation, {
      foreignKey: 'operations_id',
      as: 'operation',
    });
  };

  return OperationTransfer;
};
