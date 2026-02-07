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
import ToolHandoverForm from "./components/ToolHandoverForm";
import SignDocumentTransferForm from "../ToolTransfer/components/SignDocumentForm";
import {
  SignaturesData,
  ToolHandoverData,
  ToolHandoverFormValues,
} from "./types";
import { useToolHandoverMutation, useToolHandoverPageQuery } from "./Mutation";
import { Download, Eye, Trash2, ListPlus } from "lucide-react";
import { ClassOutlined, TableChart } from "@mui/icons-material";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import {
  showDownloadFile,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "../ToolTransfer/config";
import {
  canSign,
  getPermissionSigning,
  handleSendToSigner,
  handleSignDocument,
  isCheckShowDelete,
  isCheckShowShare,
  ShowPermissionSigning,
  StatusHandover,
} from "./config";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { showConfirmAlert } from "../../components/Alert";
import { ToolTransferData } from "../ToolTransfer/types";
import SignDocumentForm from "./components/SignDocumentForm";
import SignerSidebar from "./components/SignerSidebar";
import dayjs from "dayjs";
import { useAllStaffsQuery, useStaffMutation } from "../Staff/Mutation";
import { useToolTransferPageQuery } from "../ToolTransfer/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllPositionsQuery } from "../Position/Mutation";

export default function ToolHandover() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const handleEdit = () => setReadOnly(false);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const { handleDownloadS3 } = useStaffMutation();

  const {
    createMutation,
    updateMutation,
    updateManyMutation,
    cancelMutation,
    deleteOneMutation,
    signMutation,
    handleSignatureList,
    handleDownloadFile,
  } = useToolHandoverMutation();
  useEffect(() => {
    setSelectedIds([]);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
  }, [type, activeTab]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const searchDebounce = useDebounce(searchValue, 600);
  const { data: handoverPage = { items: [], totalItems: 0 }, isLoading } =
    useToolHandoverPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      currentStatus ? Number(currentStatus) : undefined,
    );
  const [storedLoaiCounts, setStoredLoaiCounts] = useState<any>({});
  const { data: transferPage = { items: [], totalItems: 0, loaiCounts: {} } } =
    useToolTransferPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      undefined,
      currentType ? Number(currentType) : undefined,
      3,
      true,
    );
  useEffect(() => {
    if (!currentType && transferPage?.loaiCounts) {
      if (
        JSON.stringify(transferPage.loaiCounts) !==
        JSON.stringify(storedLoaiCounts)
      ) {
        setStoredLoaiCounts(transferPage.loaiCounts);
      }
    }
  }, [transferPage.loaiCounts, currentType, storedLoaiCounts]);

  const { data: staffs = [] } = useAllStaffsQuery();
  const { data: departments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: positions = [] } = useAllPositionsQuery();

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count:
        (handoverPage?.groupCounts?.["0"] ?? 0) +
        (handoverPage?.groupCounts?.["1"] ?? 0) +
        (handoverPage?.groupCounts?.["2"] ?? 0) +
        (handoverPage?.groupCounts?.["3"] ?? 0),
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: handoverPage?.groupCounts?.["0"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Duyệt",
      count: handoverPage?.groupCounts?.["1"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: handoverPage?.groupCounts?.["2"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Hoàn thành",
      count: handoverPage?.groupCounts?.["3"] ?? 0,
      color: "success",
      value: "3",
    },
  ];

  const typeOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count:
        (storedLoaiCounts?.["1"] ?? 0) +
        (storedLoaiCounts?.["2"] ?? 0) +
        (storedLoaiCounts?.["3"] ?? 0),
      color: "default",
      value: "",
    },
    {
      label: "Cấp phát",
      count: storedLoaiCounts?.["1"] ?? 0,
      color: "success",
      value: "1",
    },
    {
      label: "Điều chuyển",
      count: storedLoaiCounts?.["2"] ?? 0,
      color: "info",
      value: "2",
    },
    {
      label: "Thu hồi",
      count: storedLoaiCounts?.["3"] ?? 0,
      color: "error",
      value: "3",
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    if (activeTab !== 0) return;
    window.scrollTo({ top: 140, behavior: "smooth" });
    setSelectedRow({ ...params.row, isNew: false });
    setReadOnly(true);
    setShowForm(true);
    setShowSidebar(true);
  };

  const handleCancel = async () => {
    if (selectedRow) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu bàn giao ccdc vật tư "${selectedRow?.id}"`,
      );
      if (confirm.isConfirmed) {
        await cancelMutation.mutate(selectedRow?.id);
        handleClose();
      }
    }
  };
  const handleViewSignTools = async (fileName: string, item: any) => {
    setShowSignDocument(true);
    setSelectedRow(item);
    setShowSignerSidebar(true); // Hiện sidebar khi ký
  };
  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleClose);
  };
  const handleSave = async (values: any) => {
    if (!values.isNew) {
      await updateMutation.mutate(values);
      handleClose();
    } else {
      await createMutation.mutate(values);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
    setReadOnly(false);
  };

  const handleSign = (
    data: SignaturesData[],
    assetHandover: ToolHandoverData,
  ) => {
    signMutation.mutate({ data, assetHandover });
  };

  const columns: GridColDef<ToolHandoverFormValues>[] = [
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
      renderCell: (params) => {
        if (!params.value) return null;
        return showDownloadFile(params.value, () =>
          handleDownloadS3(params.row.duongDanFile),
        );
      },
    },
    {
      field: "trangThaiKy",
      headerName: "Trạng thái ký",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ShowPermissionSigning(getPermissionSigning(params.row, user)),
    },
    {
      field: "trangThaiPhieu",
      headerName: "Trạng thái phiếu",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => StatusHandover(params.row.trangThaiPhieu ?? 0),
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => showStatus(params.row.trangThai ?? 0),
    },
    {
      field: "trinhDuyet",
      headerName: "Chia sẻ",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.share ?? false,
          params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap,
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
            disabled={!isCheckShowDelete(params.row, user)}
            onClick={async (e) => {
              e.stopPropagation();
              const confirm = await showConfirmAlert(
                `Xóa phiếu biên bản bàn giao "${params.row?.id}"`,
              );
              if (confirm.isConfirmed) {
                deleteOneMutation.mutate(params.row?.id);
              }
            }}
          >
            <Trash2 size={20} strokeWidth={2} color="#f44336" />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(params.row || []);
              setShowSignerSidebar(false); // Ẩn sidebar khi xem
              // setDepartmentId(params.row.idDonViGiao);
              setSelectedIds([params.row.id]);
              // await handleAssetTransfer(params.row.idDonViGiao);
              setShowSignDocument(true);
            }}
          >
            <Eye size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [toolTransfer, setToolTransfer] = useState<any | null>(null);
  const columnsTransfer: GridColDef<ToolTransferData>[] = [
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
      renderCell: (params) => {
        if (!params.value) return null;
        return showDownloadFile(params.value, () =>
          handleDownloadS3(params.row.duongDanFile),
        );
      },
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
      renderCell: (params) =>
        showStatusDocument(params.row?.trangThaiPhieuDieuDong ?? 0),
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
            onClick={async () => {
              setSelectedDocument(params.row.duongDanFile);
              setToolTransfer(params.row);
              setShowSignerSidebar(false); // Ẩn sidebar khi xem
              setShowSignDocument(true);
            }}
          >
            <Eye size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
          <IconButton
            size="small"
            title="Tạo biên bản bàn giao ccdc - vật tư"
            onClick={(e) => {
              e.stopPropagation();
              window.scrollTo({ top: 140, behavior: "smooth" });
              setSelectedRow({
                id: "",
                soQuyetDinh: "",
                banGiaoCCDCVatTu: "",
                quyetDinhDieuDongSo: "",
                lenhDieuDong: params.row.id,
                idDonViGiao: params.row.idDonViGiao,
                idDonViNhan: params.row.idDonViNhan,
                ngayBanGiao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                ngayQuyetDinh: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                ngayTaoChungTu: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                diaDiemQuyetDinh: "",
                idGiamDoc: "",
                idCongTy: params.row.idCongTy,
                idLanhDao: "",
                idDaiDiendonviBanHanhQD: "",
                daXacNhan: false,
                idDaiDienBenGiao: "",
                daiDienBenGiaoXacNhan: false,
                idDaiDienBenNhan: "",
                daiDienBenNhanXacNhan: false,
                trangThai: 0,
                note: "",
                ngayTao: "",
                ngayCapNhat: "",
                nguoiTao: "",
                nguoiCapNhat: "",
                isActive: true,
                share: false,
                duongDanFile: "",
                tenFile: "",
                byStep: false,
                giamDocKy: false,
                nguoiKyList: [] as any[],
                chiTietBanGiaoCCDCVatTu: [
                  {
                    id: "",
                    idBanGiaoCCDCVatTu: "",
                    idCCDCVatTu: "",
                    soLuong: 0,
                    idChiTietCCDCVatTu: "",
                    ngayTao: "",
                    ngayCapNhat: "",
                    nguoiTao: "",
                    nguoiCapNhat: "",
                    isActive: true,
                    idChiTietDieuDong: "",
                    hienTrang: "",
                    moTa: "",
                    ghiChu: "",
                  },
                ],
                initialChiTiet: [] as any[],
                isNew: true,
              });
              setReadOnly(false);
              setShowForm(true);
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
      {showSignDocument ? (
        activeTab === 0 ? (
          <SignDocumentForm
            selectedIds={selectedIds}
            onCancel={handleClose}
            onSign={handleSign}
            toolHandover={selectedRow}
            showSignerSidebar={showSignerSidebar}
            allUnits={allUnits}
            fullscreen={true}
            staffs={staffs}
            departments={departments}
            positions={positions}
            handleSignatureList={handleSignatureList}
          />
        ) : (
          <SignDocumentTransferForm
            selectedIds={selectedIds}
            document={selectedDocument}
            onCancel={handleClose}
            onSign={() => {}}
            toolTransferDetail={toolTransfer.chiTietDieuDongCCDCVatTuDTOS || []}
            showSignerSidebar={false}
            allUnits={allUnits}
            fullscreen={true}
            staffs={staffs}
            handleSignatureList={handleSignatureList}
          />
        )
      ) : (
        <>
          <PageAction
            title={"Biên bản bàn giao ccdc - vật tư"}
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
                <ToolHandoverForm
                  key={selectedRow?.id || "form-key"}
                  onClose={handleClose}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onEdit={handleEdit}
                  readOnly={readOnly}
                  selectedToolHandover={selectedRow}
                  label="Bàn giao"
                  departments={departments}
                  positions={positions}
                  allUnits={allUnits}
                  staffs={staffs}
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
                        <Badge
                          badgeContent={transferPage?.totalItems}
                          color="error"
                        >
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
                      ? "Biên bản bàn giao ccdc - vật tư"
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
                  onSign={handleViewSignTools}
                  handleSignDocument={handleSignDocument}
                  canSign={canSign}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onDelete={() => {}}
                  showDelete={false}
                  isCheckShowShare={isCheckShowShare}
                  handleSendToSigner={handleSend}
                  setSearchValue={setSearchValue}
                  searchValue={searchValue}
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
