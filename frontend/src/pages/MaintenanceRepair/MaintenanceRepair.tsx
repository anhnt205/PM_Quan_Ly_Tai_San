import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Badge,
  Chip,
} from "@mui/material";
import { ClassOutlined, TableChart } from "@mui/icons-material";
import { useState, useMemo, useCallback, useEffect } from "react";
import PageAction from "../../components/common/PageAction";
import MaintenanceRepairForm from "./components/MaintenanceRepairForm";
import MaintenanceRepairDetailSidebar from "./components/MaintenanceRepairDetailSidebar";
import TableCustom from "../../components/common/TableCustom";
import { useSelector } from "react-redux";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { GridColDef } from "@mui/x-data-grid";
import { Trash2, ListPlus, Eye, Building } from "lucide-react";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import {
  showStatus,
  showShareStatus,
  showDownloadFile,
  ShowPermissionSigning,
  getPermissionSigning,
  handleSendToSigner,
  canSign,
  handleSignDocument,
  isCheckShowShare,
  showStatusDocument,
} from "./config";
import { showStatus as showStatusPlan } from "../MainenancePlanRepair/config";
import {
  useMaintenanceRepairMutation,
  useMaintenanceRepairPageQuery,
  useMaintenanceRepairResultMutation,
  useMaintenanceRepairResultPageQuery,
} from "./Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import {
  useMaintenancePlanningMutation,
  useMaintenancePlanningPageQuery,
} from "../MainenancePlanRepair/Mutation";
import { showPeriod } from "../MainenancePlanRepair/config";
import { CongTy, StatusPlan } from "../../utils/const";
import S3Service from "../../services/S3Service";
import SignDocumentForm from "./components/SignDocumentForm";
import { SignaturesData } from "./types";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import MaintenanceRepairResultForm from "./components/MaintenanceRepairResultForm";
import KetQuaDialog from "./components/KetQuaDialog";

export default function MaintenanceRepair() {
  const { user } = useSelector((state: any) => state.user);

  const [showForm, setShowForm] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [maintenanceRepairs, setMaintenanceRepairs] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [activeTabRepair, setActiveTabRepair] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showKetQuaDialog, setShowKetQuaDialog] = useState(false);
  const [result, setResult] = useState<any[]>([]);

  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: allStaffs = [] } = useAllStaffsQuery();

  const location = useLocation();
  const navigate = useNavigate();

  // API queries — load data from server
  const searchDebounce = useDebounce(searchValue, 600);
  const { data: repairPageData = { items: [], totalItems: 0 } } =
    useMaintenanceRepairPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      status !== "" ? parseInt(status) : undefined,
      user?.taiKhoan?.tenDangNhap,
    );

  const { data: resultPageData = { items: [], totalItems: 0 } } =
    useMaintenanceRepairResultPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      status !== "" ? parseInt(status) : undefined,
      user?.taiKhoan?.tenDangNhap,
    );

  // Repair mutations
  const {
    createMutation: createRepairMutation,
    updateMutation: updateRepairMutation,
    cancelMutation,
    deleteOneMutation: deleteRepairMutation,
    deleteManyMutation: deleteManyRepairMutation,
    updateManyMutation,
    signMutation,
  } = useMaintenanceRepairMutation();

  const {
    createMutation: createRepairResultMutation,
    updateMutation: updateRepairResultMutation,
    cancelMutation: cancelResultMutation,
    deleteOneMutation: deleteRepairResultMutation,
    deleteManyMutation: deleteManyRepairResultMutation,
    updateManyMutation: updateManyRepairResultMutation,
    signMutation: signResultMutation,
    getResultByRepairMutation,
  } = useMaintenanceRepairResultMutation();

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleClose = useCallback(() => {
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRepair(null);
    setSelectedRepair(null);
    setShowForm(false);
    setShowResultForm(false);
    setShowSidebar(false);
    setReadOnly(false);
    setMaintenanceRepairs([]);
  }, []);

  const handleRowClick = useCallback(
    (params: any) => {
      setSelectedRepair(params.row);
      setShowForm(true);
      setShowResultForm(false);
      setReadOnly(true);
      setShowSidebar(true);
    },
    [maintenanceRepairs],
  );

  const handleRowResultClick = useCallback(
    (params: any) => {
      setSelectedRepair(params.row);
      setShowForm(false);
      setShowResultForm(true);
      setReadOnly(true);
      setShowSidebar(false);
    },
    [maintenanceRepairs],
  );

  const handleSave = useCallback(
    async (values: any) => {
      if (values.id) {
        updateRepairMutation.mutate(values);
      } else {
        createRepairMutation.mutate(values);
      }
      handleClose();
    },
    [updateRepairMutation, createRepairMutation, handleClose],
  );

  const handleSaveResult = useCallback(
    async (values: any) => {
      if (values.id) {
        updateRepairResultMutation.mutate(values);
      } else {
        createRepairResultMutation.mutate(values);
      }
      handleClose();
    },
    [updateRepairResultMutation, createRepairResultMutation, handleClose],
  );

  const handleSign = (data: SignaturesData[]) => {
    if (activeTabRepair === 0) {
      signMutation.mutate({
        SignaturesData: data,
        asset: selectedRepair,
      });
    } else {
      signResultMutation.mutate({
        SignaturesData: data,
        asset: selectedRepair,
      });
    }
  };

  const handleSend = (items: any[]) => {
    handleSendToSigner(
      items,
      activeTabRepair === 0
        ? updateManyMutation.mutateAsync
        : updateManyRepairResultMutation.mutateAsync,
      handleClose,
    );
  };
  const handleCancel = useCallback(async () => {
    if (selectedRepair && activeTabRepair === 0) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu sửa chữa bảo dưỡng "${selectedRepair?.id}"`,
      );
      if (confirm && confirm.isConfirmed) {
        cancelMutation.mutate(
          { id: selectedRepair.id, trangThai: 3 },
          { onSuccess: handleClose },
        );
      }
    } else if (selectedRepair && activeTabRepair === 1) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu kết quả sửa chữa "${selectedRepair?.id}"`,
      );
      if (confirm && confirm.isConfirmed) {
        cancelResultMutation.mutate(
          { id: selectedRepair.id, trangThai: 3 },
          { onSuccess: handleClose },
        );
      }
    }
  }, [selectedRepair, handleClose, cancelMutation]);

  const handleDelete = useCallback(
    async (data: any) => {
      const confirm = await showConfirmAlert(
        `Xóa phiếu sửa chữa bảo dưỡng "${data.id}"`,
      );
      if (confirm?.isConfirmed) {
        deleteRepairMutation.mutate(data, {
          onSuccess: () => {
            handleClose();
          },
        });
      }
    },
    [handleClose, selectedRepair, deleteRepairMutation],
  );
  const handleViewKetQua = async (id: string) => {
    const result: any[] = await getResultByRepairMutation.mutateAsync(id);
    setResult(result);
    setShowKetQuaDialog(true);
  };

  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setSelectedRepair(item);
    setShowSidebar(true); // Hiện sidebar khi ký
  };
  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      count: repairPageData?.trangThaiCounts?.["tatCa"] ?? 0,
      color: "default",
      value: "",
    },
    {
      label: "Nháp",
      count: repairPageData?.trangThaiCounts?.["nhap"] ?? 0,
      color: "default",
      value: "0",
    },
    {
      label: "Duyệt",
      count: repairPageData?.trangThaiCounts?.["choDuyet"] ?? 0,
      color: "info",
      value: "1",
    },
    {
      label: "Hủy",
      count: repairPageData?.trangThaiCounts?.["huy"] ?? 0,
      color: "error",
      value: "2",
    },
    {
      label: "Hoàn thành",
      count: repairPageData?.trangThaiCounts?.["hoanThanh"] ?? 0,
      color: "success",
      value: "3",
    },
  ];
  const columns: GridColDef<any>[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Mã",
        width: 140,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenSuaChua",
        headerName: "Tên Phiếu",
        width: 180,
        headerAlign: "center",
        align: "left",
      },

      {
        field: "idLoaiSuaChua",
        headerName: "Loại sửa chữa",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "ngayTao",
        headerName: "Ngày lập phiếu",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell(params) {
          if (!params.row?.ngayTao) return "";
          return new Date(params.row?.ngayTao).toLocaleString("vi-VN");
        },
      },

      {
        field: "ngayKetThucDuKien",
        headerName: "Thời gian dự kiến hoàn thành",
        width: 180,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenTrinhDuyetGiamDoc",
        headerName: "Trình duyệt sửa chữa",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenFile",
        headerName: "Tài liệu duyệt",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return showDownloadFile(
            params.value,
            () => S3Service.download(params.row.duongDanFile),
            // handleDownloadFile(params.value),
          );
        },
      },
      {
        field: "tenDonViGiao",
        headerName: "Đơn vị giao",
        width: 160,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "tenDonViNhan",
        headerName: "Đơn vị nhận",
        width: 160,
        headerAlign: "center",
        align: "center",
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
          ShowPermissionSigning(
            getPermissionSigning(params.row, user, allStaffs),
          ),
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
            params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap,
          ),
      },
      {
        field: "result",
        headerName: "Kết quả sửa chữa",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) =>
          showStatusDocument(params.row.tinhTrangThucHien),
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
          const hasFile = !!params.row?.tenFile;
          return (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              <Tooltip title="Xóa">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(params.row);
                  }}
                  sx={{
                    padding: "4px",
                    "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
                  }}
                >
                  <Trash2 size={20} strokeWidth={2} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xem phiếu sửa chữa">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDocument(params.row.taiLieuCuoi);
                    setShowSignDocument(true);
                    setShowSidebar(false);
                  }}
                  sx={{
                    padding: "4px",
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  }}
                >
                  <Eye size={20} strokeWidth={2} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xem phiếu kết quả">
                <IconButton
                  color="primary"
                  disabled={!params.row.coPhieuKetQua}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewKetQua(params.row.id);
                  }}
                  sx={{
                    padding: "4px",
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  }}
                >
                  <Building size={20} strokeWidth={2} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Lập phiếu kết quả sửa chữa">
                <span>
                  <IconButton
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowForm(false);
                      setSelectedRepair({
                        id: "",
                        idCongTy: CongTy.CT001,
                        tenPhieu: "",
                        ngayBatDauThucTe: dayjs(new Date()).format(
                          "YYYY-MM-DD",
                        ),
                        ngayKetThucThucTe: dayjs(new Date()).format(
                          "YYYY-MM-DD",
                        ),
                        idDonViGiao: params.row.idDonViGiao,
                        idDonViNhan: params.row.idDonViNhan,
                        idNguoiKyNhay: "",
                        trangThaiKyNhay: false,
                        nguoiLapPhieuKyNhay: false,
                        idTrinhDuyetCapPhong: "",
                        trinhDuyetCapPhongXacNhan: false,
                        idTrinhDuyetGiamDoc: "",
                        trinhDuyetGiamDocXacNhan: false,
                        idDonViDeNghi: "",
                        duongDanFile: "",
                        tenFile: "",
                        taiLieuBanGhi: "",
                        byStep: false,
                        nguoiTao: "",
                        share: false,
                        ngayTao: "",
                        taiLieuCuoi: "",
                        trangThai: 0,
                        ngayCapNhat: "",
                        idLoaiSuaChua: params.row.idLoaiSuaChua,
                        ghiChu: "",
                        idSuaChua: params.row.id,
                        chiPhiPhanCong: 0,
                        chiPhiThueNgoai: 0,
                        nguoiKyList: [] as any[],
                        initialTaiSan: [],
                        initialVatTu: [],
                        chiTietTaiSanList: [] as any[],
                      });
                      setShowResultForm(true);
                    }}
                    sx={{
                      padding: "4px",
                      "&:hover": { bgcolor: "rgba(76, 175, 80, 0.08)" },
                    }}
                  >
                    <ListPlus size={20} strokeWidth={2} color="#4caf50" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [user, allDepartments, handleRowClick, handleDelete],
  );

  const resultColumns: GridColDef<any>[] = [
    {
      field: "id",
      headerName: "Mã",
      width: 140,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "tenPhieu",
      headerName: "Tên phiếu",
      flex: 2,
      minWidth: 160,
      editable: false,
    },
    {
      field: "tenDonViGiao",
      headerName: "Đơn vị giao",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenDonViNhan",
      headerName: "Đơn vị thực hiện",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenFile",
      headerName: "Tài liệu duyệt",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return showDownloadFile(
          params.value,
          () => S3Service.download(params.row.duongDanFile),
          // handleDownloadFile(params.value),
        );
      },
    },
    {
      field: "ngayBatDauThucTe",
      headerName: "Ngày bắt đầu",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "ngayKetThucThucTe",
      headerName: "Ngày kết thúc",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 100,
      editable: false,
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
        ShowPermissionSigning(
          getPermissionSigning(params.row, user, allStaffs),
        ),
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
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Xóa">
            <IconButton
              color="error"
              onClick={async (e) => {
                e.stopPropagation();
                const confirm = await showConfirmAlert(
                  `Xóa phiếu kết quả sửa chữa "${params.row.id}"`,
                );
                if (confirm?.isConfirmed) {
                  deleteRepairResultMutation.mutate(params.row, {
                    onSuccess: () => {
                      handleClose();
                    },
                  });
                }
              }}
              sx={{
                padding: "4px",
                "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
              }}
            >
              <Trash2 size={20} strokeWidth={2} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem phiếu kết quả sửa chữa">
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDocument(params.row.taiLieuCuoi);
                setShowSignDocument(true);
                setShowSidebar(false);
              }}
              sx={{
                padding: "4px",
                "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
              }}
            >
              <Eye size={20} strokeWidth={2} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCreateFromPlan = useCallback((plan: any) => {
    const prefilledData = {
      id: "",
      idKeHoach: plan.id,
      idLoaiSuaChua: plan.idLoaiSuaChua,
      idDonViGiao: plan.idDonViGiao || "",
      idDonViNhan: plan.idDonViThucHien || "",
      ngayKetThucDuKien: plan.ngayKetThuc
        ? dayjs(plan.ngayKetThuc).format("YYYY-MM-DD")
        : dayjs(new Date()).format("YYYY-MM-DD"),
    };

    setSelectedRepair(prefilledData);
    setActiveTabRepair(0);
    setShowForm(true);
    setShowResultForm(false);
    setReadOnly(false);
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    if (location.state?.createFromPlan) {
      const planData = location.state.createFromPlan;
      handleCreateFromPlan(planData);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, handleCreateFromPlan, navigate, location.pathname]);

  return (
    <>
      <KetQuaDialog
        open={showKetQuaDialog}
        onClose={() => setShowKetQuaDialog(false)}
        result={result}
      />
      {!showSignDocument ? (
        <>
          <PageAction
            title="Sửa chữa, bảo dưỡng"
            onNewClick={() => {
              setSelectedRepair(null);
              setReadOnly(false);
              setShowForm(true);
              setShowSidebar(false);
            }}
          />
          <Box sx={{ p: 2 }}>
            {showForm && (
              <Box sx={{ mb: 2 }}>
                <MaintenanceRepairForm
                  key={showForm ? "new-form" : `edit-${selectedRepair?.id}`}
                  onClose={handleClose}
                  readOnly={readOnly}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  selectedRepair={selectedRepair}
                  departments={allDepartments}
                  staffs={(allStaffs || []).filter(
                    (staff: any) => staff.hasAccount,
                  )}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
                />
              </Box>
            )}
            {showResultForm && selectedRepair && !showForm && (
              <Box sx={{ mb: 2 }}>
                <MaintenanceRepairResultForm
                  key={`result-form-${selectedRepair?.id}`}
                  onClose={() => setShowResultForm(false)}
                  selectedRepair={selectedRepair}
                  readOnly={readOnly}
                  onSave={handleSaveResult}
                  onCancel={handleCancel}
                  onEdit={handleEdit}
                  departments={allDepartments}
                  staffs={(allStaffs || []).filter(
                    (staff: any) => staff.hasAccount,
                  )}
                  repairs={repairPageData.items}
                  allUnits={allUnits}
                  allCurrentStatus={allCurrentStatus}
                />
              </Box>
            )}

            <Grid
              container
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              {/* Tab header row */}
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
                    value={activeTabRepair}
                    onChange={(_e, v) => {
                      setActiveTabRepair(v);
                      setShowForm(false);
                      setShowResultForm(false);
                      setShowSidebar(false);
                    }}
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
                      label="Phếu sửa chữa bảo dưỡng"
                      iconPosition="top"
                    />
                    <Tab
                      icon={
                        <Badge
                          badgeContent={resultPageData.totalItems}
                          color="error"
                        >
                          <TableChart />
                        </Badge>
                      }
                      label="Kết quả sửa chữa bảo dưỡng"
                      iconPosition="top"
                    />
                  </Tabs>
                </Box>
              </Grid>

              {/* Table row */}
              <Grid
                size={{
                  xs: activeTabRepair === 0 && showSidebar ? 9 : 12,
                }}
                sx={{
                  transition: "all 0.3s ease",
                  borderRight:
                    activeTabRepair === 0 && showSidebar ? "1px solid" : "none",
                  borderColor: "divider",
                  "& .MuiPaper-root": {
                    margin: 0,
                    boxShadow: "none",
                    borderRadius: 0,
                  },
                }}
              >
                <TableCustom
                  title={
                    activeTabRepair === 0
                      ? "Phếu sửa chữa bảo dưỡng"
                      : "Kế hoạch sửa chữa bảo dưỡng"
                  }
                  columns={activeTabRepair === 0 ? columns : resultColumns}
                  rows={
                    activeTabRepair === 0
                      ? repairPageData.items
                      : resultPageData.items
                  }
                  total={
                    activeTabRepair === 0
                      ? repairPageData?.totalItems || 0
                      : resultPageData?.totalItems || 0
                  }
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={
                    activeTabRepair === 0
                      ? handleRowClick
                      : handleRowResultClick
                  }
                  showStatusFilter={true}
                  statusOptions={statusOptions}
                  statusValue={status}
                  onStatusChange={(value) => {
                    setStatus(value);
                  }}
                  selectedIds={selectedIds}
                  onSelectionChange={(ids) => {
                    setSelectedIds(ids);
                  }}
                  onDelete={() => {}}
                  showDelete={false}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  handleSendToSigner={handleSend}
                  onSign={handleViewSignAssets}
                  handleSignDocument={handleSignDocument}
                  isCheckShowShare={isCheckShowShare}
                  canSign={canSign}
                />
              </Grid>

              {/* Sidebar - only for tab 0 */}
              {activeTabRepair === 0 && showSidebar && (
                <Grid
                  size={{ xs: 3 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "#fafafa",
                    borderLeft: "1px solid #e0e0e0",
                  }}
                >
                  <MaintenanceRepairDetailSidebar
                    selectedRepair={selectedRepair}
                    onClose={() => setShowSidebar(false)}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      ) : (
        <SignDocumentForm
          selectedIds={selectedIds}
          document={selectedDocument}
          onCancel={handleClose}
          onSign={handleSign}
          listAsset={[]}
          listTool={[]}
          showSignerSidebar={showSidebar}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
          fullscreen={true}
          staffs={allStaffs}
          isEdit={false}
        />
      )}
    </>
  );
}
