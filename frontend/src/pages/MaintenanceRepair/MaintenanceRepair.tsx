import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Badge,
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
import { Trash2, ListPlus } from "lucide-react";
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
} from "./config";
import {
  useMaintenanceRepairMutation,
  useMaintenanceRepairPageQuery,
} from "./Mutation";
import { useDebounce } from "../../hooks/useDebounce";
import {
  useMaintenancePlanningMutation,
  useMaintenancePlanningPageQuery,
} from "../MainenancePlanRepair/Mutation";
import { showPeriod, showPlanType } from "../MainenancePlanRepair/config";
import { CongTy, StatusPlan } from "../../utils/const";
import S3Service from "../../services/S3Service";
import SignDocumentForm from "./components/SignDocumentForm";
import { SignaturesData } from "./types";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

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

  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: allStaffs = [] } = useAllStaffsQuery();

  const location = useLocation();
  const navigate = useNavigate();

  // API queries — load data from server
  const { data: repairPageData = { items: [], totalItems: 0 } } =
    useMaintenanceRepairPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      undefined,
      status !== "" ? parseInt(status) : undefined,
      user?.taiKhoan?.tenDangNhap,
    );
  const { getPlanningDetailMutation } = useMaintenancePlanningMutation();

  const searchDebounce = useDebounce(searchValue, 600);
  const { data: planPageData = { items: [], totalItems: 0 } } =
    useMaintenancePlanningPageQuery(
      paginationModel.page,
      paginationModel.pageSize,
      searchDebounce,
      undefined,
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

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleClose = useCallback(() => {
    setSelectedIds([]);
    setSelectedDocument(null);
    setSearchValue("");
    setShowSignDocument(false);
    setSelectedRepair(null);
    setShowForm(false);
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

  const handleSave = useCallback(
    async (values: any) => {
      const enrichedValues = {
        ...values,
        tenDonViGiao:
          allDepartments.find((d: any) => d.id === values.idDonViGiao)
            ?.tenPhongBan || "",
        tenDonViNhan:
          allDepartments.find((d: any) => d.id === values.idDonViNhan)
            ?.tenPhongBan || "",
        tenTrinhDuyetGiamDoc:
          allStaffs.find((s: any) => s.id === values.idTrinhDuyetGiamDoc)
            ?.hoTen || "",
      };

      if (values.id) {
        updateRepairMutation.mutate(enrichedValues);
      } else {
        createRepairMutation.mutate(enrichedValues);
      }
      handleClose();
    },
    [
      allDepartments,
      allStaffs,
      updateRepairMutation,
      createRepairMutation,
      handleClose,
    ],
  );

  const handleSign = (data: SignaturesData[]) => {
    signMutation.mutate({
      SignaturesData: data,
      asset: selectedRepair,
    });
  };

  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleClose);
  };
  const handleCancel = useCallback(async () => {
    if (selectedRepair) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu sửa chữa bảo dưỡng "${selectedRepair?.id}"`,
      );
      if (confirm && confirm.isConfirmed) {
        cancelMutation.mutate(
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

  const [repairDetailDetail, setRepairDetail] = useState<any[]>([]);
  const handleViewSignAssets = async (fileName: string, item: any) => {
    setSelectedDocument(fileName);
    setShowSignDocument(true);
    setSelectedRepair(item);
    setRepairDetail(item.chiTietDieuDongTaiSanDTOS);
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
        headerName: "Trình duyệt biên bản",
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
        field: "id",
        headerName: "Ký số",
        width: 140,
        headerAlign: "center",
        align: "center",
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
            </Box>
          );
        },
      },
    ],
    [user, allDepartments, handleRowClick, handleDelete],
  );

  const planningColumns: GridColDef<any>[] = [
    {
      field: "tenKeHoach",
      headerName: "Tên kế hoạch",
      flex: 2,
      minWidth: 160,
      editable: false,
    },
    {
      field: "loaiKeHoach",
      headerName: "Loại kế hoạch",
      flex: 1.5,
      minWidth: 130,
      editable: false,
      renderCell: (params: any) => showPlanType(params.value),
    },
    {
      field: "thuocKy",
      headerName: "Thuộc kỳ",
      flex: 1,
      minWidth: 100,
      editable: false,
      renderCell: (params: any) => showPeriod(params.row.ngayBatDau),
    },
    {
      field: "tenDonViThucHien",
      headerName: "Đơn vị",
      flex: 1.5,
      minWidth: 130,
      editable: false,
    },
    {
      field: "tenNguoiPhuTrach",
      headerName: "Người phụ trách",
      flex: 1.5,
      minWidth: 120,
      editable: false,
    },
    {
      field: "ngayBatDau",
      headerName: "Ngày bắt đầu",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "ngayKetThuc",
      headerName: "Ngày kết thúc",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      flex: 1.2,
      minWidth: 120,
      editable: false,
      renderCell: (params: any) => showStatus(params.value),
    },
    {
      field: "ngayTao",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 100,
      editable: false,
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
          <IconButton
            size="small"
            title="Tạo phiếu sửa chữa bảo dưỡng"
            onClick={async (e) => {
              e.stopPropagation();
              window.scrollTo({ top: 140, behavior: "smooth" });

              // 2. Set dữ liệu vào state để truyền xuống form
              setSelectedRepair({
                id: "",
                idCongTy: CongTy.CT001,
                idKeHoach: params.row.id,
                maSuaChua: "",
                tenSuaChua: "",
                loaiDoiTuong: params.row.loaiDoiTuong,
                idLoaiSuaChua: "",
                idDonViGiao: "",
                idDonViNhan: params.row.idDonViThucHien,
                idNguoiKyNhay: "",
                trangThaiKyNhay: false,
                nguoiLapPhieuKyNhay: false,
                ngayKetThucDuKien: dayjs(new Date()).format("YYYY-MM-DD"),
                idTrinhDuyetCapPhong: "",
                trinhDuyetCapPhongXacNhan: false,
                idTrinhDuyetGiamDoc: "",
                trinhDuyetGiamDocXacNhan: false,
                idDonViDeNghi: "",
                duongDanFile: "",
                tenFile: "",
                taiLieuBanGhi: "",
                byStep: false,
                soQuyetDinh: "",
                nguoiTao: "",
                share: false,
                daBanGiao: false,
                coPhieuBanGiao: false,
                taiLieuCuoi: "",
                loai: 0,
                tenDonViGiao: "",
                tenDonViNhan: "",
                tenDonViDeNghi: "",
                tenNguoiKyNhay: "",
                tenTrinhDuyetCapPhong: "",
                tenTrinhDuyetGiamDoc: "",
                trangThai: 0,
                ghiChu: "",
                nguoiKyList: [] as any[],
                initialChiTiet: [] as any[],
                chiTietSuaChuas: [],
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

  const handleCreateFromPlan = useCallback((plan: any) => {
    const prefilledData = {
      id: "",
      idKeHoach: plan.id,
      loaiDoiTuong: plan.loaiDoiTuong || "",
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
                          badgeContent={planPageData.totalItems}
                          color="error"
                        >
                          <TableChart />
                        </Badge>
                      }
                      label="Kế hoạch sửa chữa bảo dưỡng"
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
                  columns={activeTabRepair === 0 ? columns : planningColumns}
                  rows={
                    activeTabRepair === 0
                      ? repairPageData.items
                      : planPageData.items
                  }
                  total={
                    activeTabRepair === 0
                      ? repairPageData?.totalItems || 0
                      : planPageData?.totalItems || 0
                  }
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowClick={handleRowClick}
                  showStatusFilter={activeTabRepair === 0}
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
          assetTransferDetail={repairDetailDetail}
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
