import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

// Import Components
import AssetTransferForm from "./components/AssetTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import SignDocumentForm from "./components/SignDocumentForm";
import TableCustom from "../../components/common/TableCustom";

import { mockAssetTransfers as mockRows } from "../../data/AssetTransferData";

// Import Types & Data
import { AssetTransferData } from "./types";
import PageAction from "../../components/common/PageAction";
import { useParams, useSearchParams } from "react-router-dom";

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
  const [selectedDocuments, setSelectedDocuments] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    setSelectedIds([]);
    setSelectedDocuments(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
  }, [type]);
  const getTypeInfo = (typeValue: any) => {
    switch (Number(typeValue)) {
      case 1:
        return { title: "Cấp phát tài sản", label: "cấp phát tài sản" };
      case 2:
        return { title: "Điều chuyển tài sản", label: "điều chuyển tài sản" };
      case 3:
        return { title: "Thu hồi tài sản", label: "thu hồi tài sản" };
      default:
        return { title: "Cấp phát tài sản", label: "cấp phát tài sản" };
    }
  };

  // Usage inside your component
  const { title, label } = getTypeInfo(type);

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

  const handleSignAssets = (id: string) => {
    console.log("Ký biên bản cho các tài sản:", id);
    // Lấy thông tin document từ các dòng được chọn
    const documents = mockRows.find((row: any) => row.id === id);
    setSelectedDocuments(documents);
    setShowSignDocument(true);
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
      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          documents={selectedDocuments}
          onCancel={() => {
            setShowSignDocument(false);
            setSelectedDocuments([]);
          }}
          onSign={() => {
            console.log("Ký tài liệu thành công");
            setShowSignDocument(false);
            setSelectedIds([]);
            setSelectedDocuments([]);
          }}
          fullscreen={true}
        />
      ) : (
        <>
          <PageAction title={title} onNewClick={() => setShowForm(true)} />
          <Box sx={{ p: 2 }}>
            {/* FORM AREA */}
            {showForm && (
              <Box sx={{ mb: 2 }}>
                {/* Thêm margin bottom để tách biệt với bảng bên dưới */}
                <AssetTransferForm
                  onCancel={handleCloseForm}
                  onSave={() => {}}
                  onEdit={() => {}}
                  readOnly={!!selectedRow}
                  selectedTransfer={selectedRow}
                  label={label}
                />
              </Box>
            )}

            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "stretch",
                bgcolor: "background.paper",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid
                size={{ xs: selectedRow ? 9 : 12 }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight: selectedRow ? "1px solid" : "none",
                  borderColor: "divider",
                  "& .MuiPaper-root": {
                    margin: 0,
                    boxShadow: "none",
                    borderRadius: 0,
                  },
                }}
              >
                <TableCustom
                  title={`Phiếu duyệt ${label}`}
                  columns={columns}
                  rows={mockRows}
                  total={mockRows.length}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onDelete={handleDelete}
                  onSign={handleSignAssets}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showStatusFilter={true}
                />
              </Grid>

              {/* SIDEBAR - Bây giờ sẽ dính liền và cao bằng Table */}
              {selectedRow && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa", // Màu nền nhẹ để phân biệt với bảng
                  }}
                >
                  <SignerSidebar
                    selectedRow={selectedRow}
                    onClose={() => setSelectedRow(null)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
