import React, { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Popover,
  Chip,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  Clock,
  User,
  Building2,
} from "lucide-react";
import { MaintenancePlanData } from "../types";
import { StatusPlan, StatusPlanType } from "../../../utils/const";
import { showPlanType } from "../config";

dayjs.locale("vi");

/* ─── Status config ──────────────────────────────────────────────── */
const STATUS: Record<
  StatusPlanType,
  { label: string; bg: string; border: string; color: string }
> = {
  [StatusPlan.PENDING]: {
    // Dùng dấu ngoặc vuông để lấy giá trị của Enum/Constant làm key
    label: "Chưa thực hiện",
    bg: "#fff3e0",
    border: "#fb8c00",
    color: "#e65100",
  },
  [StatusPlan.PROGRESS]: {
    // Giả sử 1 là StatusPlan.DOING
    label: "Đang thực hiện",
    bg: "#e3f2fd",
    border: "#1976d2",
    color: "#0d47a1",
  },
  [StatusPlan.COMPLETED]: {
    // Giả sử 2 là StatusPlan.DONE
    label: "Đã hoàn thành",
    bg: "#e8f5e9",
    border: "#388e3c",
    color: "#1b5e20",
  },
};

const DAY_HEADERS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const EVENT_H = 22; // px – height of one event bar
const EVENT_GAP = 3; // px – gap between bars
const DAY_NUM_H = 32; // px – height of the day-number row in each week cell
const MAX_TRACKS = 3; // visible event rows per week; rest → "+N more"

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Returns array of 7-day arrays for the month view (Monday-first). */
function buildCalendarWeeks(year: number, month: number): Dayjs[][] {
  const firstOfMonth = dayjs(new Date(year, month - 1, 1));
  // Monday = 0 … Sunday = 6
  const startOffset = (firstOfMonth.day() + 6) % 7;
  const startDate = firstOfMonth.subtract(startOffset, "day");

  const weeks: Dayjs[][] = [];
  let cur = startDate;
  while (weeks.length < 6) {
    const week: Dayjs[] = Array.from({ length: 7 }, (_, i) =>
      cur.add(i, "day"),
    );
    weeks.push(week);
    cur = cur.add(7, "day");
    // Stop after the month ends
    if (cur.isAfter(firstOfMonth.endOf("month")) && weeks.length >= 4) break;
  }
  return weeks;
}

interface CalendarSlot {
  plan: MaintenancePlanData;
  /** 0-based column start within this week (0 = Mon). */
  colStart: number;
  /** Number of columns spanned in this week. */
  colSpan: number;
  startsThisWeek: boolean;
  endsThisWeek: boolean;
  track: number;
}

/** Assign vertical tracks to avoid overlap within a week row. */
function buildWeekSlots(
  plans: MaintenancePlanData[],
  weekStart: Dayjs,
  weekEnd: Dayjs,
): CalendarSlot[] {
  const overlapping = plans.filter((p) => {
    if (!p.ngayBatDau) return false;
    const s = dayjs(p.ngayBatDau);
    const e = p.ngayKetThuc ? dayjs(p.ngayKetThuc) : s;
    return (
      s.isBefore(weekEnd.add(1, "day")) &&
      e.isAfter(weekStart.subtract(1, "day"))
    );
  });

  // Sort: earlier start first → wider span first
  overlapping.sort((a, b) => dayjs(a.ngayBatDau).diff(dayjs(b.ngayBatDau)));

  // Convert to raw slots (no track yet)
  const raw = overlapping.map((plan) => {
    const s = dayjs(plan.ngayBatDau!);
    const e = plan.ngayKetThuc ? dayjs(plan.ngayKetThuc) : s;
    const startsThisWeek = s.isAfter(weekStart.subtract(1, "day"));
    const endsThisWeek = e.isBefore(weekEnd.add(1, "day"));
    const colStart = startsThisWeek ? (s.day() + 6) % 7 : 0;
    const colEnd = endsThisWeek ? (e.day() + 6) % 7 : 6;
    return {
      plan,
      colStart,
      colSpan: colEnd - colStart + 1,
      startsThisWeek,
      endsThisWeek,
    };
  });

  // Greedy track assignment
  const trackEnds: number[] = []; // trackEnds[t] = last occupied column in track t
  return raw.map((slot) => {
    let track = 0;
    while (
      trackEnds[track] !== undefined &&
      trackEnds[track] >= slot.colStart
    ) {
      track++;
    }
    trackEnds[track] = slot.colStart + slot.colSpan - 1;
    return { ...slot, track };
  });
}

/* ─── Event bar ──────────────────────────────────────────────────── */
interface EventBarProps {
  slot: CalendarSlot;
  onClick: (anchor: HTMLElement, plan: MaintenancePlanData) => void;
}

function EventBar({ slot, onClick }: EventBarProps) {
  const { plan, colStart, colSpan, startsThisWeek, endsThisWeek, track } = slot;
  const cfg = STATUS[plan.trangThai ?? 0] ?? STATUS[0];
  const top = DAY_NUM_H + track * (EVENT_H + EVENT_GAP);

  return (
    <Tooltip title={plan.tenKeHoach ?? ""} placement="top" arrow>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onClick(e.currentTarget as HTMLElement, plan);
        }}
        sx={{
          position: "absolute",
          top,
          left: `calc(${(colStart / 7) * 100}% + ${startsThisWeek ? 4 : 0}px)`,
          width: `calc(${(colSpan / 7) * 100}% - ${(startsThisWeek ? 4 : 0) + (endsThisWeek ? 4 : 0)}px)`,
          height: EVENT_H,
          bgcolor: cfg.bg,
          border: `1.5px solid ${cfg.border}`,
          borderRadius: `${startsThisWeek ? 6 : 0}px ${endsThisWeek ? 6 : 0}px ${endsThisWeek ? 6 : 0}px ${startsThisWeek ? 6 : 0}px`,
          display: "flex",
          alignItems: "center",
          px: 1,
          cursor: "pointer",
          overflow: "hidden",
          whiteSpace: "nowrap",
          zIndex: 1,
          "&:hover": { filter: "brightness(0.93)" },
          transition: "filter 0.15s",
        }}
      >
        {startsThisWeek && (
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: cfg.color,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {plan.tenKeHoach}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

/* ─── Day cell ───────────────────────────────────────────────────── */
function DayCell({
  day,
  currentMonth,
  isToday,
}: {
  day: Dayjs;
  currentMonth: number;
  isToday: boolean;
}) {
  const outsideMonth = day.month() + 1 !== currentMonth;
  return (
    <Box
      sx={{
        height: DAY_NUM_H,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        px: 0.5,
        pt: 0.5,
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isToday ? "primary.main" : "transparent",
          color: isToday
            ? "#fff"
            : outsideMonth
              ? "text.disabled"
              : "text.primary",
          fontWeight: isToday ? 700 : day.day() === 0 ? 600 : 400,
          fontSize: "0.78rem",
        }}
      >
        {day.date()}
      </Box>
    </Box>
  );
}

/* ─── Detail Popover ─────────────────────────────────────────────── */
function PlanPopover({
  anchor,
  plan,
  onClose,
  onOpenDetail,
}: {
  anchor: HTMLElement | null;
  plan: MaintenancePlanData | null;
  onClose: () => void;
  onOpenDetail?: (plan: MaintenancePlanData) => void;
}) {
  if (!plan) return null;
  const cfg = STATUS[plan.trangThai ?? 0] ?? STATUS[0];

  return (
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: { width: 300, borderRadius: 2, overflow: "hidden", boxShadow: 6 },
      }}
    >
      {/* Color header */}
      <Box
        sx={{
          bgcolor: cfg.border,
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            flex: 1,
            pr: 1,
          }}
          noWrap
        >
          {plan.tenKeHoach}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "#fff", p: 0.3 }}
        >
          <X size={16} />
        </IconButton>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Status */}
        <Chip
          label={cfg.label}
          size="small"
          sx={{
            bgcolor: cfg.bg,
            color: cfg.color,
            fontWeight: 600,
            border: `1px solid ${cfg.border}`,
            alignSelf: "flex-start",
          }}
        />

        <Divider />

        {/* Date range */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <CalendarDays
            size={15}
            style={{ marginTop: 2, color: "#757575", flexShrink: 0 }}
          />
          <Box>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              Thời gian
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 500 }}>
              {dayjs(plan.ngayBatDau).format("DD/MM/YYYY")}
              {plan.ngayKetThuc && plan.ngayKetThuc !== plan.ngayBatDau
                ? ` – ${dayjs(plan.ngayKetThuc).format("DD/MM/YYYY")}`
                : ""}
            </Typography>
          </Box>
        </Box>

        {/* Type */}
        {plan.loaiKeHoach && (
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Clock
              size={15}
              style={{ marginTop: 2, color: "#757575", flexShrink: 0 }}
            />
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                Loại kế hoạch
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 500 }}>
                {showPlanType(plan.loaiKeHoach)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Person */}
        {plan.tenNguoiPhuTrach && (
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <User
              size={15}
              style={{ marginTop: 2, color: "#757575", flexShrink: 0 }}
            />
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                Người phụ trách
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 500 }}>
                {plan.tenNguoiPhuTrach}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Dept */}
        {plan.tenDonViThucHien && (
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Building2
              size={15}
              style={{ marginTop: 2, color: "#757575", flexShrink: 0 }}
            />
            <Box>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                Đơn vị thực hiện
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 500 }}>
                {plan.tenDonViThucHien}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Notes */}
        {plan.ghiChu && (
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "text.secondary",
              fontStyle: "italic",
              mt: 0.5,
            }}
          >
            {plan.ghiChu}
          </Typography>
        )}

        {onOpenDetail && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                onClose();
                onOpenDetail(plan);
              }}
              sx={{ fontSize: "0.75rem" }}
            >
              Mở chi tiết
            </Button>
          </Box>
        )}
      </Box>
    </Popover>
  );
}

/* ─── Main Calendar ──────────────────────────────────────────────── */
interface Props {
  onClose: () => void;
  plans: MaintenancePlanData[];
  onPlanClick?: (plan: MaintenancePlanData) => void;
}

export default function MaintenancePlanCalendar({
  onClose,
  plans,
  onPlanClick,
}: Props) {
  const today = useMemo(() => dayjs(), []);
  const [current, setCurrent] = useState<Dayjs>(today.startOf("month"));
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [activePlan, setActivePlan] = useState<MaintenancePlanData | null>(
    null,
  );

  const year = current.year();
  const month = current.month() + 1;
  const weeks = useMemo(() => buildCalendarWeeks(year, month), [year, month]);

  // Plans that have at least a start date
  const validPlans = useMemo(
    () => plans.filter((p) => !!p.ngayBatDau),
    [plans],
  );

  const weekData = useMemo(
    () =>
      weeks.map((week) => {
        const weekStart = week[0];
        const weekEnd = week[6];
        const slots = buildWeekSlots(validPlans, weekStart, weekEnd);
        // Total event count per day column (for "+N more" label)
        const overflowByCol: number[] = Array(7).fill(0);
        slots.forEach((s) => {
          if (s.track >= MAX_TRACKS) {
            for (let c = s.colStart; c < s.colStart + s.colSpan; c++) {
              overflowByCol[c]++;
            }
          }
        });
        const visibleSlots = slots.filter((s) => s.track < MAX_TRACKS);
        const weekH = DAY_NUM_H + MAX_TRACKS * (EVENT_H + EVENT_GAP) + 6;
        return {
          week,
          weekStart,
          weekEnd,
          slots,
          visibleSlots,
          overflowByCol,
          weekH,
        };
      }),
    [weeks, validPlans],
  );

  // Count plans for month summary
  const monthPlans = useMemo(
    () =>
      validPlans.filter((p) => {
        const s = dayjs(p.ngayBatDau!);
        const e = p.ngayKetThuc ? dayjs(p.ngayKetThuc) : s;
        const monthStart = current.startOf("month");
        const monthEnd = current.endOf("month");
        return (
          s.isBefore(monthEnd.add(1, "day")) &&
          e.isAfter(monthStart.subtract(1, "day"))
        );
      }),
    [validPlans, current],
  );

  const handleEventClick = (anchor: HTMLElement, plan: MaintenancePlanData) => {
    setPopoverAnchor(anchor);
    setActivePlan(plan);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8f9fa",
        height: "100%",
        minHeight: 520,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* ── Toolbar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 3,
          py: 1.5,
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: "divider",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <CalendarDays size={22} color="#1976d2" />
        <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
          Lịch kế hoạch sửa chữa bảo dưỡng
        </Typography>

        {/* Month navigation */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => setCurrent(today.startOf("month"))}
          sx={{ minWidth: 64, fontWeight: 600, textTransform: "none" }}
        >
          Hôm nay
        </Button>
        <IconButton
          size="small"
          onClick={() => setCurrent((c) => c.subtract(1, "month"))}
        >
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => setCurrent((c) => c.add(1, "month"))}
        >
          <ChevronRight size={20} />
        </IconButton>
        <Typography variant="h6" fontWeight={600} sx={{ minWidth: 180 }}>
          Tháng {month} / {year}
        </Typography>

        {/* Summary chips */}
        <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
          {Object.entries(STATUS).map(([key, cfg]) => {
            const cnt = monthPlans.filter(
              (p) => (p.trangThai ?? 0) === Number(key),
            ).length;
            if (cnt === 0) return null;
            return (
              <Chip
                key={key}
                label={`${cfg.label}: ${cnt}`}
                size="small"
                sx={{
                  bgcolor: cfg.bg,
                  color: cfg.color,
                  fontWeight: 600,
                  border: `1px solid ${cfg.border}`,
                }}
              />
            );
          })}
          {monthPlans.length === 0 && (
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "text.secondary",
                alignSelf: "center",
              }}
            >
              Không có kế hoạch trong tháng này
            </Typography>
          )}
        </Box>

        <IconButton onClick={onClose} sx={{ ml: "auto" }}>
          <X size={22} />
        </IconButton>
      </Box>

      {/* ── Calendar body ── */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            minWidth: 900,
          }}
        >
          {/* Day-of-week header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "#f5f5f5",
            }}
          >
            {DAY_HEADERS.map((d) => (
              <Box
                key={d}
                sx={{
                  py: 1.2,
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: d === "CN" ? "error.main" : "text.secondary",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {d}
              </Box>
            ))}
          </Box>

          {/* Week rows */}
          {weekData.map(({ week, visibleSlots, overflowByCol, weekH }, wi) => {
            const isLastRow = wi === weekData.length - 1;
            return (
              <Box
                key={wi}
                sx={{
                  borderBottom: isLastRow ? "none" : "1px solid",
                  borderColor: "divider",
                }}
              >
                {/* Day cells row + event layer — all in a single relative box */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    position: "relative",
                    height: weekH,
                  }}
                >
                  {/* Day number cells (for click targets and borders) */}
                  {week.map((day, di) => {
                    const isToday = day.isSame(today, "day");
                    const outsideMonth = day.month() + 1 !== month;
                    const isSun = di === 6;
                    const overflow = overflowByCol[di];

                    return (
                      <Box
                        key={di}
                        sx={{
                          borderLeft: di === 0 ? "none" : "1px solid",
                          borderColor: "divider",
                          bgcolor: outsideMonth ? "#fafafa" : "transparent",
                          position: "relative",
                          height: "100%",
                        }}
                      >
                        {/* Day number */}
                        <Box
                          sx={{
                            height: DAY_NUM_H,
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                            px: 0.8,
                            pt: 0.6,
                          }}
                        >
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: isToday ? "primary.main" : "transparent",
                              color: isToday
                                ? "#fff"
                                : outsideMonth
                                  ? "#bdbdbd"
                                  : isSun
                                    ? "error.main"
                                    : "text.primary",
                              fontWeight: isToday ? 800 : 400,
                              fontSize: "0.78rem",
                            }}
                          >
                            {day.date()}
                          </Box>
                        </Box>

                        {/* "+N more" overflow label */}
                        {overflow > 0 && (
                          <Typography
                            sx={{
                              position: "absolute",
                              bottom: 3,
                              right: 5,
                              fontSize: "0.65rem",
                              color: "text.secondary",
                              fontWeight: 600,
                              pointerEvents: "none",
                            }}
                          >
                            +{overflow} more
                          </Typography>
                        )}
                      </Box>
                    );
                  })}

                  {/* Event bars overlay — absolute over the whole row */}
                  {visibleSlots.map((slot, si) => (
                    <EventBar
                      key={`${wi}-${si}`}
                      slot={slot}
                      onClick={handleEventClick}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Legend */}
        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
          {Object.entries(STATUS).map(([, cfg]) => (
            <Box
              key={cfg.label}
              sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "3px",
                  bgcolor: cfg.bg,
                  border: `1.5px solid ${cfg.border}`,
                }}
              />
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {cfg.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Plan detail popover ── */}
      <PlanPopover
        anchor={popoverAnchor}
        plan={activePlan}
        onClose={() => {
          setPopoverAnchor(null);
          setActivePlan(null);
        }}
        onOpenDetail={onPlanClick}
      />
    </Box>
  );
}
