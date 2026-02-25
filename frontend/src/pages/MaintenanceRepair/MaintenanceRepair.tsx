import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  Typography,
  Tab,
  Tabs,
  Badge,
} from "@mui/material";
import { ClassOutlined, TableChart } from "@mui/icons-material";
import { useState, useMemo, useCallback, useEffect } from "react";
import PageAction from "../../components/common/PageAction";
import MaintenanceRepairForm from "./components/MaintenanceRepairForm";
import MaintenanceRepairResultForm from "./components/MaintenanceRepairResultForm";
import MaintenanceRepairDetailSidebar from "./components/MaintenanceRepairDetailSidebar";
import MaintenancePlanCalendar from "./components/MaintenancePlanCalendar";
import MaintenancePlanningForm from "./components/MaintenancePlanningForm";
import TableCustom from "../../components/common/TableCustom";
import { useSelector } from "react-redux";
import { useAllDepartmentsQuery } from "../Department/Mutation";
import { useAllUnitsQuery } from "../Unit/Mutation";
import { useAllCurrentStatusQuery } from "../CurrentStatus/Mutation";
import { useAllStaffsQuery } from "../Staff/Mutation";
import { showConfirmAlert } from "../../components/Alert";
import { GridColDef } from "@mui/x-data-grid";
import { Trash2, FileText, FileCheck, Calendar } from "lucide-react";
import { SignHeader } from "../../components/SignDocument/SignHeader";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import { showStatus, showShareStatus } from "./config";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MaintenancePlanData } from "./types/planning";
import {
  useMaintenanceRepairPageQuery,
  useMaintenanceRepairMutation,
  useMaintenancePlanningPageQuery,
  useMaintenancePlanningMutation,
  useRepairResultPageQuery,
} from "./Mutation";
import { useAllAssetsQuery } from "../AssetManager/Mutation";
import { useAllToolQuery } from "../ToolManager/Mutation";

export default function MaintenanceRepair() {
  const { user } = useSelector((state: any) => state.user);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const location = useLocation();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showPlanningForm, setShowPlanningForm] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedRepairForResult, setSelectedRepairForResult] =
    useState<any>(null);
  const [maintenanceRepairs, setMaintenanceRepairs] = useState<any[]>([]);
  const [maintenancePlans, setMaintenancePlans] = useState<
    MaintenancePlanData[]
  >([]);
  const [status, setStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSignDocument, setShowSignDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MaintenancePlanData | null>(
    null,
  );
  const [activeTabRepair, setActiveTabRepair] = useState(0);
  const [repairResults, setRepairResults] = useState<any[]>([]);
  const [resultPaginationModel, setResultPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const { data: allDepartments = [] } = useAllDepartmentsQuery();
  const { data: allUnits = [] } = useAllUnitsQuery();
  const { data: allCurrentStatus = [] } = useAllCurrentStatusQuery();
  const { data: allStaffs = [] } = useAllStaffsQuery();

  useEffect(() => {
    if (location.state?.autoCreate) {
      setShowForm(true);
      setSelectedRepair(null);
      setReadOnly(false);

      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Assets & Tools for planning
  const { data: rawAssets = [] } = useAllAssetsQuery();
  const { data: rawTools = [] } = useAllToolQuery();
  const allEquipment = useMemo(
    () => [
      ...rawAssets.map((a: any) => ({
        ...a,
        ten: a.tenTaiSan || a.ten || "",
        loaiThietBi: "tai_san",
      })),
      ...rawTools.map((t: any) => ({
        ...t,
        ten: t.ten || "",
        loaiThietBi: "ccdc",
      })),
    ],
    [rawAssets, rawTools],
  );

  // API queries — load data from server
  const { data: repairPageData } = useMaintenanceRepairPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    undefined,
    type !== "2" ? 1 : undefined,
    status !== "" ? parseInt(status) : undefined,
  );

  const { data: repairResultPageData } = useRepairResultPageQuery(
    resultPaginationModel.page,
    resultPaginationModel.pageSize,
  );

  const { data: planPageData } = useMaintenancePlanningPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    undefined,
    status !== "" ? parseInt(status) : undefined,
  );

  useEffect(() => {
    if (repairPageData) {
      const items = Array.isArray(repairPageData)
        ? repairPageData
        : (repairPageData?.content ?? []);
      setMaintenanceRepairs(items);
    }
  }, [repairPageData]);

  useEffect(() => {
    if (planPageData) {
      const items = Array.isArray(planPageData)
        ? planPageData
        : (planPageData?.content ?? []);
      setMaintenancePlans(items);
    }
  }, [planPageData]);

  useEffect(() => {
    if (repairResultPageData) {
      const items = Array.isArray(repairResultPageData)
        ? repairResultPageData
        : (repairResultPageData?.content ?? repairResultPageData?.items ?? []);
      setRepairResults(items);
    }
  }, [repairResultPageData]);

  // Repair mutations
  const {
    createMutation: createRepairMutation,
    updateMutation: updateRepairMutation,
    updateStatusMutation: updateRepairStatusMutation,
    deleteMutation: deleteRepairMutation,
    deleteManyMutation: deleteManyRepairMutation,
  } = useMaintenanceRepairMutation();

  // Maintenance Planning mutations
  const {
    createMutation: createPlanMutation,
    updateMutation: updatePlanMutation,
    deleteMutation: deletePlanMutation,
  } = useMaintenancePlanningMutation();

  // Handlers for maintenance planning
  const handlePlanningClose = () => {
    setShowPlanningForm(false);
    setReadOnly(false);
    // Không xóa selectedPlan → sidebar vẫn hiển thị sau khi đóng form
  };

  const handlePlanningEdit = () => {
    setReadOnly(false);
  };

  const handlePlanningSave = (planData: MaintenancePlanData) => {
    if (selectedPlan?.id) {
      // Cập nhật local state ngay lập tức (không chờ API)
      setMaintenancePlans((prev) =>
        prev.map((plan) => (plan.id === planData.id ? planData : plan)),
      );
      setSelectedPlan(planData);
      setShowPlanningForm(false);
      setReadOnly(false);
      // Tự động gọi API nếu có (bất đồng bộ, không chặn UI)
      updatePlanMutation.mutate(planData, {
        onError: (error) => {
          console.warn(
            "API update failed (local state already updated):",
            error,
          );
        },
      });
    } else {
      // Tạo mới
      const newPlan = {
        ...planData,
        id: planData.id || `KH-${Date.now()}`,
      };
      setMaintenancePlans((prev) => [newPlan, ...prev]);
      setShowPlanningForm(false);
      setReadOnly(false);
      createPlanMutation.mutate(newPlan, {
        onError: (error) => {
          console.warn(
            "API create failed (local state already updated):",
            error,
          );
        },
      });
    }
  };

  const handleDeleteSelectedPlanning = () => {
    selectedIds.forEach((id) => {
      deletePlanMutation.mutate(id, {
        onSuccess: () => {
          setMaintenancePlans((prev) => prev.filter((plan) => plan.id !== id));
        },
        onError: (error) => {
          console.error("Error deleting plan:", error);
        },
      });
    });
    setSelectedIds([]);
  };

  // Define planning table columns
  const planningColumns = [
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
      renderCell: (params: any) => {
        const types: Record<string, string> = {
          thiet_bi: "Theo thiết bị",
          chu_ky_thoi_gian: "Theo chu kỳ",
          gio_may: "Theo giờ máy",
        };
        return types[params.value as string] || params.value;
      },
    },
    {
      field: "kyText",
      headerName: "Thuộc kỳ",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "tenDonVi",
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
      field: "trangThaiText",
      headerName: "Trạng thái",
      flex: 1.2,
      minWidth: 120,
      editable: false,
      renderCell: (params: any) => {
        const statusMap: Record<
          string,
          { label: string; bg: string; color: string }
        > = {
          "Chưa thực hiện": {
            label: "Chưa thực hiện",
            bg: "#fff3e0",
            color: "#e65100",
          },
          "Đang thực hiện": {
            label: "Đang thực hiện",
            bg: "#e3f2fd",
            color: "#0277bd",
          },
          "Đã hoàn thành": {
            label: "Đã hoàn thành",
            bg: "#e8f5e9",
            color: "#2e7d32",
          },
        };
        const s = statusMap[params.value as string];
        if (!s) return params.value || "";
        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: "16px",
              bgcolor: s.bg,
              color: s.color,
              fontSize: "0.75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </Box>
        );
      },
    },
    {
      field: "ngayTaoFormatted",
      headerName: "Ngày tạo",
      flex: 1,
      minWidth: 100,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 100,
      editable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Tạo phiếu SCBD từ kế hoạch này">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowPlanningForm(false);
                setSelectedRepair({
                  idKeHoach: params.row.id,
                  idPhanXuong: params.row.idDonVi,
                  tenPhieu: `Phiếu SCBD - ${params.row.tenKeHoach}`,
                });
                setReadOnly(false);
                setShowForm(true);
              }}
            >
              <FileText fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa kế hoạch">
            <IconButton
              size="small"
              color="error"
              onClick={async (e) => {
                e.stopPropagation();
                const confirm = await showConfirmAlert(
                  `Xóa kế hoạch "${params.row.tenKeHoach}"?`,
                );
                if (confirm?.isConfirmed) {
                  setMaintenancePlans((prev) =>
                    prev.filter((p) => p.id !== params.row.id),
                  );
                  if (selectedPlan?.id === params.row.id) {
                    setSelectedPlan(null);
                    setShowPlanningForm(false);
                    setShowSidebar(false);
                  }
                }
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Planning status filter options
  const planningStatusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count: maintenancePlans.length,
      color: "primary",
    },
    {
      label: "Chưa thực hiện",
      value: "0",
      count: maintenancePlans.filter((plan) => plan.trangThai === 0).length,
      color: "warning",
    },
    {
      label: "Đang thực hiện",
      value: "1",
      count: maintenancePlans.filter((plan) => plan.trangThai === 1).length,
      color: "info",
    },
    {
      label: "Đã hoàn thành",
      value: "2",
      count: maintenancePlans.filter((plan) => plan.trangThai === 2).length,
      color: "success",
    },
  ];

  const statusOptions: FilterOption[] = useMemo(
    () => [
      {
        label: "Tất cả",
        count: maintenanceRepairs.length,
        color: "default",
        value: "",
      },
      {
        label: "Nháp",
        count: maintenanceRepairs.filter((item) => item.trangThai === 0).length,
        color: "default",
        value: "0",
      },
      {
        label: "Duyệt",
        count: maintenanceRepairs.filter((item) => item.trangThai === 1).length,
        color: "info",
        value: "1",
      },
      {
        label: "Đang sửa chữa",
        count: maintenanceRepairs.filter((item) => item.trangThai === 2).length,
        color: "secondary",
        value: "2",
      },
      {
        label: "Hủy",
        count: maintenanceRepairs.filter((item) => item.trangThai === 3).length,
        color: "error",
        value: "3",
      },
      {
        label: "Hoàn thành",
        count: maintenanceRepairs.filter((item) => item.trangThai === 4).length,
        color: "success",
        value: "4",
      },
    ],
    [maintenanceRepairs],
  );

  const filteredRepairs = useMemo(() => {
    let result = maintenanceRepairs;

    // Filter by type if provided
    if (type) {
      result = result.filter((item) => item.loai === parseInt(type));
    }

    // Filter by status if provided
    if (status !== "") {
      result = result.filter((item) => item.trangThai === parseInt(status));
    }

    return result;
  }, [maintenanceRepairs, status, type]);

  // Determine page title based on type parameter
  const pageTitle = useMemo(() => {
    if (type === "1") {
      return "Sửa chữa bảo dưỡng";
    } else if (type === "2") {
      return "Lập kế hoạch sửa chữa bảo dưỡng";
    }
    return "Danh sách sửa chữa bảo dưỡng";
  }, [type]);

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleClose = useCallback(() => {
    setSelectedRepair(null);
    setShowForm(false);
    setShowResultForm(false);
    setReadOnly(false);
    setShowSidebar(false);
  }, []);

  const handleRowClick = useCallback(
    (params: any) => {
      const fullRepair = maintenanceRepairs.find((r) => r.id === params.row.id);
      setSelectedRepair(fullRepair || params.row);
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

  const handleCancel = useCallback(async () => {
    if (selectedRepair) {
      const confirm = await showConfirmAlert(
        `Hủy phiếu sửa chữa bảo dưỡng "${selectedRepair?.id}"`,
      );
      if (confirm && confirm.isConfirmed) {
        updateRepairStatusMutation.mutate(
          { id: selectedRepair.id, trangThai: 3 },
          { onSuccess: handleClose },
        );
      }
    }
  }, [selectedRepair, handleClose, updateRepairStatusMutation]);

  const handleDeleteSelected = useCallback(
    (ids: string[]) => {
      deleteManyRepairMutation.mutate(ids, {
        onSuccess: () => {
          setSelectedIds([]);
          if (selectedRepair && ids.includes(selectedRepair.id)) {
            handleClose();
          }
        },
      });
    },
    [selectedRepair, handleClose, deleteManyRepairMutation],
  );

  const handleDelete = useCallback(
    async (rowId: string) => {
      const confirm = await showConfirmAlert(
        `Xóa phiếu sửa chữa bảo dưỡng "${rowId}"`,
      );
      if (confirm?.isConfirmed) {
        deleteRepairMutation.mutate(rowId, {
          onSuccess: () => {
            if (selectedRepair?.id === rowId) handleClose();
          },
        });
      }
    },
    [handleClose, selectedRepair, deleteRepairMutation],
  );

  const handleViewPdf = useCallback(
    async (_fileName: string, _filePath: string) => {
      // TODO: Implement S3 file preview
    },
    [],
  );

  const columns: GridColDef<any>[] = useMemo(
    () => [
      {
        field: "tenPhieu",
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
        field: "ngayYeuCauHoanThanh",
        headerName: "Thời gian yêu cầu hoàn thành",
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
      },

      {
        field: "id",
        headerName: "Ký số",
        width: 140,
        headerAlign: "center",
        align: "center",
      },

      {
        field: "idPhanXuong",
        headerName: "Phân xưởng quản lý",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const dept = allDepartments.find(
            (d: any) => d.id === params.row?.idPhanXuong,
          );
          return dept?.tenPhongBan || params.row?.idPhanXuong || "";
        },
      },

      {
        field: "idDonViTiepNhanTaiSan",
        headerName: "Đơn vị tiếp nhận",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const dept = allDepartments.find(
            (d: any) => d.id === params.row?.idDonViTiepNhanTaiSan,
          );
          return dept?.tenPhongBan || params.row?.idDonViTiepNhanTaiSan || "";
        },
      },

      {
        field: "trangThai",
        headerName: "Trạng thái phiếu",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => showStatus(params.row?.trangThai ?? 0),
      },

      {
        field: "share",
        headerName: "Trình duyệt",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const isMyCreated =
            params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap;
          return showShareStatus(params.row?.share ?? false, isMyCreated);
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
          const hasFile = !!params.row?.tenFile;
          return (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              <Tooltip title={hasFile ? "Xem tài liệu" : "Chưa có tài liệu"}>
                <span>
                  <IconButton
                    color="info"
                    disabled={!hasFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPdf(
                        params.row.tenFile,
                        params.row.duongDanFile,
                      );
                    }}
                    sx={{
                      padding: "4px",
                      "&:hover:not(:disabled)": {
                        bgcolor: "rgba(2, 136, 209, 0.08)",
                      },
                    }}
                  >
                    <FileText size={20} strokeWidth={2} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Lập phiếu kết quả sửa chữa">
                <span>
                  <IconButton
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowForm(false);
                      setSelectedRepairForResult(params.row);
                      setShowResultForm(true);
                    }}
                    sx={{
                      padding: "4px",
                      "&:hover": { bgcolor: "rgba(76, 175, 80, 0.08)" },
                    }}
                  >
                    <FileCheck size={20} strokeWidth={2} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(params.row.id);
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
    [user, allDepartments, handleRowClick, handleDelete, handleViewPdf],
  );

  const repairResultColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Mã phiếu kết quả",
        width: 160,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "idPhieuScbd",
        headerName: "Mã phiếu SCBD",
        width: 160,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "ngayHoanThanh",
        headerName: "Ngày hoàn thành",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          if (!params.value) return "";
          const d = new Date(params.value);
          return isNaN(d.getTime()) ? params.value : d.toLocaleString("vi-VN");
        },
      },
      {
        field: "idPhanXuong",
        headerName: "Phân xưởng",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          const dept = allDepartments.find(
            (d: any) => d.id === params.row?.idPhanXuong,
          );
          return dept?.tenPhongBan || params.value || "";
        },
      },
      {
        field: "tongChiPhi",
        headerName: "Tổng chi phí",
        width: 140,
        headerAlign: "center",
        align: "right",
        renderCell: (params) => {
          if (params.value == null) return "";
          return Number(params.value).toLocaleString("vi-VN") + " đ";
        },
      },
      {
        field: "ketQuaText",
        headerName: "Kết quả",
        width: 150,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "ghiChu",
        headerName: "Ghi chú",
        flex: 1,
        minWidth: 160,
        headerAlign: "center",
        align: "left",
      },
      {
        field: "ngayTao",
        headerName: "Ngày tạo",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          if (!params.value) return "";
          const d = new Date(params.value);
          return isNaN(d.getTime())
            ? params.value
            : d.toLocaleDateString("vi-VN");
        },
      },
    ],
    [allDepartments],
  );

  return (
    <>
      {!showSignDocument ? (
        <>
          <PageAction
            title={
              type === "2"
                ? "Lập kế hoạch sửa chữa bảo dưỡng"
                : "Sửa chữa bảo dưỡng"
            }
            onNewClick={() => {
              if (type === "2") {
                handlePlanningClose();
                setShowPlanningForm(true);
              } else if (activeTabRepair === 0) {
                handleClose();
                setShowForm(true);
              }
            }}
          />
          <Box sx={{ p: 2 }}>
            {type === "2" ? (
              <>
                {showPlanningForm && (
                  <Box sx={{ mb: 2 }}>
                    <MaintenancePlanningForm
                      key={
                        selectedPlan
                          ? `view-planning-${selectedPlan.id}`
                          : "new-planning-form"
                      }
                      onClose={handlePlanningClose}
                      readOnly={readOnly}
                      onEdit={handlePlanningEdit}
                      onSave={handlePlanningSave}
                      selectedPlan={selectedPlan}
                      departments={allDepartments}
                      staffs={allStaffs}
                      assets={allEquipment}
                    />
                  </Box>
                )}

                {showResultForm &&
                  selectedRepairForResult &&
                  !showPlanningForm && (
                    <Box sx={{ mb: 2 }}>
                      <MaintenanceRepairResultForm
                        key={`plan-result-${selectedRepairForResult?.id}`}
                        onClose={() => {
                          setShowResultForm(false);
                          setSelectedRepairForResult(null);
                        }}
                        selectedRepair={{
                          ...selectedRepairForResult,
                          // Map Planning fields sang ResultForm fields
                          idPhanXuong: selectedRepairForResult?.idDonVi || "",
                          idDonViDeNghi: selectedRepairForResult?.idDonVi || "",
                          idDonViTiepNhanTaiSan:
                            selectedRepairForResult?.idDonVi || "",
                          idNguoiKyNhay:
                            selectedRepairForResult?.idNguoiPhuTrach || "",
                          idTrinhDuyetCapPhong:
                            selectedRepairForResult?.idNguoiPhuTrach || "",
                        }}
                        readOnly={false}
                        onSave={(_data) => {
                          setShowResultForm(false);
                          setSelectedRepairForResult(null);
                        }}
                        onCancel={() => {
                          setShowResultForm(false);
                          setSelectedRepairForResult(null);
                        }}
                        departments={allDepartments}
                        staffs={(allStaffs || []).filter(
                          (staff: any) => staff.hasAccount,
                        )}
                      />
                    </Box>
                  )}

                <Grid container spacing={2} sx={{ height: "100vh" }}>
                  <Grid size={{ xs: showSidebar ? 9 : 12 }}>
                    <TableCustom
                      title="Danh sách kế hoạch"
                      rows={maintenancePlans
                        .filter((plan) =>
                          status === ""
                            ? true
                            : plan.trangThai === parseInt(status),
                        )
                        .map((plan) => {
                          const d = plan.ngayBatDau
                            ? new Date(plan.ngayBatDau)
                            : null;
                          const thang = d ? d.getMonth() + 1 : null;
                          const nam = d ? d.getFullYear() : null;
                          const quy = thang ? Math.ceil(thang / 3) : null;
                          const kyText = d
                            ? `T${thang}/${nam} · Q${quy}/${nam}`
                            : "—";
                          return {
                            ...plan,
                            kyText,
                            trangThaiText:
                              plan.trangThai === 0
                                ? "Chưa thực hiện"
                                : plan.trangThai === 1
                                  ? "Đang thực hiện"
                                  : plan.trangThai === 2
                                    ? "Đã hoàn thành"
                                    : "Không xác định",
                            ngayTaoFormatted: plan.ngayTao
                              ? (() => {
                                  const d = new Date(plan.ngayTao);
                                  return isNaN(d.getTime())
                                    ? plan.ngayTao.split(",")[0]
                                    : d.toLocaleDateString("vi-VN");
                                })()
                              : "N/A",
                          };
                        })}
                      columns={planningColumns}
                      total={
                        status === ""
                          ? maintenancePlans.length
                          : maintenancePlans.filter(
                              (p) => p.trangThai === parseInt(status),
                            ).length
                      }
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      checkboxSelection
                      onRowClick={(params) => {
                        const fullPlan = maintenancePlans.find(
                          (p) => p.id === params.row.id,
                        );
                        setSelectedPlan(fullPlan || params.row);
                        setReadOnly(true);
                        setShowPlanningForm(true);
                        setShowResultForm(false);
                        setShowSidebar(true);
                      }}
                      statusOptions={planningStatusOptions}
                      statusValue={status}
                      onStatusChange={(value: string) => {
                        setStatus(value);
                      }}
                      selectedIds={selectedIds}
                      onSelectionChange={(ids) => {
                        setSelectedIds(ids);
                      }}
                      onDelete={handleDeleteSelectedPlanning}
                      showDelete={true}
                      extraActions={
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Calendar size={16} />}
                          sx={{
                            bgcolor: showCalendar
                              ? "success.dark"
                              : "success.main",
                            "&:hover": { bgcolor: "success.dark" },
                          }}
                          onClick={() => setShowCalendar((v) => !v)}
                        >
                          {showCalendar ? "Bảng" : "Lịch"}
                        </Button>
                      }
                      customContent={
                        showCalendar ? (
                          <MaintenancePlanCalendar
                            onClose={() => setShowCalendar(false)}
                            plans={maintenancePlans}
                            onPlanClick={(plan) => {
                              setSelectedPlan(plan);
                              setReadOnly(true);
                              setShowPlanningForm(true);
                              setShowSidebar(true);
                              setShowCalendar(false);
                            }}
                          />
                        ) : undefined
                      }
                    />
                  </Grid>

                  {showSidebar && selectedPlan && (
                    <Grid
                      size={{ xs: 3 }}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#fafafa",
                        borderLeft: "1px solid",
                        borderColor: "divider",
                        p: 2,
                        overflowY: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Chi tiết kế hoạch
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setShowSidebar(false);
                            // Xóa plan chỉ khi form cũng không mở
                            if (!showPlanningForm) setSelectedPlan(null);
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Tên kế hoạch
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {selectedPlan?.tenKeHoach || "—"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Loại kế hoạch
                          </Typography>
                          <Typography variant="body2">
                            {selectedPlan?.loaiKeHoach === "thiet_bi"
                              ? "Theo thiết bị"
                              : selectedPlan?.loaiKeHoach === "chu_ky_thoi_gian"
                                ? "Chu kỳ thời gian"
                                : selectedPlan?.loaiKeHoach === "gio_may"
                                  ? "Giờ máy"
                                  : "—"}
                          </Typography>
                        </Box>
                        {selectedPlan?.ngayBatDau &&
                          (() => {
                            const d = new Date(selectedPlan.ngayBatDau);
                            const thang = d.getMonth() + 1;
                            const quy = Math.ceil(thang / 3);
                            const nam = d.getFullYear();
                            return (
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Thuộc kỳ
                                </Typography>
                                <Typography variant="body2">
                                  Tháng {thang} · Quý {quy} · Năm {nam}
                                </Typography>
                              </Box>
                            );
                          })()}
                        {selectedPlan?.loaiKeHoach === "chu_ky_thoi_gian" && (
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Chu kỳ (ngày)
                            </Typography>
                            <Typography variant="body2">
                              {selectedPlan?.chu_ky_thoi_gian} ngày
                            </Typography>
                          </Box>
                        )}
                        {selectedPlan?.loaiKeHoach === "gio_may" && (
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Mốc giờ máy
                            </Typography>
                            <Typography variant="body2">
                              {selectedPlan?.gio_may_bao_duong} giờ
                            </Typography>
                          </Box>
                        )}
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Đơn vị thực hiện
                          </Typography>
                          <Typography variant="body2">
                            {selectedPlan?.tenDonVi || "—"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Người phụ trách
                          </Typography>
                          <Typography variant="body2">
                            {selectedPlan?.tenNguoiPhuTrach || "—"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Ngày bắt đầu
                          </Typography>
                          <Typography variant="body2">
                            {selectedPlan?.ngayBatDau || "—"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Ngày kết thúc
                          </Typography>
                          <Typography variant="body2">
                            {selectedPlan?.ngayKetThuc || "—"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Trạng thái
                          </Typography>
                          <Typography variant="body2">
                            {selectedPlan?.trangThai === 0
                              ? "❓ Chưa thực hiện"
                              : selectedPlan?.trangThai === 1
                                ? "⏳ Đang thực hiện"
                                : "✅ Đã hoàn thành"}
                          </Typography>
                        </Box>
                        {selectedPlan?.ghiChu && (
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Ghi chú
                            </Typography>
                            <Typography variant="body2">
                              {selectedPlan.ghiChu}
                            </Typography>
                          </Box>
                        )}
                        {selectedPlan?.danhSachThietBi &&
                          selectedPlan.danhSachThietBi.length > 0 && (
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Thiết bị ({selectedPlan.danhSachThietBi.length})
                              </Typography>
                              {selectedPlan.danhSachThietBi.map((tb, i) => (
                                <Typography key={i} variant="body2">
                                  • {tb.tenThietBi || tb.idThietBi}
                                </Typography>
                              ))}
                            </Box>
                          )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </>
            ) : (
              <>
                {activeTabRepair === 0 && showForm && !showResultForm && (
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

                {activeTabRepair === 0 &&
                  showResultForm &&
                  selectedRepairForResult &&
                  !showForm && (
                    <Box sx={{ mb: 2 }}>
                      <MaintenanceRepairResultForm
                        key={`result-form-${selectedRepairForResult?.id}`}
                        onClose={() => setShowResultForm(false)}
                        selectedRepair={selectedRepairForResult}
                        readOnly={false}
                        onSave={(_data) => {
                          // TODO: Implement API call to save result
                          setShowResultForm(false);
                        }}
                        onCancel={() => setShowResultForm(false)}
                        departments={allDepartments}
                        staffs={(allStaffs || []).filter(
                          (staff: any) => staff.hasAccount,
                        )}
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
                              badgeContent={repairResults.length}
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
                        activeTabRepair === 0 && showSidebar
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      "& .MuiPaper-root": {
                        margin: 0,
                        boxShadow: "none",
                        borderRadius: 0,
                      },
                    }}
                  >
                    {activeTabRepair === 0 ? (
                      <TableCustom
                        title={pageTitle}
                        columns={columns}
                        rows={filteredRepairs}
                        total={filteredRepairs.length}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        onRowClick={handleRowClick}
                        showStatusFilter={true}
                        statusOptions={statusOptions}
                        onStatusChange={(value) => {
                          setStatus(value);
                        }}
                        statusValue={status}
                        selectedIds={selectedIds}
                        onSelectionChange={(ids) => {
                          setSelectedIds(ids);
                        }}
                        onDelete={handleDeleteSelected}
                        showDelete={true}
                      />
                    ) : (
                      <TableCustom
                        title="Kết quả sửa chữa bảo dưỡng"
                        columns={repairResultColumns}
                        rows={repairResults}
                        total={repairResults.length}
                        paginationModel={resultPaginationModel}
                        onPaginationModelChange={setResultPaginationModel}
                        checkboxSelection={false}
                        showDelete={false}
                        showStatusFilter={false}
                      />
                    )}
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
              </>
            )}
          </Box>
        </>
      ) : (
        <Dialog
          fullScreen
          open={showSignDocument}
          onClose={() => {
            setShowSignDocument(false);
            setSelectedDocument(null);
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              bgcolor: "#ced4da",
            }}
          >
            <SignHeader
              pagesCount={1}
              handleExportPDF={() => {}}
              onCancel={() => {
                setShowSignDocument(false);
                setSelectedDocument(null);
              }}
            />

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "850px",
                  bgcolor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  lineHeight: 0,
                }}
              >
                <iframe
                  src={`${selectedDocument}#toolbar=0&navpanes=0&scrollbar=0&view=FitW`}
                  style={{
                    width: "100%",
                    height: "1200px",
                    border: "none",
                  }}
                  title="PDF Viewer"
                />
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  );
}
