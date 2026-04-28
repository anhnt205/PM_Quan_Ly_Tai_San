import React, { useMemo, useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Collapse,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/routes";

import { useCmms } from "../../hooks/CmmsContext";
import IncidentDialog from "../Maintenance/components/dialog/IncidentDialog";

import CreatePlanDialog from "../Maintenance/components/planning/CreatePlan";
import PlanDetailPanel from "../Maintenance/components/planning/PlanDetailPanel";
import IncidentDetailPanel from "../Maintenance/components/planning/IncidentDetailPanel";
import { calculatePlanMaterials } from "../../mockdata/mockNorms";
import { initialIncidentInspectionRecords } from "../../mockdata/mockIncidentInspection";
import { extendedIncidentReports } from "../../mockdata/mockIncidentReports";
import type { IncidentReport } from "../../mockdata/mockIncidentReports";
import MaintenancePlanCalendar from "./components/MaintenancePlanCalendar";
import { FilterOption } from "../../components/common/FilterStatusGroup";
import PageAction from "../../components/common/PageAction";
import TableCustom from "../../components/common/TableCustom";
import {
  useMaintenancePlanningGroupedQuery,
  useMaintenancePlanningMutation,
} from "./Mutation";
import { CongTy } from "../../utils/const";
import { MaintenancePlanData } from "./types";
import { handleSendToSigner, isCheckShowShare } from "./config";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "../../redux/store";

// ── Status config ──────────────────────────────────────────
const planStatusConfig: Record<
  string,
  {
    label: string;
    color: "default" | "warning" | "success" | "error";
  }
> = {
  0: { label: "Bản nháp", color: "default" },
  1: { label: "Chờ duyệt", color: "warning" },
  2: { label: "Từ chối", color: "error" },
  3: { label: "Đã duyệt", color: "success" },
};

const renderStatus = (status: number) => {
  const cfg = planStatusConfig[status] ?? planStatusConfig[0];
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

const incidentStatusConfig: Record<
  string,
  {
    label: string;
    color: "default" | "warning" | "success" | "error" | "info";
  }
> = {
  draft: { label: "Bản nháp", color: "default" },
  "cho-duyet": { label: "Chờ duyệt", color: "warning" },
  "da-duyet": { label: "Đã duyệt", color: "success" },
  "tu-choi": { label: "Từ chối", color: "error" },
};

const renderIncidentStatus = (status: string) => {
  const cfg = incidentStatusConfig[status] ?? incidentStatusConfig["cho-duyet"];
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

// ── Severity color helper ─────────────────────────────────
const severityColor: Record<string, string> = {
  Nhẹ: "#4caf50",
  "Trung bình": "#ff9800",
  Nặng: "#f44336",
  "Nghiêm trọng": "#9c27b0",
};

const signStatusConfig: Record<
  number,
  {
    label: string;
    color: "default" | "success";
  }
> = {
  0: { label: "Chưa gửi", color: "default" },
  1: { label: "Đã gửi", color: "success" },
};

const renderShareStatus = (status: number) => {
  const cfg = signStatusConfig[status] ?? signStatusConfig[0];
  return <Chip label={cfg.label} color={cfg.color} size="small" />;
};

export default function MaintenancePlanRepair() {
  const navigate = useNavigate();

  /**
   * Navigation state machine:
   *   selectedPlan=null, selectedIncident=null  → List mode  (bảng full width)
   *   selectedPlan≠null, selectedIncident=null  → Plan mode  (bảng 400px + PlanDetailPanel)
   *   selectedPlan≠null, selectedIncident≠null  → Incident mode (bảng 400px + IncidentDetailPanel)
   *
   * Ở compact mode (plan/incident), bảng trái dùng TableCustom với columnsCollapsed
   * hiển thị toàn bộ filtered — giữ nguyên như code gốc.
   * Thêm mới: phía dưới TableCustom có incident sub-rows của plan đang chọn,
   * cho phép chuyển đổi giữa chi tiết KH và từng SC dễ dàng.
   */

  const { user } = useSelector((state: RootState) => state.user);
  const [selectedPlan, setSelectedPlan] = useState<MaintenancePlanData | null>(
    null,
  );
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedIncidentPlanIds, setExpandedIncidentPlanIds] = useState<
    Set<string>
  >(new Set());
  const [showForm, setShowForm] = useState(false);
  const [incidentInspectionRecords, setIncidentInspectionRecords] = useState(
    initialIncidentInspectionRecords,
  );
  const searchDebounce = useDebounce(searchValue, 500);
  const { data: groupedData, isLoading } = useMaintenancePlanningGroupedQuery(
    CongTy.CT001,
    // statusFilter,
    // searchDebounce,
    // user?.taiKhoan?.tenDangNhap,
  );
  const { createMutation, updateMutation, deleteMutation, updateManyMutation } =
    useMaintenancePlanningMutation();

  const {
    annualPlans,
    addAnnualPlan,
    repairRequests,
    inspectionRecords,
    acceptanceTestRecords,
    materialQualityRecords,
    addRepairRequest,
    addInspectionRecord,
    addAcceptanceTestRecord,
    addMaterialQualityRecord,
    incidentReports,
    addIncidentReport,
  } = useCmms();

  useEffect(() => {
    console.log("📋 [CMMS Context Data]", {
      totalPlans: annualPlans.length,
      years: Array.from(new Set(annualPlans.map((p) => p.year))).sort(
        (a, b) => b - a,
      ),
    });
  }, [annualPlans]);

  // ── Merge static + context incident reports ───────────────
  const allIncidentReports = useMemo<IncidentReport[]>(() => {
    const extended = extendedIncidentReports as IncidentReport[];
    const fromContext = (incidentReports as IncidentReport[]) || [];
    return [
      ...extended,
      ...fromContext.filter((r) => !extended.some((e) => e.id === r.id)),
    ];
  }, [incidentReports]);

  const getIncidentsForPlan = (planId: string): IncidentReport[] =>
    allIncidentReports.filter((inc) => inc.planIds?.includes(planId));

  const selectedSchedule: Record<string, any> =
    (selectedPlan as any)?.monthlySchedule ?? {};
  const yearlyMaterials = useMemo(
    () => (selectedPlan ? calculatePlanMaterials(selectedSchedule) : []),
    [selectedPlan, selectedSchedule],
  );

  const allPlans = useMemo(() => {
    if (!groupedData?.data) return [];
    return Object.values(groupedData.data).flat() as MaintenancePlanData[];
  }, [groupedData]);

  // ── Client-side filtering ─────────────────────────────────
  const filtered = useMemo(() => {
    if (!allPlans || allPlans.length === 0) {
      return [];
    }

    const result = allPlans.filter((p) => {
      const matchSearch =
        !searchValue ||
        p.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        (p as any).tenKeHoach
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
      const matchStatus = !statusFilter || p.trangThai === Number(statusFilter);
      return matchSearch && matchStatus;
    });

    return result;
  }, [allPlans, searchValue, statusFilter]);

  const plansByYear = useMemo(() => {
    const groups = filtered.reduce((acc, plan) => {
      const list = acc.get(plan.nam) ?? [];
      list.push(plan);
      acc.set(plan.nam, list);
      return acc;
    }, new Map<number, MaintenancePlanData[]>());

    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  // ── Toggle helpers ────────────────────────────────────────
  const toggleYear = (year: number) =>
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));

  const toggleIncidentExpand = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIncidentPlanIds((prev) => {
      const next = new Set(prev);
      next.has(planId) ? next.delete(planId) : next.add(planId);
      return next;
    });
  };

  const handleToggleSelect = (planId: string) => {
    setSelectedIds((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId],
    );
  };

  // ── Navigation handlers ───────────────────────────────────
  // Case 1 & 4: Click KH → hiển thị chi tiết KH, ẩn SC
  const handlePlanRowClick = (plan: MaintenancePlanData) => {
    setSelectedPlan(plan);
    setSelectedIncident(null);
    // Auto-expand incident sub-rows for this plan
    setExpandedIncidentPlanIds((prev) => {
      const next = new Set(prev);
      next.add(plan.id);
      return next;
    });
  };

  // Case 2: Click SC → hiển thị chi tiết SC
  const handleIncidentRowClick = (
    plan: MaintenancePlanData,
    incident: IncidentReport,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setSelectedPlan(plan);
    setSelectedIncident(incident);
    setExpandedIncidentPlanIds((prev) => {
      const next = new Set(prev);
      next.add(plan.id);
      return next;
    });
  };

  // Case 3 & 5: Đóng panel → về danh sách
  const handleCloseAll = () => {
    setSelectedPlan(null);
    setSelectedIncident(null);
  };

  // ── Selection helpers ─────────────────────────────────────
  const selectedPlans = allPlans.filter((plan) =>
    selectedIds.includes(plan.id),
  );
  const canSendToSigner =
    selectedPlans.length > 0 && selectedPlans.every((p) => p.trangThai === 0);
  const canCreateIncident = selectedPlans.length > 0;

  const [showIncidentDialog, setShowIncidentDialog] = useState(false);

  const countByStatus = (s: number) =>
    allPlans.filter((p) => p.trangThai === s).length;

  const handleSend = (items: any[]) => {
    handleSendToSigner(items, updateManyMutation.mutateAsync, handleCloseAll);
  };

  const statusOptions: FilterOption[] = [
    { label: "Tất cả", value: "", count: allPlans.length, color: "primary" },
    {
      label: "Bản nháp",
      value: 0,
      count: countByStatus(0),
      color: "default",
    },
    {
      label: "Chờ duyệt",
      value: 1,
      count: countByStatus(1),
      color: "warning",
    },
    {
      label: "Từ chối",
      value: 2,
      count: countByStatus(2),
      color: "error",
    },
    {
      label: "Đã duyệt",
      value: 3,
      count: countByStatus(3),
      color: "success",
    },
  ];

  const isDetailOpen = !!selectedPlan;

  // Incidents for the currently selected plan (used in compact incident sub-section)
  const incidentsForSelectedPlan = selectedPlan
    ? getIncidentsForPlan(selectedPlan.id)
    : [];
  const isCompactIncidentOpen = selectedPlan
    ? expandedIncidentPlanIds.has(selectedPlan.id)
    : false;

  const columnsFull = [
    { field: "id", headerName: "Mã kế hoạch", width: 140, editable: false },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: "sourceDepartmentId",
      headerName: "Đơn vị/Phân xưởng",
      width: 160,
      editable: false,
    },
    { field: "year", headerName: "Năm", width: 80, editable: false },
    {
      field: "createdDate",
      headerName: "Ngày tạo",
      width: 110,
      editable: false,
    },
    {
      field: "deviceIds",
      headerName: "Số TB",
      width: 80,
      editable: false,
      renderCell: (params: any) => params.row.deviceIds?.length ?? 0,
    },
    {
      field: "share",
      headerName: "Trình duyệt",
      width: 130,
      editable: false,
      renderCell: (params: any) => renderShareStatus(params.value),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      editable: false,
      renderCell: (params: any) => renderStatus(params.value),
    },
  ];

  const columnsCollapsed = [
    { field: "id", headerName: "Mã kế hoạch", flex: 1, editable: false },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      editable: false,
      renderCell: (params: any) => renderStatus(params.value),
    },
  ];

  return (
    <>
      <PageAction
        title="Lập kế hoạch sửa chữa bảo dưỡng"
        onNewClick={() => setShowForm(true)}
      />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            height: "calc(100vh - 180px)",
            minHeight: 600,
            maxHeight: "80vh",
          }}
        >
          {/* ══ LEFT PANEL ══════════════════════════════════════ */}
          <Card
            elevation={0}
            sx={{
              flex: isDetailOpen ? "0 0 400px" : 1,
              transition: "flex 0.3s ease",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                p: "0 !important",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <TableCustom
                title="Danh sách kế hoạch"
                rows={isDetailOpen ? filtered : []}
                columns={isDetailOpen ? columnsCollapsed : columnsFull}
                total={filtered.length}
                isCompact={isDetailOpen}
                checkboxSelection={!isDetailOpen}
                onRowClick={(params) =>
                  handlePlanRowClick(params.row as MaintenancePlanData)
                }
                statusOptions={statusOptions}
                statusValue={statusFilter}
                onStatusChange={setStatusFilter}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onDelete={() => {}}
                showDelete={false}
                isCheckShowShare={isCheckShowShare}
                extraActions={
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{ display: isDetailOpen ? "none" : undefined }}
                      disabled={!canCreateIncident}
                      onClick={() => setShowIncidentDialog(true)}
                    >
                      Tạo phiếu báo sự cố ({selectedPlans.length})
                    </Button>

                    {isCheckShowShare(selectedPlans) && (
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        sx={{ display: isDetailOpen ? "none" : undefined }}
                        disabled={!canSendToSigner}
                        onClick={async () => await handleSend(selectedPlans)}
                      >
                        Trình duyệt người ký ({selectedPlans.length})
                      </Button>
                    )}
                  </>
                }
                customContent={
                  !isDetailOpen ? (
                    /* ── LIST MODE: accordion theo năm ── */
                    <Stack
                      spacing={2}
                      sx={{ py: 1, px: 1, flex: 1, overflow: "auto" }}
                    >
                      {plansByYear.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Không có kế hoạch phù hợp.
                        </Typography>
                      ) : (
                        plansByYear.map(
                          ([year, plans]: [number, MaintenancePlanData[]]) => (
                            <Accordion
                              key={year}
                              expanded={!!expandedYears[year]}
                              onChange={() => toggleYear(year)}
                              disableGutters
                              sx={{
                                mb: 1,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                  bgcolor: "background.paper",
                                  minHeight: 56,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                  >
                                    {year}
                                  </Typography>
                                  <Chip
                                    label={`${plans.length} kế hoạch`}
                                    size="small"
                                  />
                                  <Typography
                                    color="text.secondary"
                                    sx={{ flexGrow: 1 }}
                                  >
                                    Tổng TB:{" "}
                                    {plans.reduce(
                                      (sum, p) =>
                                        sum + (p.danhSachTaiSan?.length ?? 0),
                                      0,
                                    )}
                                  </Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0 }}>
                                <TableContainer
                                  component={Paper}
                                  variant="outlined"
                                >
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow sx={{ bgcolor: "#1FA463" }}>
                                        <TableCell
                                          padding="checkbox"
                                          sx={{ color: "#fff", width: 40 }}
                                        />
                                        <TableCell
                                          padding="checkbox"
                                          sx={{ color: "#fff" }}
                                        />
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Mã kế hoạch
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Mô tả
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Đơn vị/Phân xưởng
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Năm
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Ngày tạo
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                          align="right"
                                        >
                                          Số TB
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Sự cố
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Trình duyệt
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            fontWeight: 700,
                                            color: "#fff",
                                          }}
                                        >
                                          Trạng thái
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {plans.map(
                                        (plan: MaintenancePlanData) => {
                                          const planIncidents =
                                            getIncidentsForPlan(plan.id);
                                          const isIncidentOpen =
                                            expandedIncidentPlanIds.has(
                                              plan.id,
                                            );
                                          const isPlanSelected =
                                            (
                                              selectedPlan as MaintenancePlanData | null
                                            )?.id === plan.id &&
                                            !selectedIncident;

                                          return (
                                            <React.Fragment key={plan.id}>
                                              <TableRow
                                                hover
                                                selected={isPlanSelected}
                                                sx={{
                                                  cursor: "pointer",
                                                  bgcolor: isPlanSelected
                                                    ? "action.selected"
                                                    : undefined,
                                                }}
                                                onClick={() =>
                                                  handlePlanRowClick(plan)
                                                }
                                              >
                                                <TableCell
                                                  padding="checkbox"
                                                  onClick={(e) =>
                                                    planIncidents.length > 0 &&
                                                    toggleIncidentExpand(
                                                      plan.id,
                                                      e,
                                                    )
                                                  }
                                                  sx={{ width: 40 }}
                                                >
                                                  {planIncidents.length > 0 && (
                                                    <Tooltip
                                                      title={
                                                        isIncidentOpen
                                                          ? "Ẩn sự cố"
                                                          : `${planIncidents.length} sự cố`
                                                      }
                                                    >
                                                      <IconButton size="small">
                                                        {isIncidentOpen ? (
                                                          <KeyboardArrowUpIcon fontSize="small" />
                                                        ) : (
                                                          <KeyboardArrowDownIcon fontSize="small" />
                                                        )}
                                                      </IconButton>
                                                    </Tooltip>
                                                  )}
                                                </TableCell>
                                                <TableCell
                                                  padding="checkbox"
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                >
                                                  <Checkbox
                                                    size="small"
                                                    checked={selectedIds.includes(
                                                      plan.id,
                                                    )}
                                                    onChange={() =>
                                                      handleToggleSelect(
                                                        plan.id,
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell>{plan.id}</TableCell>
                                                <TableCell>
                                                  {plan.tenKeHoach}
                                                </TableCell>
                                                <TableCell>
                                                  {plan.tenDonViGiao ?? "—"}
                                                </TableCell>
                                                <TableCell>
                                                  {plan.nam}
                                                </TableCell>
                                                <TableCell>
                                                  {plan.ngayTao}
                                                </TableCell>
                                                <TableCell align="right">
                                                  {plan.danhSachTaiSan
                                                    ?.length ?? 0}
                                                </TableCell>
                                                <TableCell>
                                                  {planIncidents.length > 0 ? (
                                                    <Chip
                                                      icon={
                                                        <WarningAmberIcon
                                                          sx={{ fontSize: 14 }}
                                                        />
                                                      }
                                                      label={
                                                        planIncidents.length
                                                      }
                                                      size="small"
                                                      color="warning"
                                                      variant="outlined"
                                                    />
                                                  ) : (
                                                    <Typography
                                                      variant="caption"
                                                      color="text.disabled"
                                                    >
                                                      —
                                                    </Typography>
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {renderShareStatus(
                                                    plan.share ? 1 : 0,
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {renderStatus(plan.trangThai)}
                                                </TableCell>
                                              </TableRow>

                                              {/* Incident sub-rows */}
                                              {planIncidents.length > 0 && (
                                                <TableRow>
                                                  <TableCell
                                                    colSpan={10}
                                                    sx={{ p: 0, border: 0 }}
                                                  >
                                                    <Collapse
                                                      in={isIncidentOpen}
                                                      timeout="auto"
                                                      unmountOnExit
                                                    >
                                                      <Box
                                                        sx={{
                                                          bgcolor: "#fffde7",
                                                          borderBottom:
                                                            "1px solid",
                                                          borderColor:
                                                            "divider",
                                                        }}
                                                      >
                                                        <Table size="small">
                                                          <TableHead>
                                                            <TableRow
                                                              sx={{
                                                                bgcolor:
                                                                  "#f9a825",
                                                              }}
                                                            >
                                                              <TableCell
                                                                sx={{
                                                                  pl: 6,
                                                                  fontWeight: 700,
                                                                  color: "#fff",
                                                                  fontSize: 12,
                                                                }}
                                                              >
                                                                Số phiếu
                                                              </TableCell>
                                                              <TableCell
                                                                sx={{
                                                                  fontWeight: 700,
                                                                  color: "#fff",
                                                                  fontSize: 12,
                                                                }}
                                                              >
                                                                Ngày phát hiện
                                                              </TableCell>
                                                              <TableCell
                                                                sx={{
                                                                  fontWeight: 700,
                                                                  color: "#fff",
                                                                  fontSize: 12,
                                                                }}
                                                              >
                                                                Hệ thống
                                                              </TableCell>
                                                              <TableCell
                                                                sx={{
                                                                  fontWeight: 700,
                                                                  color: "#fff",
                                                                  fontSize: 12,
                                                                }}
                                                              >
                                                                Mức độ
                                                              </TableCell>
                                                              <TableCell
                                                                sx={{
                                                                  fontWeight: 700,
                                                                  color: "#fff",
                                                                  fontSize: 12,
                                                                }}
                                                              >
                                                                Trạng thái
                                                              </TableCell>
                                                            </TableRow>
                                                          </TableHead>
                                                          <TableBody>
                                                            {planIncidents.map(
                                                              (incident) => {
                                                                const isIncidentSelected =
                                                                  selectedIncident?.id ===
                                                                  incident.id;
                                                                return (
                                                                  <TableRow
                                                                    key={
                                                                      incident.id
                                                                    }
                                                                    hover
                                                                    selected={
                                                                      isIncidentSelected
                                                                    }
                                                                    sx={{
                                                                      cursor:
                                                                        "pointer",
                                                                      bgcolor:
                                                                        isIncidentSelected
                                                                          ? "rgba(249,168,37,0.15)"
                                                                          : undefined,
                                                                      "&:hover":
                                                                        {
                                                                          bgcolor:
                                                                            "rgba(249,168,37,0.08)",
                                                                        },
                                                                    }}
                                                                    onClick={(
                                                                      e,
                                                                    ) =>
                                                                      handleIncidentRowClick(
                                                                        plan,
                                                                        incident,
                                                                        e,
                                                                      )
                                                                    }
                                                                  >
                                                                    <TableCell
                                                                      sx={{
                                                                        pl: 6,
                                                                      }}
                                                                    >
                                                                      <Box
                                                                        sx={{
                                                                          display:
                                                                            "flex",
                                                                          alignItems:
                                                                            "center",
                                                                          gap: 0.5,
                                                                        }}
                                                                      >
                                                                        <WarningAmberIcon
                                                                          sx={{
                                                                            fontSize: 14,
                                                                            color:
                                                                              "#f9a825",
                                                                          }}
                                                                        />
                                                                        <Typography
                                                                          variant="body2"
                                                                          fontWeight={
                                                                            500
                                                                          }
                                                                        >
                                                                          {
                                                                            incident.number
                                                                          }
                                                                        </Typography>
                                                                      </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      <Typography variant="body2">
                                                                        {
                                                                          incident.detectedAt
                                                                        }
                                                                      </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      <Typography variant="body2">
                                                                        {
                                                                          incident.systemName
                                                                        }
                                                                      </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      {incident.severity ? (
                                                                        <Chip
                                                                          label={
                                                                            incident.severity
                                                                          }
                                                                          size="small"
                                                                          sx={{
                                                                            bgcolor:
                                                                              severityColor[
                                                                                incident
                                                                                  .severity
                                                                              ] ||
                                                                              "#bdbdbd",
                                                                            color:
                                                                              "#fff",
                                                                            fontSize: 11,
                                                                          }}
                                                                        />
                                                                      ) : (
                                                                        "—"
                                                                      )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      {renderIncidentStatus(
                                                                        incident.status ??
                                                                          "cho-duyet",
                                                                      )}
                                                                    </TableCell>
                                                                  </TableRow>
                                                                );
                                                              },
                                                            )}
                                                          </TableBody>
                                                        </Table>
                                                      </Box>
                                                    </Collapse>
                                                  </TableCell>
                                                </TableRow>
                                              )}
                                            </React.Fragment>
                                          );
                                        },
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </AccordionDetails>
                            </Accordion>
                          ),
                        )
                      )}

                      {showCalendar && (
                        <MaintenancePlanCalendar
                          onClose={() => setShowCalendar(false)}
                          plans={annualPlans as any}
                          onPlanClick={(plan: any) => {
                            handlePlanRowClick(plan as MaintenancePlanData);
                            setShowCalendar(false);
                          }}
                          onCreateRepair={() => navigate(ROUTES.ASSETGROUP)}
                        />
                      )}
                    </Stack>
                  ) : undefined
                }
              />

              {/* ── COMPACT MODE: incident sub-section bên dưới danh sách thu nhỏ ──
                  Chỉ hiện khi đang xem chi tiết KH/SC và plan đó có sự cố.
                  Cho phép người dùng click vào KH (row trên) hoặc SC bất kỳ bên dưới. ── */}
              {isDetailOpen &&
                selectedPlan &&
                incidentsForSelectedPlan.length > 0 && (
                  <Box
                    sx={{
                      borderTop: "2px solid",
                      borderColor: "divider",
                      flexShrink: 0,
                    }}
                  >
                    {/* Toggle header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 1.5,
                        py: 0.75,
                        bgcolor: "#fffde7",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#fff9c4" },
                        userSelect: "none",
                      }}
                      onClick={(e) => toggleIncidentExpand(selectedPlan.id, e)}
                    >
                      <WarningAmberIcon
                        sx={{ fontSize: 15, color: "#f9a825", mr: 0.75 }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{ flex: 1, color: "#795548" }}
                      >
                        {incidentsForSelectedPlan.length} sự cố —{" "}
                        {selectedPlan.id}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ p: 0.25 }}
                        onClick={(e) =>
                          toggleIncidentExpand(selectedPlan.id, e)
                        }
                      >
                        {isCompactIncidentOpen ? (
                          <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    </Box>

                    {/* Incident rows — same style as list mode sub-rows */}
                    <Collapse
                      in={isCompactIncidentOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ bgcolor: "#fffde7" }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "#f9a825" }}>
                              <TableCell
                                sx={{
                                  pl: 2,
                                  fontWeight: 700,
                                  color: "#fff",
                                  fontSize: 12,
                                }}
                              >
                                Số phiếu
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                  color: "#fff",
                                  fontSize: 12,
                                }}
                              >
                                Trạng thái
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {incidentsForSelectedPlan.map((incident) => {
                              const isIncidentSelected =
                                selectedIncident?.id === incident.id;
                              return (
                                <TableRow
                                  key={incident.id}
                                  hover
                                  selected={isIncidentSelected}
                                  sx={{
                                    cursor: "pointer",
                                    bgcolor: isIncidentSelected
                                      ? "rgba(249,168,37,0.15)"
                                      : undefined,
                                    "&:hover": {
                                      bgcolor: "rgba(249,168,37,0.08)",
                                    },
                                  }}
                                  onClick={(e) =>
                                    handleIncidentRowClick(
                                      selectedPlan,
                                      incident,
                                      e,
                                    )
                                  }
                                >
                                  <TableCell sx={{ pl: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <WarningAmberIcon
                                        sx={{ fontSize: 13, color: "#f9a825" }}
                                      />
                                      <Typography
                                        variant="body2"
                                        fontWeight={
                                          isIncidentSelected ? 700 : 400
                                        }
                                      >
                                        {incident.number}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {renderIncidentStatus(
                                      incident.status ?? "cho-duyet",
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </Box>
                )}
            </CardContent>
          </Card>

          {/* ══ RIGHT PANEL ═════════════════════════════════════ */}
          {isDetailOpen && selectedPlan && (
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                overflow: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              {selectedIncident ? (
                <IncidentDetailPanel
                  incident={selectedIncident}
                  plan={selectedPlan}
                  inspectionRecords={inspectionRecords}
                  acceptanceTestRecords={acceptanceTestRecords}
                  materialQualityRecords={materialQualityRecords}
                  incidentInspectionRecords={incidentInspectionRecords}
                  onClose={handleCloseAll}
                  onCreateIncidentInspectionRecord={(record) =>
                    setIncidentInspectionRecords((prev) => [...prev, record])
                  }
                  onCreateInspectionRecord={addInspectionRecord}
                  onCreateAcceptanceRecord={addAcceptanceTestRecord}
                  onCreateMaterialQualityRecord={addMaterialQualityRecord}
                />
              ) : (
                <PlanDetailPanel
                  plan={selectedPlan}
                  repairRequests={repairRequests}
                  inspectionRecords={inspectionRecords}
                  acceptanceTestRecords={acceptanceTestRecords}
                  materialQualityRecords={materialQualityRecords}
                  onClose={handleCloseAll}
                  onCreateRepairRequest={addRepairRequest}
                  onCreateInspectionRecord={addInspectionRecord}
                  onCreateAcceptanceRecord={addAcceptanceTestRecord}
                  onCreateMaterialQualityRecord={addMaterialQualityRecord}
                />
              )}
            </Paper>
          )}
        </Box>
      </Box>

      {/* Yearly materials summary */}
      {selectedPlan && !selectedIncident && yearlyMaterials.length > 0 && (
        <Box
          sx={{
            mt: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Tổng hợp vật tư cần thiết — Kế hoạch năm {selectedPlan.nam} (
            {selectedPlan.id})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tên vật tư</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Tổng số lượng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Đơn vị</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearlyMaterials.map((mat, i) => (
                  <TableRow key={mat.name}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{mat.name}</TableCell>
                    <TableCell align="right">
                      {mat.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell>{mat.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <CreatePlanDialog
        open={showForm}
        initialData={selectedPlan}
        onClose={() => {
          setShowForm(false);
          setSelectedPlan(null);
        }}
        onSave={async (plan, isEdit) => {
          if (isEdit) {
            await updateMutation.mutateAsync(plan);
          } else {
            await createMutation.mutateAsync(plan);
          }
          setShowForm(false);
          setSelectedPlan(null);
        }}
      />
      <IncidentDialog
        open={showIncidentDialog}
        onClose={() => setShowIncidentDialog(false)}
        selectedPlans={selectedPlans}
        onSubmit={(rec) => {
          addIncidentReport(rec);
          setShowIncidentDialog(false);
          setSelectedIds([]);
        }}
      />
    </>
  );
}
