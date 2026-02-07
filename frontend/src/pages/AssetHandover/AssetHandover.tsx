import { SyntheticEvent, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

import TableCustom from "../../components/common/TableCustom";
import PageAction from "../../components/common/PageAction";
import AssetHandoverForm from "./components/AssetHandoverForm";
import SignerSidebar from "./components/SignerSidebar";

import { AssetHandoverData, AssetTransferData, SignaturesData } from "./types";
import {
  useAssetHandoverMutation,
  useAssetHandoverPageQuery,
} from "./Mutation";
import { Eye, Trash2, ListPlus } from "lucide-react";
import { ClassOutlined, TableChart } from "@mui/icons-material";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import {
  showDownloadFile,
  showShareStatus,
  showStatus,
  showStatusDocument,
} from "../AssetTransfer/config";
import { useSelector } from "react-redux";
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
import { showConfirmAlert } from "../../components/Alert";
import SignDocumentForm from "./components/SignDocumentForm";
import SignDocumentTransferForm from "../AssetTransfer/components/SignDocumentForm";

import dayjs from "dayjs";
import { useAssetTransferPageQuery } from "../AssetTransfer/Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import { useAllStaffsQuery, useStaffMutation } from "../Staff/Mutation";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllPositionsQuery } from "../Position/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";

export default function AssetHandover() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [showSignerSidebar, setShowSignerSidebar] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const handleEdit = () => setReadOnly(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const { user } = useSelector((state: any) => state.user);
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
  } = useAssetHandoverMutation();

  const searchDebounce = useDebounce(searchValue, 600);
  const { data: handoverPage = { items: [], totalItems: 0 }, isLoading } =
    useAssetHandoverPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      user.taiKhoan?.tenDangNhap,
      currentStatus ? Number(currentStatus) : undefined,
    );

  const [storedLoaiCounts, setStoredLoaiCounts] = useState<any>({});
  const { data: transferPage = { items: [], totalItems: 0 } } =
    useAssetTransferPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      currentType ? Number(currentType) : undefined,
      undefined,
      3,
      undefined,
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
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();

  useEffect(() => {
    setSelectedIds([]);
    setSelectedRow(null);
    setShowForm(false);
    setShowSidebar(false);
  }, [activeTab]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
      count: transferPage?.loaiCounts?.["1"] ?? 0,
      color: "success",
      value: "1",
    },
    {
      label: "Điều chuyển",
      count: transferPage?.loaiCounts?.["2"] ?? 0,
      color: "info",
      value: "2",
    },
    {
      label: "Thu hồi",
      count: transferPage?.loaiCounts?.["3"] ?? 0,
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
        `Hủy phiếu bàn giao tài sản "${selectedRow?.id}"`,
      );
      if (confirm.isConfirmed) {
        await cancelMutation.mutate(selectedRow?.id);
        handleClose();
      }
    }
  };
  const handleViewSignAssets = async (fileName: string, item: any) => {
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
    assetHandover: AssetHandoverData,
  ) => {
    signMutation.mutate({ data, assetHandover });
  };

  const columns: GridColDef<AssetHandoverData>[] = [
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
        ShowPermissionSigning(getPermissionSigning(params.row, user, staffs)),
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
      headerName: "Trình duyệt",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        showShareStatus(
          params.row?.share ?? false,
          params.row?.nguoiTao == user?.taiKhoan?.tenDangNhap,
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
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
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
              <Trash2 size={20} strokeWidth={2} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem">
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
          </Tooltip>
        </Box>
      ),
    },
  ];

  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [assetTransfer, setAssetTransfer] = useState<any | null>(null);

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
              setAssetTransfer(params.row);
              setShowSignerSidebar(false); // Ẩn sidebar khi xem
              setShowSignDocument(true);
            }}
          >
            <Eye size={20} strokeWidth={2} color="#4caf50" />
          </IconButton>
          <IconButton
            size="small"
            title="Tạo biên bản bàn giao tài sản"
            onClick={(e) => {
              e.stopPropagation();
              window.scrollTo({ top: 140, behavior: "smooth" });
              setSelectedRow({
                id: "",
                soQuyetDinh: "",
                banGiaoTaiSan: "",
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
                chiTietBanGiaoTaiSan: [
                  {
                    id: "",
                    idBanGiaoTaiSan: "",
                    idTaiSan: "",
                    donViTinh: "",
                    soLuong: 1,
                    hienTrang: "1",
                    ghiChu: "",
                    isActive: true,
                    moTa: "",
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
            assetHandover={selectedRow}
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
            selectedIds={[assetTransfer.id]}
            document={selectedDocument}
            onCancel={handleClose}
            onSign={() => {}}
            assetTransferDetail={assetTransfer.chiTietDieuDongTaiSanDTOS || []}
            showSignerSidebar={showSignerSidebar}
            allUnits={allUnits}
            allCurrentStatus={allCurrentStatus}
            fullscreen={true}
            staffs={staffs}
            handleSignatureList={handleSignatureList}
          />
        )
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
                  onClose={handleClose}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onEdit={handleEdit}
                  readOnly={readOnly}
                  selectedAssetHandover={selectedRow}
                  label={activeTab === 0 ? "Bàn giao" : "Điều động"}
                  departments={departments}
                  positions={positions}
                  allUnits={allUnits}
                  staffs={staffs}
                />
              </Box>
            )}

            {/* Bước 1: Cấu trúc lại Grid để Tabs luôn chiếm 100% chiều ngang */}
            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* HÀNG 1: TABS - Luôn full width (size 12) */}
              <Grid size={{ xs: 12 }}>
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
                          badgeContent={transferPage.totalItems}
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
              </Grid>
              {/* HÀNG 2: BẢNG VÀ SIDEBAR */}
              {/* Cột bên trái: Chứa Bảng */}
              <Grid
                size={{
                  xs: activeTab === 0 && showSidebar && selectedRow ? 9 : 12,
                }}
              >
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
                  onSign={handleViewSignAssets}
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
                />
              </Grid>
              {/* Cột bên phải: Chứa Sidebar (Chỉ hiển thị khi đủ điều kiện) */}
              {activeTab === 0 && showSidebar && selectedRow && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    bgcolor: "#fafafa",
                    borderLeft: "1px solid #e0e0e0",
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
