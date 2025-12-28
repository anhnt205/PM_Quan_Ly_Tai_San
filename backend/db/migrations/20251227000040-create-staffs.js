"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Staffs", {
      Id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      FullName: {
        type: Sequelize.STRING(500), // HoTen
        allowNull: true,
      },
      PhoneNumber: {
        type: Sequelize.STRING(20), // DiDong
        allowNull: true,
      },
      WorkEmail: {
        type: Sequelize.STRING(100), // EmailCongViec
        allowNull: true,
        unique: true,
      },
      // Các trạng thái ký (0/1)
      HasInitialSig: { type: Sequelize.TINYINT(1), defaultValue: 0 }, // KyNhay
      HasNormalSig: { type: Sequelize.TINYINT(1), defaultValue: 0 }, // KyThuong
      HasDigitalSig: { type: Sequelize.TINYINT(1), defaultValue: 0 }, // KySo

      AgreementUuid: { type: Sequelize.STRING(100), allowNull: true },
      PinCode: { type: Sequelize.STRING(50), allowNull: true }, // PIN
      SavePin: { type: Sequelize.TINYINT(1), defaultValue: 0 },

      // Đường dẫn ảnh chữ ký/avatar
      InitialSigImg: { type: Sequelize.TEXT, allowNull: true }, // ChuKyNhay
      NormalSigImg: { type: Sequelize.TEXT, allowNull: true }, // ChuKyThuong
      Avatar: { type: Sequelize.TEXT, allowNull: true },

      // Khóa ngoại liên kết (References dùng tên TABLE)
      DepartmentId: {
        type: Sequelize.STRING(50), // BoPhan
        // references: { model: "Departments", key: "Id" },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },
      PositionId: {
        type: Sequelize.STRING(50), // ChucVu
        // references: { model: "Positions", key: "Id" },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },
      ManagerId: {
        type: Sequelize.STRING(50), // NguoiQuanLy
        allowNull: true,
        // references: { model: "Users", key: "Id" },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },
      IsManager: { type: Sequelize.TINYINT(1), defaultValue: 0 }, // LaQuanLy

      CompanyId: {
        type: Sequelize.STRING(50), // IdCongTy
        // references: { model: "Companies", key: "Id" },
        // onUpdate: "CASCADE",
        // onDelete: "SET NULL",
      },

      WorkAddress: { type: Sequelize.TEXT, allowNull: true }, // DiaChiLamViec
      WorkType: { type: Sequelize.TEXT, allowNull: true }, // HinhThucLamViec
      WorkHours: { type: Sequelize.TEXT, allowNull: true }, // GioLamViec
      Timezone: { type: Sequelize.STRING(100), allowNull: true }, // MuiGio

      IsActive: { type: Sequelize.TINYINT(1), defaultValue: 1 },

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
    await queryInterface.dropTable("Staffs");
  },
};
