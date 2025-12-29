import { useState } from "react";
import { Box, Chip, Grid, Paper } from "@mui/material";
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

  // Columns Configuration
  const columns: GridColDef[] = [
    { field: "TenPhieu", headerName: "Phiếu kỹ nội sinh", width: 200 },
    { field: "TrichYeu", headerName: "Trích yếu", width: 120 },
    { field: "NgayTao", headerName: "Ngày có hiệu lực", width: 180 },
    { field: "NguoiTao", headerName: "Trình duyệt bởi", width: 150 },
    {
      field: "TaiLieu",
      headerName: "Tài liệu duyệt",
      width: 150,
      renderCell: () => (
        <Chip
          label="Tài liệu..."
          size="small"
          variant="outlined"
          color="success"
          icon={<Add sx={{ fontSize: 12 }} />}
          clickable
        />
      ),
    },
    { field: "SoQuyetDinh", headerName: "Ký số", width: 150 },
    { field: "IdDonViGiao", headerName: "Đơn vị giao", width: 150 },
    { field: "IdDonViNhan", headerName: "Đơn vị nhận", flex: 1 },
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
