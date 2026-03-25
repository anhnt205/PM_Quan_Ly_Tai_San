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
    // backgroundImage: "linear-gradient(to bottom, #ffffff, #e6f7f0)",
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
        sx={{ mb: 2 }}
      >
        THEO DÕI TÌNH HÌNH HOẠT ĐỘNG HÀNG THÁNG NĂM {selectedYear}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
          sx={{
            borderRadius: "0px",
            overflowX: "auto",
            width: "100%",
          }}
        >
          <Table size="small" sx={{ borderCollapse: 'collapse', border: '1px solid black', minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    minWidth: 120,
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Ngày/tháng
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    minWidth: 200,
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Đơn vị quản lý
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    minWidth: 150,
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Giờ hoạt động<br/>trong tháng
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    minWidth: 180,
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Kết quả hoạt<br/>động của thiết bị
                </TableCell>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Giờ ngừng máy (h)
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    minWidth: 150,
                    border: "1px solid black",
                    backgroundColor: "transparent",
                  }}
                >
                  Ghi chú
                </TableCell>
              </TableRow>
              <TableRow>
                {['Hỏng máy', 'Chờ đợi', 'Mất điện', 'Thiếu N.liệu', 'Lý do khác'].map((text) => (
                  <TableCell
                    key={text}
                    align="center"
                    sx={{
                      fontFamily: '"Times New Roman", Times, serif',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      border: "1px solid black",
                      backgroundColor: "transparent",
                      minWidth: 90,
                    }}
                  >
                    {text === 'Hỏng máy' ? <>Hỏng<br/>máy</> : 
                     text === 'Chờ đợi' ? <>Chờ<br/>đợi</> : 
                     text === 'Mất điện' ? <>Mất<br/>điện</> : 
                     text === 'Thiếu N.liệu' ? <>Thiếu<br/>N.liệu</> : 
                     <>Lý do<br/>khác</>}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ border: "1px solid black" }}>
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const hasData = !row.isNew || Number(row.gioHoatDong) > 0;
                  return (
                    <TableRow key={row.id}>
                      <TableCell align="center" sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px', fontFamily: '"Times New Roman", Times, serif', fontSize: '16px', fontWeight: 'bold' }}>
                        Tháng {row.thang}
                      </TableCell>
                      <TableCell align="center" sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px', fontFamily: '"Times New Roman", Times, serif', fontSize: '16px' }}>
                        {hasData ? (asset?.tenDonViHienThoi || asset?.tenDonViBanDau || "") : ""}
                      </TableCell>
                      <TableCell align="center" sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}>
                        {readOnly ? (
                          <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '16px' }}>{row?.gioHoatDong || ""}</Typography>
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
                            InputProps={{ inputProps: { min: 0 }, disableUnderline: true }}
                            sx={{ '& .MuiInputBase-input': { textAlign: 'center', fontFamily: '"Times New Roman", Times, serif', fontSize: '16px' } }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                      <TableCell sx={{ borderTop: "none", borderBottom: '1px dashed black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px' }}></TableCell>
                    </TableRow>
                  );
                })
              )}

              {/* Dòng tổng */}
              {!isLoading && (
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px', fontFamily: '"Times New Roman", Times, serif', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    TỔNG
                  </TableCell>
                  <TableCell
                    sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}
                  ></TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black", padding: '8px', fontFamily: '"Times New Roman", Times, serif', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    {totals.gioHoatDong.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                  <TableCell sx={{ borderTop: "none", borderBottom: '1px solid black', borderLeft: "1px solid black", borderRight: "1px solid black" }}></TableCell>
                </TableRow>
              )}
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
