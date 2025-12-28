"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Positions", {
      Id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      PositionName: {
        type: Sequelize.STRING(500), // TenChucVu
        allowNull: true,
      },
      // Các quyền hạn (Quy ước: 1 là True, 0 là False)
      ManageStaff: {
        type: Sequelize.TINYINT(1), // QuanLyNhanVien
        defaultValue: 0,
      },
      ManageDepartment: {
        type: Sequelize.TINYINT(1), // QuanLyPhongBan
        defaultValue: 0,
      },
      ManageProject: {
        type: Sequelize.TINYINT(1), // QuanLyDuAn
        defaultValue: 0,
      },
      ManageCapital: {
        type: Sequelize.TINYINT(1), // QuanLyNguonVon
        defaultValue: 0,
      },
      ManageAssetModel: {
        type: Sequelize.TINYINT(1), // QuanLyMoHinhTaiSan
        defaultValue: 0,
      },
      ManageAssetGroup: {
        type: Sequelize.TINYINT(1), // QuanLyNhomTaiSan
        defaultValue: 0,
      },
      ManageAsset: {
        type: Sequelize.TINYINT(1), // QuanLyTaiSan
        defaultValue: 0,
      },
      ManageToolSupplies: {
        type: Sequelize.TINYINT(1), // QuanLyCCDCVatTu
        defaultValue: 0,
      },
      TransferAsset: {
        type: Sequelize.TINYINT(1), // DieuDongTaiSan
        defaultValue: 0,
      },
      TransferToolSupplies: {
        type: Sequelize.TINYINT(1), // DieuDongCCDCVatTu
        defaultValue: 0,
      },
      HandoverAsset: {
        type: Sequelize.TINYINT(1), // BanGiaoTaiSan
        defaultValue: 0,
      },
      HandoverToolSupplies: {
        type: Sequelize.TINYINT(1), // BanGiaoCCDCVatTu
        defaultValue: 0,
      },
      ReportAccess: {
        type: Sequelize.TINYINT(1), // BaoCao
        defaultValue: 0,
      },
      CompanyId: {
        type: Sequelize.STRING(50), // IdCongTy
        allowNull: true,
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
    await queryInterface.dropTable("Positions");
  },
};
