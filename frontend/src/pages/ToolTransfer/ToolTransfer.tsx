import { useEffect, useState } from "react";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";

import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolTransferForm from "./components/ToolTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import BienBanDialog from "./components/BienBanDialog";
import TableCustom from "../../components/common/TableCustom";
import PageAction from "../../components/common/PageAction";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { showConfirmAlert } from "../../components/Alert";
import {
  canSign,
  getPermissionSigning,
  getTypeInfo,
  handleSendToSigner,
  handleSignDocument,
  isCheckShowDelete,
  isCheckShowShare,
  showDownloadFile,
  ShowPermissionSigning,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "../ToolTransfer/config";
import { findById } from "../../utils/helpers";
import { Building, Eye, Trash2 } from "lucide-react";
import { ToolSignature, ToolTransferData } from "./types";
import { useToolTransferMutation } from "./Mutation";
import SignDocumentForm from "./components/SignDocumentForm";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { ToolHandoverData } from "../ToolHandover/types";
import { useToolHandoverDetailsQuery } from "../ToolHandover/Mutation";

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
  const [status, setStatus] = useState("");

  const {
    toolTransferPage,
    allDepartments,
    allStaff,
    allUnits,
    allCurrentStatus,
    handleDownloadFile,
    createMutation,
    updateMutation,
    updateManyMutation,
    cancelMutation,
    deleteOneMutation,
    handleSignatureList,
    signMutation,
    getToolHandoverMutation,
    handoverDetails,
  } = useToolTransferMutation(
    paginationModel.page,
    paginationModel.pageSize,
    searchValue,
    type ? Number(type) : undefined,
    status ? Number(status) : undefined,
  );

  const { data: detailData = [] } = useToolHandoverDetailsQuery(
    selectedRow?.id || "",
  );

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: toolTransferPage.loaiCounts?.[`${type}`] ?? 0,
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: toolTransferPage?.trangThaiCounts?.["0"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Duyệt",
      count: toolTransferPage?.trangThaiCounts?.["1"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: toolTransferPage?.trangThaiCounts?.["2"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Hoàn thành",
      count: toolTransferPage?.trangThaiCounts?.["3"] ?? 0,
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
  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleClose);
  };

  const handleRowClick = async (params: GridRowParams) => {
    const data = params.row as ToolTransferData;
    setSelectedRow(data);
    setReadOnly(true);

    try {
      await getToolHandoverMutation.mutateAsync(data.id);

      setShowSidebar(true);
      setShowForm(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bàn giao:", error);
      setShowSidebar(true);
    }
  };

  const handleSave = async (values: any) => {
    if (selectedRow) {
      await updateMutation.mutate(values);
      handleClose();
    } else {
      await createMutation.mutate(values);
      handleClose();
    }
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSign = (data: ToolSignature[]) => {
    signMutation.mutate(data);
  };

  const handleDelete = async (rowData: ToolTransferData) => {
    const confirm = await showConfirmAlert(
      `Xóa phiếu ${title} "${rowData.tenPhieu}"`,
    );
    if (confirm.isConfirmed) {
      deleteOneMutation.mutate(rowData.id);
    }
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setToolTransferDetail(item.chiTietDieuDongCCDCVatTuDTOS || []);
    setShowSignerSidebar(true); // Hiện sidebar khi ký
  };

  const [toolHandover, setToolHandover] = useState<ToolHandoverData[]>([]);
  const handleViewBienBan = async (id: string) => {
    const result: any[] = await getToolHandoverMutation.mutateAsync(id);
    setToolHandover(result);
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
      field: "trangThaiPhieuDieuDong",
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
        const rowData = params.row as ToolTransferData;
        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Xóa">
              <IconButton
                size="small"
                color="error"
                disabled={!isCheckShowDelete(rowData, user)}
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
                disabled={!rowData.coPhieuBanGiao}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBienBan(rowData.id);
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
                  // setDepartmentId(rowData.idDonViGiao);
                  setSelectedIds([rowData.id]);

                  setShowSignDocument(true);
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
      <BienBanDialog
        open={showBienBanDialog}
        onClose={() => setShowBienBanDialog(false)}
        toolHandover={toolHandover}
        handleSignatureList={handleSignatureList}
      />

      {showSignDocument ? (
        <SignDocumentForm
          selectedIds={selectedIds}
          document={selectedDocument}
          onCancel={handleClose}
          onSign={handleSign}
          toolTransferDetail={toolTransferDetail}
          showSignerSidebar={showSignerSidebar}
          allUnits={allUnits}
          fullscreen={true}
          staffs={allStaff}
          handleSignatureList={handleSignatureList}
        />
      ) : (
        <>
          <PageAction
            title={title}
            onNewClick={() => {
              setSelectedRow(null);
              setShowSidebar(false);
              setShowForm(true);
              setReadOnly(false);
            }}
          />

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
                allUnits={allUnits}
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
                onSign={handleViewSignAssets}
                handleSignDocument={handleSignDocument}
                canSign={canSign}
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
                isCheckShowShare={isCheckShowShare}
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
                  overflowY: "auto",
                }}
              >
                <SignerSidebar
                  selectedRow={selectedRow}
                  handoverDetails={detailData}
                  onClose={() => setShowSidebar(false)}
                />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
}
