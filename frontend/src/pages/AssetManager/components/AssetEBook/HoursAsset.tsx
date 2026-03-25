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
import { AssetHoursType } from "../../types";
import { useAssetHoursPageQuery, useGioHoatDongMutation } from "../../Mutation";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import EditButton from "../../../../components/Button/EditButton";

// Style sách
const bookStyles = {
  container: {
    width: "210mm",
    minHeight: "297mm",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    backgroundImage: "linear-gradient(to bottom, #ffffff, #e6f7f0)",
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
    color: "#026e42b6a",
    fontStyle: "italic" as const,
  },
};

const MONTHS = [...Array(12)].map((_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));
export default function HoursAsset({
  asset,
  onPageChange,
  currentPage = 3,
  totalPages = 4,
  readOnly = true,
  onEdit,
  onCancel,
}: {
  asset: any;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [rows, setRows] = useState<AssetHoursType[]>([]);
  const [originalData, setOriginalData] = useState<Map<number, AssetHoursType>>(
    new Map(),
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { createMutation, updateMutation, deleteManyMutation } =
    useGioHoatDongMutation();

  const {
    data: historyData,
    isLoading,
    refetch,
  } = useAssetHoursPageQuery(0, 100, asset?.id, selectedYear);
  const resetData = () => {
    if (historyData?.items) {
      const dataMap = new Map<number, AssetHoursType>();
      historyData.items.forEach((item: AssetHoursType) => {
        dataMap.set(item.thang, {
          id: item.id,
          thang: item.thang,
          gioHoatDong: item.gioHoatDong || 0,
          gioSauSCL: item.gioSauSCL || 0,
          gioSauBcc: item.gioSauBcc || 0,
          ngaySCT_Vao: item.ngaySCT_Vao ? item.ngaySCT_Vao.slice(0, 10) : "",
          ngaySCT_Ra: item.ngaySCT_Ra ? item.ngaySCT_Ra.slice(0, 10) : "",
          ngayBcc_Vao: item.ngayBcc_Vao ? item.ngayBcc_Vao.slice(0, 10) : "",
          ngayBcc_Ra: item.ngayBcc_Ra ? item.ngayBcc_Ra.slice(0, 10) : "",
          soLanBaoDuongCapI: item.soLanBaoDuongCapI || 0,
          soLanBaoDuongCapII: item.soLanBaoDuongCapII || 0,
          ghiChu: item.ghiChu || "",
          isNew: false,
        });
      });

      setOriginalData(dataMap);

      const allRows: AssetHoursType[] = MONTHS.map((month) => {
        const existingData = dataMap.get(month.value);
        if (existingData) {
          return existingData;
        }
        return {
          id: `new-${month.value}`,
          thang: month.value,
          gioHoatDong: 0,
          gioSauSCL: 0,
          gioSauBcc: 0,
          ngaySCT_Vao: "",
          ngaySCT_Ra: "",
          ngayBcc_Vao: "",
          ngayBcc_Ra: "",
          soLanBaoDuongCapI: 0,
          soLanBaoDuongCapII: 0,
          ghiChu: "",
          isNew: true,
        };
      });
      setRows(allRows);
    } else {
      const emptyRows: AssetHoursType[] = MONTHS.map((month) => ({
        id: `new-${month.value}`,
        thang: month.value,
        gioHoatDong: 0,
        gioSauSCL: 0,
        gioSauBcc: 0,
        ngaySCT_Vao: "",
        ngaySCT_Ra: "",
        ngayBcc_Vao: "",
        ngayBcc_Ra: "",
        soLanBaoDuongCapI: 0,
        soLanBaoDuongCapII: 0,
        ghiChu: "",
        isNew: true,
      }));
      setRows(emptyRows);
      setOriginalData(new Map());
    }
    setHasChanges(false);
  };

  const handleCancel = () => {
    resetData();
    onCancel();
  };
  useEffect(() => {
    resetData();
  }, [historyData, selectedYear]);

  const handleChange = (
    thang: number,
    field: keyof AssetHoursType,
    value: any,
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.thang === thang ? { ...row, [field]: value } : row,
      ),
    );
    setHasChanges(true);
  };

  // Lấy danh sách cần tạo mới, cập nhật, xóa
  const getChanges = () => {
    const toCreate: any[] = [];
    const toUpdate: any[] = [];
    const toDelete: string[] = [];

    rows.forEach((row) => {
      const original = originalData.get(row.thang);

      // Bỏ qua nếu không có giờ hoạt động và không phải dữ liệu cũ
      if (!row.gioHoatDong && !original) {
        return;
      }

      if (row.isNew && row.gioHoatDong) {
        // Tạo mới
        toCreate.push({
          idTaiSan: asset.id,
          nam: selectedYear,
          thang: row.thang,
          gioHoatDong: Number(row.gioHoatDong) || 0,
          gioSauSCL: Number(row.gioSauSCL) || 0,
          gioSauBcc: Number(row.gioSauBcc) || 0,
          ngaySCT_Vao: row.ngaySCT_Vao ? `${row.ngaySCT_Vao}T00:00:00` : null,
          ngaySCT_Ra: row.ngaySCT_Ra ? `${row.ngaySCT_Ra}T00:00:00` : null,
          ngayBcc_Vao: row.ngayBcc_Vao ? `${row.ngayBcc_Vao}T00:00:00` : null,
          ngayBcc_Ra: row.ngayBcc_Ra ? `${row.ngayBcc_Ra}T00:00:00` : null,
          soLanBaoDuongCapI: Number(row.soLanBaoDuongCapI) || 0,
          soLanBaoDuongCapII: Number(row.soLanBaoDuongCapII) || 0,
          ghiChu: row.ghiChu || "",
        });
      } else if (!row.isNew && original) {
        // Kiểm tra có thay đổi không
        const hasChange =
          Number(original.gioHoatDong) !== Number(row.gioHoatDong) ||
          original.gioSauSCL !== row.gioSauSCL ||
          original.gioSauBcc !== row.gioSauBcc ||
          original.ngaySCT_Vao !== row.ngaySCT_Vao ||
          original.ngaySCT_Ra !== row.ngaySCT_Ra ||
          original.ngayBcc_Vao !== row.ngayBcc_Vao ||
          original.ngayBcc_Ra !== row.ngayBcc_Ra ||
          original.soLanBaoDuongCapI !== row.soLanBaoDuongCapI ||
          original.soLanBaoDuongCapII !== row.soLanBaoDuongCapII ||
          original.ghiChu !== row.ghiChu;

        if (hasChange) {
          toUpdate.push({
            id: row.id,
            idTaiSan: asset.id,
            nam: selectedYear,
            thang: row.thang,
            gioHoatDong: Number(row.gioHoatDong) || 0,
            gioSauSCL: Number(row.gioSauSCL) || 0,
            gioSauBcc: Number(row.gioSauBcc) || 0,
            ngaySCT_Vao: row.ngaySCT_Vao ? `${row.ngaySCT_Vao}T00:00:00` : null,
            ngaySCT_Ra: row.ngaySCT_Ra ? `${row.ngaySCT_Ra}T00:00:00` : null,
            ngayBcc_Vao: row.ngayBcc_Vao ? `${row.ngayBcc_Vao}T00:00:00` : null,
            ngayBcc_Ra: row.ngayBcc_Ra ? `${row.ngayBcc_Ra}T00:00:00` : null,
            soLanBaoDuongCapI: Number(row.soLanBaoDuongCapI) || 0,
            soLanBaoDuongCapII: Number(row.soLanBaoDuongCapII) || 0,
            ghiChu: row.ghiChu || "",
          });
        }
      }
    });

    // Tìm các tháng bị xóa (có trong original nhưng không có trong rows mới?)
    // Trong trường hợp này, vì luôn hiển thị 12 tháng nên không có xóa

    // Nếu có API xóa, bạn có thể thêm logic xóa ở đây

    return { toCreate, toUpdate, toDelete };
  };

  const handleSaveAll = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const { toCreate, toUpdate, toDelete } = getChanges();

      // 1. Xử lý xóa (nếu có)
      if (toDelete.length > 0 && deleteManyMutation) {
        await new Promise((resolve, reject) => {
          deleteManyMutation.mutate(toDelete, {
            onSuccess: resolve,
            onError: reject,
          });
        });
      }

      // 2. Xử lý tạo mới hàng loạt
      if (toCreate.length > 0 && createMutation) {
        await new Promise((resolve, reject) => {
          createMutation.mutate(toCreate, {
            onSuccess: resolve,
            onError: reject,
          });
        });
      }

      // 3. Xử lý cập nhật hàng loạt
      if (toUpdate.length > 0 && updateMutation) {
        await new Promise((resolve, reject) => {
          updateMutation.mutate(toUpdate, {
            onSuccess: resolve,
            onError: reject,
          });
        });
      }

      // Refresh dữ liệu
      await refetch();
      setHasChanges(false);
      onCancel();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSaving(false);
    }
  };

  // Tính tổng
  const totals = {
    gioHoatDong: rows.reduce(
      (sum, row) => sum + (Number(row.gioHoatDong) || 0),
      0,
    ),
    gioSauSCL: rows.reduce((sum, row) => sum + (Number(row.gioSauSCL) || 0), 0),
    gioSauBcc: rows.reduce((sum, row) => sum + (Number(row.gioSauBcc) || 0), 0),
    soLanBaoDuongCapI: rows.reduce(
      (sum, row) => sum + (Number(row.soLanBaoDuongCapI) || 0),
      0,
    ),
    soLanBaoDuongCapII: rows.reduce(
      (sum, row) => sum + (Number(row.soLanBaoDuongCapII) || 0),
      0,
    ),
  };

  return (
    <Box sx={bookStyles.container}>
      {/* Button actions */}
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
          {!readOnly && (
            <>
              <SaveBtn onSave={handleSaveAll} />
              <CancelBtn onClick={handleCancel} />
            </>
          )}
          {readOnly && <EditButton onClick={onEdit} />}
        </Box>
      </Box>

      {/* Header sách */}
      <Typography
        textAlign="center"
        fontSize={20}
        fontWeight={700}
        sx={{ letterSpacing: "2px", mb: 2 }}
      >
        GIỜ (KM) HOẠT ĐỘNG CỦA THIẾT BỊ TRONG NĂM {selectedYear}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={selectedYear}
            label="Năm"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <MenuItem value={currentYear - 1}>{currentYear - 1}</MenuItem>
            <MenuItem value={currentYear}>{currentYear}</MenuItem>
            <MenuItem value={currentYear + 1}>{currentYear + 1}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid grey", overflowX: "auto" }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#e8f5e9" }}>
                <TableCell
                  rowSpan={2}
                  sx={{
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 60,
                  }}
                >
                  Tháng
                </TableCell>
                <TableCell
                  colSpan={3}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Giờ (km)
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Ngày SCT
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Ngày BCC
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Số lần Báo đường
                </TableCell>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Ghi chú
                </TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Hoạt động
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Sau SCL
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Sau Bcc
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Vào
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Ra
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Vào
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 100,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Ra
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 80,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Cấp I
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 80,
                    bgcolor: "#e8f5e9",
                    border: "1px solid grey",
                  }}
                >
                  Cấp II
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{ ...bookStyles.container, display: "flex !importance" }}
            >
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "medium", border: "1px solid grey" }}
                    >
                      {row.thang}
                    </TableCell>

                    {/* Giờ hoạt động - Có thể nhập */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {readOnly ? (
                        <Typography>{row?.gioHoatDong || ""}</Typography>
                      ) : (
                        <TextField
                          fullWidth
                          size="small"
                          variant="standard"
                          type="number"
                          value={row.gioHoatDong}
                          onChange={(e) =>
                            handleChange(
                              row.thang,
                              "gioHoatDong",
                              e.target.value,
                            )
                          }
                          placeholder="Nhập giờ/km"
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      )}
                    </TableCell>

                    {/* Ngày SCT Vào - Tự động hoặc không cần nhập */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="date"
                      value={row.ngaySCT_Vao || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ngaySCT_Vao", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    /> */}
                    </TableCell>

                    {/* Ngày SCT Ra */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="date"
                      value={row.ngaySCT_Ra || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ngaySCT_Ra", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    /> */}
                    </TableCell>

                    {/* Ngày BCC Vào */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="date"
                      value={row.ngayBcc_Vao || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ngayBcc_Vao", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    /> */}
                    </TableCell>

                    {/* Ngày BCC Ra */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="date"
                      value={row.ngayBcc_Ra || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ngayBcc_Ra", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    /> */}
                    </TableCell>

                    {/* Số lần báo đường cấp I */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="number"
                      value={row.soLanBaoDuongCapI}
                      onChange={(e) =>
                        handleChange(
                          row.thang,
                          "soLanBaoDuongCapI",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                    /> */}
                    </TableCell>

                    {/* Số lần báo đường cấp II */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="number"
                      value={row.soLanBaoDuongCapII}
                      onChange={(e) =>
                        handleChange(
                          row.thang,
                          "soLanBaoDuongCapII",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                    /> */}
                    </TableCell>

                    {/* Ghi chú */}
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      value={row.ghiChu || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ghiChu", e.target.value)
                      }
                      placeholder="Ghi chú..."
                    /> */}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      value={row.ghiChu || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ghiChu", e.target.value)
                      }
                      placeholder="Ghi chú..."
                    /> */}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid grey",
                      }}
                    >
                      {/* <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      value={row.ghiChu || ""}
                      onChange={(e) =>
                        handleChange(row.thang, "ghiChu", e.target.value)
                      }
                      placeholder="Ghi chú..."
                    /> */}
                    </TableCell>
                  </TableRow>
                ))
              )}

              {/* Dòng tổng */}
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", border: "1px solid grey" }}
                >
                  TỔNG
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", border: "1px solid grey" }}
                >
                  {totals.gioHoatDong.toLocaleString()}
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{
                    border: "1px solid grey",
                  }}
                ></TableCell>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{
                    border: "1px solid grey",
                  }}
                ></TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", border: "1px solid grey" }}
                >
                  {/* {totals.soLanBaoDuongCapI} */}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", border: "1px solid grey" }}
                >
                  {/* {totals.soLanBaoDuongCapII} */}
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid grey",
                  }}
                ></TableCell>
                <TableCell
                  sx={{
                    border: "1px solid grey",
                  }}
                ></TableCell>
                <TableCell
                  sx={{
                    border: "1px solid grey",
                  }}
                ></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Footer - luôn ở dưới cùng */}
      <Box sx={bookStyles.footer}>
        <Box sx={bookStyles.pageNumber}>Trang {currentPage}</Box>
      </Box>
    </Box>
  );
}
