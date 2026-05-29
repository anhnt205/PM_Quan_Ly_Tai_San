import React, { useState } from "react";
import {
  Box,
  Chip,
  Alert,
  Badge,
  Card,
  CardContent,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  AssignmentOutlined,
  BuildOutlined,
  FactCheckOutlined,
  PlaylistAddCheckOutlined,
  InventoryOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import PageAction from "../../../components/common/PageAction";
import TableCustom from "../../../components/common/TableCustom";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  useMaintenanceAcceptanceTestPageQuery,
  useMaintenanceAcceptanceTestVehiclePageQuery,
  useMaintenanceIncidentPageQuery,
  useMaintenanceInspectionPageQuery,
  useMaintenanceMaterialAssessmentPageQuery,
  useMaintenancePlanningPageQuery,
  useMaintenanceRepairPageQuery,
  useMaintenanceIncidentInspectionPageQuery,
  useMaintenanceBienPhapMayMocPageQuery,
  useMaintenanceBienPhapPhuongTienPageQuery,
  useMaintenanceVehicleInspectionPageQuery,
} from "../../MainenancePlanRepair/Mutation";
import {
  generateBienBanKeHoachPdf,
  generatePhieuSuCoPdf,
  generateSuaChuaPdf,
  generateGiamDinhPdf,
  generateGiamDinhPhuongTienPdf,
  generateNghiemThuPdf,
  generateNghiemThuPhuongTienPdf,
  generateDanhGiaVatTuPdf,
  generateKiemTraSuCoPdf,
  generateBienPhapMayMocPdf,
  generateBienPhapPhuongTienPdf,
  showStatus,
  listSigneInfo,
  showShareStatus,
  isCheckShowShare,
  handleSendToSigner,
  showDownloadFile,
} from "../config";
import SignDocumentForm from "../components/signdocument/SignDocumentForm";
import { useAllDepartmentsQuery } from "../../Department/Mutation";
import { useAllStaffsQuery } from "../../Staff/Mutation";
import { useAllPositionsQuery } from "../../Position/Mutation";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  AcceptanceTestAdapter,
  NghiemThuPhuongTienAdapter,
  IncidentAdapter,
  InspectionAdapter,
  MaterialAssessmentAdapter,
  PlanAdapter,
  RepairAdapter,
  IncidentInspectionAdapter,
  BienPhapMayMocAdapter,
  BienPhapPhuongTienAdapter,
} from "../Adapter";
import { FilterOption } from "../../../components/common/FilterStatusGroup";
import { useMaintenanceMutation } from "../mutation";
import { useMenuData } from "../../../hooks/useMenuData";
import S3Service from "../../../services/S3Service";
import { TypeBienBan } from "../../../utils/const";

export default function MaintenanceRecordPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { user } = useSelector((state: RootState) => state.user);

  // Filter ngày & trạng thái
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [nhomTaiSanFilter, setNhomTaiSanFilter] = useState("MAY_MOC");
  const [bienPhapType, setBienPhapType] = useState<"may_moc" | "phuong_tien">(
    "may_moc",
  );

  const { data: staffs } = useAllStaffsQuery();
  const { data: departments } = useAllDepartmentsQuery();
  const { data: positions } = useAllPositionsQuery();

  const { counts } = useMenuData();

  const pendingCounts = [
    counts.totalPlan,
    counts.totalRepair,
    counts.totalInspection,
    (counts as any).totalBienPhap || 0,
    counts.totalAcceptance,
    counts.totalMaterialAssessment,
    counts.totalIncident,
    counts.totalIncidentInspection,
  ];

  const { updateManyMutation } = useMaintenanceMutation(
    activeTab === 0
      ? "maintenancePlanningPage"
      : activeTab === 1
        ? "repairPage"
        : activeTab === 2
          ? bienPhapType === "may_moc"
            ? "inspectionPage"
            : "vehicleInspectionPage"
          : activeTab === 3
            ? bienPhapType === "may_moc"
              ? "bienPhapMayMocPage"
              : "bienPhapPhuongTienPage"
            : activeTab === 4
              ? bienPhapType === "may_moc"
                ? "nghiemThuMayMocPage"
                : "nghiemThuPhuongTienPage"
              : activeTab === 5
                ? "materialAssessmentPage"
                : activeTab === 6
                  ? "incidentPage"
                  : activeTab === 7
                    ? "incidentInspectionPage"
                    : "",
    activeTab === 0
      ? "kehoach-suachua"
      : activeTab === 1
        ? "suachua"
        : activeTab === 2
          ? bienPhapType === "may_moc"
            ? "giamdinh-maymoc"
            : "giamdinh-phuongtien"
          : activeTab === 3
            ? bienPhapType === "may_moc"
              ? "bienphap-maymoc"
              : "bienphap-phuongtien"
            : activeTab === 4
              ? bienPhapType === "may_moc"
                ? "nghiemthu-maymoc"
                : "nghiemthu-phuongtien"
              : activeTab === 5
                ? "danhgia-vattu"
                : activeTab === 6
                  ? "suco-thietbi"
                  : activeTab === 7
                    ? "kiemtra-suco"
                    : "",
    activeTab,
  );

  const searchDebounce = useDebounce(searchValue, 500);
  const {
    data: planPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading,
  } = useMaintenancePlanningPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 0,
    nhomTaiSanFilter,
  );

  const {
    data: repairPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingRepair,
  } = useMaintenanceRepairPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 1,
  );

  const {
    data: giamDinhMayMoc = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingInspection,
  } = useMaintenanceInspectionPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 2 && bienPhapType === "may_moc",
  );

  const {
    data: giamDinhPhuongTien = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingGiamDinh,
  } = useMaintenanceVehicleInspectionPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 2 && bienPhapType === "phuong_tien",
  );
  const inspectionPaged =
    bienPhapType === "may_moc" ? giamDinhMayMoc : giamDinhPhuongTien;

  const {
    data: bienPhapMayMocPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingBienPhapMayMoc,
  } = useMaintenanceBienPhapMayMocPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 3 && bienPhapType === "may_moc",
  );

  const {
    data: bienPhapPhuongTienPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingBienPhapPhuongTien,
  } = useMaintenanceBienPhapPhuongTienPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 3 && bienPhapType === "phuong_tien",
  );

  const bienPhapPaged =
    bienPhapType === "may_moc" ? bienPhapMayMocPaged : bienPhapPhuongTienPaged;

  const {
    data: nghiemThuMayMocPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingNghiemThuMayMoc,
  } = useMaintenanceAcceptanceTestPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 4 && bienPhapType === "may_moc",
  );

  const {
    data: nghiemThuPhuongTienPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingNghiemThuPhuongTien,
  } = useMaintenanceAcceptanceTestVehiclePageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 4 && bienPhapType !== "may_moc",
  );

  const acceptanceTestPaged =
    bienPhapType === "may_moc"
      ? nghiemThuMayMocPaged
      : nghiemThuPhuongTienPaged;

  const {
    data: materialAssessmentPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingMaterialAssessment,
  } = useMaintenanceMaterialAssessmentPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 5,
  );

  const {
    data: incidentPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
    isLoading: isLoadingIncident,
  } = useMaintenanceIncidentPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 6,
  );

  const {
    data: incidentInspectionPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
    isLoading: isLoadingIncidentInspection,
  } = useMaintenanceIncidentInspectionPageQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchDebounce,
    statusFilter !== "" ? Number(statusFilter) : undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
    undefined,
    dateFrom,
    dateTo,
    activeTab === 7,
  );

  const tabConfigs = [
    { label: "Kế hoạch", icon: <AssignmentOutlined />, idLabel: "Mã KH" },
    {
      label: "Lệnh sửa chữa",
      icon: <BuildOutlined />,
      idLabel: "Số lệnh SC",
      field: "soPhieu",
    },
    {
      label: "BB Giám định",
      icon: <FactCheckOutlined />,
      idLabel: "Số BB giám định",
      field: "soPhieu",
    },
    {
      label: "Biện pháp sửa chữa",
      icon: <BuildOutlined />,
      idLabel: "Số biện pháp",
      field: "soPhieu",
    },
    {
      label: "BB Nghiệm thu",
      icon: <PlaylistAddCheckOutlined />,
      idLabel: "Số BB nghiệm thu",
    },
    {
      label: "BB Đánh giá VT",
      icon: <InventoryOutlined />,
      idLabel: "Số BB đánh giá",
    },
    {
      label: "Phiếu báo SỰ CỐ",
      icon: <WarningOutlined />,
      idLabel: "Số phiếu",
      field: "soPhieu",
    },
    {
      label: "BB Kiểm tra SỰ CỐ",
      icon: <SearchOutlined />,
      idLabel: "Số BB kiểm tra",
    },
  ];

  const parentColumnConfigs: Record<
    number,
    { field: string; headerName: string; key?: string }[]
  > = {
    1: [{ field: "planId", headerName: "Mã kế hoạch" }],
    2: [
      {
        field: "idBienBanSuaChua",
        headerName: "Mã lệnh SC",
        key: TypeBienBan.SUA_CHUA,
      },
      {
        field: "idBienBanKiemTra",
        headerName: "Mã BB kiểm tra SC",
        key: TypeBienBan.SU_CO,
      },
    ],
    3: [{ field: "idGiamDinh", headerName: "Mã BB giám định" }],
    4: [{ field: "soPhieu", headerName: "Mã biện pháp" }],
    5: [{ field: "idNghiemThu", headerName: "Mã BB nghiệm thu" }],
    6: [{ field: "planId", headerName: "Mã kế hoạch" }],
    7: [{ field: "idSuCo", headerName: "Mã phiếu báo SC" }],
  };

  const allRows = [
    { ...planPaged, items: planPaged.items.map(PlanAdapter) },
    { ...repairPaged, items: repairPaged.items.map(RepairAdapter) },
    { ...inspectionPaged, items: inspectionPaged.items.map(InspectionAdapter) },
    {
      ...bienPhapPaged,
      items: (bienPhapPaged.items || []).map(
        bienPhapType === "may_moc"
          ? BienPhapMayMocAdapter
          : BienPhapPhuongTienAdapter,
      ),
    },
    {
      ...acceptanceTestPaged,
      items: (acceptanceTestPaged.items || []).map(
        bienPhapType === "may_moc"
          ? AcceptanceTestAdapter
          : NghiemThuPhuongTienAdapter,
      ),
    },
    {
      ...materialAssessmentPaged,
      items: (materialAssessmentPaged.items || []).map(
        MaterialAssessmentAdapter,
      ),
    },
    { ...incidentPaged, items: incidentPaged.items.map(IncidentAdapter) },
    {
      ...incidentInspectionPaged,
      items: (incidentInspectionPaged.items || []).map(
        IncidentInspectionAdapter,
      ),
    },
  ];

  const currentAllData = allRows[activeTab];
  const safeRows = (currentAllData?.items || []).map((r: any) => ({
    ...r,
    id: r.id || crypto.randomUUID(),
  }));

  const buildColumns = (collapsed: boolean) => {
    const parentCols = (parentColumnConfigs[activeTab] ?? []).map((cfg) => ({
      field: cfg.field,
      headerName: cfg.headerName,
      width: 160,
      renderCell: (params: any) => {
        // Tab giám định: hiển thị dữ liệu vào đúng cột loại biên bản
        if (activeTab === 2) {
          const loai = params.row.loaiBienBan; // 'sua_chua' | 'su_co'
          if (loai === cfg.key) {
            return <span>{params.row.idBienBan || "—"}</span>;
          }
          return <span style={{ color: "#bbb" }}>—</span>;
        }
        return (
          <span style={{ color: params.value ? "inherit" : "#bbb" }}>
            {params.value || "—"}
          </span>
        );
      },
    }));

    if (collapsed) {
      return [
        {
          field: tabConfigs[activeTab].field || "id",
          headerName: tabConfigs[activeTab].idLabel,
          flex: 1,
        },
        {
          field: "trangThai",
          headerName: "TT",
          width: 110,
          renderCell: (params: any) => showStatus(params.row.trangThai),
        },
      ];
    }

    const columns: any[] = [
      { field: "id", headerName: tabConfigs[activeTab].idLabel, width: 160 },
      ...parentCols,
      { field: "moTa", headerName: "Nội dung/Ghi chú", flex: 1, minWidth: 200 },
    ];

    if (activeTab === 3 && bienPhapType === "may_moc") {
      columns.push({
        field: "tenFile",
        headerName: "Tài liệu",
        width: 180,
        renderCell: (params: any) => {
          return showDownloadFile(
            params.value,
            () => S3Service.download(params.row.duongDanFile),
            // handleDownloadFile(params.value),
          );
        },
      });
    }

    columns.push(
      { field: "ngayTao", headerName: "Ngày tạo", width: 120 },
      {
        field: "share",
        headerName: "Trình duyệt",
        width: 160,
        renderCell: (params: any) =>
          showShareStatus(
            params.row?.share ?? false,
            params.row?.nguoiTao === user?.taiKhoan?.tenDangNhap,
          ),
      },
      {
        field: "trangThai",
        headerName: "Trạng thái",
        width: 140,
        renderCell: (params: any) => showStatus(params.row.trangThai),
      },
    );

    return columns;
  };

  const renderPreview = () => {
    if (!selectedRow) return null;
    const commonProps = {
      selectedIds: [selectedRow.id],
      onCancel: () => {
        setSelectedRow(null);
      },
      onSign: () => {},
      plan: selectedRow,
      staffs: staffs || [],
      departments: departments || [],
      positions: positions || [],
      fullscreen: false,
      showSignerSidebar: true,
      showHeader: false,
    };

    switch (activeTab) {
      case 0:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateBienBanKeHoachPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 1:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateSuaChuaPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 2:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              bienPhapType === "may_moc"
                ? generateGiamDinhPdf(
                    selectedRow,
                    staffs || [],
                    departments || [],
                    positions || [],
                  )
                : generateGiamDinhPhuongTienPdf(
                    selectedRow,
                    staffs || [],
                    departments || [],
                    positions || [],
                  )
            }
          />
        );
      case 3:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              bienPhapType === "may_moc"
                ? generateBienPhapMayMocPdf(
                    selectedRow,
                    staffs || [],
                    departments || [],
                    positions || [],
                  )
                : generateBienPhapPhuongTienPdf(
                    selectedRow,
                    staffs || [],
                    departments || [],
                    positions || [],
                  )
            }
          />
        );
      case 4:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              bienPhapType === "may_moc"
                ? generateNghiemThuPdf(
                    selectedRow,
                    staffs || [],
                    departments || [],
                    positions || [],
                  )
                : generateNghiemThuPhuongTienPdf(
                    selectedRow,
                    staffs || [],
                    departments || [],
                    positions || [],
                  )
            }
          />
        );
      case 5:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateDanhGiaVatTuPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 6:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generatePhieuSuCoPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      case 7:
        return (
          <SignDocumentForm
            {...commonProps}
            fullscreen={false}
            showSignerSidebar={false}
            showHeader={true}
            generatePdf={() =>
              generateKiemTraSuCoPdf(
                selectedRow,
                staffs || [],
                departments || [],
                positions || [],
              )
            }
          />
        );
      default:
        return null;
    }
  };

  const renderSignProcess = (row: any) => {
    const signers = listSigneInfo(row, staffs, departments, positions);
    if (!signers.length)
      return (
        <Alert severity="info">Không có quy trình ký cho biên bản này.</Alert>
      );

    return (
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          Quy trình ký
          <Chip
            label={`${signers.length} người`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 400 }}
          />
        </Typography>
        <Box sx={{ position: "relative", pl: 5 }}>
          <Box
            sx={{
              position: "absolute",
              left: 16,
              top: 8,
              bottom: 8,
              width: "1px",
              bgcolor: "divider",
            }}
          />
          {signers.map((s: any, idx: number) => (
            <Box
              key={`${s.hoTen}-${idx}`}
              sx={{ position: "relative", mb: 1.5 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: -37,
                  top: 14,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  zIndex: 1,
                  boxShadow: "0 0 0 3px white",
                }}
              >
                {idx + 1}
              </Box>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                  bgcolor: "background.paper",
                  transition: "all 0.2s",
                  "&:hover": { boxShadow: 1, borderColor: "grey.300" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {s.hoTen?.charAt(0) ?? "?"}
                    </Box>
                    <Box>
                      <Typography fontWeight={600} fontSize={13}>
                        {s.hoTen ?? "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.chucVu || ""}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={s.donVi || ""}
                          size="small"
                          sx={{ fontSize: 10, height: 18, bgcolor: "grey.100" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    {s.signed ? (
                      <Chip
                        label={`Đã ký${s.signedAt ? ` • ${s.signedAt}` : ""}`}
                        size="small"
                        color="success"
                      />
                    ) : (
                      <Chip label="Chưa ký" size="small" color="warning" />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchValue("");
    setSelectedRow(null);
  };

  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleClose);
  };

  const isDetailOpen = !!selectedRow;

  const resetFilters = () => {
    setSearchValue("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setSelectedRow(null);
    setPaginationModel((m) => ({ ...m, page: 0 }));
  };

  const statusOptions: FilterOption[] = [
    {
      label: "Tất cả",
      value: "",
      count:
        (currentAllData?.trangThaiCounts?.["0"] || 0) +
        (currentAllData?.trangThaiCounts?.["1"] || 0) +
        (currentAllData?.trangThaiCounts?.["2"] || 0) +
        (currentAllData?.trangThaiCounts?.["3"] || 0),
      color: "primary",
    },
    {
      label: "Bản nháp",
      value: 0,
      count: currentAllData?.trangThaiCounts?.["0"] || 0,
      color: "default",
    },
    {
      label: "Chờ duyệt",
      value: 1,
      count: currentAllData?.trangThaiCounts?.["1"] || 0,
      color: "warning",
    },
    {
      label: "Từ chối",
      value: 2,
      count: currentAllData?.trangThaiCounts?.["2"] || 0,
      color: "error",
    },
    {
      label: "Đã duyệt",
      value: 3,
      count: currentAllData?.trangThaiCounts?.["3"] || 0,
      color: "success",
    },
  ];

  return (
    <>
      <PageAction title="Quản lý biên bản" />

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* ── Tab bar ── */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "#fff",
              display: "flex",
              justifyContent: "flex-end",
              overflowX: "auto",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, v) => {
                setActiveTab(v);
                resetFilters();
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "bold",
                  minHeight: 64,
                },
              }}
            >
              {tabConfigs.map((t, i) => (
                <Tab
                  key={i}
                  iconPosition="top"
                  icon={
                    <Badge badgeContent={pendingCounts[i]} color="primary">
                      {t.icon}
                    </Badge>
                  }
                  label={t.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* ── Filter thời gian ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "#fafafa",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              Lọc theo ngày:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Từ
              </Typography>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPaginationModel((m) => ({ ...m, page: 0 }));
                }}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 13,
                  color: "inherit",
                  background: "transparent",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Đến
              </Typography>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPaginationModel((m) => ({ ...m, page: 0 }));
                }}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 13,
                  color: "inherit",
                  background: "transparent",
                }}
              />
            </Box>
            {activeTab === 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Nhóm tài sản
                </Typography>
                <select
                  value={nhomTaiSanFilter}
                  onChange={(e) => {
                    setNhomTaiSanFilter(e.target.value);
                    setPaginationModel((m) => ({ ...m, page: 0 }));
                  }}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 13,
                    color: "inherit",
                    background: "transparent",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="MAY_MOC">Máy móc</option>
                  <option value="PHUONG_TIEN">Phương tiện</option>
                </select>
              </Box>
            )}
            {(dateFrom || dateTo) && (
              <Chip
                label="Xóa bộ lọc ngày"
                size="small"
                onDelete={() => {
                  setDateFrom("");
                  setDateTo("");
                  setPaginationModel((m) => ({ ...m, page: 0 }));
                }}
                sx={{ fontSize: 11 }}
              />
            )}

            {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  ml: "auto",
                  pl: 2,
                  borderLeft: { xs: "none", md: "1px solid" },
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Loại tài sản:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "grey.100",
                    p: 0.5,
                    borderRadius: 2.5,
                  }}
                >
                  <Box
                    onClick={() => {
                      setBienPhapType("may_moc");
                      setPaginationModel((m) => ({ ...m, page: 0 }));
                    }}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor:
                        bienPhapType === "may_moc" ? "#fff" : "transparent",
                      color:
                        bienPhapType === "may_moc"
                          ? "primary.main"
                          : "text.secondary",
                      boxShadow:
                        bienPhapType === "may_moc"
                          ? "0px 1px 3px rgba(0,0,0,0.1)"
                          : "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        color:
                          bienPhapType === "may_moc"
                            ? "primary.main"
                            : "text.primary",
                      },
                    }}
                  >
                    Máy móc
                  </Box>
                  <Box
                    onClick={() => {
                      setBienPhapType("phuong_tien");
                      setPaginationModel((m) => ({ ...m, page: 0 }));
                    }}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor:
                        bienPhapType === "phuong_tien" ? "#fff" : "transparent",
                      color:
                        bienPhapType === "phuong_tien"
                          ? "primary.main"
                          : "text.secondary",
                      boxShadow:
                        bienPhapType === "phuong_tien"
                          ? "0px 1px 3px rgba(0,0,0,0.1)"
                          : "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        color:
                          bienPhapType === "phuong_tien"
                            ? "primary.main"
                            : "text.primary",
                      },
                    }}
                  >
                    Phương tiện
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* ── Nội dung: bảng + panel detail song song ── */}
          <Box sx={{ display: "flex", gap: 0, minHeight: 500 }}>
            {/* ── Bảng danh sách ── */}
            <Card
              elevation={0}
              sx={{
                flex: isDetailOpen ? "0 0 400px" : 1,
                transition: "flex 0.3s ease",
                overflow: "hidden",
                borderRadius: 0,
                borderRight: isDetailOpen ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ height: "100%", p: "0 !important" }}>
                <TableCustom
                  title="Danh sách biên bản"
                  rows={safeRows}
                  columns={buildColumns(isDetailOpen)}
                  total={currentAllData?.totalItems || 0}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  checkboxSelection={!isDetailOpen}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showDelete={false}
                  onRowClick={(params) => {
                    setSelectedRow(params.row);
                    setDetailTab(0);
                  }}
                  isRowSelectable={() => true}
                  showStatusFilter={!isDetailOpen}
                  statusOptions={statusOptions as any}
                  statusValue={statusFilter}
                  onStatusChange={(val) => {
                    setStatusFilter(val as any);
                    setPaginationModel((m) => ({ ...m, page: 0 }));
                  }}
                  canSign={() => false}
                  isCheckShowShare={isCheckShowShare}
                  handleSendToSigner={handleSend}
                />
              </CardContent>
            </Card>

            {/* ── Panel chi tiết / preview ── */}
            {isDetailOpen && (
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  overflow: "auto",
                  borderRadius: 0,
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Xem trước: {selectedRow.id}
                  </Typography>
                  <IconButton size="small" onClick={() => setSelectedRow(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Tabs
                  value={detailTab}
                  onChange={(_, v) => setDetailTab(v)}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Biên bản" />
                  <Tab label="Quy trình ký" />
                </Tabs>

                {detailTab === 0
                  ? renderPreview()
                  : renderSignProcess(selectedRow)}
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
