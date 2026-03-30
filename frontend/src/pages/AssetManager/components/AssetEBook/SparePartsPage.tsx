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
  IconButton,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import EditButton from "../../../../components/Button/EditButton";

// Style sách – giống các trang khác
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
  content: {
    flex: 1,
    overflow: "auto",
  },
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

const cellSx = {
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: "15px",
  border: "1px solid black",
  backgroundColor: "transparent",
};

const dataCellSx = {
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: "15px",
  borderTop: "none",
  borderBottom: "1px dashed black",
  borderLeft: "1px solid black",
  borderRight: "1px solid black",
  padding: "6px 8px",
  height: "38px",
};

interface SparePartRow {
  id: string;
  tt: number;
  tenVaQuyCache: string;
  donViTinh: string;
  soLuong: string;
  trongLuong: string;
  nguyenLieu: string;
}

interface SparePartsPageProps {
  asset?: any;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
}

const EMPTY_ROWS_TARGET = 12;

const SparePartsPage: React.FC<SparePartsPageProps> = ({
  asset,
  onPageChange,
  currentPage = 4,
  totalPages = 6,
  readOnly = true,
  onEdit,
  onCancel,
}) => {
  const [rows, setRows] = useState<SparePartRow[]>([]);
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
    setIsEditMode(false);
  };

  const handleAddRow = () => {
    const newRow: SparePartRow = {
      id: `temp-${Date.now()}`,
      tt: rows.length + 1,
      tenVaQuyCache: "",
      donViTinh: "",
      soLuong: "",
      trongLuong: "",
      nguyenLieu: "",
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleChange = (id: string, field: keyof SparePartRow, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const emptyCount = Math.max(0, EMPTY_ROWS_TARGET - rows.length);

  return (
    <Box sx={bookStyles.container}>
      {/* Toolbar */}
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
          {!isEditMode && readOnly && <EditButton onClick={handleEdit} />}
        </Box>
      </Box>

      {/* Tiêu đề */}
      <Typography
        textAlign="center"
        fontSize={18}
        fontWeight={700}
        sx={{ letterSpacing: "2px", mb: 2, fontFamily: '"Times New Roman", Times, serif' }}
      >
        BẢNG KÊ CÁC PHỤ TÙNG CHÍNH CỦA MÁY
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
            Thêm phụ tùng
          </Button>
        </Box>
      )}

      {/* Bảng */}
      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: "0px", overflow: "hidden", width: "100%", marginTop: "4px" }}
        >
          <Table size="small" sx={{ borderCollapse: "collapse", border: "1px solid black" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ ...cellSx, fontWeight: "bold", width: "7%" }}
                >
                  TT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...cellSx, fontWeight: "bold", width: "35%" }}
                >
                  Tên và quy cách phụ tùng
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...cellSx, fontWeight: "bold", width: "12%" }}
                >
                  Đơn vị
                  <br />
                  tính
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...cellSx, fontWeight: "bold", width: "12%" }}
                >
                  Số
                  <br />
                  lượng
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...cellSx, fontWeight: "bold", width: "17%" }}
                >
                  Trọng lượng
                  <br />
                  (kg)
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...cellSx, fontWeight: "bold", width: "17%" }}
                >
                  Nguyên liệu chế
                  <br />
                  tạo
                </TableCell>
                {isEditMode && (
                  <TableCell
                    align="center"
                    sx={{ ...cellSx, fontWeight: "bold", width: "8%" }}
                  >
                    Thao tác
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Dữ liệu thực */}
              {rows.map((row, idx) => (
                <TableRow key={row.id}>
                  {/* TT */}
                  <TableCell align="center" sx={dataCellSx}>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px" }}>
                      {idx + 1}
                    </Typography>
                  </TableCell>
                  {/* Tên & quy cách */}
                  <TableCell sx={dataCellSx}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        value={row.tenVaQuyCache}
                        onChange={(e) => handleChange(row.id, "tenVaQuyCache", e.target.value)}
                        placeholder="Nhập tên và quy cách..."
                      />
                    ) : (
                      <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px" }}>
                        {row.tenVaQuyCache}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Đơn vị tính */}
                  <TableCell align="center" sx={dataCellSx}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        value={row.donViTinh}
                        onChange={(e) => handleChange(row.id, "donViTinh", e.target.value)}
                        placeholder="Chiếc..."
                      />
                    ) : (
                      <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px" }}>
                        {row.donViTinh}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Số lượng */}
                  <TableCell align="center" sx={dataCellSx}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true, inputProps: { style: { textAlign: "center" } } }}
                        value={row.soLuong}
                        onChange={(e) => handleChange(row.id, "soLuong", e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px", textAlign: "center" }}>
                        {row.soLuong}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Trọng lượng */}
                  <TableCell align="center" sx={dataCellSx}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true, inputProps: { style: { textAlign: "center" } } }}
                        value={row.trongLuong}
                        onChange={(e) => handleChange(row.id, "trongLuong", e.target.value)}
                      />
                    ) : (
                      <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px", textAlign: "center" }}>
                        {row.trongLuong}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Nguyên liệu */}
                  <TableCell sx={dataCellSx}>
                    {isEditMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        value={row.nguyenLieu}
                        onChange={(e) => handleChange(row.id, "nguyenLieu", e.target.value)}
                        placeholder="Thép, nhôm..."
                      />
                    ) : (
                      <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "15px" }}>
                        {row.nguyenLieu}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Xóa */}
                  {isEditMode && (
                    <TableCell align="center" sx={dataCellSx}>
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
                    <TableCell sx={{ ...dataCellSx, height: "38px" }} />
                    <TableCell sx={{ ...dataCellSx, height: "38px" }} />
                    <TableCell sx={{ ...dataCellSx, height: "38px" }} />
                    <TableCell sx={{ ...dataCellSx, height: "38px" }} />
                    <TableCell sx={{ ...dataCellSx, height: "38px" }} />
                    <TableCell sx={{ ...dataCellSx, height: "38px" }} />
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
};

export default SparePartsPage;
