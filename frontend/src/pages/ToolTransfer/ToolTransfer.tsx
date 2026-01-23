import { useEffect, useState } from "react";
import { Box, Grid, IconButton, Tooltip, LinearProgress } from "@mui/material";

import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolTransferForm from "./components/ToolTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import BienBanDialog from "./components/BienBanDialog";
import TableCustom from "../../components/common/TableCustom";
import PageAction from "../../components/common/PageAction";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToolTransferMutation } from "./Mutation";
import { showConfirmAlert } from "../../components/Alert";
import {
  getTypeInfo,
  isCheckShowDelete,
  showDownloadFile,
  ShowPermissionSigning,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "../ToolTransfer/config";
import ImportErrorDialog from "../../components/common/ImportErrorDialog";
import { findById, getPermissionSigning } from "../../utils/helpers";
import { Building, Eye, Trash2 } from "lucide-react";
import SignDocumentForm from "../../components/common/SignDocumentForm";
import { ToolTransferData } from "./types";

export default function ToolTransfer() {
  const { user } = useSelector((state: any) => state.user);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ToolTransferData | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const [showBienBanDialog, setShowBienBanDialog] = useState(false);
  const [toolTransferDetail, setToolTransferDetail] = useState<any[]>([]);
  const [toolByDepartment, setToolByDepartment] = useState<any[]>([]);

  const {
    toolTransferPage,
    allStaff,
    allDepartments,
    handleDownloadFile,
    handoverDetails,
    allToolsByDonVi,
    createMutation,
    updateMutation,
    deleteOneMutation,
    allUnits,
    allCurrentStatus,
    setDepartmentId,
    cancelMutation,
    signMutation,
    isFetching,
    errorState,
    handleSignatureList,
    handleToolByDonVi,
  } = useToolTransferMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
    type ? Number(type) : undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    selectedRow?.id,
  );

  useEffect(() => {
    setShowForm(false);
    setSelectedRow(null);
    setShowSidebar(false);
    setReadOnly(false);
    setSelectedIds([]);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedDocument(null);
  }, [type]);

  const { title, label } = getTypeInfo(type);

  // --- HANDLERS ---
  const handleClose = () => {
    setShowForm(false);
    setSelectedRow(null);
    setShowSidebar(false);
    setReadOnly(false);
    setSelectedIds([]);
    setShowSignDocument(false);
  };

  const handleRowClick = (params: GridRowParams) => {
    const data = params.row as ToolTransferData;
    setSelectedRow(data);
    setShowForm(true);
    setReadOnly(true);
    setShowSidebar(true);
  };

  const handleSave = async (values: any) => {
    try {
      // 1. Xử lý upload file binary nếu có
      if (values.AttachmentFile) {
        const formData = new FormData();
        formData.append("file", values.AttachmentFile);
        // await uploadFileMutation.mutateAsync(formData); // Giả định có mutation upload
      }

      const dataToSend = { ...values };
      delete dataToSend.AttachmentFile;

      // 3. Thực hiện lưu (Update hoặc Create)
      if (selectedRow) {
        await updateMutation.mutateAsync(dataToSend);
      } else {
        await createMutation.mutateAsync(dataToSend);
      }

      handleClose();
    } catch (error) {
      console.error("Lỗi khi lưu phiếu:", error);
    }
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleDelete = async (rowData: ToolTransferData) => {
    const confirm = await showConfirmAlert(
      `Xóa phiếu ${title} "${rowData.tenPhieu}"`,
    );
    if (confirm.isConfirmed) {
      deleteOneMutation.mutate(rowData.id);
    }
  };

  const handleSignTools = (id: string, rowData: ToolTransferData) => {
    setSelectedDocument(rowData);
    setShowSignerSidebar(true);
    setShowSignDocument(true);
  };

  const handleViewDocument = (rowData: ToolTransferData) => {
    setSelectedDocument(rowData);
    setShowSignerSidebar(false);
    setSelectedIds([rowData.id]);
    setShowSignDocument(true);
  };

  const handleToolTransfer = async (department: string) => {
    const result = await handleToolByDonVi(type ? Number(type) : 1, department);
    setToolByDepartment(result?.items);
  };

  const handleViewBienBan = (rowData: ToolTransferData) => {
    setSelectedDocument(rowData);
    setShowBienBanDialog(true);
  };

  const columns: GridColDef<ToolTransferData>[] = [
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
      renderCell: (params) => {
        if (!params.row?.tggnTuNgay) return "";
        return new Date(params.row?.tggnTuNgay).toLocaleString("vi-VN");
      },
    },
    {
      field: "nguoiTao",
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
      field: "soQuyetDinh",
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
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString("vi-VN") : "",
    },
    {
      field: "tggnDenNgay",
      headerName: "Thời gian giao nhận đến ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString("vi-VN") : "",
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
      renderCell: (params) => showStatus(params.value ?? 0),
    },
    {
      field: "trangThaiKy",
      headerName: "Trạng thái ký",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(getPermissionSigning(params.row, user, allStaff)),
    },
    {
      field: "trangThaiBanGiao",
      headerName: "Trạng thái bàn giao",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showStatusDocument(params.row?.trangThaiBanGiao ?? 0),
    },
    {
      field: "trinhDuyet",
      headerName: "Trình duyệt",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.trinhDuyet ?? false,
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
        const rowData = params.row as ToolTransferData;
        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(rowData);
                }}
              >
                <Trash2 size={18} />
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
                <Building size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xem">
              <IconButton
                size="small"
                color="success"
                onClick={async (e) => {
                  e.stopPropagation();
                  setSelectedDocument(rowData);
                  setToolTransferDetail(
                    rowData.chiTietDieuDongCCDCVatTuDTOS || [],
                  );
                  setShowSignerSidebar(false);
                  setDepartmentId(rowData.idDonViGiao);
                  setSelectedIds([rowData.id]);

                  try {
                    await handleToolTransfer(rowData.idDonViGiao);
                    setShowSignDocument(true);
                  } catch (error) {
                    console.warn(
                      "Không lấy được danh mục gốc, sử dụng dữ liệu chi tiết có sẵn.",
                    );
                    setShowSignDocument(true);
                  }
                }}
              >
                <Eye size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <ImportErrorDialog
        open={errorState.open}
        onClose={errorState.onClose}
        errors={errorState.errors}
      />

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
          onSign={() => signMutation.mutate}
          showSignerSidebar={showSignerSidebar}
          fullscreen={true}
        />
      ) : (
        <>
          <PageAction
            title={title}
            onNewClick={() => {
              setSelectedRow(null);
              setShowForm(true);
              setReadOnly(false);
            }}
          />

          <Box sx={{ p: 2, position: "relative" }}>
            {isFetching && (
              <LinearProgress
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  height: 2,
                }}
              />
            )}

            {showForm && (
              <Box sx={{ mb: 2 }}>
                <ToolTransferForm
                  key={selectedRow ? `edit-${selectedRow.id}` : "new-form"}
                  onClose={handleClose}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onCancel={async () => {
                    if (selectedRow) {
                      const confirm = await showConfirmAlert(
                        `Bạn có chắc muốn hủy phiếu "${selectedRow.tenPhieu}"?`,
                      );
                      if (confirm.isConfirmed)
                        cancelMutation.mutate(selectedRow.id);
                    }
                  }}
                  readOnly={readOnly}
                  selectedTool={selectedRow}
                  departments={allDepartments}
                  staffs={allStaff}
                  setDepartmentId={setDepartmentId}
                  allToolsByDonVi={allToolsByDonVi}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
                  label={label}
                  type={Number(type)}
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
                // 1. Cố định chiều cao ở đây
                height: "calc(100vh)",
              }}
            >
              <Grid
                size={{ xs: showSidebar ? 9 : 12 }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight: showSidebar ? "1px solid" : "none",
                  borderColor: "divider",
                  height: "100%", // Chiếm 100% chiều cao cha
                  display: "flex",
                  flexDirection: "column",
                  // 2. Cho phép scroll bên trong nếu nội dung quá dài
                  overflow: "hidden",
                  "& .MuiPaper-root": {
                    margin: 0,
                    boxShadow: "none",
                    borderRadius: 0,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    height: "100%", // Ép Paper chiếm hết chiều cao
                    overflow: "hidden",
                  },
                }}
              >
                <TableCustom
                  title={`Danh sách phiếu ${label}`}
                  columns={columns}
                  rows={toolTransferPage.items || []}
                  total={toolTransferPage.totalItems || 0}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onDelete={(ids: string[]) => {}}
                  onSign={handleSignTools}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showStatusFilter={true}
                />
              </Grid>

              {showSidebar && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa",
                    height: "100%",
                    // 3. Sidebar cũng cần scroll riêng nếu danh sách người ký quá dài
                    overflowY: "auto",
                  }}
                >
                  <SignerSidebar
                    selectedRow={selectedRow}
                    handoverDetails={handoverDetails}
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
