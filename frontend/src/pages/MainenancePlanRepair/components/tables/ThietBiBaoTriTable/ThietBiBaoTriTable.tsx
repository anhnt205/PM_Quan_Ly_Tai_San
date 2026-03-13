import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Collapse,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import {
  InfoOutlineRounded,
  Visibility,
  VisibilityOff,
  Add,
  Delete,
} from "@mui/icons-material";
import FieldAutoCompleted from "../../../../../components/TextField/FieldAutoCompleted";
import FieldInput from "../../../../../components/TextField/FieldInput";

enum Action {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

interface Props {
  formik: any;
  readOnly?: boolean;
  taiSans?: any[];
  ccdcs?: any[];
}

export default function ThietBiBaoTriTable({
  formik,
  readOnly = false,
  taiSans = [],
  ccdcs = [],
}: Props) {
  const [tableExpanded, setTableExpanded] = useState(true);

  // Tách làm 2 mảng riêng biệt trong Formik
  const currentTaiSans = formik.values.chiTietsTaiSan || [];
  const currentCCDCs = formik.values.chiTietsCCDC || [];

  const hasTaiSanData =
    currentTaiSans.filter((item: any) => item.action !== Action.DELETE).length >
    0;
  const hasCCDCData =
    currentCCDCs.filter((item: any) => item.action !== Action.DELETE).length >
    0;

  // --- HANDLER TÀI SẢN ---
  const handleAddTaiSan = () => {
    const newAsset = {
      id: "",
      idKeHoachSuaChua: formik.values.id,
      idTaiSan: "",
      tenTaiSan: "",
      ghiChu: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("chiTietsTaiSan", [newAsset, ...currentTaiSans]);
  };

  const handleDeleteTaiSan = (originalIndex: number) => {
    formik.setFieldValue(
      `chiTietsTaiSan[${originalIndex}].action`,
      Action.DELETE,
    );
  };

  const handleAddCCDC = () => {
    const newTool = {
      id: "",
      idKeHoachSuaChua: formik.values.id,
      idCCDC: "",
      idChiTietCCDC: "",
      tenCCDC: "",
      tenVatTu: "",
      soLuong: 1,
      ghiChu: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("chiTietsCCDC", [newTool, ...currentCCDCs]);
  };

  const handleDeleteCCDC = (originalIndex: number) => {
    formik.setFieldValue(
      `chiTietsCCDC[${originalIndex}].action`,
      Action.DELETE,
    );
  };

  return (
    <Paper
      sx={{
        mt: 2,
        p: 2,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        bgcolor: "background.paper",
      }}
    >
      {/* HEADER BẢNG */}
      <Box
        onClick={() => setTableExpanded(!tableExpanded)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          mb: tableExpanded ? 2 : 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <InfoOutlineRounded color="primary" />
          <Typography fontWeight={500} color="text.primary">
            Danh sách thiết bị tài sản / CCDC cần bảo trì
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "13px" }}
          >
            {tableExpanded ? "Thu gọn" : "Mở rộng"}
          </Typography>
          {tableExpanded ? (
            <Visibility sx={{ color: "text.secondary", fontSize: 20 }} />
          ) : (
            <VisibilityOff sx={{ color: "text.secondary", fontSize: 20 }} />
          )}
        </Box>
      </Box>

      {/* NỘI DUNG 2 BẢNG */}
      <Collapse in={tableExpanded}>
        <Grid container spacing={3}>
          {/* =========== BẢNG 1: TÀI SẢN =========== */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "success.main" }}>
                    <TableCell
                      align="center"
                      sx={{
                        color: "primary.contrastText",
                        fontWeight: 600,
                        width: "50%",
                      }}
                    >
                      Tên Tài Sản
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "primary.contrastText", fontWeight: 600 }}
                    >
                      Ghi chú
                    </TableCell>
                    {!readOnly && (
                      <TableCell
                        align="center"
                        width={60}
                        sx={{ color: "primary.contrastText", fontWeight: 600 }}
                      >
                        Xóa
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!readOnly && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          p: 1,
                          borderBottom: hasTaiSanData ? "1px solid" : "none",
                          borderColor: "divider",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          startIcon={<Add />}
                          onClick={handleAddTaiSan}
                          sx={{
                            py: 0.75,
                            borderStyle: "dashed",
                            "&:hover": {
                              borderStyle: "dashed",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          Thêm Tài Sản
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {currentTaiSans.map((item: any, originalIndex: number) => {
                    if (item.action === Action.DELETE) return null;
                    return (
                      <TableRow key={item.id || `ts-${originalIndex}`}>
                        <TableCell
                          sx={{ minWidth: 200, verticalAlign: "top", pt: 1.5 }}
                        >
                          {readOnly ? (
                            taiSans.find((t: any) => t.id === item.idTaiSan)
                              ?.ten ||
                            item.tenTaiSan ||
                            "-"
                          ) : (
                            <FieldAutoCompleted
                              title="Chọn thiết bị tài sản"
                              data={taiSans}
                              labelkey="ten"
                              formik={formik}
                              field={`chiTietsTaiSan[${originalIndex}].idTaiSan`}
                              onChange={(val) => {
                                formik.setFieldValue(
                                  `chiTietsTaiSan[${originalIndex}].tenTaiSan`,
                                  val?.ten,
                                );
                              }}
                              disabled={readOnly}
                              limitOptions={20}
                            />
                          )}
                        </TableCell>

                        <TableCell sx={{ verticalAlign: "top", pt: 1.5 }}>
                          {readOnly ? (
                            item.ghiChu || "-"
                          ) : (
                            <FieldInput
                              title="Nhập ghi chú"
                              formik={formik}
                              field={`chiTietsTaiSan[${originalIndex}].ghiChu`}
                              disabled={readOnly}
                            />
                          )}
                        </TableCell>

                        {!readOnly && (
                          <TableCell
                            align="center"
                            sx={{ verticalAlign: "top", pt: 1.5 }}
                          >
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteTaiSan(originalIndex)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}

                  {readOnly && !hasTaiSanData && (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        align="center"
                        sx={{ py: 3, color: "text.secondary" }}
                      >
                        Chưa có Tài sản nào được thêm
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* =========== BẢNG 2: CCDC - VẬT TƯ =========== */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "success.main" }}>
                    <TableCell
                      align="center"
                      sx={{
                        color: "info.contrastText",
                        fontWeight: 600,
                        width: "45%",
                      }}
                    >
                      Vật tư tiêu hao
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "info.contrastText",
                        fontWeight: 600,
                        width: "20%",
                      }}
                    >
                      SL hiện có
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "info.contrastText", fontWeight: 600 }}
                    >
                      Ghi chú
                    </TableCell>
                    {!readOnly && (
                      <TableCell
                        align="center"
                        width={60}
                        sx={{ color: "info.contrastText", fontWeight: 600 }}
                      >
                        Xóa
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!readOnly && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{
                          p: 1,
                          borderBottom: hasCCDCData ? "1px solid" : "none",
                          borderColor: "divider",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          startIcon={<Add />}
                          onClick={handleAddCCDC}
                          sx={{
                            py: 0.75,
                            borderStyle: "dashed",
                            "&:hover": {
                              borderStyle: "dashed",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          Thêm Vật tư tiêu hao
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {currentCCDCs.map((item: any, originalIndex: number) => {
                    if (item.action === Action.DELETE) return null;

                    const selectedCCDC = ccdcs.find(
                      (c: any) =>
                        c.id === item.idCCDC || c.id === item.idChiTietCCDC,
                    );
                    const slHienCo = selectedCCDC?.soLuong ?? "-";

                    return (
                      <TableRow key={item.id || `ccdc-${originalIndex}`}>
                        <TableCell
                          sx={{ minWidth: 200, verticalAlign: "top", pt: 1.5 }}
                        >
                          {readOnly ? (
                            <Typography
                              variant="body2"
                              sx={{
                                pt: 0.8,
                                color: "text.primary",
                                fontWeight: 500,
                              }}
                            >
                              {item.tenCCDC ||
                                item.tenVatTu ||
                                selectedCCDC?.ten ||
                                "-"}
                            </Typography>
                          ) : (
                            <FieldAutoCompleted
                              title="Chọn CCDC - Vật tư"
                              data={ccdcs}
                              labelkey="ten"
                              formik={formik}
                              field={`chiTietsCCDC[${originalIndex}].idChiTietCCDC`}
                              onChange={(val) => {
                                const masterId =
                                  val?.idCCDCVatTu || val?.idCCDC || val?.id;
                                formik.setFieldValue(
                                  `chiTietsCCDC[${originalIndex}].idCCDC`,
                                  masterId,
                                );
                                formik.setFieldValue(
                                  `chiTietsCCDC[${originalIndex}].tenVatTu`,
                                  val?.ten,
                                );
                                formik.setFieldValue(
                                  `chiTietsCCDC[${originalIndex}].tenCCDC`,
                                  val?.ten,
                                );
                              }}
                              disabled={readOnly}
                              limitOptions={20}
                            />
                          )}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{ verticalAlign: "top", pt: 1.5 }}
                        >
                          {readOnly ? (
                            <Typography
                              variant="body2"
                              sx={{
                                pt: 0.8,
                                fontWeight: 500,
                                textAlign: "center",
                              }}
                            >
                              {slHienCo}
                            </Typography>
                          ) : (
                            <TextField
                              fullWidth
                              disabled
                              size="small"
                              type="number"
                              placeholder="0"
                              value={slHienCo !== "-" ? slHienCo : ""}
                              InputLabelProps={{ shrink: true }}
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "40px",
                                  bgcolor: "action.hover",
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "rgba(0, 0, 0, 0.8)",
                                  textAlign: "center",
                                },
                              }}
                            />
                          )}
                        </TableCell>

                        <TableCell sx={{ verticalAlign: "top", pt: 1.5 }}>
                          {readOnly ? (
                            item.ghiChu || "-"
                          ) : (
                            <FieldInput
                              title="Nhập ghi chú"
                              formik={formik}
                              field={`chiTietsCCDC[${originalIndex}].ghiChu`}
                              disabled={readOnly}
                            />
                          )}
                        </TableCell>

                        {!readOnly && (
                          <TableCell
                            align="center"
                            sx={{ verticalAlign: "top", pt: 1.5 }}
                          >
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCCDC(originalIndex)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}

                  {readOnly && !hasCCDCData && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ py: 3, color: "text.secondary" }}
                      >
                        Chưa có CCDC - Vật tư nào được thêm
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
}
