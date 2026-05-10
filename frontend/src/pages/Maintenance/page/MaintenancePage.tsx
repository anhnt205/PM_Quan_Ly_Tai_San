import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Grid,
  Stack,
  useTheme,
  Pagination,
} from "@mui/material";
import {
  BuildOutlined,
  DescriptionOutlined,
  FactCheckOutlined,
  InventoryOutlined,
  AssignmentTurnedInOutlined,
  BoltOutlined,
  CheckCircle,
  PendingOutlined,
  CloseOutlined,
  PrecisionManufacturingOutlined,
  CheckCircleOutline,
  RadioButtonUnchecked,
  WarningOutlined,
  SearchOutlined,
  HourglassEmpty,
} from "@mui/icons-material";
import { donViList } from "../../../mockdata/specialMockOnly";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  useMaintenancePlanningPageQuery,
  useMaintenanceRepairPageQuery,
  useMaintenanceInspectionPageQuery,
  useMaintenanceMaterialAssessmentPageQuery,
  useMaintenanceAcceptanceTestPageQuery,
  useMaintenanceIncidentPageQuery,
  useMaintenanceIncidentInspectionPageQuery,
  useMaintenanceProcessPagedQuery,
} from "../../MainenancePlanRepair/Mutation";
import { QuyTrinhSuaChuaData } from "../types";
import {
  PlanAdapter,
  RepairAdapter,
  InspectionAdapter,
  MaterialAssessmentAdapter,
  AcceptanceTestAdapter,
  IncidentAdapter,
  IncidentInspectionAdapter,
} from "../Adapter";
import FieldYear from "../../../components/TextField/FieldYear";
import { useAllDepartmentsQuery } from "../../Department/Mutation";
import { useAssetByDonViQuery } from "../../AssetTransfer/Mutation";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { findById } from "../../../utils/helpers";
import { BookXIcon } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────
const trangThaiChipProps = (
  trang: string | number,
): {
  label: string;
  color: "success" | "warning" | "info" | "error" | "default";
} => {
  if (trang === 0 || trang === "0")
    return { label: "Bản nháp", color: "default" };
  if (trang === 1 || trang === "1")
    return { label: "Chờ duyệt", color: "warning" };
  if (trang === 2 || trang === "2") return { label: "Từ chối", color: "error" };
  if (trang === 3 || trang === "3")
    return { label: "Đã duyệt", color: "success" };

  switch (trang) {
    case "da-duyet":
      return { label: "Đã duyệt", color: "success" };
    case "cho-duyet":
      return { label: "Chờ duyệt", color: "warning" };
    case "cho-ky":
      return { label: "Chờ ký", color: "info" };
    case "dot-xuat":
      return { label: "Đột xuất", color: "error" };
    default:
      return { label: String(trang), color: "default" };
  }
};

const processStatusChipProps = (row: QuyTrinhSuaChuaData) => {
  // Logic: Lệnh SC -> Giám định -> Nghiệm thu
  // 1. Nghiệm thu
  if (row.idNghiemThu) {
    if (row.trangThaiNghiemThu === 3)
      return { label: "Hoàn thành", color: "success" as const };
    if (row.trangThaiNghiemThu === 1)
      return { label: "Đợi nghiệm thu", color: "warning" as const };
    return { label: "Đang nghiệm thu", color: "info" as const };
  }

  // 2. Giám định
  if (row.idGiamDinh) {
    if (row.trangThaiGiamDinh === 3)
      return { label: "Chờ nghiệm thu", color: "warning" as const };
    return { label: "Đang giám định", color: "info" as const };
  }

  // 3. Lệnh sửa chữa
  if (row.idSuaChua) {
    if (row.trangThaiSuaChua === 3)
      return { label: "Chờ giám định", color: "warning" as const };
    return trangThaiChipProps(row.trangThaiSuaChua);
  }

  return { label: "Chưa bắt đầu", color: "default" as const };
};

// ── Summary Card ──────────────────────────────────────────────
const SummaryCard = ({
  icon,
  title,
  main,
  mainLabel,
  sub,
  subLabel,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  main: number;
  mainLabel: string;
  sub: number;
  subLabel: string;
  color: string;
}) => (
  <Paper
    elevation={1}
    sx={{
      borderRadius: 2,
      p: 2,
      flex: 1,
      minWidth: 180,
      display: "flex",
      alignItems: "center",
      gap: 2,
      bgcolor: "#fff",
    }}
  >
    <Box
      sx={{
        width: 8,
        height: 56,
        borderRadius: 1,
        bgcolor: color,
        flexShrink: 0,
      }}
    />
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}
        >
          {title}
        </Typography>
        <Box sx={{ color }}>{icon}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mt: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} lineHeight={1}>
            {main}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {mainLabel}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="warning.main"
            lineHeight={1}
          >
            {sub}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subLabel}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Paper>
);

// ── Quy Trinh Step ────────────────────────────────────────────
const QuyTrinhStep = ({
  step,
  title,
  icon,
  color,
  items,
  onXemTatCa,
}: {
  step: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: { ma: string; trang: string }[];
  onXemTatCa: () => void;
}) => (
  <Paper
    elevation={1}
    sx={{
      borderRadius: 2,
      p: 2,
      flex: 1,
      minWidth: 180,
      bgcolor: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: `${color}22`,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
        }}
      >
        {step}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>
          {title}
        </Typography>
      </Box>
    </Box>
    <Stack spacing={0.5}>
      {items.slice(0, 3).map((item) => {
        const cfg = trangThaiChipProps(item.trang);
        return (
          <Box
            key={item.ma}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.78rem",
                color: "text.secondary",
                fontFamily: "monospace",
              }}
            >
              {item.ma}
            </Typography>
            <Chip
              label={cfg.label}
              color={cfg.color}
              size="small"
              sx={{ fontSize: "0.65rem", height: 20 }}
            />
          </Box>
        );
      })}
    </Stack>
    <Box sx={{ mt: "auto" }}>
      <Typography
        variant="caption"
        onClick={onXemTatCa}
        sx={{
          color: "primary.main",
          cursor: "pointer",
          fontWeight: 700,
          display: "inline-block",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Xem tất cả ({items.length})
      </Typography>
    </Box>
  </Paper>
);

// ── Tien Do Item ──────────────────────────────────────────────
const TienDoItem = ({
  label,
  ma,
  trang,
}: {
  label: string;
  ma: string;
  trang: "done" | "pending" | "wait";
}) => {
  const iconProps = {
    done: {
      icon: <CheckCircle sx={{ fontSize: 16, color: "#22c55e" }} />,
      color: "#22c55e",
    },
    pending: {
      icon: <PendingOutlined sx={{ fontSize: 16, color: "#f59e0b" }} />,
      color: "#f59e0b",
    },
    wait: {
      icon: <RadioButtonUnchecked sx={{ fontSize: 16, color: "#94a3b8" }} />,
      color: "#94a3b8",
    },
  }[trang];

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.5 }}>
      <Box sx={{ mt: 0.2 }}>{iconProps.icon}</Box>
      <Box>
        <Typography variant="caption" fontWeight={600} display="block">
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          {ma}
        </Typography>
      </Box>
    </Box>
  );
};

// ── Modal Xem Tất Cả ──────────────────────────────────────────
const ModalXemTatCa = ({
  open,
  onClose,
  title,
  items,
  page,
  totalPages,
  onPageChange,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: { ma: string; trang: string | number }[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {title}
      <IconButton size="small" onClick={onClose}>
        <CloseOutlined fontSize="small" />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, i) => {
              const cfg = trangThaiChipProps(item.trang);
              return (
                <TableRow key={item.ma} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {item.ma}
                  </TableCell>
                  <TableCell>
                    <Chip label={cfg.label} color={cfg.color} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, v) => onPageChange(v - 1)}
            color="primary"
          />
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined" size="small">
        Đóng
      </Button>
    </DialogActions>
  </Dialog>
);

// ── Main Component ────────────────────────────────────────────
export default function MaintenanceStatPage() {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.user);

  const [donVi, setDonVi] = useState("");
  const [nam, setNam] = useState(new Date().getFullYear());
  const [selectedId, setSelectedId] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    type: string;
  }>({
    open: false,
    title: "",
    type: "",
  });

  const [pageModels, setPageModels] = useState({
    plan: 0,
    repair: 0,
    inspection: 0,
    material: 0,
    acceptance: 0,
    incident: 0,
    incidentInspection: 0,
  });

  const [processPage, setProcessPage] = useState(1);

  const { data: departments = [] } = useAllDepartmentsQuery();
  const { data: assetsData = { items: [] } } = useAssetByDonViQuery(2, donVi);
  const assets = assetsData?.items || [];

  const { data: processPaged = { items: [], totalItems: 0 } } =
    useMaintenanceProcessPagedQuery(processPage, 10, selectedId, nam);

  const getStatusIcon = (trangThai?: number) => {
    switch (trangThai) {
      case 3: // Đã duyệt / Hoàn thành
        return (
          <CheckCircleOutline
            sx={{ color: "#2ecc71", fontSize: 18, mr: 0.5 }}
          />
        );
      case 1: // Chờ duyệt
        return (
          <HourglassEmpty sx={{ color: "#f39c12", fontSize: 18, mr: 0.5 }} />
        );
      case 0: // Nháp
        return (
          <RadioButtonUnchecked
            sx={{ color: "text.disabled", fontSize: 18, mr: 0.5 }}
          />
        );
      case 2: // Từ chối
        return (
          <CloseOutlined sx={{ color: "#e74c3c", fontSize: 18, mr: 0.5 }} />
        );
      default:
        return null;
    }
  };

  // Pagination for phieu table
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const handleDonViChange = (val: string) => {
    setDonVi(val);
    setPage(1);
  };

  const openModal = (title: string, type: string) =>
    setModal({ open: true, title, type });

  // ── Queries ──
  const {
    data: planPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
  } = useMaintenancePlanningPageQuery(
    pageModels.plan,
    10,
    "",
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: repairPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
  } = useMaintenanceRepairPageQuery(
    pageModels.repair,
    10,
    "",
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: inspectionPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
  } = useMaintenanceInspectionPageQuery(
    pageModels.inspection,
    10,
    "",
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: materialPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
  } = useMaintenanceMaterialAssessmentPageQuery(
    pageModels.material,
    10,
    "",
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: acceptancePaged = { items: [], totalItems: 0, trangThaiCounts: {} },
  } = useMaintenanceAcceptanceTestPageQuery(
    pageModels.acceptance,
    10,
    "",
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: incidentPaged = { items: [], totalItems: 0, trangThaiCounts: {} },
  } = useMaintenanceIncidentPageQuery(
    pageModels.incident,
    10,
    "",
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );
  const {
    data: incidentInspectionPaged = {
      items: [],
      totalItems: 0,
      trangThaiCounts: {},
    },
  } = useMaintenanceIncidentInspectionPageQuery(
    pageModels.incidentInspection,
    10,
    "",
    undefined,
    undefined,
    user?.taiKhoan?.tenDangNhap,
  );

  const planItems = planPaged.items.map(PlanAdapter).map((item: any) => ({
    ma: item.planId || item.id,
    trang: item.trangThai,
  }));
  const repairItems = repairPaged.items.map(RepairAdapter).map((item: any) => ({
    ma: item.idSuaChua || item.id,
    trang: item.trangThai,
  }));
  const inspectionItems = inspectionPaged.items
    .map(InspectionAdapter)
    .map((item: any) => ({
      ma: item.idGiamDinh || item.id,
      trang: item.trangThai,
    }));
  const materialItems = materialPaged.items
    .map(MaterialAssessmentAdapter)
    .map((item: any) => ({
      ma: item.idDanhGia || item.id,
      trang: item.trangThai,
    }));
  const acceptanceItems = acceptancePaged.items
    .map(AcceptanceTestAdapter)
    .map((item: any) => ({
      ma: item.idNghiemThu || item.id,
      trang: item.trangThai,
    }));
  const incidentItems = incidentPaged.items
    .map(IncidentAdapter)
    .map((item: any) => ({
      ma: item.idSuCo || item.soPhieu || item.id,
      trang: item.trangThai,
    }));
  const incidentInspectionItems = incidentInspectionPaged.items
    .map(IncidentInspectionAdapter)
    .map((item: any) => ({
      ma: item.incidentInspectionId || item.id,
      trang: item.trangThai,
    }));

  const quyTrinhSteps = [
    {
      step: 1,
      title: "KẾ HOẠCH",
      icon: <BuildOutlined sx={{ fontSize: 16 }} />,
      color: "#3b82f6",
      items: planItems,
      type: "plan",
    },
    {
      step: 2,
      title: "SỰ CỐ",
      icon: <WarningOutlined sx={{ fontSize: 16 }} />,
      color: "#ef4444",
      items: incidentItems,
      type: "incident",
    },
    {
      step: 3,
      title: "LỆNH SỬA CHỮA",
      icon: <DescriptionOutlined sx={{ fontSize: 16 }} />,
      color: "#f59e0b",
      items: repairItems,
      type: "repair",
    },
    {
      step: 4,
      title: "GIÁM ĐỊNH",
      icon: <FactCheckOutlined sx={{ fontSize: 16 }} />,
      color: "#22c55e",
      items: inspectionItems,
      type: "inspection",
    },
    {
      step: 5,
      title: "BB SỰ CỐ",
      icon: <SearchOutlined sx={{ fontSize: 16 }} />,
      color: "#8b5cf6",
      items: incidentInspectionItems,
      type: "incidentInspection",
    },
    {
      step: 6,
      title: "PHIẾU VẬT TƯ",
      icon: <InventoryOutlined sx={{ fontSize: 16 }} />,
      color: "#f97316",
      items: materialItems,
      type: "material",
    },
    {
      step: 7,
      title: "NGHIỆM THU",
      icon: <AssignmentTurnedInOutlined sx={{ fontSize: 16 }} />,
      color: "#10b981",
      items: acceptanceItems,
      type: "acceptance",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f6f8fb", minHeight: "100vh", py: 3, px: 3 }}>
      <Box sx={{ maxWidth: 1800, mx: "auto" }}>
        {/* ── Top Filter Bar ── */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <FieldAutoCompleted
                title="Đơn vị"
                data={departments}
                labelkey="tenPhongBan"
                setValue={setDonVi}
                value={donVi}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <FieldAutoCompleted
                title="Chọn Thiết Bị"
                data={assets}
                labelkey="tenTaiSan"
                setValue={setSelectedId}
                value={selectedId}
                limitOptions={20}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FieldYear title="Năm" selectedYear={nam} setSelectedYear={setNam} />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2}>
          {/* Left */}
          <Grid size={{ xs: 12, md: selectedId ? 8 : 12 }}>
            <Stack spacing={2}>
              {/* Summary */}
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<BuildOutlined fontSize="small" />}
                    title="Kế Hoạch"
                    color="#3b82f6"
                    main={planPaged.totalItems}
                    mainLabel="Tổng số"
                    sub={planPaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<WarningOutlined fontSize="small" />}
                    title="Sự Cố"
                    color="#ef4444"
                    main={incidentPaged.totalItems}
                    mainLabel="Tổng số"
                    sub={incidentPaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<DescriptionOutlined fontSize="small" />}
                    title="Lệnh SC"
                    color="#f59e0b"
                    main={repairPaged.totalItems}
                    mainLabel="Tổng số"
                    sub={repairPaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<FactCheckOutlined fontSize="small" />}
                    title="Giám Định"
                    color="#22c55e"
                    main={inspectionPaged.totalItems}
                    mainLabel="Tổng số"
                    sub={inspectionPaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<SearchOutlined fontSize="small" />}
                    title="BB Sự Cố"
                    color="#8b5cf6"
                    main={incidentInspectionPaged.totalItems}
                    mainLabel="Tổng số"
                    sub={incidentInspectionPaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<InventoryOutlined fontSize="small" />}
                    title="Phiếu VT"
                    color="#f97316"
                    main={materialPaged.totalItems}
                    mainLabel="Tổng số"
                    sub={materialPaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <SummaryCard
                    icon={<AssignmentTurnedInOutlined fontSize="small" />}
                    title="Nghiệm Thu"
                    color="#10b981"
                    main={acceptancePaged.totalItems}
                    mainLabel="Tổng số"
                    sub={acceptancePaged.trangThaiCounts["1"] || 0}
                    subLabel="Chờ duyệt"
                  />
                </Grid>
              </Grid>

              {/* Quy Trinh */}
              <Paper
                elevation={0}
                sx={{ borderRadius: 2, p: 2, bgcolor: "transparent" }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  mb={1}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                >
                  Sơ đồ quy trình
                </Typography>
                {/* {quyTrinh.lenhDotXuat && (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#fff8f0",
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <BoltOutlined sx={{ color: "#f97316", fontSize: 18 }} />
                    <Typography
                      variant="caption"
                      fontWeight={800}
                      color="#c2410c"
                    >
                      LỆNH SỬA CHỮA ĐỘT XUẤT
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      Đã: <b>{quyTrinh.lenhDotXuat.hoaThanhCount}</b> · Đang:{" "}
                      <b>{quyTrinh.lenhDotXuat.dangXuLyCount}</b>
                    </Typography>
                  </Paper>
                )} */}

                <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                  {quyTrinhSteps.map((step, i) => (
                    <Box key={step.step} sx={{ minWidth: 220 }}>
                      <QuyTrinhStep
                        {...step}
                        onXemTatCa={() => openModal(step.title, step.type)}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Danh Sách Phiếu - Updated with API */}
              <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800}>
                    DANH SÁCH PHIẾU:{" "}
                    <span style={{ color: "#2563eb" }}>
                      {findById(assets, selectedId)?.tenTaiSan?.toUpperCase()}
                    </span>
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Hiển thị {(processPage - 1) * 10 + 1} -{" "}
                      {Math.min(
                        processPage * 10,
                        processPaged?.totalItems || 0,
                      )}{" "}
                      / {processPaged?.totalItems || 0}
                    </Typography>
                  </Stack>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f3f6fb" }}>
                        {[
                          "STT",
                          "Thiết Bị",
                          "Lệnh Sửa Chữa",
                          "Biên Bản",
                          "Nghiệm thu",
                          "Trạng Thái",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{ fontWeight: 800, fontSize: "0.78rem", py: 1 }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(processPaged?.items || []).map(
                        (row: QuyTrinhSuaChuaData, index: number) => (
                          <TableRow
                            key={row.idSuaChuaChiTiet}
                            hover
                            sx={{ "&:hover": { bgcolor: "#fbfbff" } }}
                          >
                            <TableCell>
                              {(processPage - 1) * 10 + index + 1}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="caption">
                                  {row.thietBi}
                                </Typography>
                                <Chip
                                  label={row.thietBiId}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 18, fontSize: "0.6rem" }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                              }}
                            >
                              {row.lenhSuaChua || "---"}
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {getStatusIcon(row.trangThaiGiamDinh)}
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  {row.bienBanGiamDinh || "---"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {getStatusIcon(row.trangThaiNghiemThu)}
                                <Typography
                                  variant="caption"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  {row.phieuNghiemThu || "---"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                {...processStatusChipProps(row)}
                                size="small"
                                sx={{
                                  fontWeight: 800,
                                  height: 20,
                                  fontSize: "0.65rem",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                      {(processPaged?.items || []).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Không có dữ liệu quy trình
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "center", p: 1.5 }}>
                  <Pagination
                    count={Math.ceil((processPaged?.totalItems || 0) / 10)}
                    page={processPage}
                    onChange={(_, v) => setProcessPage(v)}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Right */}
          {selectedId && <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ bgcolor: "primary.main", px: 3, py: 2 }}>
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    color="#fff"
                    sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                  >
                    Thông Tin Thiết Bị
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "#eef2ff", width: 56, height: 56 }}>
                      <PrecisionManufacturingOutlined
                        sx={{ color: "#2563eb", fontSize: 28 }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {findById(assets, selectedId)?.tenTaiSan}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Mã: <b>{findById(assets, selectedId)?.ma}</b>
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Vị trí:
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 800, textTransform: "uppercase" }}
                    >
                      Tình trạng
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      {/* <Chip
                        label={detail.tinhTrang}
                        size="small"
                        sx={{
                          bgcolor: detail.tinhTrangColor + "22",
                          color: detail.tinhTrangColor,
                          fontWeight: 800,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {detail.lanSCTiepTheoDate}
                      </Typography> */}
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 800, textTransform: "uppercase" }}
                    >
                      Tổng giờ chạy
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {"-"} giờ
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {"-"}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={800}
                      color="text.secondary"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Tiến độ
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {/* {tienDo.map((item) => (
                        <TienDoItem key={item.ma} {...item} />
                      ))} */}
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={800}
                      color="text.secondary"
                    >
                      Ghi chú
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {/* {detail.ghiChu} */}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>}
        </Grid>

        {/* Modal */}

        {/* Modal */}
        <ModalXemTatCa
          open={modal.open}
          onClose={() => {
            setModal((m) => ({ ...m, open: false }));
            setPageModels((p) => ({ ...p, [modal.type]: 0 }));
          }}
          title={modal.title}
          items={
            modal.type === "plan"
              ? planItems
              : modal.type === "incident"
                ? incidentItems
                : modal.type === "repair"
                  ? repairItems
                  : modal.type === "inspection"
                    ? inspectionItems
                    : modal.type === "incidentInspection"
                      ? incidentInspectionItems
                      : modal.type === "material"
                        ? materialItems
                        : modal.type === "acceptance"
                          ? acceptanceItems
                          : []
          }
          page={pageModels[modal.type as keyof typeof pageModels] || 0}
          totalPages={Math.ceil(
            (modal.type === "plan"
              ? planPaged.totalItems
              : modal.type === "incident"
                ? incidentPaged.totalItems
                : modal.type === "repair"
                  ? repairPaged.totalItems
                  : modal.type === "inspection"
                    ? inspectionPaged.totalItems
                    : modal.type === "incidentInspection"
                      ? incidentInspectionPaged.totalItems
                      : modal.type === "material"
                        ? materialPaged.totalItems
                        : modal.type === "acceptance"
                          ? acceptancePaged.totalItems
                          : 0) / 10,
          )}
          onPageChange={(p) =>
            setPageModels((prev) => ({ ...prev, [modal.type]: p }))
          }
        />
      </Box>
    </Box>
  );
}
