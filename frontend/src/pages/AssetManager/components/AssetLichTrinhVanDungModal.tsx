import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Fade,
} from "@mui/material";
import { Close, Save, CalendarMonth, Settings } from "@mui/icons-material";
import dayjs from "dayjs";
import { showSuccessAlert } from "../../../components/Alert";
import LichTrinhTable from "./AssetLichTrinhVanDungTable";

// ============================================================
// Types
// ============================================================
interface ShiftRecord {
  idTaiSan: string;
  nam: number;
  thang: number;
  ngay: number;
  ca: number; // 1, 2, 3
  soGio: number;
}

export interface AssetScheduleData {
  idTaiSan: string;
  tenTaiSan: string;
  soThe: string;
  ghiChu: string;
  shifts: ShiftRecord[];
}

interface LichTrinhVanDungModalProps {
  open: boolean;
  onClose: () => void;
  selectedAssets: any[];
}

// ============================================================
// Helpers
// ============================================================
const getDaysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();

const generateMockShifts = (
  idTaiSan: string,
  month: number,
  year: number,
): ShiftRecord[] => {
  const days = getDaysInMonth(month, year);
  const records: ShiftRecord[] = [];
  const filledDays = Math.ceil(days * 0.6);
  for (let d = 1; d <= filledDays; d++) {
    for (let ca = 1; ca <= 3; ca++) {
      records.push({
        idTaiSan,
        nam: year,
        thang: month,
        ngay: d,
        ca,
        soGio: Math.floor(Math.random() * 6) + 2,
      });
    }
  }
  return records;
};

// ============================================================
// Design System Tokens (Industrial Utilitarian & Luxury Tech)
// ============================================================
export const colors = {
  bgApp: "#f8fafc",
  borderDark: "#03935a",
  borderLight: "#e2e8f0",
  cellBorder: "#cbd5e1",
  headerBg: "#04b46e",
  headerText: "#ffffff",
  accent: "#04b46e",
  accentHover: "#03935a",
  textMain: "#1e293b",
  textMuted: "#64748b",
  rowHover: "#f1f5f9",
  sumBg: "rgba(4, 180, 110, 0.08)",
  sumText: "#036940",
};

export const cellBorderCss = `1px solid ${colors.cellBorder}`;

export const headerCellSx = {
  fontWeight: 700,
  fontSize: "11px",
  letterSpacing: "0.05em",
  border: `1px solid ${colors.borderDark}`,
  backgroundColor: colors.headerBg,
  color: colors.headerText,
  textAlign: "center" as const,
  padding: "8px 4px",
  whiteSpace: "normal" as const,
  lineHeight: 1.4,
  fontFamily: '"Outfit", "Inter", sans-serif',
  textTransform: "uppercase" as const,
};

export const dataCellSx = {
  fontSize: "12px",
  border: cellBorderCss,
  padding: "3px 4px",
  textAlign: "center" as const,
  height: "32px",
  verticalAlign: "middle" as const,
  fontFamily: '"Inter", sans-serif',
  color: colors.textMain,
};

export const inputSx = {
  "& .MuiInputBase-root": {
    borderRadius: "4px",
    backgroundColor: "transparent",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(16, 185, 129, 0.04)",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
    },
  },
  "& .MuiInputBase-input": {
    textAlign: "center",
    fontSize: "13px",
    padding: "4px 2px",
    fontWeight: 600,
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  },
  "& .MuiInput-underline:before": { borderBottom: "none" },
  "& .MuiInput-underline:after": { borderBottom: `2px solid ${colors.accent}` },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none",
  },
};

export const sumCellSx = {
  ...dataCellSx,
  fontWeight: 700,
  backgroundColor: colors.sumBg,
  color: colors.sumText,
  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
};

// ============================================================
// Component chính
// ============================================================
export default function LichTrinhVanDungModal({
  open,
  onClose,
  selectedAssets,
}: LichTrinhVanDungModalProps) {
  const now = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(now.month() + 1);
  const [selectedYear, setSelectedYear] = useState(now.year());

  const [assetsData, setAssetsData] = useState<AssetScheduleData[]>([]);

  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedMonth, selectedYear),
    [selectedMonth, selectedYear],
  );

  // Khởi tạo data khi mở modal hoặc đổi tháng/năm
  useEffect(() => {
    if (!open || selectedAssets.length === 0) return;
    const newData: AssetScheduleData[] = selectedAssets.map((asset) => ({
      idTaiSan: asset.id || asset.soThe,
      tenTaiSan: asset.tenTaiSan || "Không tên",
      soThe: asset.soThe || "",
      ghiChu: "",
      shifts: generateMockShifts(
        asset.id || asset.soThe,
        selectedMonth,
        selectedYear,
      ),
    }));
    setAssetsData(newData);
  }, [open, selectedAssets, selectedMonth, selectedYear]);

  // Lấy giá trị giờ
  const getShiftValue = useCallback(
    (assetIdx: number, day: number, ca: number): number => {
      const asset = assetsData[assetIdx];
      if (!asset) return 0;
      const found = asset.shifts.find(
        (s) =>
          s.ngay === day &&
          s.ca === ca &&
          s.thang === selectedMonth &&
          s.nam === selectedYear,
      );
      return found ? found.soGio : 0;
    },
    [assetsData, selectedMonth, selectedYear],
  );

  // Set giá trị giờ
  const setShiftValue = useCallback(
    (assetIdx: number, day: number, ca: number, value: number) => {
      setAssetsData((prev) => {
        const updated = [...prev];
        const asset = { ...updated[assetIdx] };
        const shifts = [...asset.shifts];
        const idx = shifts.findIndex(
          (s) =>
            s.ngay === day &&
            s.ca === ca &&
            s.thang === selectedMonth &&
            s.nam === selectedYear,
        );
        if (idx >= 0) {
          shifts[idx] = { ...shifts[idx], soGio: value };
        } else {
          shifts.push({
            idTaiSan: asset.idTaiSan,
            nam: selectedYear,
            thang: selectedMonth,
            ngay: day,
            ca,
            soGio: value,
          });
        }
        asset.shifts = shifts;
        updated[assetIdx] = asset;
        return updated;
      });
    },
    [selectedMonth, selectedYear],
  );

  // Set trường meta
  const setAssetField = useCallback(
    (assetIdx: number, field: keyof AssetScheduleData, value: any) => {
      setAssetsData((prev) => {
        const updated = [...prev];
        updated[assetIdx] = { ...updated[assetIdx], [field]: value };
        return updated;
      });
    },
    [],
  );

  // Tổng giờ 1 ngày (Ca1+Ca2+Ca3) cho 1 tài sản
  const getDayTotal = useCallback(
    (assetIdx: number, day: number): number => {
      let sum = 0;
      for (let ca = 1; ca <= 3; ca++) sum += getShiftValue(assetIdx, day, ca);
      return sum;
    },
    [getShiftValue],
  );

  // Tổng giờ 1 ca trong cả tháng
  const getShiftMonthTotal = useCallback(
    (assetIdx: number, ca: number): number => {
      let sum = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        sum += getShiftValue(assetIdx, d, ca);
      }
      return sum;
    },
    [getShiftValue, daysInMonth],
  );

  // Tổng cộng cả tháng (tất cả ca)
  const getMonthGrandTotal = useCallback(
    (assetIdx: number): number => {
      let sum = 0;
      for (let ca = 1; ca <= 3; ca++) {
        sum += getShiftMonthTotal(assetIdx, ca);
      }
      return sum;
    },
    [getShiftMonthTotal],
  );

  // Lưu
  const handleSave = () => {
    const allRecords: ShiftRecord[] = [];
    assetsData.forEach((asset) => {
      asset.shifts.forEach((s) => {
        if (s.soGio > 0) allRecords.push(s);
      });
    });
    console.log("📦 Payload gửi lên Backend:", allRecords);
    showSuccessAlert(`Lưu thành công ${allRecords.length} bản ghi hoạt động!`);
    onClose();
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const ROWS_PER_ASSET = 4;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: "96vw",
          maxWidth: "96vw",
          height: "92vh",
          maxHeight: "92vh",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        },
      }}
    >
      {/* ===== HEADER BAR (SLATE GRADIENT) ===== */}
      <DialogTitle
        sx={{
          background: colors.headerBg,
          color: colors.headerText,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 4,
          borderBottom: `1px solid ${colors.borderDark}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(16, 185, 129, 0.15)",
              color: colors.accent,
              p: 1,
              borderRadius: "8px",
            }}
          >
            <CalendarMonth />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.02em",
                fontFamily: '"Outfit", "Inter", sans-serif',
              }}
            >
              Lịch trình vận dụng
            </Typography>
            <Typography sx={{ fontSize: "11px", color: colors.textMuted }}>
              Báo cáo & Nhập giờ máy hoạt động chi tiết
            </Typography>
          </Box>
          <Chip
            label={`${selectedAssets.length} tài sản đang chọn`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.08)",
              color: "#e2e8f0",
              fontWeight: 600,
              fontSize: "11px",
              border: "1px solid rgba(255,255,255,0.1)",
              ml: 1,
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.6)",
            "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: colors.bgApp,
        }}
      >
        {/* ===== CONTROLS PANEL ===== */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            py: 2,
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            flexShrink: 0,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel
                id="month-select-label"
                sx={{ fontSize: "13px", fontWeight: 500 }}
              >
                Tháng
              </InputLabel>
              <Select
                labelId="month-select-label"
                value={selectedMonth}
                label="Tháng"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                sx={{
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <MenuItem key={m} value={m}>
                    Tháng {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel
                id="year-select-label"
                sx={{ fontSize: "13px", fontWeight: 500 }}
              >
                Năm
              </InputLabel>
              <Select
                labelId="year-select-label"
                value={selectedYear}
                label="Năm"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                sx={{
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {[
                  now.year() - 2,
                  now.year() - 1,
                  now.year(),
                  now.year() + 1,
                ].map((y) => (
                  <MenuItem key={y} value={y}>
                    Năm {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(15, 23, 42, 0.05)",
                py: 0.6,
                px: 1.5,
                borderRadius: "20px",
              }}
            >
              <Settings sx={{ fontSize: "14px", color: colors.textMuted }} />
              <Typography
                sx={{
                  fontSize: "12px",
                  color: colors.textMuted,
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Kỳ làm việc: {daysInMonth} ngày
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              bgcolor: colors.accent,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              px: 4,
              py: 1,
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: colors.accentHover,
                boxShadow: "0 6px 12px -2px rgba(16, 185, 129, 0.3)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Lưu dữ liệu
          </Button>
        </Box>

        {/* ===== TABLE LAYOUT CONTAINER ===== */}
        <LichTrinhTable
          assetsData={assetsData}
          days={days}
          daysInMonth={daysInMonth}
          getShiftValue={getShiftValue}
          setShiftValue={setShiftValue}
          getDayTotal={getDayTotal}
          getShiftMonthTotal={getShiftMonthTotal}
          getMonthGrandTotal={getMonthGrandTotal}
          setAssetField={setAssetField}
        />
      </DialogContent>
    </Dialog>
  );
}
