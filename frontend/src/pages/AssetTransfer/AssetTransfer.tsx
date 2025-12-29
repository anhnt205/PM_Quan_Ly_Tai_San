import { useState } from "react";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

// Import Components
import PageHeader from "./components/PageHeader";
import FilterBar from "./components/FilterBar";
import AssetTransferForm from "./components/AssetTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import TableCustom from "../../components/common/TableCustom";

import { mockAssetTransfers as mockRows } from "../../data/AssetTransferData";

// Import Types & Data
import { AssetTransferData } from "./types";

export default function AssetTransfer() {
  // State
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AssetTransferData | null>(
    null
  );
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // Handlers
  const handleNewClick = () => {
    setShowForm(true);
    setSelectedRow(null);
  };

  const handleRowClick = (params: GridRowParams) => {
    const data = params.row as AssetTransferData;
    setSelectedRow(data);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRow(null);
  };

  const handleDelete = (ids: string[]) => {
    console.log("Xóa các bản ghi:", ids);
  };

  const columns: GridColDef<AssetTransferData>[] = [
    {
      field: "SoQuyetDinh",
      headerName: "Số chứng từ",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {params.value}
        </Typography>
      ),
    },

    { field: "TenPhieu", headerName: "Tên phiếu", width: 200 },

    { field: "TrichYeu", headerName: "Trích yếu", width: 180 },

    {
      field: "NgayTao",
      headerName: "Ngày tạo",
      width: 160,
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    { field: "NguoiTao", headerName: "Người tạo", width: 160 },

    { field: "IdDonViGiao", headerName: "Đơn vị giao", width: 180 },
    { field: "IdDonViNhan", headerName: "Đơn vị nhận", width: 180 },
    { field: "IdDonViDeNghi", headerName: "Đơn vị đề nghị", width: 180 },

    {
      field: "TenFile",
      headerName: "Tài liệu",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <Chip
            label={
              params.value.length > 20
                ? params.value.substring(0, 15) + "..."
                : params.value
            }
            size="small"
            variant="outlined"
            color="success"
            icon={<Add sx={{ fontSize: 12 }} />}
            clickable
            title={params.value}
          />
        );
      },
    },

    {
      field: "TrangThai",
      headerName: "Trạng thái",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const statusMap: Record<
          number,
          { label: string; color: "default" | "info" | "error" | "success" }
        > = {
          0: { label: "Nháp", color: "default" },
          1: { label: "Duyệt", color: "info" },
          2: { label: "Hủy", color: "error" },
          3: { label: "Hoàn thành", color: "success" },
        };

        const status = statusMap[params.value as number] || {
          label: "KĐ",
          color: "default",
        };

        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            sx={{ minWidth: 80, fontWeight: 600 }}
          />
        );
      },
    },
  ];

  return (
    <>
      <PageHeader onNewClick={handleNewClick} />

      <Box
        sx={{
          width: "100%",
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        {/* PAGE CONTAINER */}
        <Box sx={{ px: 3, pb: 4, pt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* 1. FILTER BAR (Đã tách ra component riêng) */}
            <FilterBar totalCount={mockRows.length} />

            {/* 2. CONTENT AREA */}
            <Box sx={{ bgcolor: "background.paper" }}>
              {/* FORM AREA */}
              {showForm && (
                <Box
                  sx={{
                    p: 3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "grey.50",
                  }}
                >
                  <AssetTransferForm
                    onCancel={handleCloseForm}
                    onSave={() => {}}
                    onEdit={() => {}}
                    readOnly={!!selectedRow}
                    selectedTransfer={selectedRow}
                  />
                </Box>
              )}

              {/* GRID & SIDEBAR AREA */}
              <Grid container>
                <Grid
                  size={{ xs: selectedRow ? 9 : 12 }}
                  sx={{
                    transition: "all 0.3s ease",
                    borderRight: selectedRow ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <TableCustom
                    title="Danh sách phiếu điều chuyển"
                    columns={columns}
                    rows={mockRows}
                    total={mockRows.length}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onRowClick={handleRowClick}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onDelete={handleDelete}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                  />
                </Grid>

                {/* SIDEBAR */}
                {selectedRow && (
                  <Grid size={{ xs: 3 }}>
                    <SignerSidebar
                      selectedRow={selectedRow}
                      onClose={() => setSelectedRow(null)}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
