import React from "react";
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

const mockData = [
  {
    id: "A579",
    name: "Giá nạp máy bắn mìn (MCS-5): U = 12/250V; n = 5 m...",
    date: "20/03/2023",
  },
  {
    id: "A726",
    name: "Áp tô mát phòng nở 200A, U=1140(660)V, mã hiệu: T...",
    date: "20/04/2025",
  },
  {
    id: "A372",
    name: "Máy biến áp chiếu sáng phòng nổ 660/127V-20kVA; ...",
    date: "24/11/2021",
  },
  {
    id: "A373",
    name: "Máy biến áp chiếu sáng phòng nổ 660/127V-20kVA; ...",
    date: "24/11/2021",
  },
  {
    id: "A374",
    name: "Máy biến áp chiếu sáng phòng nổ 660/127V-20kVA; ...",
    date: "24/11/2021",
  },
  {
    id: "A375",
    name: "Máy biến áp chiếu sáng phòng nổ 660/127V-20kVA; ...",
    date: "24/11/2021",
  },
  {
    id: "A376",
    name: "Máy biến áp chiếu sáng phòng nổ 660/127V-20kVA; ...",
    date: "24/11/2021",
  },
  {
    id: "A377",
    name: "Máy nén khí công nghiệp model XJ-200",
    date: "03/02/2024",
  },
  { id: "A381", name: "Bộ nguồn dự phòng UPS 5kVA", date: "11/06/2022" },
  { id: "A392", name: "Máy quét mã vạch Zebra ZD621", date: "08/08/2023" },
];

export default function NearDepreciationPanel() {
  return (
    <Card sx={{ borderRadius: 3 }}>
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
                  defaultValue={20}
                  sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Box>

              <Tooltip title="Lọc">
                <IconButton size="small">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>

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
                  174 tài sản
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eaf7ee" }}>
                <TableCell
                  sx={{ width: 120, fontWeight: 700, color: "#0b9d55" }}
                >
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0b9d55" }}>
                  Tên tài sản
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ width: 160, fontWeight: 700, color: "#0b9d55" }}
                >
                  Ngày sử dụng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip
                      label={row.id}
                      sx={{
                        bgcolor: "#e6f4ea",
                        color: "#0b9d55",
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 680 }}>
                    <Typography noWrap sx={{ maxWidth: { xs: 240, md: 640 } }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{row.date}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="caption" color="text.secondary">
            Hiển thị 1–10 trong 174 kết quả
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
