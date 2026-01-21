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

// Import Types & Data
import { AssetTransferData, SignaturesData } from "./types";
import PageAction from "../../components/common/PageAction";
import { useParams, useSearchParams } from "react-router-dom";
import { useAssetTranferMutation } from "./Mutation";
import { useSelector } from "react-redux";
import { findById, getPermissionSigning } from "../../utils/helpers";
import {
  getTypeInfo,
  handleSendToSigner,
  isCheckShowDelete,
  showDownloadFile,
  ShowPermissionSigning,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "./config";
import { showConfirmAlert } from "../../components/Alert";
import { FilterOption } from "../../components/common/FilterStatusGroup";

export default function AssetTransfer() {
  const { user } = useSelector((state: any) => state.user);
  // State
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AssetTransferData | null>(
    null,
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const [showBienBanDialog, setShowBienBanDialog] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [departmentId, setDepartmentId] = useState("");
  const [assetTransferDetail, setAssetTransferDetail] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [assetByDepartment, setAssetByDepartment] = useState<any[]>([]);
  const {
    assetTranferPage,
    allDepartments,
    allStaff,
    allUnits,
    allCurrentStatus,
    allAssetsByDonVi,
    handleDownloadFile,
    createMutation,
    updateMutation,
    updateManyMutation,
    cancelMutation,
    deleteOneMutation,
    handleSignatureList,
    signMutation,
    handleAssetByDonVi,
  } = useAssetTranferMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
    type ? Number(type) : 1,
    user?.taiKhoan?.tenDangNhap,
    status ? Number(status) : undefined,
    departmentId,
  );

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: assetTranferPage.totalItems,
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: assetTranferPage?.trangThaiCounts?.["0"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Duyệt",
      count: assetTranferPage?.trangThaiCounts?.["1"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: assetTranferPage?.trangThaiCounts?.["2"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Hoàn thành",
      count: assetTranferPage?.trangThaiCounts?.["3"] ?? 0,
      color: "success",
      value: "3",
    },
  ];

  useEffect(() => {
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
    setReadOnly(false);
  }, [type]);

  // Usage inside your component
  const { title, label } = getTypeInfo(type);

  const handleRowClick = (params: GridRowParams) => {
    const data = params.row as AssetTransferData;
    setSelectedRow(data);
    setShowForm(true);
    setReadOnly(true);
    setShowSidebar(true);
  };

  const handleAssetTransfer = async (department: string) => {
    const result = await handleAssetByDonVi(
      type ? Number(type) : 1,
      department,
    );
    setAssetByDepartment(result?.items);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };
  const handleClose = () => {
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
    setReadOnly(false);
  };

  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleClose);
  };
  const handleSave = async (values: any) => {
    if (selectedRow) {
      await updateMutation.mutate(values);
      handleClose();
    } else {
      await createMutation.mutate(values);
      handleClose();
    }
    setShowForm(false);
    setSelectedRow(null);
  };
  const handleCancel = async () => {
    if (selectedRow) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu ${title} "${selectedRow?.id}"`,
      );
      if (confirm.isConfirmed) {
        await cancelMutation.mutate(selectedRow?.id);
        handleClose();
      }
    }
  };

  const handleSign = (data: SignaturesData[]) => {
    signMutation.mutate(data);
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setAssetTransferDetail(item.chiTietDieuDongTaiSanDTOS);
    setShowSignerSidebar(true); // Hiện sidebar khi ký
  };

  const handleViewBienBan = (rowData: AssetTransferData) => {
    console.log("Xem phiếu bàn giao:", rowData.id);
    setSelectedDocument(rowData);
    setShowBienBanDialog(true);
  };

  const columns: GridColDef<any>[] = [
    {
      field: "tenPhieu",
      headerName: "Phiếu ký nội sinh",
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "trichYeu",
      headerName: "Trích yếu",
      width: 180,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "ngayHieuLuc",
      headerName: "Ngày có hiệu lực",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell(params) {
        if (!params.row?.tggnTuNgay) return "";
        return new Date(params.row?.tggnTuNgay).toLocaleString("vi-VN");
      },
    },

    {
      field: "tenTrinhDuyetGiamDoc",
      headerName: "Trình duyệt biên bản",
      width: 160,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "tenFile",
      headerName: "Tài liệu duyệt",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (!params.value) return null;
        return showDownloadFile(params.value, () =>
          handleDownloadFile(params.value),
        );
      },
    },

    {
      field: "id",
      headerName: "Ký số",
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "tggnTuNgay",
      headerName: "Thời gian giao nhận từ ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    {
      field: "tggnDenNgay",
      headerName: "Thời gian giao nhận đến ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) => {
        if (!value) return "";
        return new Date(value).toLocaleString("vi-VN");
      },
    },

    {
      field: "idDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        findById(allDepartments, params.value)?.tenPhongBan,
    },
    {
      field: "idDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        findById(allDepartments, params.value)?.tenPhongBan,
    },
    {
      field: "trangThai",
      headerName: "Trạng thái phiếu",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => showStatus(params.row.trangThai ?? 0),
    },

    {
      field: "TrangThaiKy",
      headerName: "Trạng thái ký",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(getPermissionSigning(params.row, user, allStaff)),
    },

    {
      field: "TrangThaiBanGiao",
      headerName: "Trạng thái bàn giao",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showStatusDocument(params.row?.trangThaiPhieuDieuDong ?? 0),
    },

    {
      field: "share",
      headerName: "Trình duyệt",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.share ?? false,
          params.row?.nguoiTao == user?.taiKhoan?.tenDangNhap,
        ),
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
                color="error"
                disabled={!isCheckShowDelete(rowData, user)}
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirm = await showConfirmAlert(
                    `Xóa phiếu ${title} "${rowData?.id}"`,
                  );
                  if (confirm.isConfirmed) {
                    deleteOneMutation.mutate(rowData.id);
                  }
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
                color="success"
                onClick={async (e) => {
                  e.stopPropagation();
                  setSelectedDocument(rowData.tenFile);
                  setAssetTransferDetail(
                    rowData.chiTietDieuDongTaiSanDTOS || [],
                  );
                  setShowSignerSidebar(false); // Ẩn sidebar khi xem
                  setDepartmentId(rowData.idDonViGiao);
                  setSelectedIds([rowData.id]);
                  await handleAssetTransfer(rowData.idDonViGiao);
                  setShowSignDocument(true);
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
      {/* Dialog Xem Biên Bản */}
      <BienBanDialog
        open={showBienBanDialog}
        onClose={() => setShowBienBanDialog(false)}
        documentData={selectedDocument}
      />

      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          document={selectedDocument}
          onCancel={handleClose}
          onSign={handleSign}
          assetTransferDetail={assetTransferDetail}
          showSignerSidebar={showSignerSidebar}
          allAssetsByDonVi={assetByDepartment}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
          fullscreen={true}
          staffs={allStaff}
          handleSignatureList={handleSignatureList}
        />
      ) : (
        <>
          <PageAction
            title={title}
            onNewClick={() => {
              setShowForm(true);
              setSelectedRow(null);
              setReadOnly(false);
            }}
          />
          <Box sx={{ p: 2 }}>
            {/* FORM AREA */}
            {showForm && (
              <Box sx={{ mb: 2 }}>
                {/* Thêm margin bottom để tách biệt với bảng bên dưới */}
                <AssetTransferForm
                  key={showForm ? "new-form" : `edit-${selectedRow?.id}`}
                  onClose={handleClose}
                  readOnly={readOnly}
                  type={Number(type)}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  selectedTransfer={selectedRow}
                  label={label}
                  isSignedForm={!!selectedRow && !showForm}
                  departments={allDepartments}
                  staffs={allStaff}
                  setDepartmentId={setDepartmentId}
                  allAssetsByDonVi={allAssetsByDonVi}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
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
                size={{ xs: showSidebar ? 9 : 12 }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight: showSidebar ? "1px solid" : "none",
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
                  rows={assetTranferPage.items}
                  total={assetTranferPage.totalItems}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  // onDelete={handleDelete}
                  onSign={handleViewSignAssets}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showStatusFilter={true}
                  showDelete={false}
                  handleSendToSigner={handleSend}
                  statusOptions={statusOptions}
                  onStatusChange={(value) => {
                    setStatus(value);
                  }}
                  statusValue={status}
                  handleAssetTransfer={handleAssetTransfer}
                />
              </Grid>

              {/* SIDEBAR - Bây giờ sẽ dính liền và cao bằng Table */}
              {/* SIDEBAR - Bây giờ sẽ dính liền và cao bằng Table */}
              {showSidebar && (
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
