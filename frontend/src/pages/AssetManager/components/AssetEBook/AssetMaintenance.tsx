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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Delete, Save, Print } from "@mui/icons-material";
import dayjs from "dayjs";
import { MaintenanceIncidentType } from "../../types";

interface AssetMaintenanceProps {
  asset?: any; // Thông tin tài sản (nếu cần)
}

// Các loại sự cố thường gặp (có thể thay đổi theo nhu cầu)
const INCIDENT_TYPES = [
  "Hỏng động cơ",
  "Hỏng hệ thống điện",
  "Hỏng bơm",
  "Rò rỉ dầu",
  "Hỏng vòng bi",
  "Hỏng cảm biến",
  "Tai nạn lao động",
  "Hỏng hệ thống điều khiển",
  "Hỏng khung máy",
  "Hỏng hệ thống thủy lực",
  "Khác",
];

// Các địa điểm sửa chữa
const REPAIR_LOCATIONS = [
  "Sửa chữa tại chỗ",
  "Sửa chữa tại xưởng",
  "Sửa chữa bảo hành",
  "Sửa chữa ngoài",
  "Thay thế thiết bị mới",
];

export default function AssetMaintenance({ asset }: AssetMaintenanceProps) {
  const [rows, setRows] = useState<MaintenanceIncidentType[]>([
    {
      id: `temp-${Date.now()}`,
      tuNgay: dayjs().format("YYYY-MM-DD"),
      denNgay: dayjs().format("YYYY-MM-DD"),
      loaiSuCo: "",
      noiSuaChua: "",
      ghiChu: "",
      isNew: true,
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddRow = () => {
    const newRow: MaintenanceIncidentType = {
      id: `temp-${Date.now()}`,
      tuNgay: dayjs().format("YYYY-MM-DD"),
      denNgay: dayjs().format("YYYY-MM-DD"),
      loaiSuCo: "",
      noiSuaChua: "",
      ghiChu: "",
      isNew: true,
    };
    setRows([...rows, newRow]);
    setHasChanges(true);
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
    setHasChanges(true);
  };

  const handleChange = (
    id: string,
    field: keyof MaintenanceIncidentType,
    value: any,
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Tách dữ liệu mới và dữ liệu cần cập nhật
      const newRows = rows.filter((row) => row.isNew);
      const updateRows = rows.filter((row) => !row.isNew);

      // TODO: Gọi API khi có
      console.log("Dữ liệu cần tạo mới:", newRows);
      console.log("Dữ liệu cần cập nhật:", updateRows);
      console.log(
        "Dữ liệu cần xóa:",
        rows.filter((row) => row.isDeleted),
      );

      // Giả lập lưu thành công
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cập nhật lại trạng thái: đánh dấu các row mới thành row cũ
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          isNew: false,
        })),
      );

      setHasChanges(false);
      alert("Lưu thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSaving(false);
    }
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
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h6" fontWeight="bold" color="#333">
          DIỄN BIẾN KỸ THUẬT VÀ TAI NẠN, SỰ CỐ PHẢI SỬA CHỮA
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveAll}
            disabled={!hasChanges || isSaving}
            sx={{
              bgcolor: "#009e60",
              "&:hover": { bgcolor: "#026e42" },
              "&.Mui-disabled": { bgcolor: "#ccc" },
              textTransform: "none",
            }}
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddRow}
            sx={{ textTransform: "none" }}
          >
            Thêm
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #ddd", overflowX: "auto" }}
      >
        <Table size="small" stickyHeader sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 120,
                  border: "1px solid grey",
                }}
              >
                Từ ngày
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 120,
                  border: "1px solid grey",
                }}
              >
                Đến ngày
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 300,
                  border: "1px solid grey",
                }}
              >
                Loại sự cố, tai nạn, nội dung hư hỏng
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 200,
                  border: "1px solid grey",
                }}
              >
                Nơi sửa chữa
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 60,
                  border: "1px solid grey",
                }}
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ border: "1px solid grey" }}
                >
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: "1px solid grey" }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="date"
                      value={row.tuNgay}
                      onChange={(e) =>
                        handleChange(row.id, "tuNgay", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={{ input: { fontSize: 13 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: "1px solid grey" }}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="date"
                      value={row.denNgay}
                      onChange={(e) =>
                        handleChange(row.id, "denNgay", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={{ input: { fontSize: 13 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: "1px solid grey" }}>
                    <FormControl fullWidth size="small" variant="standard">
                      <Select
                        value={row.loaiSuCo}
                        onChange={(e) =>
                          handleChange(row.id, "loaiSuCo", e.target.value)
                        }
                        displayEmpty
                        sx={{ fontSize: 13 }}
                      >
                        <MenuItem value="" disabled>
                          Chọn loại sự cố...
                        </MenuItem>
                        {INCIDENT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid grey" }}>
                    <FormControl fullWidth size="small" variant="standard">
                      <Select
                        value={row.noiSuaChua}
                        onChange={(e) =>
                          handleChange(row.id, "noiSuaChua", e.target.value)
                        }
                        displayEmpty
                        sx={{ fontSize: 13 }}
                      >
                        <MenuItem value="" disabled>
                          Chọn nơi sửa chữa...
                        </MenuItem>
                        {REPAIR_LOCATIONS.map((location) => (
                          <MenuItem key={location} value={location}>
                            {location}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid grey" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRow(row.id)}
                      sx={{ color: "#d32f2f" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
