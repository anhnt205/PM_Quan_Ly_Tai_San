import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete, Save } from "@mui/icons-material";

interface MonthlyActivityData {
  id: string;
  thang: number;
  gioKm: string;
  ngaySctVao: string;
  ngaySctRa: string;
  ngayBccVao: string;
  ngayBccRa: string;
  soLanBaoDuongCapI: string;
  soLanBaoDuongCapII: string;
  ghiChu: string;
  isNew?: boolean;
}

export default function HoursAsset() {
  const [rows, setRows] = useState<MonthlyActivityData[]>([
    {
      id: `row-${Date.now()}`,
      thang: 1,
      gioKm: "",
      ngaySctVao: "",
      ngaySctRa: "",
      ngayBccVao: "",
      ngayBccRa: "",
      soLanBaoDuongCapI: "",
      soLanBaoDuongCapII: "",
      ghiChu: "",
      isNew: true,
    },
  ]);

  const handleAddRow = () => {
    const newRow: MonthlyActivityData = {
      id: `row-${Date.now()}`,
      thang: rows.length + 1,
      gioKm: "",
      ngaySctVao: "",
      ngaySctRa: "",
      ngayBccVao: "",
      ngayBccRa: "",
      soLanBaoDuongCapI: "",
      soLanBaoDuongCapII: "",
      ghiChu: "",
      isNew: true,
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof MonthlyActivityData,
    value: any,
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSaveAll = () => {
    console.log("Dữ liệu cần lưu:", rows);
    alert("Đã lưu dữ liệu!");
  };

  const totals = {
    gioKm: rows.reduce(
      (sum, row) => sum + Number(parseFloat(row.gioKm) || 0),
      0,
    ),
    capI: rows.reduce(
      (sum, row) => sum + Number(row.soLanBaoDuongCapI || 0),
      0,
    ),
    capII: rows.reduce(
      (sum, row) => sum + Number(row.soLanBaoDuongCapII || 0),
      0,
    ),
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold" color="#333">
          GIỜ (KM) HOẠT ĐỘNG CỦA THIẾT BỊ TRONG NĂM
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveAll}
            sx={{ bgcolor: "#009e60", "&:hover": { bgcolor: "#026e42" } }}
          >
            Lưu
          </Button>
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddRow}>
            Thêm
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #ddd" }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                rowSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center", width: 60 }}
              >
                Tháng
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center", width: 80 }}
              >
                Giờ (km)
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Ngày SCT
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Ngày BCC
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Số lần Báo đường
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center", width: 100 }}
              >
                Ghi chú
              </TableCell>
              <TableCell
                rowSpan={2}
                sx={{ fontWeight: "bold", textAlign: "center", width: 60 }}
              >
                Thao tác
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Vào
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Ra
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Vào
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Ra
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Cấp I
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Cấp II
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">
                  <TextField
                    type="number"
                    size="small"
                    variant="standard"
                    value={row.thang}
                    onChange={(e) =>
                      handleChange(
                        row.id,
                        "thang",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    sx={{ width: 60, input: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.gioKm}
                    onChange={(e) =>
                      handleChange(row.id, "gioKm", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.gioKm}
                    onChange={(e) =>
                      handleChange(row.id, "ngaySctVao", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.gioKm}
                    onChange={(e) =>
                      handleChange(row.id, "ngaySctVao", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.gioKm}
                    onChange={(e) =>
                      handleChange(row.id, "ngaySctVao", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.gioKm}
                    onChange={(e) =>
                      handleChange(row.id, "ngaySctVao", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.soLanBaoDuongCapI}
                    onChange={(e) =>
                      handleChange(
                        row.id,
                        "soLanBaoDuongCapI",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.soLanBaoDuongCapII}
                    onChange={(e) =>
                      handleChange(
                        row.id,
                        "soLanBaoDuongCapII",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={row.ghiChu}
                    onChange={(e) =>
                      handleChange(row.id, "ghiChu", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRow(row.id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                TỔNG
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {totals.gioKm.toLocaleString()}
              </TableCell>
              <TableCell colSpan={4} align="center"></TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {totals.capI}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {totals.capII}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
