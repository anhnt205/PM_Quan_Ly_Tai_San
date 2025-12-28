"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      Id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      UserName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      FullName: {
        type: Sequelize.STRING(500),
      },
      Email: {
        type: Sequelize.STRING(50),
      },
      PhoneNumber: {
        type: Sequelize.STRING(50),
      },
      Avatar: {
        type: Sequelize.TEXT,
      },
      CompanyID: {
        type: Sequelize.STRING(50),
        defaultValue: null,
        // references: {
        //   model: "Companies",
        //   key: "id",
        // },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },
      IsActive: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
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
        type: Sequelize.STRING(50),
        // references: {
        //   model: "Users",
        //   key: "Id",
        // },
      },
      updatedBy: {
        type: Sequelize.STRING(50),
        // references: {
        //   model: "Users",
        //   key: "Id",
        // },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
