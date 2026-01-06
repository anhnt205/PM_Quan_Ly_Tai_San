import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Add,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

// Import Components
import AssetTransferForm from "./components/AssetTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import SignDocumentForm from "./components/SignDocumentForm";
import BienBanDialog from "./components/BienBanDialog";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<AssetTransferData | null>(
    null
  );
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const [showBienBanDialog, setShowBienBanDialog] = useState(false);

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

  const handleOpenDeleteDialog = (row: AssetTransferData) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete) {
      handleDelete([rowToDelete.id]);
      console.log("Đã xóa:", rowToDelete.TenPhieu);
    }
    handleCloseDeleteDialog();
  };

  const handleSaveAssetTransfer = async (values: any) => {
    try {
      console.log("Lưu biên bản:", values);

      // Nếu có file đính kèm, gửi file lên server
      if (values.AttachmentFile) {
        const formData = new FormData();
        formData.append("file", values.AttachmentFile);

        // Gửi file lên backend
        const uploadResponse = await fetch(
          "http://42.119.110.246:8389/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          console.error("Lỗi upload file");
        }
      }

      // Gửi dữ liệu biên bản (không gửi file binary)
      const dataToSend = { ...values };
      delete dataToSend.AttachmentFile; // Xóa file binary khỏi payload

      // Gọi API save biên bản (sẽ implement sau)
      console.log("Dữ liệu gửi:", dataToSend);

      // Đóng form sau khi save thành công
      handleCloseForm();
    } catch (error) {
      console.error("Lỗi khi lưu biên bản:", error);
    }
  };

  const handleSignAssets = (id: string) => {
    console.log("Ký biên bản cho các tài sản:", id);
    // Lấy thông tin document từ các dòng được chọn
    const documents = mockRows.find((row: any) => row.Id === id);
    setSelectedDocuments(documents);
    setShowSignerSidebar(true); // Hiện sidebar khi ký
    setShowSignDocument(true);
  };

  const handleViewDocument = (rowData: AssetTransferData) => {
    console.log("Xem tài liệu:", rowData.Id);
    setSelectedDocuments(rowData);
    setShowSignerSidebar(false); // Ẩn sidebar khi xem
    setShowSignDocument(true);
  };

  const handleViewBienBan = (rowData: AssetTransferData) => {
    console.log("Xem phiếu bàn giao:", rowData.Id);
    setSelectedDocuments(rowData);
    setShowBienBanDialog(true);
  };

  const columns: GridColDef<AssetTransferData>[] = [
    {
      field: "TenPhieu",
      headerName: "Phiếu ký nội sinh",
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "TrichYeu",
      headerName: "Trích yếu",
      width: 180,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "NgayTao",
      headerName: "Ngày có hiệu lực",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    {
      field: "NguoiTao",
      headerName: "Trình duyệt biên bản",
      width: 160,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "TenFile",
      headerName: "Tài liệu duyệt",
      width: 180,
      headerAlign: "center",
      align: "center",
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
      field: "SoQuyetDinh",
      headerName: "Ký số",
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "ThoiGian",
      headerName: "Thời gian",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    {
      field: "IdDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "IdDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "IdDonViDeNghi",
      headerName: "Đơn vị đề nghị",
      width: 180,
      headerAlign: "center",
      align: "center",
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

    {
      field: "TrangThaiKy",
      headerName: "Trạng thái ký",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const statusMap: Record<
          number,
          { label: string; color: "default" | "info" | "error" | "success" }
        > = {
          0: { label: "Không được phép ký", color: "info" },
          1: { label: "Không được phép ký", color: "info" },
          2: { label: "Không được phép ký", color: "info" },
          3: { label: "Không được phép ký", color: "info" },
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

    {
      field: "TrangThaiBanGiao",
      headerName: "Trạng thái bàn giao",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const statusMap: Record<
          number,
          { label: string; color: "default" | "info" | "error" | "success" }
        > = {
          0: { label: "Chưa tạo biên bản", color: "error" },
          1: { label: "Sắp quá hạn bàn giao", color: "default" },
          /*2: { label: "Hủy", color: "error" },
          3: { label: "Hoàn thành", color: "success" },*/
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

    {
      field: "TrinhDuyet",
      headerName: "Trình duyệt",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const statusMap: Record<
          number,
          { label: string; color: "default" | "info" | "error" | "success" }
        > = {
          0: { label: "Được gửi", color: "success" },
          1: { label: "Đã gửi", color: "success" },
          2: { label: "Chưa gửi", color: "error" },
          //3: { label: "Hoàn thành", color: "success" },
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

    {
      field: "HanhDong",
      headerName: "Hành động",
      width: 140,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const rowData = params.row as AssetTransferData;
        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDeleteDialog(rowData);
                }}
                sx={{
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(244, 67, 54, 0.08)" },
                }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xem phiếu bàn giao">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBienBan(rowData);
                }}
                sx={{
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                }}
              >
                <EventNoteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xem">
              <IconButton
                size="small"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDocument(rowData);
                }}
                sx={{
                  padding: "4px",
                  "&:hover": { bgcolor: "rgba(76, 175, 80, 0.08)" },
                }}
              >
                <VisibilityIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
        >
          Xóa biên bản bàn giao
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#ffcccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteIcon sx={{ fontSize: 32, color: "#f44336" }} />
            </Box>
          </Box>
          <DialogContentText sx={{ color: "#666", fontSize: 14 }}>
            Bạn có chắc muốn xóa <strong>"{rowToDelete?.TenPhieu}"</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              px: 3,
              py: 1,
              backgroundColor: "#f0f0f0",
              color: "#333",
              fontWeight: 500,
              textTransform: "none",
              fontSize: 14,
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            Không
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              px: 3,
              py: 1,
              fontWeight: 500,
              textTransform: "none",
              fontSize: 14,
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xem Biên Bản */}
      <BienBanDialog
        open={showBienBanDialog}
        onClose={() => setShowBienBanDialog(false)}
        documentData={selectedDocuments}
      />

      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          documents={selectedDocuments}
          onCancel={() => {
            setShowSignDocument(false);
            setSelectedDocuments([]);
            setShowSignerSidebar(true);
          }}
          onSign={() => {
            console.log("Ký tài liệu thành công");
            setShowSignDocument(false);
            setSelectedIds([]);
            setSelectedDocuments([]);
            setShowSignerSidebar(true);
          }}
          showSignerSidebar={showSignerSidebar}
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
                  onSave={handleSaveAssetTransfer}
                  onEdit={() => {}}
                  readOnly={!!selectedRow}
                  selectedTransfer={selectedRow}
                  label={label}
                  isSignedForm={!!selectedRow}
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
