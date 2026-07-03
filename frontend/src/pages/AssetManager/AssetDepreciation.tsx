import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import TableCustom from "../../components/common/TableCustom";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Assets from "../../data/Assets.json";
import AssetDepreciationForm from "./components/AssetDepreciationForm";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import {
  useAssetDepreciationsQuery,
  useAssetManagerMutation,
} from "./Mutation";
import dayjs from "dayjs";
import { useDebounce } from "../../hooks/useDebounce";

export default function AssetDepreciation() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).toISOString(),
  );
  const [searchValue, setSearchValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const searchDebounce = useDebounce(searchValue, 600);
  const { data: assetDepreciations = { items: [], totalItems: 0 } } =
    useAssetDepreciationsQuery(
      selectedDate,
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
    );
  const handleRowClick = (params: GridRowParams) => {
    setSelectedAsset(params.row);
    setReadOnly(true);
    setShowForm(true);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "soThe",
      headerName: "Số thẻ",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tenTaiSan",
      headerName: "Tên tài sản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nvNS",
      headerName: "Vốn NS",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.nvNS || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "vonVay",
      headerName: "Vốn vay",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.vonVay || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "vonKhac",
      headerName: "Vốn khác",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.vonKhac || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "maTk",
      headerName: "Mã tài khoản",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ngayTinhKhao",
      headerName: "Ngày tính khấu hao",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row.ngayTinhKhao
          ? dayjs(params.row.ngayTinhKhao).format("DD/MM/YYYY HH:mm:ss")
          : "",
    },
    {
      field: "thangKh",
      headerName: "Tháng khấu hao",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nguyenGia",
      headerName: "Nguyên giá",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.nguyenGia || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "khauHaoBanDau",
      headerName: "Khấu hao ban đầu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.khauHaoBanDau || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "khauHaoPsdk",
      headerName: "Khấu hao PSDK",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.khauHaoPsdk || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "gtclBanDau",
      headerName: "GTCL ban đầu",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.khauHaoBanDau || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "khauHaoPsck",
      headerName: "Khấu hao PSCK",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.khauHaoPsck || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "gtclHienTai",
      headerName: "GTCL hiện tại",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.gtclHienTai || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "khauHaoBinhQuan",
      headerName: "Khấu hao bình quân",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.khauHaoBinhQuan || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "soTien",
      headerName: "Số tiền",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.soTien || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "chenhLech",
      headerName: "Chênh lệch",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.chenhLech || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "khKyTruoc",
      headerName: "Khấu hao kỳ trước",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.khKyTruoc || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "clKyTruoc",
      headerName: "Chênh lệch kỳ trước",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        Number((params.row.clKyTruoc || 0).toFixed(0)).toLocaleString(),
    },
    {
      field: "hsdCkh",
      headerName: "HSDCKH",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tkNo",
      headerName: "Tài khoản nợ",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tkCo",
      headerName: "Tài khoản có",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dtgt",
      headerName: "DTGT",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dtth",
      headerName: "DTTH",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "kmcp",
      headerName: "KMCP",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ghiChuKhao",
      headerName: "Ghi chú khấu hao",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userId",
      headerName: "Người tạo",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 2 }}>
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
        tableId="assetDepreciation"
        title="Danh sách khấu hao tài sản"
        columns={columns}
        rows={assetDepreciations.items}
        total={assetDepreciations.totalItems}
        onRowClick={handleRowClick}
        isFilterDate={true}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
      />
    </Box>
  );
}
