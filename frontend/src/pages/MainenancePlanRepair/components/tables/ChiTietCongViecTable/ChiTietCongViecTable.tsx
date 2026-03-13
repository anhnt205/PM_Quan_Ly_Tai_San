import { useState } from "react"; // Đã bỏ useEffect vì không cần tự thêm dòng
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  InfoOutlineRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { MaintenancePlanWorkItem } from "../../../types";
import { Formik } from "formik";
import dayjs from "dayjs";
import { Action } from "../../../../../utils/const";

interface Props {
  formik: any;
  readOnly?: boolean;
  staffs?: any[];
}

// Style Header đồng bộ với bảng Thiết bị
const headerStyle = {
  bgcolor: "success.main",
  color: "white",
  fontWeight: "bold",
  borderBottom: "none",
};

export default function ChiTietCongViecTable({
  formik,
  readOnly = false,
  staffs = [],
}: Props) {
  const [tableExpanded, setTableExpanded] = useState(true);
  const [editingWork, setEditingWork] =
    useState<MaintenancePlanWorkItem | null>(null);

  // 1. Logic Save: Nhận values từ Inner Formik và đẩy vào Main Formik
  const handleSaveWork = (values: MaintenancePlanWorkItem) => {
    if (!editingWork) return;

    const currentCongViecs = formik.values.congViecs || [];

    // Nếu là sửa dòng cũ: tìm theo ID hoặc so sánh object reference nếu là dòng mới tạo
    const isNew =
      !editingWork.id &&
      !currentCongViecs.some((w: any) => w.id === editingWork.id);

    const updated = currentCongViecs.map((w: any) =>
      w === editingWork ? { ...values } : w,
    );

    formik.setFieldValue("congViecs", updated);
    setEditingWork(null);
  };
  const currentData = formik.values.congViecs || [];
  const hasData = currentData.length > 0;

  // Logic Add: Chèn dòng mới lên đầu mảng và mở bảng nếu đang đóng
  const handleAddWork = () => {
    const newWork = {
      id: "",
      idKeHoach: "",
      tenCongViec: "",
      moTa: "",
      nguoiThucHien: "",
      thoiGianDuKien: 0,
      ngayThucHien: dayjs(new Date()).format("YYYY-MM-DD"),
      ngayTao: "",
      ngayCapNhat: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("congViecs", [newWork, ...currentData]);
    if (!tableExpanded) setTableExpanded(true);

    setEditingWork(newWork);
  };

  // Logic Delete
  const handleDeleteWork = (index: number) => {
    formik.setFieldValue(`congViecs[${index}].action`, Action.DELETE);
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
      {/* Header cho phép Click để Collapse */}
      <Box
        onClick={() => setTableExpanded(!tableExpanded)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          mb: tableExpanded ? 2 : 0,
        }}
      >
        {/* Cụm bên trái: Icon Info + Tiêu đề */}
        <Box display="flex" alignItems="center" gap={1}>
          <InfoOutlineRounded color="primary" />
          <Typography fontWeight={500}>Chi tiết công việc bảo trì</Typography>
        </Box>

        {/* Cụm bên phải: Chữ Thu gọn/Mở rộng + Icon Mắt */}
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
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          {/* Ép tableLayout: "fixed" để không giật khung */}
          <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ ...headerStyle, width: "25%" }}>
                  Tên công việc
                </TableCell>
                <TableCell align="center" sx={{ ...headerStyle, width: "25%" }}>
                  Mô tả
                </TableCell>
                <TableCell align="center" sx={{ ...headerStyle, width: 150 }}>
                  TG dự kiến (phút)
                </TableCell>
                <TableCell align="center" sx={{ ...headerStyle, width: 140 }}>
                  Ngày thực hiện
                </TableCell>
                <TableCell align="center" sx={{ ...headerStyle, width: 140 }}>
                  Người thực hiện
                </TableCell>
                {!readOnly && (
                  <TableCell align="center" sx={{ ...headerStyle, width: 100 }}>
                    Hành động
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Nút inline Thêm công việc nét đứt (Chỉ hiện khi chế độ Sửa) */}
              {!readOnly && (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
                      onClick={handleAddWork}
                      sx={{
                        py: 0.75,
                        borderStyle: "dashed",
                        "&:hover": {
                          borderStyle: "dashed",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Thêm công việc
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {/* Render danh sách công việc */}
              {hasData &&
                currentData
                  .filter((item: any) => item.action !== Action.DELETE)
                  .map((work: any, index: number) => (
                    <TableRow key={work.id || index}>
                      <TableCell>
                        {work.tenCongViec || (
                          <Typography
                            color="text.secondary"
                            fontStyle="italic"
                            fontSize="0.875rem"
                          >
                            Chưa đặt tên
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {work.moTa || "-"}
                      </TableCell>
                      <TableCell align="center">
                        {work.thoiGianDuKien || 0}
                      </TableCell>
                      <TableCell align="center">
                        {work.ngayThucHien || "-"}
                      </TableCell>
                      <TableCell align="center">
                        {work.nguoiThucHien || "-"}
                      </TableCell>
                      {!readOnly && (
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            {/* Nút Sửa */}
                            <IconButton
                              size="small"
                              onClick={() => setEditingWork(work)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            {/* Nút Xóa - Cho phép xóa tự do, không chặn khi chỉ còn 1 dòng */}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteWork(index)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

              {/* Thông báo trống: Chỉ hiện khi đang ở chế độ readOnly (vì chế độ Sửa đã có nút Thêm nét đứt bù đắp) */}
              {readOnly && !hasData && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    Chưa có công việc nào được thêm
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
      {/* Dialog chỉnh sửa công việc */}
      <Dialog
        open={editingWork !== null}
        onClose={() => setEditingWork(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa công việc bảo trì</DialogTitle>
        <Divider />

        {editingWork && (
          <Formik
            initialValues={editingWork} // Khởi tạo bằng dữ liệu của dòng đang chọn
            enableReinitialize // Quan trọng: để cập nhật lại khi chọn dòng khác
            onSubmit={(values) => handleSaveWork(values)}
          >
            {({ values, handleChange, setFieldValue, submitForm }) => (
              <>
                <DialogContent sx={{ pt: 2 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      name="tenCongViec" // Dùng name để handleChange tự bắt
                      label="Tên công việc"
                      value={values.tenCongViec}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      required
                    />

                    <TextField
                      name="moTa"
                      label="Mô tả"
                      value={values.moTa}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        name="thoiGianDuKien"
                        label="Thời gian dự kiến (phút)"
                        type="number"
                        value={values.thoiGianDuKien}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        name="ngayThucHien"
                        label="Ngày thực hiện"
                        type="date"
                        value={values.ngayThucHien}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        name="nguoiThucHien"
                        label="Người thực hiện"
                        value={values.nguoiThucHien}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                      />
                    </Box>
                  </Box>
                </DialogContent>

                <Divider />
                <DialogActions sx={{ px: 3, py: 1.5 }}>
                  <Button onClick={() => setEditingWork(null)} color="inherit">
                    Hủy
                  </Button>
                  <Button
                    onClick={submitForm}
                    variant="contained"
                    disabled={!values.tenCongViec?.trim()}
                  >
                    Lưu
                  </Button>
                </DialogActions>
              </>
            )}
          </Formik>
        )}
      </Dialog>
    </Paper>
  );
}
