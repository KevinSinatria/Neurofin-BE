"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, {
        foreignKey: "id_user",
        targetKey: "id",
      });
    }
  }

  Expense.init(
    {
      expenseid: {
        type: DataTypes.STRING(11),
        primaryKey: true,
      },
      id_user: DataTypes.INTEGER,
      category: DataTypes.STRING,
      uangmasuk: DataTypes.DECIMAL(15, 2),
      uangkeluar: DataTypes.DECIMAL(15, 2),
      uangakhir: DataTypes.DECIMAL(15, 2),
      description: DataTypes.TEXT,
      transaction_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Expense",
    }
  );
  return Expense;
};
