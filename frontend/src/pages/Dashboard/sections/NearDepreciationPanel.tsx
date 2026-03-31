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
import { useAssetInspectionPageQuery } from "../../AssetManager/Mutation";
import { useConfig } from "../../../hooks/useContext";

export default function NearDepreciationPanel() {
  const { config } = useConfig();
  const [rowsPerPage, setRowsPerPage] = useState<number | "all">(20);
  const [page, setPage] = useState(0);
  const { data: taiSanSapHet = { items: [], totalItems: 0 }, isLoading } =
    useAssetInspectionPageQuery(
      page,
      rowsPerPage === "all" ? 9999999 : rowsPerPage,
      config?.ngayBaoDangKiem,
    );

  const handleRowsPerPageChange = (e: any) => {
    const v = e.target.value;
    setRowsPerPage(v === "all" ? 9999999 : Number(v));
    setPage(0);
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value - 1);
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
              Tài sản sắp hết hạn đăng kiểm
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
                  {taiSanSapHet?.totalItems.toLocaleString()} tài sản
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
          <Table size="small" stickyHeader sx={{}}>
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
                    bgcolor: "#eaf7ee",
                    minWidth: 200,
                  }}
                >
                  Tên tài sản
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    minWidth: 200,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Ngày hết hạn đăng kiểm
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    minWidth: 150,
                    fontWeight: 700,
                    color: "#0b9d55",
                    bgcolor: "#eaf7ee",
                  }}
                >
                  Thời hạn còn lại
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taiSanSapHet?.items?.map((row: any, idx: number) => (
                <TableRow
                  key={String(row.id || row.soThe || idx)}
                  hover
                  sx={{ backgroundColor: "#fff" }}
                >
                  <TableCell align="left">
                    <Chip
                      label={row.soThe}
                      sx={{
                        bgcolor: "#e6f4ea",
                        color: "#0b9d55",
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{}}>
                    <Typography noWrap sx={{}}>
                      {row.tenTaiSan || ""}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: 280 }}>
                    <Typography>{row.ngayDangKiemTiepTheo || ""}</Typography>
                  </TableCell>
                  <TableCell sx={{ width: 280 }}>
                    {row.thoiHanConLai != null ? (
                      <Chip
                        label={`${row.thoiHanConLai} ngày`}
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
                const total = taiSanSapHet?.totalItems || 0;
                if (total === 0) return `Hiển thị 0 kết quả`;
                if (rowsPerPage === "all")
                  return `Hiển thị 1–${total} trong ${total} kết quả`;
                const start = page * (rowsPerPage as number) + 1;
                const end = Math.min((page + 1) * (rowsPerPage as number), total);
                return `Hiển thị ${start}–${end} trong ${total} kết quả`;
              })()}
            </Typography>
          </Box>
          <Box>
            {rowsPerPage !== "all" &&
              (taiSanSapHet?.totalItems || 0) > (rowsPerPage as number) && (
                <Pagination
                  count={Math.ceil(
                    (taiSanSapHet?.totalItems || 0) / (rowsPerPage as number),
                  )}
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
