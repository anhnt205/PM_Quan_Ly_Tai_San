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
import { Add, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import EditButton from "../../../../components/Button/EditButton";

// Style sách – giống các trang khác trong AssetEBook
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

// Shared cell sx for header
const hcell = (extra?: object) => ({
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

// Shared cell sx for data rows
const dcell = (extra?: object) => ({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: "14px",
  borderTop: "none",
  borderBottom: "1px dashed black",
  borderLeft: "1px solid black",
  borderRight: "1px solid black",
  padding: "4px 6px",
  height: "38px",
  verticalAlign: "middle" as const,
  ...extra,
});

interface IncidentRow {
  id: string;
  ca: string;
  ngayThangNam: string;
  hoTenVanHanh: string;
  nguyenNhan: string;
  hoTenSuaChua: string;
  gioNgung: string;
  tienCongSC: string;
  tienNguyenVatLieu: string;
  tongCong: string;
}

interface AssetMaintenanceProps {
  asset?: any;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: (values: any) => void;
  isView?: boolean;
}

const EMPTY_ROWS_TARGET = 12;

export default function AssetMaintenance({
  asset,
  onPageChange,
  currentPage = 6,
  totalPages = 6,
  readOnly = true,
  onEdit,
  onCancel,
  onSave,
  isView = false,
}: AssetMaintenanceProps) {
  const [rows, setRows] = useState<IncidentRow[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = () => {
    setIsEditMode(true);
    onEdit?.();
  };

  const handleCancel = () => {
    setIsEditMode(false);
    onCancel?.();
  };

  const handleSave = () => {
    // TODO: kết nối API khi có
    onSave?.({ rows });
    setIsEditMode(false);
  };

  const handleAddRow = () => {
    const newRow: IncidentRow = {
      id: `temp-${Date.now()}`,
      ca: "",
      ngayThangNam: dayjs().format("YYYY-MM-DD"),
      hoTenVanHanh: "",
      nguyenNhan: "",
      hoTenSuaChua: "",
      gioNgung: "",
      tienCongSC: "",
      tienNguyenVatLieu: "",
      tongCong: "",
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof IncidentRow,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const emptyCount = Math.max(0, EMPTY_ROWS_TARGET - rows.length);
  const colSpan = isEditMode ? 10 : 9;

  return (
    <Box sx={bookStyles.container}>
      {/* Toolbar */}
      {!isView && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: 2,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            {!readOnly && isEditMode && (
              <>
                <SaveBtn onSave={handleSave} />
                <CancelBtn onClick={handleCancel} />
              </>
            )}
            {!isEditMode && !readOnly && <EditButton onClick={handleEdit} />}
          </Box>
        </Box>
      )}

      {/* Tiêu đề */}
      <Typography
        textAlign="center"
        fontSize={17}
        fontWeight={700}
        sx={{
          letterSpacing: "1px",
          mb: 2,
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        THEO DÕI TÌNH HÌNH SỰ CỐ XẢY RA HÀNG THÁNG
      </Typography>

      {/* Nút thêm dòng (chỉ khi edit) */}
      {isEditMode && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddRow}
            sx={{
              borderColor: "#009e60",
              color: "#009e60",
              "&:hover": { borderColor: "#66bb6a", bgcolor: "#e6f7f0" },
              textTransform: "none",
            }}
          >
            Thêm sự cố
          </Button>
        </Box>
      )}

      {/* Bảng */}
      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "0px",
            overflow: "hidden",
            width: "100%",
            mt: "4px",
          }}
        >
          <Table
            size="small"
            sx={{ borderCollapse: "collapse", border: "1px solid black" }}
          >
            <TableHead>
              {/* Header tầng 1 */}
              <TableRow>
                <TableCell rowSpan={2} sx={hcell({ width: "5%" })}>
                  Ca
                </TableCell>
                <TableCell rowSpan={2} sx={hcell({ width: "12%" })}>
                  Ngày/tháng/năm
                </TableCell>
                <TableCell rowSpan={2} sx={hcell({ width: "16%" })}>
                  Họ tên và chữ ký người vận hành ca máy xảy ra sự cố
                </TableCell>
                <TableCell rowSpan={2} sx={hcell({ width: "22%" })}>
                  Nguyên nhân sự cố, tình trạng và cách giải quyết hư hỏng
                </TableCell>
                <TableCell rowSpan={2} sx={hcell({ width: "14%" })}>
                  Họ tên và chữ ký người sửa chữa
                </TableCell>
                {/* Nhóm "Thiệt hại vì sự cố" – span 4 cột */}
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={hcell({ width: "31%" })}
                >
                  Thiệt hại vì sự cố
                </TableCell>
                {isEditMode && (
                  <TableCell rowSpan={2} sx={hcell({ width: "6%" })}>
                    Thao tác
                  </TableCell>
                )}
              </TableRow>

              {/* Header tầng 2 */}
              <TableRow>
                <TableCell sx={hcell({ width: "8%" })}>Giờ ngừng (h)</TableCell>
                <TableCell sx={hcell({ width: "9%" })}>Tiền công s/c</TableCell>
                <TableCell sx={hcell({ width: "9%" })}>
                  Tiền nguyên vật liệu
                </TableCell>
                <TableCell sx={hcell({ width: "9%" })}>Tổng cộng (đ)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Dữ liệu thực */}
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {/* Ca */}
                  <TableCell align="center" sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: { style: { textAlign: "center" } },
                        }}
                        value={row.ca}
                        onChange={(e) =>
                          handleChange(row.id, "ca", e.target.value)
                        }
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {row.ca}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Ngày/tháng/năm */}
                  <TableCell align="center" sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        type="date"
                        InputProps={{ disableUnderline: true }}
                        value={row.ngayThangNam}
                        onChange={(e) =>
                          handleChange(row.id, "ngayThangNam", e.target.value)
                        }
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                        }}
                      >
                        {row.ngayThangNam
                          ? dayjs(row.ngayThangNam).format("DD/MM/YYYY")
                          : ""}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Họ tên vận hành */}
                  <TableCell sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        value={row.hoTenVanHanh}
                        onChange={(e) =>
                          handleChange(row.id, "hoTenVanHanh", e.target.value)
                        }
                        placeholder="Họ và tên..."
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                        }}
                      >
                        {row.hoTenVanHanh}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Nguyên nhân */}
                  <TableCell sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        multiline
                        maxRows={3}
                        InputProps={{ disableUnderline: true }}
                        value={row.nguyenNhan}
                        onChange={(e) =>
                          handleChange(row.id, "nguyenNhan", e.target.value)
                        }
                        placeholder="Mô tả nguyên nhân..."
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                        }}
                      >
                        {row.nguyenNhan}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Họ tên sửa chữa */}
                  <TableCell sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        value={row.hoTenSuaChua}
                        onChange={(e) =>
                          handleChange(row.id, "hoTenSuaChua", e.target.value)
                        }
                        placeholder="Họ và tên..."
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                        }}
                      >
                        {row.hoTenSuaChua}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Giờ ngừng */}
                  <TableCell align="center" sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: { style: { textAlign: "center" } },
                        }}
                        value={row.gioNgung}
                        onChange={(e) =>
                          handleChange(row.id, "gioNgung", e.target.value)
                        }
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {row.gioNgung}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Tiền công s/c */}
                  <TableCell align="center" sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: { style: { textAlign: "center" } },
                        }}
                        value={row.tienCongSC}
                        onChange={(e) =>
                          handleChange(row.id, "tienCongSC", e.target.value)
                        }
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {row.tienCongSC}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Tiền nguyên vật liệu */}
                  <TableCell align="center" sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: { style: { textAlign: "center" } },
                        }}
                        value={row.tienNguyenVatLieu}
                        onChange={(e) =>
                          handleChange(
                            row.id,
                            "tienNguyenVatLieu",
                            e.target.value,
                          )
                        }
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {row.tienNguyenVatLieu}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Tổng cộng */}
                  <TableCell align="center" sx={dcell()}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          inputProps: { style: { textAlign: "center" } },
                        }}
                        value={row.tongCong}
                        onChange={(e) =>
                          handleChange(row.id, "tongCong", e.target.value)
                        }
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {row.tongCong}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Xóa */}
                  {isEditMode && (
                    <TableCell align="center" sx={dcell()}>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRow(row.id)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {/* Dòng trống mô phỏng sổ sách */}
              {!isEditMode &&
                Array.from({ length: emptyCount }).map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    {Array.from({ length: 9 }).map((__, ci) => (
                      <TableCell key={ci} sx={{ ...dcell(), height: "38px" }} />
                    ))}
                  </TableRow>
                ))}
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
