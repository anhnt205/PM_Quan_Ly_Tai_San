"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      Id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      UserName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      FullName: {
        type: DataTypes.STRING(500),
      },
      Email: {
        type: DataTypes.STRING(50),
      },
      PhoneNumber: {
        type: DataTypes.STRING(50),
      },
      Avatar: {
        type: DataTypes.TEXT,
      },
      CompanyID: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      IsActive: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      createdBy: {
        type: DataTypes.STRING(50),
      },
      updatedBy: {
        type: DataTypes.STRING(50),
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );
  return User;
};
