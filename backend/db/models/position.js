"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Position.init(
    {
      Id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      PositionName: {
        type: DataTypes.STRING(200), // TenChucVu
        allowNull: true,
      },
      // Các quyền hạn (Quy ước: 1 là True, 0 là False)
      ManageStaff: {
        type: DataTypes.TINYINT(1), // QuanLyNhanVien
        defaultValue: 0,
      },
      ManageDepartment: {
        type: DataTypes.TINYINT(1), // QuanLyPhongBan
        defaultValue: 0,
      },
      ManageProject: {
        type: DataTypes.TINYINT(1), // QuanLyDuAn
        defaultValue: 0,
      },
      ManageCapital: {
        type: DataTypes.TINYINT(1), // QuanLyNguonVon
        defaultValue: 0,
      },
      ManageAssetModel: {
        type: DataTypes.TINYINT(1), // QuanLyMoHinhTaiSan
        defaultValue: 0,
      },
      ManageAssetGroup: {
        type: DataTypes.TINYINT(1), // QuanLyNhomTaiSan
        defaultValue: 0,
      },
      ManageAsset: {
        type: DataTypes.TINYINT(1), // QuanLyTaiSan
        defaultValue: 0,
      },
      ManageToolSupplies: {
        type: DataTypes.TINYINT(1), // QuanLyCCDCVatTu
        defaultValue: 0,
      },
      TransferAsset: {
        type: DataTypes.TINYINT(1), // DieuDongTaiSan
        defaultValue: 0,
      },
      TransferToolSupplies: {
        type: DataTypes.TINYINT(1), // DieuDongCCDCVatTu
        defaultValue: 0,
      },
      HandoverAsset: {
        type: DataTypes.TINYINT(1), // BanGiaoTaiSan
        defaultValue: 0,
      },
      HandoverToolSupplies: {
        type: DataTypes.TINYINT(1), // BanGiaoCCDCVatTu
        defaultValue: 0,
      },
      ReportAccess: {
        type: DataTypes.TINYINT(1), // BaoCao
        defaultValue: 0,
      },
      CompanyId: {
        type: DataTypes.STRING(50), // IdCongTy
        allowNull: true,
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
      modelName: "Position",
    }
  );
  return Position;
};
