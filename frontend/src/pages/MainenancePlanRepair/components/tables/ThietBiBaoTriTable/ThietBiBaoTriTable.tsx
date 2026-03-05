import {
  Paper,
  Box,
  Typography,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  TextField,
  Chip,
} from "@mui/material";
import {
  InfoOutlineRounded,
  Add,
  Delete,
  Lock,
  Visibility,
  VisibilityOff,
  Inventory,
} from "@mui/icons-material";
import { act, useState } from "react";
import FieldAutoCompleted from "../../../../../components/TextField/FieldAutoCompleted";
import { Action, Devicetype } from "../../../../../utils/const";

interface Props {
  formik: any;
  readOnly?: boolean;
  assets?: any[];
}

export default function ThietBiBaoTriTable({
  formik,
  readOnly = false,
  assets = [],
}: Props) {
  const [tableExpanded, setTableExpanded] = useState(true);

  const currentData = formik.values.chiTiets || [];
  const hasData = currentData.length > 0;

  const handleAddAsset = () => {
    const newAsset = {
      id: "",
      idKeHoach: "",
      idTaiSan: null,
      idCCDC: null,
      ghiChu: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("chiTiets", [newAsset, ...currentData]);
  };

  const handleDeleteAsset = (index: number) => {
    formik.setFieldValue(`chiTiets[${index}].action`, Action.DELETE);
  };

  // Helper validation cho ô đầu tiên
  const getErrorForRow = (index: number) => {
    const value = formik.values.chiTiets?.[index]?.idThietBi;
    const touched = formik.touched.chiTiets?.[index]?.idThietBi;
    if (!touched) return false;
    return !value || value.trim() === "";
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
      }}
    >
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
          <Typography fontWeight={500}>
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

      <Collapse in={tableExpanded}>
        <Box mb={2}>
          {/* ToggleButtonGroup kiểu pill với sliding background */}
          <ToggleButtonGroup
            value={formik.values.LoaiDoiTuong || Devicetype.ASSET}
            exclusive
            onChange={(_, val) => {
              if (val) formik.setFieldValue("LoaiDoiTuong", val);
            }}
            disabled={readOnly || hasData}
            sx={{
              position: "relative",
              bgcolor: "background.paper", // Nền trắng cho group
              borderRadius: "50px", // Pill shape ngoài cùng
              overflow: "hidden",
              border: "1px solid",
              borderColor: "success.main",
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                mx: 0, // Đưa mx về 0 để 2 nút dính sát vào nhau ở giữa
                px: 3,
                py: 0.75,
                fontWeight: 500,
                fontSize: "0.875rem",
                textTransform: "none",
                color: "success.main", // Chữ xanh khi không chọn
                transition: "color 0.3s ease",
                zIndex: 2,

                // Nút bên trái: Bo góc trái, vuông góc phải
                "&:first-of-type": {
                  borderRadius: "46px 0 0 46px !important",
                },
                // Nút bên phải: Vuông góc trái, bo góc phải
                "&:last-of-type": {
                  borderRadius: "0 46px 46px 0 !important",
                },

                "&.Mui-selected": {
                  color: "white", // Chữ trắng khi chọn
                  backgroundColor: "transparent !important", // Để indicator xử lý nền
                  boxShadow: "none",
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
              // Sliding indicator
              "&:after": {
                content: '""',
                position: "absolute",
                top: "4px",
                left: "4px",
                height: "calc(100% - 8px)",
                // Chiều rộng bằng đúng 1 nửa vùng không gian chứa nút (trừ đi padding 2 bên)
                width: "calc(50% - 4px)",
                backgroundColor: "success.main",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 1,

                // Đổi hình dáng của khối nền trượt cho khớp với nút bên dưới
                borderRadius:
                  formik.values.LoaiDoiTuong === Devicetype.TOOL
                    ? "0 46px 46px 0"
                    : "46px 0 0 46px",

                // Trượt sang phải một khoảng bằng chính chiều rộng của nó (100%)
                transform:
                  formik.values.LoaiDoiTuong === Devicetype.TOOL
                    ? "translateX(100%)"
                    : "translateX(0)",
              },
            }}
          >
            <ToggleButton
              value={Devicetype.ASSET}
              sx={{
                width: 200,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {hasData && formik.values.LoaiDoiTuong === Devicetype.ASSET && (
                  <Tooltip
                    title="Chỉ được chọn 1 trong 2 loại, vui lòng xóa tất cả các dòng đã thêm để có thể đổi loại"
                    placement="top"
                    arrow
                  >
                    <Lock sx={{ fontSize: 16 }} />
                  </Tooltip>
                )}
                Tài sản
              </Box>
            </ToggleButton>

            <ToggleButton
              value={Devicetype.TOOL}
              sx={{
                width: 200,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {hasData && formik.values.LoaiDoiTuong === Devicetype.TOOL && (
                  <Tooltip
                    title="Chỉ được chọn 1 trong 2 loại, vui lòng xóa tất cả các dòng đã thêm để có thể đổi loại"
                    placement="top"
                    arrow
                  >
                    <Lock sx={{ fontSize: 16 }} />
                  </Tooltip>
                )}
                CCDC - Vật tư
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "success.main" }}>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: 600, width: "50%" }}
                >
                  Thiết bị
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: 600, width: 150 }}
                >
                  Loại
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Ghi chú
                </TableCell>
                {!readOnly && (
                  <TableCell
                    align="center"
                    width={80}
                    sx={{ color: "white", fontWeight: 600 }}
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
                      borderBottom: hasData ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddAsset}
                      sx={{
                        py: 0.75,
                        borderStyle: "dashed",
                        "&:hover": {
                          borderStyle: "dashed",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Thêm thiết bị
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {currentData.filter((item: any) => item.action !== Action.DELETE).map((item: any, index: number) => {
                const isError = getErrorForRow(index);

                return (
                  <TableRow key={item.id || index}>
                    <TableCell sx={{ minWidth: 250 }}>
                      {readOnly ? (
                        formik.values.LoaiDoiTuong === Devicetype.TOOL ? (
                          item.tenCCDC || "-"
                        ) : (
                          item.tenTaiSan || "-"
                        )
                      ) : (
                        <FieldAutoCompleted
                          title={
                            formik.values.LoaiDoiTuong === Devicetype.TOOL
                              ? "Chọn thiết bị ccdc"
                              : "Chọn thiết bị tài sản"
                          }
                          data={assets}
                          labelkey={
                            formik.values.LoaiDoiTuong === Devicetype.TOOL
                              ? "tenCCDC"
                              : "tenTaiSan"
                          }
                          formik={formik}
                          field={
                            formik.values.LoaiDoiTuong === Devicetype.TOOL
                              ? `chiTiets[${index}].idCCDC`
                              : `chiTiets[${index}].idTaiSan`
                          }
                          disabled={readOnly}
                          limitOptions={20}
                        />
                      )}
                    </TableCell>

                    {/* Cột Loại dạng Chip vuông góc */}
                    <TableCell align="center">
                      {formik.values.LoaiDoiTuong === Devicetype.TOOL ? (
                        <Chip
                          icon={<Inventory fontSize="small" />}
                          label="CCDC - VT"
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{
                            borderRadius: "6px",
                            fontWeight: 500,
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<Inventory fontSize="small" />}
                          label="Tài sản"
                          size="small"
                          color="info"
                          variant="outlined"
                          sx={{
                            borderRadius: "6px",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      {readOnly ? (
                        item.ghiChu || "-"
                      ) : (
                        <TextField
                          size="small"
                          fullWidth
                          value={item.ghiChu || ""}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `chiTiets[${index}].ghiChu`,
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </TableCell>

                    {!readOnly && (
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteAsset(index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}

              {readOnly && !hasData && (
                <TableRow>
                  <TableCell
                    colSpan={readOnly ? 3 : 4}
                    align="center"
                    sx={{ py: 3, color: "text.secondary" }}
                  >
                    Chưa có thiết bị nào được thêm vào kế hoạch
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
}
