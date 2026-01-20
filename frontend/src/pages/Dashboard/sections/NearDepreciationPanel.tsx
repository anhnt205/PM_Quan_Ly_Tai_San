import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import Pagination from "@mui/material/Pagination";
import { useDashboardMutation } from "../Mutation";


type AssetRow = {
  Id?: string | number;
  id?: string | number;
  Ma?: string | number;
  TenTaiSan?: string;
  name?: string;
  NgaySuDung?: string | number | null;
  SoKyKhauHao?: number | null;
  NguyenGia?: number | string | null;
  NgayHetHan?: string | number | null;
  ThoiHanConLai?: string | number | null;
  ThoiHan?: string | number | null;
  TrangThai?: string;
};

export default function NearDepreciationPanel() {
  const { taiSanSapHet = [], isLoading } = useDashboardMutation();
  const rows = (
    Array.isArray(taiSanSapHet) ? taiSanSapHet : taiSanSapHet?.data || []
  ) as AssetRow[];
  const [rowsPerPage, setRowsPerPage] = useState<number | "all">(20);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage, rows.length]);

  const handleRowsPerPageChange = (e: any) => {
    const v = e.target.value;
    setRowsPerPage(v === "all" ? "all" : Number(v));
    setPage(1);
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const displayedRows =
    rowsPerPage === "all"
      ? rows
      : rows.slice(
          (page - 1) * (rowsPerPage as number),
          page * (rowsPerPage as number),
        );

  const getStatusFor = (val: any) => {
    const n = Number(val);
    if (Number.isNaN(n)) return null;
    if (n <= 0 || n === 1) return { label: "Khẩn cấp", bg: "#ffeaea", color: "#d14343" };
    if (n === 2) return { label: "Cảnh báo", bg: "#fffbe6", color: "#f59e0b" };
    return { label: "Bình thường", bg: "#e6f4ea", color: "#0b9d55" };
  };

  return (
    <Card sx={{ borderRadius: 3, bgcolor: "#f6fffa" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}>
            <Typography
              variant="h6"
              sx={{ color: "#0b9d55", fontWeight: 700, fontSize: 22 }}
            >
              Tài sản sắp hết hạn khấu hao
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Hiển thị:
                </Typography>
                <Select
                  size="small"
                  value={rowsPerPage === "all" ? "all" : rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value="all">Tất cả</MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#fff7ed",
                  borderRadius: 4,
                  px: 2,
                  py: 0.5,
                }}
              >
                <InsertChartOutlinedIcon sx={{ color: "#f59e0b", mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#f97316", fontWeight: 600 }}
                >
                  {rows.length.toLocaleString()} tài sản
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            bgcolor: "transparent",
            maxHeight: 360,
          }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: 2000 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eaf7ee", height: 64 }}>
                <TableCell
                  sx={{
                    width: 140,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: 700,
                    color: "#0b9d55",
                    minWidth: 700,
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Tên tài sản
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 280,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Ngày sử dụng
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 280,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Số kỳ khấu hao
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 280,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Nguyên giá
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 280,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Ngày hết hạn
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 280,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Thời hạn còn lại
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: 280,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Trạng thái
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((row, idx) => (
                <TableRow
                  key={String(row.Id || row.id || row.Ma || idx)}
                  hover
                  sx={{ backgroundColor: "#fff" }}
                >
                  <TableCell align="left">
                    <Chip
                      label={row.Id}
                      sx={{
                        bgcolor: "#e6f4ea",
                        color: "#0b9d55",
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ maxWidth: 800 }}>
                    <Typography noWrap sx={{ maxWidth: { xs: 320, md: 900 } }}>
                      {row.TenTaiSan || row.name || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ width: 280 }}>
                    <Typography noWrap sx={{ maxWidth: { xs: 320, md: 900 } }}>
                      {row.NgaySuDung
                        ? new Date(row.NgaySuDung).toLocaleDateString("en-GB")
                        : ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ width: 280 }}>
                    {row.SoKyKhauHao != null ? (
                      <Chip
                        label={`${row.SoKyKhauHao} kỳ`}
                        sx={{
                          bgcolor: "#e6f4ea",
                          color: "#0b9d55",
                          fontWeight: 700,
                        }}
                      />
                    ) : (
                      <Typography />
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ width: 280 }}>
                    <Typography>
                      {row.NguyenGia != null
                        ? Number(row.NguyenGia).toLocaleString() + " đ"
                        : ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ width: 280 }}>
                    <Typography>
                      {row.NgayHetHan
                        ? new Date(row.NgayHetHan).toLocaleDateString("en-GB")
                        : ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ width: 280 }}>
                    {row.ThoiHanConLai != null ? (
                      <Chip
                        label={`${row.ThoiHanConLai} tháng`}
                        sx={{
                          bgcolor: "#e6f4ea",
                          color: "#0b9d55",
                          fontWeight: 700,
                        }}
                      />
                    ) : (
                      <Typography />
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ width: 280 }}>
                    {(() => {
                      const status = getStatusFor(
                        (row.ThoiHanConLai ?? row.ThoiHan) || row.ThoiHanConLai,
                      );
                      return status ? (
                        <Chip
                          label={status.label}
                          sx={{
                            bgcolor: status.bg,
                            color: status.color,
                            fontWeight: 700,
                          }}
                        />
                      ) : (
                        <Typography>{row.TrangThai || ""}</Typography>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              {(() => {
                const total = rows.length;
                if (total === 0) return `Hiển thị 0 kết quả`;
                if (rowsPerPage === "all")
                  return `Hiển thị 1–${total} trong ${total} kết quả`;
                const start = (page - 1) * (rowsPerPage as number) + 1;
                const end = Math.min(page * (rowsPerPage as number), total);
                return `Hiển thị ${start}–${end} trong ${total} kết quả`;
              })()}
            </Typography>
          </Box>
          <Box>
            {rowsPerPage !== "all" && rows.length > (rowsPerPage as number) && (
              <Pagination
                count={Math.ceil(rows.length / (rowsPerPage as number))}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
