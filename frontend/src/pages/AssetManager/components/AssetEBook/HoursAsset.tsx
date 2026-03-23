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

// Mảng 12 tháng
const MONTHS = [
  { value: 1, label: " 1" },
  { value: 2, label: " 2" },
  { value: 3, label: " 3" },
  { value: 4, label: " 4" },
  { value: 5, label: " 5" },
  { value: 6, label: " 6" },
  { value: 7, label: " 7" },
  { value: 8, label: " 8" },
  { value: 9, label: " 9" },
  { value: 10, label: " 10" },
  { value: 11, label: " 11" },
  { value: 12, label: " 12" },
];

export default function HoursAsset({ asset }: { asset: any }) {
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

  // Khởi tạo 12 tháng từ dữ liệu API
  useEffect(() => {
    if (historyData?.items) {
      const dataMap = new Map<number, AssetHoursType>();

      // Lưu dữ liệu từ API vào Map
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

      // Tạo rows cho 12 tháng
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
      setHasChanges(false);
    } else {
      // Không có dữ liệu, tạo 12 tháng trống
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
          GIỜ (KM) HOẠT ĐỘNG CỦA THIẾT BỊ TRONG NĂM {selectedYear}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
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

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveAll}
            disabled={!hasChanges || isSaving}
            sx={{
              bgcolor: "#009e60",
              "&:hover": { bgcolor: "#026e42" },
              "&.Mui-disabled": { bgcolor: "#ccc" },
            }}
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #ddd", overflowX: "auto" }}
      >
        <Table size="small" stickyHeader sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell
                rowSpan={2}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 60,
                  border: "1px solid grey",
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
                  border: "1px solid grey",
                }}
              >
                Cấp II
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
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
                    <TextField
                      fullWidth
                      size="small"
                      variant="standard"
                      type="number"
                      value={row.gioHoatDong}
                      onChange={(e) =>
                        handleChange(row.thang, "gioHoatDong", e.target.value)
                      }
                      placeholder="Nhập giờ/km"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
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
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
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
  );
}
