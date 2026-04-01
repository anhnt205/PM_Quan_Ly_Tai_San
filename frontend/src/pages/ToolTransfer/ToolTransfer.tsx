import { useEffect, useState } from "react";
import { Box, Grid, IconButton, Tooltip, Tabs, Tab } from "@mui/material";
import { VisibilityOff } from "@mui/icons-material";

import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import ToolTransferForm from "./components/ToolTransferForm";
import SignerSidebar from "./components/SignerSidebar";
import BienBanDialog from "./components/BienBanDialog";
import TableCustom from "../../components/common/TableCustom";
import PageAction from "../../components/common/PageAction";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { showConfirmAlert } from "../../components/Alert";
import {
  canSign,
  getDecision,
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
} from "../AssetTransfer/config"; // Dùng chung config
import { Building, Eye, Trash2, Edit } from "lucide-react";
import { ToolSignature, ToolTransferData } from "./types";
import { useToolTransferMutation, useToolTransferPageQuery } from "./Mutation";
import SignDocumentForm from "./components/SignDocumentForm";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { ToolHandoverData } from "../ToolHandover/types";
import { useToolHandoverDetailsQuery } from "../ToolHandover/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { useAllStaffsQuery, useStaffMutation } from "../Staff/Mutation";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import S3Service from "../../services/S3Service";
import BienBanTabContent from "./components/BienBanTabContent";

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

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const [showBienBanDialog, setShowBienBanDialog] = useState(false);
  const [toolTransferDetail, setToolTransferDetail] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [sidebarMode, setSidebarMode] = useState<"document" | "signer" | null>(
    null,
  );
  const [isFullPageSign, setIsFullPageSign] = useState(false);
  const [toolHandover, setToolHandover] = useState<any[]>([]);
  const {
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
    decisionMutation,
  } = useToolTransferMutation();

  const { data: detailData = [] } = useToolHandoverDetailsQuery(
    selectedRow?.id || "",
  );

  const searchDebounce = useDebounce(searchValue, 600);
  const {
    data: toolTransferPage = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
      loaiCounts: {},
    },
    isLoading,
  } = useToolTransferPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    user?.taiKhoan?.tenDangNhap,
    type ? Number(type) : undefined,
    status ? Number(status) : undefined,
  );

  const { data: allStaffs = [] } = useAllStaffsQuery();
  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();

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
      label: "Phê duyệt",
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
      label: "Chưa ban hành",
      count: toolTransferPage?.trangThaiCounts?.["3"] ?? 0,
      color: "secondary",
      value: "3",
    },
    {
      label: "Đã ban hành",
      count: toolTransferPage?.trangThaiCounts?.["4"] ?? 0,
      color: "success",
      value: "4",
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

  useEffect(() => {
    if (location.state?.autoCreate) {
      setSelectedRow(null);
      setShowSidebar(false);
      setShowForm(true);
      setReadOnly(false);

      navigate(location.pathname + location.search, { replace: true });
    }
  }, [
    location.state?.autoCreate,
    location.pathname,
    location.search,
    navigate,
  ]);

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
    setShowForm(false);
    setReadOnly(true);
    setShowSidebar(true);
    setSidebarMode("document");
    setShowSignDocument(true);
    setIsFullPageSign(false);
    setTabValue(0);
    setSelectedDocument(data.taiLieuCuoi);
    setToolTransferDetail(data.chiTietDieuDongCCDCVatTuDTOS || []);

    // Tải biên bản
    if (data.coPhieuBanGiao) {
      const result: any[] = await getToolHandoverMutation.mutateAsync(data.id);
      setToolHandover(result);
    } else {
      setToolHandover([]);
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
    signMutation.mutate({
      SignaturesData: data,
      toolTransfer: selectedRow,
    });
  };

  const handleDelete = async (rowData: ToolTransferData) => {
    const confirm = await showConfirmAlert(
      `Xóa phiếu ${title} "${rowData.tenPhieu}"`,
    );
    if (confirm.isConfirmed) {
      deleteOneMutation.mutate(rowData);
    }
  };

  const handleDecision = (data: any[]) => {
    decisionMutation.mutate(data, {
      onSuccess: () => {
        // Chủ động cập nhật lại state của selectedRow ngay khi ban hành thành công
        setSelectedRow((prev: any) => {
          if (!prev) return prev;

          // Kiểm tra xem row đang được chọn (đang mở Sidebar) có nằm trong danh sách vừa ban hành không
          const isJustIssued = data.some((item) => item.id === prev.id);

          if (isJustIssued) {
            // Nếu có, trả về một object mới và ghi đè trangThai thành 4 (Đã ban hành)
            return { ...prev, trangThai: 4 };
          }

          return prev;
        });
      },
    });
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setIsFullPageSign(true); // Luôn cho full screen khi click action Ký
    setSelectedRow(item);
    setToolTransferDetail(item.chiTietDieuDongCCDCVatTuDTOS || []);
  };

  const handleViewBienBan = async (id: string) => {
    const result: any[] = await getToolHandoverMutation.mutateAsync(id);
    setToolHandover(result);
    setShowSidebar(true);
    setSidebarMode("document");
    setTabValue(2);
  };

  const columns: GridColDef<ToolTransferData>[] = [
    {
      field: "trangThai",
      headerName: "Trạng thái phiếu",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => showStatus(params.value ?? 0),
    },
    {
      field: "id",
      headerName: "Mã",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
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
        if (!params.row?.tgGnTuNgay) return "";
        return new Date(params.row?.tgGnTuNgay).toLocaleString("vi-VN");
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
          S3Service.download(params.row.duongDanFile),
        );
      },
    },
    {
      field: "tgGnTuNgay",
      headerName: "Thời gian giao nhận từ ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString("vi-VN") : "",
    },
    {
      field: "tgGnDenNgay",
      headerName: "Thời gian giao nhận đến ngày",
      width: 160,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString("vi-VN") : "",
    },
    {
      field: "tenDonViGiao",
      headerName: "Đơn vị giao",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tenDonViNhan",
      headerName: "Đơn vị nhận",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "trangThaiKy",
      headerName: "Trạng thái ký",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(
          getPermissionSigning(params.row, user, allStaffs),
        ),
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
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
              alignItems: "center",
              height: "100%", // Thêm dòng này để Box lấp đầy chiều cao của cell
              width: "100%", // Thêm dòng này để đảm bảo căn giữa ngang tuyệt đối
            }}
          >
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
            <Tooltip title="Sửa">
              <IconButton
                size="small"
                color="info"
                // disabled={rowData.trangThai !== 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRow(rowData);
                  setReadOnly(true);
                  setShowForm(true);
                  setShowSidebar(false);
                }}
              >
                <Edit size={18} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Xem phiếu bàn giao">
              <IconButton
                size="small"
                color="primary"
                disabled={!rowData.coPhieuBanGiao}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBienBan(rowData.id);
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
                  handleRowClick({ row: rowData } as any);
                }}
              >
                <Eye size={18} />
              </IconButton>
            </Tooltip> */}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {/* Biên bản Dialog không còn dùng trực tiếp vì chuyển sang Tab */}

      {showSignDocument && isFullPageSign ? (
        <SignDocumentForm
          key={selectedRow?.id}
          selectedIds={selectedIds}
          document={selectedDocument}
          onCancel={handleClose}
          onSign={handleSign}
          toolTransferDetail={toolTransferDetail}
          showSignerSidebar={showSignerSidebar}
          allUnits={allUnits}
          fullscreen={true}
          staffs={allStaffs}
          handleSignatureList={handleSignatureList}
          isEdit={false}
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
          <Box sx={{ p: 2 }}>
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
                        cancelMutation.mutate(selectedRow);
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
                height: "calc(100vh)",
              }}
            >
              <Grid
                size={{
                  xs: showSidebar && sidebarMode === "document" ? 6 : 12,
                }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight: showSidebar ? "1px solid" : "none",
                  borderColor: "divider",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <TableCustom
                  tableId="toolTransfer"
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
                  handleDecision={handleDecision}
                  isDecision={getDecision}
                  isCheckShowShare={isCheckShowShare}
                  loading={isLoading}
                />
              </Grid>

              {showSidebar && sidebarMode === "document" && (
                <Grid
                  size={{ xs: 6 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "white",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "white",
                      pr: 1,
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={(_, newValue) => setTabValue(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#04b46eff",
                        },
                        "& .MuiTab-root": {
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          minWidth: 100,
                          "&.Mui-selected": {
                            color: "#04b46eff",
                          },
                        },
                      }}
                    >
                      <Tab label="Tài liệu" />
                      <Tab label="Quy trình ký" />
                      <Tab label="Biên bản" />
                    </Tabs>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowSidebar(false);
                        setSidebarMode(null);
                      }}
                    >
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    {tabValue === 0 ? (
                      <Box
                        sx={{
                          height: "calc(100vh - 120px)",
                          overflow: "hidden",
                        }}
                      >
                        <SignDocumentForm
                          key={selectedRow?.id}
                          selectedIds={selectedIds}
                          document={selectedDocument}
                          onCancel={handleClose}
                          onSign={handleSign}
                          toolTransferDetail={toolTransferDetail}
                          showSignerSidebar={false}
                          allUnits={allUnits}
                          fullscreen={false}
                          staffs={allStaffs}
                          isEdit={false}
                          title={`${selectedRow?.tenPhieu || ""} (${selectedRow?.id || ""})`}
                        />
                      </Box>
                    ) : tabValue === 1 ? (
                      <Box
                        sx={{
                          height: "calc(100vh - 120px)",
                          overflow: "hidden",
                        }}
                      >
                        <SignerSidebar
                          key={selectedRow?.id}
                          selectedRow={selectedRow}
                          handoverDetails={detailData}
                          onClose={() => {
                            setShowSidebar(false);
                            setSidebarMode(null);
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: "calc(100vh - 120px)",
                          overflow: "hidden",
                        }}
                      >
                        <BienBanTabContent
                          toolHandover={toolHandover}
                          handleSignatureList={handleSignatureList}
                          onClose={handleClose}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
}
