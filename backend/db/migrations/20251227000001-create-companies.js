"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Companies", {
      Id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      CompanyName: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      ShortName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      Email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      HeadquarterCountry: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      HeadquarterCity: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      HeadquarterCommune: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      HeadquarterOther: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      CompanyLogo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      TaxNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      Website: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      PhoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      IsActive: {
        type: Sequelize.TINYINT(1),
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
    await queryInterface.dropTable("Companies");
  },
};
