"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Departments", {
      Id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      UnitGroupId: {
        type: Sequelize.STRING(50), // Tương ứng IdNhomDonvi
        allowNull: true,
      },
      DepartmentName: {
        type: Sequelize.STRING(500), // Tương ứng TenPhongBan
        allowNull: true,
      },
      ManagerId: {
        type: Sequelize.STRING(50), // Tương ứng IdQuanLy
        allowNull: true,
        // references: { model: "Users", key: "Id" },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },
      CompanyId: {
        type: Sequelize.STRING(50), // Tương ứng IdCongTy
        allowNull: true,
        // references: { model: "Companies", key: "Id" },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },
      ParentDepartment: {
        type: Sequelize.TEXT, // Tương ứng PhongCapTren
        allowNull: true,
      },
      ColorCode: {
        type: Sequelize.STRING(20), // Tương ứng MauSac
        allowNull: true,
      },
      IsActive: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1,
      },
      IsStore: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0,
      },
      WarehouseType: {
        type: Sequelize.TINYINT(1),
      },
      IsLeader: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        type: Sequelize.CHAR,
        // references: {
        //   model: "Users",
        //   key: "Id",
        // },
      },
      updatedBy: {
        type: Sequelize.CHAR,
        // references: {
        //   model: "Users",
        //   key: "Id",
        // },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Departments");
  },
};
