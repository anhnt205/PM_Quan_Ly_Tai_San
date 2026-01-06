import { SyntheticEvent, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useSearchParams } from "react-router-dom";

import TableCustom from "../../components/common/TableCustom";
import PageAction from "../../components/common/PageAction";
import AssetHandoverForm from "./components/AssetHandoverForm/AssetHandoverForm";
import SignDocumentForm from "../../components/common/SignDocumentForm";
import SignerSidebar from "../AssetTransfer/components/SignerSidebar";

import { AssetHandoverFormValues, AssetTransferData } from "./types";
import { useAssetHandoverMutation } from "./Mutation";
import { Download, Eye, Trash2, ListPlus } from "lucide-react";
import { ClassOutlined, TableChart } from "@mui/icons-material";
import { FilterOption } from "../../components/common/FilterStatusGroup";

export default function AssetHandover() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  console.log(selectedIds);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const handleEdit = () => setReadOnly(false);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState("all");
  const [currentType, setCurrentType] = useState("all");
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    handoverPage,
    transferPage,
    isLoading,
    createMutation,
    updateMutation,
    deleteOneMutation,
    handleDownloadFile,
  } = useAssetHandoverMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue
  );

  useEffect(() => {
    setSelectedIds([]);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
  }, [type, activeTab]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: handoverPage?.totalItems || 0,
      color: "default",
      value: "all",
    },
    { label: "Nháp", count: 0, color: "default", value: 0 },
    { label: "Duyệt", count: 1, color: "info", value: 1 },
    { label: "Hủy", count: 1, color: "error", value: 2 },
    { label: "Hoàn thành", count: 1, color: "success", value: 3 },
  ];

  const typeOptions: FilterOption[] = [
    { label: "Tất cả", count: 0, color: "default", value: "all" },
    { label: "Cấp phát", count: 0, color: "success", value: 1 },
    { label: "Điều chuyển", count: 3, color: "info", value: 2 },
    { label: "Thu hồi", count: 0, color: "error", value: 3 },
  ];

  const handleRowClick = (params: GridRowParams) => {
    if (activeTab !== 0) return;
    window.scrollTo({ top: 140, behavior: "smooth" });
    setSelectedRow(params.row);
    setReadOnly(true);
    setShowForm(true);
    setShowSidebar(true);
  };

  const handleSave = (values: any) => {
    const mutation = values.id ? updateMutation : createMutation;
    mutation.mutate(values, {
      onSuccess: () => setShowForm(false),
    });
  };

  const handleCloseForm = () => {
    if (!selectedRow) setShowForm(false);
    else setReadOnly(true);
    setShowSidebar(false);
  };

  const handleSignAssets = (id: string) => {
    // 1. Xác định nguồn dữ liệu dựa trên Tab hiện tại
    const currentData =
      activeTab === 0 ? handoverPage?.items : transferPage?.items;

    // 2. Tìm dòng dữ liệu (row) tương ứng với ID được truyền vào
    // Lưu ý: Kiểm tra API trả về là "id" hay "Id" để khớp với field
    const document = currentData?.find(
      (row: any) => row.id === id || row.Id === id
    );

    if (document) {
      setSelectedDocuments(document);
      setShowSignDocument(true);
    } else {
      console.error("Không tìm thấy dữ liệu cho ID:", id);
    }
  };

  const handleDelete = (ids: string[]) => {
    if (ids.length > 0) {
      ids.forEach((id) => {
        deleteOneMutation.mutate(id);
      });
    }
  };

  const handleConfirmDelete = () => {
    if (rowToDelete?.id) {
      deleteOneMutation.mutate(rowToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setRowToDelete(null);
        },
      });
    }
  };

  const columns: GridColDef<AssetHandoverFormValues>[] = [
    {
      field: "soQuyetDinh",
      headerName: "Số quyết định",
      width: 150,
      valueGetter: (params, row: any) => row.id,
      renderCell: (params) => params.value,
    },
    {
      field: "lenhDieuDong",
      headerName: "Lệnh điều động",
      width: 150,
      valueGetter: (params, row: any) => row.lenhDieuDong,
    },
    {
      field: "idDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      valueGetter: (params, row: any) => row.tenDonViGiao,
    },
    {
      field: "idDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      valueGetter: (params, row: any) => row.tenDonViNhan,
    },
    {
      field: "ngayBanGiao",
      headerName: "Ngày bàn giao",
      width: 150,
      valueGetter: (params, row: any) => row.ngayBanGiao,
    },
    {
      field: "ngayTaoChungTu",
      headerName: "Ngày tạo chứng từ",
      width: 150,
      valueGetter: (params, row: any) => row.ngayTaoChungTu,
    },
    {
      field: "nguoiTao",
      headerName: "Người lập phiếu",
      width: 160,
      valueGetter: (params, row: any) => row.tenDaiDienBenGiao || row.nguoiTao,
    },
    {
      field: "tenFile",
      headerName: "Tài liệu",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.tenFile,
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={
              params.value.length > 15
                ? params.value.substring(0, 12) + "..."
                : params.value
            }
            size="small"
            variant="outlined"
            sx={{
              color: "#2e7d32",
              borderColor: "#2e7d32",
              bgcolor: "#f1f8e9",
              borderRadius: "4px",
              width: "180px",
              "& .MuiChip-icon": {
                color: "#2e7d32",
                marginRight: "2px",
              },
            }}
            icon={<Download size={16} strokeWidth={2} />}
            clickable
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadFile(params.value);
            }}
            title={params.value}
          />
        ) : null,
    },
    {
      field: "trangThaiKy",
      headerName: "Trạng thái ký",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const row = params.row; // Lúc này row tự động có kiểu AssetHandoverFormValues
        const currentUserId = "1594";

        // (1) Tìm trong nguoiKyList
        const nguoiKyIds = row.nguoiKyList?.map((item) => item.idNguoiKy) || [];

        // (2) Tìm trong id bên giao và id bên nhận
        const sideIds = [row.idDaiDienBenGiao, row.idDaiDienBenNhan];

        // (3) Tìm trong chuKyList
        const signedIds = row.chuKyList?.map((item) => item.idNguoiKy) || [];

        // Logic kiểm tra
        const isUserAuthorized =
          nguoiKyIds.includes(currentUserId) || sideIds.includes(currentUserId);
        const isSigned = signedIds.includes(currentUserId);

        let chipConfig = { label: "Không được phép ký", color: "#ff7043" };

        if (isSigned) {
          chipConfig = { label: "Đã ký", color: "#4caf50" };
        } else if (isUserAuthorized) {
          chipConfig = { label: "Cần ký", color: "#fbc02d" };
        }

        return (
          <Chip
            label={chipConfig.label}
            size="small"
            sx={{
              bgcolor: chipConfig.color,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "170px",
            }}
          />
        );
      },
    },
    {
      field: "trangThaiPhieu",
      headerName: "Trạng thái phiếu",
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.trangThaiPhieu,
      renderCell: (params) => {
        const statusConfig: Record<number, { label: string; color: string }> = {
          0: { label: "Chưa hoàn thành", color: "#FFC121" },
          1: { label: "Đã hủy", color: "#d32f2f" },
          2: { label: "Đã hoàn thành", color: "#4caf50" },
        };

        const status = statusConfig[params.value as number] || statusConfig[0];

        return (
          <Chip
            label={status.label}
            sx={{
              bgcolor: status.color,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "180px",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.trangThai,
      renderCell: (params) => {
        const statusMap: Record<number, { label: string; color: string }> = {
          0: { label: "Nháp", color: "#bdbdbd" },
          1: { label: "Duyệt", color: "#FFC121" },
          2: { label: "Hủy", color: "#ff2121ff" },
          3: { label: "Hoàn thành", color: "#ff7043" },
        };
        const status = statusMap[params.value as number] || {
          label: "Nháp",
          color: "#bdbdbd",
        };
        return (
          <Chip
            label={status.label}
            sx={{
              bgcolor: status.color,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "180px",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "trinhDuyet",
      headerName: "Trình duyệt",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (params, row: any) => row.share,
      renderCell: (params) => (
        <Chip
          label={params.value === false ? "Chưa gửi" : "Được gửi"}
          sx={{
            bgcolor: params.value === false ? "#f44336" : "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "4px",
            width: "100px",
          }}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete([params.row.id]);
            }}
          >
            <Trash2 size={20} strokeWidth={2} color="#f44336" />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (params.row.tenFile) {
                setPreviewFileName(params.row.tenFile);
              } else {
                alert("Không có file để xem!");
              }
            }}
          >
            <Eye size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const columnsTransfer: GridColDef<AssetTransferData>[] = [
    {
      field: "tenPhieu",
      headerName: "Phiếu ký nội sinh",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "ngayKy",
      headerName: "Ngày ký",
      width: 180,
      valueGetter: (params, row: any) => row.ngayKy,
    },
    {
      field: "tggnTuNgay",
      headerName: "Ngày có hiệu lực",
      width: 180,
    },
    {
      field: "tenTrinhDuyetGiamDoc",
      headerName: "Trình duyệt ban giám đốc",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "tenFile",
      headerName: "Tài liệu duyệt",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value ? (
          <Chip
            label={
              params.value.length > 15
                ? params.value.substring(0, 12) + "..."
                : params.value
            }
            size="small"
            variant="outlined"
            sx={{
              color: "#2e7d32",
              borderColor: "#2e7d32",
              bgcolor: "#f1f8e9",
              borderRadius: "4px",
              width: "180px",
              "& .MuiChip-icon": {
                color: "#2e7d32",
              },
            }}
            icon={<Download size={16} strokeWidth={2} />}
            clickable
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadFile(params.value);
            }}
            title={params.value}
          />
        ) : null,
    },
    {
      field: "soQuyetDinh",
      headerName: "Ký số",
      width: 150,
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const isDone = params.value === 3;
        return (
          <Chip
            label={isDone ? "Hoàn thành" : "Đang xử lý"}
            sx={{
              bgcolor: isDone ? "#ff7043" : "#bdbdbd",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "130px",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleRowClick(params as any)}
          >
            <Eye size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
          <IconButton
            size="small"
            title="Tạo biên bản bàn giao tài sản"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ListPlus size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      {/* 1. DIALOG XÁC NHẬN XÓA */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}
        >
          Xóa {activeTab === 0 ? "biên bản bàn giao" : "quyết định điều động"}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: "#ffcccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={32} color="#f44336" />
            </Box>
          </Box>
          <DialogContentText>
            Bạn có chắc muốn xóa{" "}
            <strong>"{rowToDelete?.TenPhieu || rowToDelete?.id}"</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Không
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {previewFileName && (
        <SignDocumentForm
          fileName={previewFileName}
          onCancel={() => setPreviewFileName(null)}
          onDownload={handleDownloadFile}
          showSignerSidebar={false}
        />
      )}

      {/* 3. LOGIC HIỂN THỊ CHÍNH */}
      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          documents={selectedDocuments}
          onCancel={() => {
            setShowSignDocument(false);
            setSelectedDocuments([]);
          }}
          onSign={() => {
            setShowSignDocument(false);
            setSelectedIds([]);
            // Gọi API reload data ở đây
          }}
          fullscreen={true}
        />
      ) : (
        <>
          <PageAction
            title={"Biên bản bàn giao tài sản"}
            onNewClick={() => {
              setSelectedRow(null);
              setReadOnly(false);
              setShowForm(true);
              setShowSidebar(false);
            }}
          />

          <Box sx={{ p: 2 }}>
            {showForm && (
              <Box sx={{ mb: 2 }}>
                <AssetHandoverForm
                  key={selectedRow?.id || "form-key"}
                  onCancel={handleCloseForm}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  readOnly={readOnly}
                  selectedTransfer={selectedRow}
                  label={activeTab === 0 ? "Bàn giao" : "Điều động"}
                />
              </Box>
            )}

            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Grid
                size={{
                  xs: activeTab === 0 && showSidebar && selectedRow ? 9 : 12,
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "#fff",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: "bold",
                        minHeight: "64px",
                      },
                    }}
                  >
                    <Tab
                      icon={<ClassOutlined />}
                      label="Biên bản bàn giao"
                      iconPosition="top"
                    />
                    <Tab
                      icon={
                        <Badge badgeContent={3} color="error">
                          <TableChart />
                        </Badge>
                      }
                      label="Quyết định điều động"
                      iconPosition="top"
                    />
                  </Tabs>
                </Box>

                <TableCustom
                  loading={isLoading}
                  title={
                    activeTab === 0
                      ? "Biên bản bàn giao tài sản"
                      : "Biên bản điều động"
                  }
                  columns={activeTab === 0 ? columns : columnsTransfer}
                  rows={
                    activeTab === 0
                      ? handoverPage?.items || []
                      : transferPage?.items || []
                  }
                  total={
                    activeTab === 0
                      ? handoverPage?.totalItems || 0
                      : transferPage?.totalItems || 0
                  }
                  showStatusFilter={true}
                  statusOptions={activeTab === 0 ? statusOptions : typeOptions}
                  statusValue={activeTab === 0 ? currentStatus : currentType}
                  onStatusChange={(val) => {
                    if (activeTab === 0) setCurrentStatus(val);
                    else setCurrentType(val);
                  }}
                  onSign={handleSignAssets}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onDelete={(row: any) => {
                    setRowToDelete(row);
                    setDeleteDialogOpen(true);
                  }}
                />
              </Grid>

              {activeTab === 0 && showSidebar && selectedRow && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{ bgcolor: "#fafafa", borderLeft: "1px solid #e0e0e0" }}
                >
                  <SignerSidebar
                    selectedRow={selectedRow}
                    onClose={() => setShowSidebar(false)}
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
