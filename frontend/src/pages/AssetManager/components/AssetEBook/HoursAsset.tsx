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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { AssetHoursType } from "../../types";
import { useAssetHoursPageQuery, useGioHoatDongMutation } from "../../Mutation";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import EditButton from "../../../../components/Button/EditButton";
import { DepartmentType } from "../../../Department/types";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";

// ---- Style sách ----
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

// Cell style helpers
const hCell = (extra?: object) => ({
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

const dCell = (extra?: object) => ({
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: "13px",
  borderTop: "none",
  borderBottom: "1px dashed black",
  borderLeft: "1px solid black",
  borderRight: "1px solid black",
  padding: "4px 6px",
  height: "38px",
  verticalAlign: "middle" as const,
  ...extra,
});

// Row type kết hợp thêm trường UI
interface RowState extends AssetHoursType {
  _dateStr: string; // YYYY-MM-DD dùng cho date input
  _isNew: boolean;
}

const EMPTY_ROWS = 12;

export default function HoursAsset({
  asset,
  onPageChange,
  currentPage = 5,
  totalPages = 7,
  readOnly = true,
  onEdit,
  onCancel,
  allDepartments = [],
}: {
  asset: any;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  readOnly?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  allDepartments: DepartmentType[];
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [rows, setRows] = useState<RowState[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { createMutation, updateMutation, deleteManyMutation } =
    useGioHoatDongMutation();
  const {
    data: historyData,
    isLoading,
    refetch,
  } = useAssetHoursPageQuery(0, 100, asset?.id, selectedYear);

  // ---- Load data từ API ----
  const loadRows = () => {
    if (historyData?.items && historyData.items.length > 0) {
      const loaded: RowState[] = historyData.items.map(
        (item: AssetHoursType) => ({
          ...item,
          _dateStr: item.ngay
            ? `${item.nam}-${String(item.thang).padStart(2, "0")}-${String(item.ngay).padStart(2, "0")}`
            : `${item.nam}-${String(item.thang).padStart(2, "0")}-01`,
          _isNew: false,
        }),
      );
      setRows(loaded);
    } else {
      setRows([]);
    }
    setHasChanges(false);
  };

  useEffect(() => {
    loadRows();
  }, [historyData, selectedYear]);

  const handleEditMode = () => {
    setIsEditMode(true);
    onEdit();
  };
  const handleCancel = () => {
    loadRows();
    setIsEditMode(false);
    onCancel();
  };

  // ---- Thêm dòng mới ----
  const handleAddRow = () => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const newRow: RowState = {
      id: `temp-${Date.now()}`,
      idTaiSan: asset?.id || "",
      nam: String(selectedYear),
      thang: String(dayjs().month() + 1),
      ngay: String(dayjs().date()),
      idDonVi: asset?.idDonViHienThoi || asset?.idDonViBanDau || "",
      gioHoatDong: 0,
      ketQuaHoatDong: "",
      gioNgungMay_HongMay: 0,
      gioNgungMay_ChoDoi: 0,
      gioNgungMay_MatDien: 0,
      gioNgungMay_ThieuNguyenLieu: 0,
      gioNgungMay_LyDoKhac: 0,
      ghiChu: "",
      ngayTao: "",
      ngayCapNhat: "",
      _dateStr: todayStr,
      _isNew: true,
    };
    setRows((prev) => [...prev, newRow]);
    setHasChanges(true);
  };

  // ---- Xóa dòng ----
  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setHasChanges(true);
  };

  // ---- Thay đổi ngày (tách ra nam/thang/ngay) ----
  const handleDateChange = (id: string, dateStr: string) => {
    const d = dayjs(dateStr);
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              _dateStr: dateStr,
              nam: String(d.year()),
              thang: String(d.month() + 1),
              ngay: String(d.date()),
            }
          : r,
      ),
    );
    setHasChanges(true);
  };

  // ---- Thay đổi trường số/text ----
  const handleChange = (
    id: string,
    field: keyof AssetHoursType,
    value: any,
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
    setHasChanges(true);
  };

  // ---- Lưu ----
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const toCreate: any[] = [];
      const toUpdate: any[] = [];

      rows.forEach((row) => {
        const payload = {
          idTaiSan: asset?.id,
          nam: row.nam,
          thang: row.thang,
          ngay: row.ngay,
          idDonVi: row.idDonVi,
          gioHoatDong: Number(row.gioHoatDong) || 0,
          ketQuaHoatDong: row.ketQuaHoatDong || "",
          gioNgungMay_HongMay: Number(row.gioNgungMay_HongMay) || 0,
          gioNgungMay_ChoDoi: Number(row.gioNgungMay_ChoDoi) || 0,
          gioNgungMay_MatDien: Number(row.gioNgungMay_MatDien) || 0,
          gioNgungMay_ThieuNguyenLieu:
            Number(row.gioNgungMay_ThieuNguyenLieu) || 0,
          gioNgungMay_LyDoKhac: Number(row.gioNgungMay_LyDoKhac) || 0,
          ghiChu: row.ghiChu || "",
        };
        if (row._isNew) {
          toCreate.push(payload);
        } else {
          toUpdate.push({ ...payload, id: row.id });
        }
      });

      if (toCreate.length > 0 && createMutation) {
        await new Promise((res, rej) =>
          createMutation.mutate(toCreate, { onSuccess: res, onError: rej }),
        );
      }
      if (toUpdate.length > 0 && updateMutation) {
        await new Promise((res, rej) =>
          updateMutation.mutate(toUpdate, { onSuccess: res, onError: rej }),
        );
      }

      await refetch();
      setHasChanges(false);
      setIsEditMode(false);
      onCancel();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Tổng ----
  const total = (field: keyof AssetHoursType) =>
    rows.reduce((s, r) => s + (Number(r[field]) || 0), 0);

  // ---- Render ô số ----
  const NumCell = ({
    row,
    field,
  }: {
    row: RowState;
    field: keyof AssetHoursType;
  }) => (
    <TableCell align="center" sx={dCell()}>
      {isEditMode ? (
        <TextField
          fullWidth
          size="small"
          variant="standard"
          type="number"
          InputProps={{
            disableUnderline: true,
            inputProps: { min: 0, style: { textAlign: "center" } },
          }}
          value={row[field] as number}
          onChange={(e) => handleChange(row.id, field, e.target.value)}
        />
      ) : (
        <Typography
          sx={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {Number(row[field]) > 0 ? (row[field] as number) : ""}
        </Typography>
      )}
    </TableCell>
  );

  const emptyCount = Math.max(0, EMPTY_ROWS - rows.length);

  return (
    <Box sx={bookStyles.container}>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
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
              <SaveBtn onSave={handleSave} />
              <CancelBtn onClick={handleCancel} />
            </>
          )}
          {readOnly && <EditButton onClick={handleEditMode} />}
        </Box>
      </Box>

      {/* Tiêu đề */}
      <Typography
        textAlign="center"
        fontSize={17}
        fontWeight={700}
        sx={{
          letterSpacing: "1px",
          mb: 1,
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        THEO DÕI TÌNH HÌNH HOẠT ĐỘNG HÀNG THÁNG
      </Typography>

      {/* Chọn năm */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={selectedYear}
            label="Năm"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[
              currentYear - 2,
              currentYear - 1,
              currentYear,
              currentYear + 1,
            ].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Nút thêm dòng */}
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
            Thêm dòng
          </Button>
        </Box>
      )}

      {/* Bảng */}
      <Box sx={bookStyles.content}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: "0px", overflowX: "auto", width: "100%" }}
        >
          <Table
            size="small"
            sx={{
              borderCollapse: "collapse",
              border: "1px solid black",
              minWidth: 1100,
            }}
          >
            <TableHead>
              {/* Header tầng 1 */}
              <TableRow>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 100 })}>
                  Ngày/tháng/năm
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 160 })}>
                  Đơn vị quản lý
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 90 })}>
                  Giờ hoạt động trong tháng
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 140 })}>
                  Kết quả hoạt động của thiết bị
                </TableCell>
                <TableCell colSpan={5} align="center" sx={hCell()}>
                  Giờ ngừng máy (h)
                </TableCell>
                <TableCell rowSpan={2} sx={hCell({ minWidth: 120 })}>
                  Ghi chú
                </TableCell>
                {isEditMode && (
                  <TableCell rowSpan={2} sx={hCell({ minWidth: 60 })}>
                    Thao tác
                  </TableCell>
                )}
              </TableRow>
              {/* Header tầng 2 */}
              <TableRow>
                {[
                  "Hỏng máy",
                  "Chờ đợi",
                  "Mất điện",
                  "Thiếu N.liệu",
                  "Lý do khác",
                ].map((t) => (
                  <TableCell
                    key={t}
                    align="center"
                    sx={hCell({ minWidth: 70 })}
                  >
                    {t}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={isEditMode ? 11 : 10}
                    align="center"
                    sx={{ border: "1px solid black" }}
                  >
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rows.map((row: any) => (
                    <TableRow key={row.id}>
                      {/* Ngày */}
                      <TableCell align="center" sx={dCell()}>
                        {isEditMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            type="date"
                            InputProps={{ disableUnderline: true }}
                            value={row._dateStr}
                            onChange={(e) =>
                              handleDateChange(row.id, e.target.value)
                            }
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: "13px",
                            }}
                          >
                            {row._dateStr
                              ? dayjs(row._dateStr).format("DD/MM/YYYY")
                              : ""}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Đơn vị */}
                      <TableCell sx={dCell()}>
                        {readOnly ? (
                          <Typography
                            sx={{
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: "13px",
                            }}
                          >
                            {row?.tenDonVi || ""}
                          </Typography>
                        ) : (
                          <Autocomplete
                            options={allDepartments}
                            getOptionLabel={(option) =>
                              option?.tenPhongBan || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value?.id
                            }
                            value={
                              allDepartments.find(
                                (d) => d.id === row.idDonVi,
                              ) || null
                            }
                            onChange={(_, newValue) => {
                              handleChange(
                                row.id,
                                "idDonVi",
                                newValue?.id || "",
                              );
                              handleChange(
                                row.id,
                                "tenDonVi",
                                newValue?.tenPhongBan || "",
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                InputProps={{
                                  ...params.InputProps,
                                  disableUnderline: true,
                                }}
                                placeholder="Chọn đơn vị..."
                              />
                            )}
                            sx={{ width: "100%" }}
                          />
                        )}
                      </TableCell>

                      {/* Giờ hoạt động */}
                      <NumCell row={row} field="gioHoatDong" />

                      {/* Kết quả hoạt động */}
                      <TableCell sx={dCell()}>
                        {isEditMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            value={row.ketQuaHoatDong as string}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                "ketQuaHoatDong",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập kết quả..."
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: "13px",
                            }}
                          >
                            {row.ketQuaHoatDong as string}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Giờ ngừng: 5 cột */}
                      <NumCell row={row} field="gioNgungMay_HongMay" />
                      <NumCell row={row} field="gioNgungMay_ChoDoi" />
                      <NumCell row={row} field="gioNgungMay_MatDien" />
                      <NumCell row={row} field="gioNgungMay_ThieuNguyenLieu" />
                      <NumCell row={row} field="gioNgungMay_LyDoKhac" />

                      {/* Ghi chú */}
                      <TableCell sx={dCell()}>
                        {isEditMode ? (
                          <TextField
                            fullWidth
                            size="small"
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            value={row.ghiChu as string}
                            onChange={(e) =>
                              handleChange(row.id, "ghiChu", e.target.value)
                            }
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: "13px",
                            }}
                          >
                            {row.ghiChu as string}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Xóa */}
                      {isEditMode && (
                        <TableCell align="center" sx={dCell()}>
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

                  {/* Dòng trống khi không edit */}
                  {!isEditMode &&
                    Array.from({ length: emptyCount }).map((_, i) => (
                      <TableRow key={`empty-${i}`}>
                        {Array.from({ length: 10 }).map((__, ci) => (
                          <TableCell key={ci} sx={dCell()} />
                        ))}
                      </TableRow>
                    ))}

                  {/* Dòng tổng */}
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={2}
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      TỔNG
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {total("gioHoatDong") > 0 ? total("gioHoatDong") : ""}
                    </TableCell>
                    <TableCell
                      sx={{ ...dCell(), borderBottom: "1px solid black" }}
                    />
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {total("gioNgungMay_HongMay") > 0
                        ? total("gioNgungMay_HongMay")
                        : ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {total("gioNgungMay_ChoDoi") > 0
                        ? total("gioNgungMay_ChoDoi")
                        : ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {total("gioNgungMay_MatDien") > 0
                        ? total("gioNgungMay_MatDien")
                        : ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {total("gioNgungMay_ThieuNguyenLieu") > 0
                        ? total("gioNgungMay_ThieuNguyenLieu")
                        : ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        ...dCell(),
                        borderBottom: "1px solid black",
                        fontWeight: "bold",
                      }}
                    >
                      {total("gioNgungMay_LyDoKhac") > 0
                        ? total("gioNgungMay_LyDoKhac")
                        : ""}
                    </TableCell>
                    <TableCell
                      sx={{ ...dCell(), borderBottom: "1px solid black" }}
                    />
                    {isEditMode && (
                      <TableCell
                        sx={{ ...dCell(), borderBottom: "1px solid black" }}
                      />
                    )}
                  </TableRow>
                </>
              )}
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
