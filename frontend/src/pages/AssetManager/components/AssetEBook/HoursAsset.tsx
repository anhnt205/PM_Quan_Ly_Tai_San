import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { useLichTrinhYearQuery } from "../../Mutation";
import { DepartmentType } from "../../../Department/types";

// ---- Style sách ----
const bookStyles = {
  container: {
    width: "210mm",
    minHeight: "297mm",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "2px",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
    position: "relative" as const,
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    "&::before": {
      content: '""',
      position: "absolute" as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: "24px",
      background:
        "linear-gradient(to right, rgba(139, 69, 19, 0.08), transparent)",
      pointerEvents: "none" as const,
      borderTopLeftRadius: "12px",
      borderBottomLeftRadius: "12px",
    },
    "&::after": {
      content: '""',
      position: "absolute" as const,
      right: 0,
      top: 0,
      bottom: 0,
      width: "24px",
      background:
        "linear-gradient(to left, rgba(139, 69, 19, 0.08), transparent)",
      pointerEvents: "none" as const,
      borderTopRightRadius: "12px",
      borderBottomRightRadius: "12px",
    },
  },
  content: { flex: 1, overflow: "auto" },
  footer: {
    marginTop: "auto",
    paddingTop: "24px",
    position: "relative" as const,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pageNumber: {
    position: "absolute" as const,
    bottom: 0,
    right: "20px",
    fontSize: "12px",
    fontStyle: "italic" as const,
  },
};

// Cell style helpers
const hCell = (extra?: object) => ({
  fontFamily: '"Times New Roman", Times, serif',
  fontWeight: "bold",
  fontSize: "14px",
  border: "1px solid black",
  backgroundColor: "transparent",
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
  padding: "6px 4px",
  ...extra,
});

const dCell = (extra?: object) => ({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: "13px",
  borderTop: "none",
  borderBottom: "1px dashed black",
  borderLeft: "1px solid black",
  borderRight: "1px solid black",
  padding: "4px 6px",
  height: "38px",
  verticalAlign: "middle" as const,
  ...extra,
});

export default function HoursAsset({
  asset,
  onPageChange,
  currentPage = 5,
  totalPages = 7,
  readOnly = true,
  onEdit,
  onCancel,
  allDepartments = [],
  isView = false,
}: {
  asset: any;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  allDepartments: DepartmentType[];
  isView?: boolean;
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const { data: scheduleList = [], isLoading } = useLichTrinhYearQuery(
    asset?.id || asset?.soThe,
    selectedYear,
  );

  const rows = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const month = i + 1;
      const schedule = scheduleList.find((s: any) => s.thang === month);
      let totalHours = 0;
      if (schedule?.chiTietLichTrinhs) {
        schedule.chiTietLichTrinhs.forEach((ct: any) => {
          totalHours += (ct.ca1 || 0) + (ct.ca2 || 0) + (ct.ca3 || 0);
        });
      }
      return {
        month: i + 1,
        year: selectedYear,
        totalHours,
      };
    });
  }, [scheduleList, selectedYear]);

  const grandTotal = rows.reduce((acc, row) => acc + row.totalHours, 0);

  return (
    <Box sx={bookStyles.container}>
      {/* Tiêu đề */}
      <Typography
        textAlign="center"
        fontSize={17}
        fontWeight={700}
        sx={{
          letterSpacing: "1px",
          mb: 1,
          mt: 4,
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        THEO DÕI TÌNH HÌNH HOẠT ĐỘNG HÀNG THÁNG
      </Typography>

      {/* Chọn năm */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={selectedYear}
            label="Năm"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[
              currentYear - 2,
              currentYear - 1,
              currentYear,
              currentYear + 1,
            ].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bảng */}
      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: "0px", overflowX: "auto", width: "100%" }}
        >
          <Table
            size="small"
            sx={{
              borderCollapse: "collapse",
              border: "1px solid black",
              minWidth: 1100,
            }}
          >
            <TableHead>
              {/* Header tầng 1 */}
              <TableRow>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 100 })}>
                  Tháng/Năm
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 160 })}>
                  Đơn vị quản lý
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 90 })}>
                  Giờ hoạt động trong tháng
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 140 })}>
                  Kết quả hoạt động của thiết bị
                </TableCell>
                <TableCell colSpan={5} align="center" sx={hCell()}>
                  Giờ ngừng máy (h)
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 120 })}>
                  Ghi chú
                </TableCell>
              </TableRow>
              {/* Header tầng 2 */}
              <TableRow>
                {[
                  "Hỏng máy",
                  "Chờ đợi",
                  "Mất điện",
                  "Thiếu N.liệu",
                  "Lý do khác",
                ].map((t) => (
                  <TableCell
                    key={t}
                    align="center"
                    sx={hCell({ minWidth: 70 })}
                  >
                    {t}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    sx={{ border: "1px solid black", height: 200 }}
                  >
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rows.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell align="center" sx={dCell()}>
                        <Typography
                          sx={{
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: "13px",
                          }}
                        >
                          {`${String(row.month).padStart(2, "0")}/${row.year}`}
                        </Typography>
                      </TableCell>

                      <TableCell sx={dCell()}></TableCell>

                      <TableCell align="center" sx={dCell()}>
                        <Typography
                          sx={{
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: "13px",
                            fontWeight: row.totalHours > 0 ? 600 : 400,
                          }}
                        >
                          {row.totalHours > 0 ? row.totalHours : ""}
                        </Typography>
                      </TableCell>

                      <TableCell sx={dCell()}></TableCell>
                      <TableCell sx={dCell()}></TableCell>
                      <TableCell sx={dCell()}></TableCell>
                      <TableCell sx={dCell()}></TableCell>
                      <TableCell sx={dCell()}></TableCell>
                      <TableCell sx={dCell()}></TableCell>
                      <TableCell sx={dCell()}></TableCell>
                    </TableRow>
                  ))}

                  {/* Dòng tổng */}
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={2}
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      TỔNG
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {grandTotal > 0 ? grandTotal : ""}
                    </TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                    <TableCell sx={{ ...dCell(), borderBottom: "1px solid black" }}></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Footer */}
      <Box sx={bookStyles.footer}>
        <Box sx={bookStyles.pageNumber}>Trang {currentPage}</Box>
      </Box>
    </Box>
  );
}
