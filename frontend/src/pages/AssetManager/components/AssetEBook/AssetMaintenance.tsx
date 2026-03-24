import React, { useState, useEffect } from "react";
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
import { Add, Delete, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { MaintenanceIncidentType } from "../../types";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import EditButton from "../../../../components/Button/EditButton";

// Style sách
const bookStyles = {
  container: {
    backgroundColor: "#fef7e8",
    backgroundImage: "linear-gradient(to bottom, #fef7e8, #fef0e0)",
    borderRadius: "12px",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
    position: "relative" as const,
    padding: "24px",
    minHeight: "calc(100vh - 120px)",
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
  content: {
    flex: 1,
    overflow: "auto",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "24px",
    borderTop: "1px dashed #d4a373",
    position: "relative" as const,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  pageNumber: {
    position: "absolute" as const,
    bottom: "24px",
    right: "24px",
    fontSize: "12px",
    color: "#b8956e",
    fontStyle: "italic" as const,
  },
};

// Các loại sự cố thường gặp
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

interface AssetMaintenanceProps {
  asset?: any;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: (values: any) => void;
}

export default function AssetMaintenance({
  asset,
  onPageChange,
  currentPage = 4,
  totalPages = 4,
  readOnly = true,
  onEdit,
  onCancel,
  onSave,
}: AssetMaintenanceProps) {
  const [rows, setRows] = useState<MaintenanceIncidentType[]>([]);
  const [originalData, setOriginalData] = useState<MaintenanceIncidentType[]>(
    [],
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data - sau này thay bằng API
  useEffect(() => {
    // Giả sử lấy dữ liệu từ API
    const mockData: MaintenanceIncidentType[] = [
      // {
      //   id: "1",
      //   tuNgay: "2024-01-15",
      //   denNgay: "2024-01-20",
      //   loaiSuCo: "Hỏng động cơ",
      //   noiSuaChua: "Sửa chữa tại xưởng",
      //   ghiChu: "Thay động cơ mới",
      //   isNew: false,
      //   isDeleted: false,
      // },
    ];

    setRows(mockData);
    setOriginalData(JSON.parse(JSON.stringify(mockData)));
  }, [asset]);

  // Hàm reset dữ liệu về trạng thái ban đầu
  const resetData = () => {
    setRows(JSON.parse(JSON.stringify(originalData)));
    setHasChanges(false);
  };

  // Xử lý khi bấm Edit
  const handleEdit = () => {
    setIsEditMode(true);
    onEdit?.();
  };

  // Xử lý khi bấm Cancel
  const handleCancel = () => {
    resetData();
    setIsEditMode(false);
    onCancel?.();
  };

  const handleAddRow = () => {
    const newRow: MaintenanceIncidentType = {
      id: `temp-${Date.now()}`,
      tuNgay: dayjs().format("YYYY-MM-DD"),
      denNgay: dayjs().format("YYYY-MM-DD"),
      loaiSuCo: "",
      noiSuaChua: "",
      ghiChu: "",
      isNew: true,
      isDeleted: false,
    };
    setRows([...rows, newRow]);
    setHasChanges(true);
  };

  const handleDeleteRow = (id: string, isNew?: boolean) => {
    if (isNew) {
      // Xóa row mới khỏi danh sách
      setRows(rows.filter((row) => row.id !== id));
    } else {
      // Đánh dấu xóa mềm
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, isDeleted: true } : row)),
      );
    }
    setHasChanges(true);
  };

  const handleChange = (
    id: string,
    field: keyof MaintenanceIncidentType,
    value: any,
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          // Đánh dấu action là update nếu không phải row mới
          if (!row.isNew && !row.isDeleted) {
            updatedRow.isUpdated = true;
          }
          return updatedRow;
        }
        return row;
      }),
    );
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Phân loại dữ liệu cần xử lý
      const rowsToCreate = rows.filter((row) => row.isNew && !row.isDeleted);
      const rowsToUpdate = rows.filter(
        (row) => !row.isNew && !row.isDeleted && row.isUpdated,
      );
      const rowsToDelete = rows.filter((row) => !row.isNew && row.isDeleted);

      // TODO: Gọi API khi có
      console.log("Dữ liệu cần tạo mới:", rowsToCreate);
      console.log("Dữ liệu cần cập nhật:", rowsToUpdate);
      console.log("Dữ liệu cần xóa:", rowsToDelete);

      // Giả lập lưu thành công
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cập nhật lại trạng thái sau khi lưu
      const updatedRows = rows
        .map((row) => {
          if (row.isNew && !row.isDeleted) {
            // Giả sử API trả về id mới
            return {
              ...row,
              id: `real-${Date.now()}-${row.id}`,
              isNew: false,
              isUpdated: false,
            };
          }
          if (!row.isNew && row.isUpdated && !row.isDeleted) {
            return { ...row, isUpdated: false };
          }
          if (row.isDeleted) {
            return null; // Sẽ bị lọc bỏ
          }
          return row;
        })
        .filter(Boolean) as MaintenanceIncidentType[];

      setRows(updatedRows);
      setOriginalData(JSON.parse(JSON.stringify(updatedRows)));
      setHasChanges(false);
      setIsEditMode(false);

      onSave?.({ rowsToCreate, rowsToUpdate, rowsToDelete });
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSaving(false);
    }
  };

  // Lọc các row không bị xóa để hiển thị
  const visibleRows = rows.filter((row) => !row.isDeleted);

  return (
    <Box sx={bookStyles.container}>
      {/* Button actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          mb: 2,
          position: "sticky",
          top: 10,
          zIndex: 10,
        }}
      >
        {!readOnly && isEditMode && (
          <>
            <SaveBtn onSave={handleSaveAll} />
            <CancelBtn onClick={handleCancel} />
          </>
        )}
        {readOnly && !isEditMode && <EditButton onClick={handleEdit} />}
      </Box>

      {/* Header sách */}
      <Typography
        textAlign="center"
        fontSize={20}
        fontWeight={700}
        sx={{ color: "#8b5a2b", letterSpacing: "2px", mb: 2 }}
      >
        DIỄN BIẾN KỸ THUẬT VÀ TAI NẠN, SỰ CỐ PHẢI SỬA CHỮA
      </Typography>

      {/* Nút thêm - chỉ hiển thị khi ở chế độ edit */}
      {isEditMode && (
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={3}
          gap={2}
        >
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddRow}
            sx={{
              borderColor: "#d4a373",
              color: "#8b5a2b",
              "&:hover": { borderColor: "#b8956e", bgcolor: "#fef0e0" },
              textTransform: "none",
            }}
          >
            Thêm sự cố
          </Button>
        </Box>
      )}

      {/* Nội dung chính */}
      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #d4a373",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5ede0" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    width: 120,
                    bgcolor: "#f5ede0",
                    border: "1px solid #d4a373",
                  }}
                >
                  Từ ngày
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    width: 120,
                    bgcolor: "#f5ede0",
                    border: "1px solid #d4a373",
                  }}
                >
                  Đến ngày
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    width: 300,
                    bgcolor: "#f5ede0",
                    border: "1px solid #d4a373",
                  }}
                >
                  Loại sự cố, tai nạn, nội dung hư hỏng
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    width: 200,
                    bgcolor: "#f5ede0",
                    border: "1px solid #d4a373",
                  }}
                >
                  Nơi sửa chữa
                </TableCell>
                {!readOnly && (
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      width: 60,
                      bgcolor: "#f5ede0",
                      border: "1px solid #d4a373",
                    }}
                  >
                    Thao tác
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody
              sx={{ ...bookStyles.container, display: "flex !importance" }}
            >
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ border: "1px solid #d4a373", color: "#b8956e" }}
                  >
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ border: "1px solid #d4a373" }}>
                      {isEditMode ? (
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
                          InputProps={{ disableUnderline: true }}
                          sx={{ input: { color: "#5a3e2b", fontSize: 13 } }}
                        />
                      ) : (
                        <Typography sx={{ color: "#5a3e2b", fontSize: 13 }}>
                          {row.tuNgay
                            ? dayjs(row.tuNgay).format("DD/MM/YYYY")
                            : ""}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ border: "1px solid #d4a373" }}>
                      {isEditMode ? (
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
                          InputProps={{ disableUnderline: true }}
                          sx={{ input: { color: "#5a3e2b", fontSize: 13 } }}
                        />
                      ) : (
                        <Typography sx={{ color: "#5a3e2b", fontSize: 13 }}>
                          {row.denNgay
                            ? dayjs(row.denNgay).format("DD/MM/YYYY")
                            : ""}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ border: "1px solid #d4a373" }}>
                      {isEditMode ? (
                        <FormControl fullWidth size="small" variant="standard">
                          <Select
                            value={row.loaiSuCo}
                            onChange={(e) =>
                              handleChange(row.id, "loaiSuCo", e.target.value)
                            }
                            displayEmpty
                            sx={{ fontSize: 13, color: "#5a3e2b" }}
                            disableUnderline
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
                      ) : (
                        <Typography sx={{ color: "#5a3e2b", fontSize: 13 }}>
                          {row.loaiSuCo || ""}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={{ border: "1px solid #d4a373" }}>
                      {isEditMode ? (
                        <FormControl fullWidth size="small" variant="standard">
                          <Select
                            value={row.noiSuaChua}
                            onChange={(e) =>
                              handleChange(row.id, "noiSuaChua", e.target.value)
                            }
                            displayEmpty
                            sx={{ fontSize: 13, color: "#5a3e2b" }}
                            disableUnderline
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
                      ) : (
                        <Typography sx={{ color: "#5a3e2b", fontSize: 13 }}>
                          {row.noiSuaChua || ""}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #d4a373" }}
                    >
                      {isEditMode && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteRow(row.id, row.isNew)}
                          sx={{ color: "#d32f2f" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Footer - luôn ở dưới cùng */}
      <Box sx={bookStyles.footer}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              color: "#8b5a2b",
              "&:hover": { bgcolor: "#fef0e0" },
              "&.Mui-disabled": { color: "#d4a373" },
              textTransform: "none",
            }}
          >
            ← Trang trước
          </Button>
          <Button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{
              color: "#8b5a2b",
              "&:hover": { bgcolor: "#fef0e0" },
              "&.Mui-disabled": { color: "#d4a373" },
              textTransform: "none",
            }}
          >
            Trang sau →
          </Button>
        </Box>
        <Box sx={bookStyles.pageNumber}>Trang {currentPage}</Box>
      </Box>
    </Box>
  );
}
