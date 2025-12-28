"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Department.init(
    {
      Id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      UnitGroupId: {
        type: DataTypes.STRING(50), // Tương ứng IdNhomDonvi
        allowNull: true,
      },
      DepartmentName: {
        type: DataTypes.STRING(500), // Tương ứng TenPhongBan
        allowNull: true,
      },
      ManagerId: {
        type: DataTypes.STRING(50), // Tương ứng IdQuanLy
        allowNull: true,
      },
      CompanyId: {
        type: DataTypes.STRING(50), // Tương ứng IdCongTy
        allowNull: true,
      },
      ParentDepartment: {
        type: DataTypes.TEXT, // Tương ứng PhongCapTren
        allowNull: true,
      },
      ColorCode: {
        type: DataTypes.STRING(20), // Tương ứng MauSac
        allowNull: true,
      },
      IsActive: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
      },
      IsStore: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
      WarehouseType: {
        type: DataTypes.TINYINT(1),
      },
      IsLeader: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
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
        type: DataTypes.CHAR,
      },
      updatedBy: {
        type: DataTypes.CHAR,
      },
    },
    {
      sequelize,
      modelName: "Department",
    }
  );
  return Department;
};
