import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Assets from "../../data/Assets.json";
import AssetDepreciationForm from "./components/AssetDepreciationForm";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/routes";

export default function AssetDepreciation() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [AssetData, setAssetData] = useState(Assets);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedAsset(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const columns: GridColDef[] = [
    {
      field: "assetNumber",
      headerName: "Mã tài sản",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetCode",
      headerName: "Số thẻ",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetName",
      headerName: "Tên tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "recordedDate",
      headerName: "Ngày sào sổ",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "stateBudgetCapital",
      headerName: "Vốn NS",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "loanCapital",
      headerName: "Vốn vay",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "otherCapital",
      headerName: "Vốn khác",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "usedDate",
      headerName: "Ngày sử dụng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "currentUnitId",
      headerName: "Đơn vị hiện thời",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantityAsset",
      headerName: "Số lượng TS con",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetGroupId",
      headerName: "Nhóm tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetTypeId",
      headerName: "Loại tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetStatus",
      headerName: "Hiện trạng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "unitId",
      headerName: "Đơn vị tính",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "brand",
      headerName: "Mã hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "brandCode",
      headerName: "Số mã hiệu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Link
          to={ROUTES.ASSETMANAGER}
          style={{ textDecoration: "none", color: "green", fontSize: 18 }}
        >
          Quản lý tài sản
        </Link>
        <Typography fontSize={12}>Khấu hao tài sản</Typography>
      </Box>
      {showForm && (
        <Box py={2}>
          <AssetDepreciationForm
            onCancel={() => {
              setShowForm(false);
              setSelectedAsset(null);
              setReadOnly(false);
            }}
            selectedAsset={selectedAsset}
            readOnly={readOnly}
            onEdit={() => {}}
            onSave={() => {}}
          />
        </Box>
      )}

      <TableCustom
        title="Danh sách khấu hao tài sản"
        columns={columns}
        rows={AssetData}
        onRowClick={handleRowClick}
        isFilterDate={true}
      />
    </Box>
  );
}
