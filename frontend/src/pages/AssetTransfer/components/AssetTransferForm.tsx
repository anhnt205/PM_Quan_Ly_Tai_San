import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  styled,
  alpha,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ViewBtn from "../../../components/Button/ViewBtn";
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  CloudUpload,
  Delete,
  InfoOutlineRounded,
  Cancel,
  Description, // Icon file
  Visibility, // Icon xem trước
} from "@mui/icons-material";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldDateTime from "../../../components/TextField/FieldDateTime";

// Styled Component cho nút Hủy Phiếu (như ảnh 1)
const CancelStatusBadge = styled(Box)(({ theme }) => ({
  backgroundColor: "#f44336", // Màu đỏ cam
  color: "#fff",
  padding: "6px 16px",
  borderRadius: "20px", // Bo tròn 2 đầu
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  marginBottom: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
}));

// Styled Component cho vùng File Upload (như ảnh 2)
const FileUploadBox = styled(Box)(({ theme }) => ({
  border: "1px solid rgba(0, 0, 0, 0.23)",
  borderRadius: "4px",
  padding: "8px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "8px",
  "&:hover": {
    borderColor: "rgba(0, 0, 0, 0.87)",
  },
}));

// Styled cho Table Cell để giống ảnh 2 (chỉ gạch chân)
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid rgba(224, 224, 224, 1)",
  padding: "16px 8px", // Tăng padding dọc
  fontSize: "14px",
}));

const CustomTableHeadCell = styled(CustomTableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "transparent", // Nền trong suốt
}));

export default function AssetTransferForm({
  onEdit,
  onCancel,
  selectedTransfer,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedTransfer?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  // Logic kiểm tra xem có được phép sửa hay không
  // Giả sử trạng thái Nháp có mã là 0 hoặc null (khi tạo mới)
  const isDraftOrNew = !selectedTransfer || selectedTransfer.TrangThai === 0;
  // readOnly thực tế = props readOnly HOẶC không phải là Nháp/Mới
  const isFormReadOnly = readOnly || !isDraftOrNew;

  const formik = useFormik({
    initialValues: {
      Id: "",
      SoQuyetDinh: "",
      TenPhieu: "",
      TrichYeu: "",
      IdDonViGiao: "",
      IdDonViNhan: "",
      TGGNTuNgay: null,
      TGGNDenNgay: null,
      IdDonViDeNghi: "",
      IdNguoiKyNhay: "",
      NguoiLapPhieuKyNhay: true,
      IdTrinhDuyetCapPhong: "",
      IdTrinhDuyetGiamDoc: "",
      TenFile: "",
      assets: [
        {
          assetId: "",
          uom: "",
          quantity: 1,
          status: "",
          note: "",
        },
      ],
    },
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedTransfer) {
      formik.setValues(selectedTransfer);
    } else {
      formik.resetForm();
    }
  }, [selectedTransfer]);

  return (
    <Accordion
      sx={{ background: "#f6f8f4ff", boxShadow: "none" }}
      expanded={expanded}
    >
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none",
          },
          px: 0, // Bỏ padding ngang mặc định để thẳng hàng
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography fontWeight={600}>Chi tiết cấp phát tài sản</Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 0 }}>
        {/* Nhóm Nút Hành Động */}
        <Box display="flex" gap={2} mb={2}>
          {!isFormReadOnly && <SaveBtn onSave={formik.submitForm} />}
          {!isFormReadOnly && <CancelBtn onClick={onCancel} />}
          {isFormReadOnly && isDraftOrNew && <EditButton onClick={onEdit} />}
        </Box>

        {/* Thanh trạng thái Hủy phiếu (Chỉ hiện nếu trạng thái là Hủy - ví dụ mã 2) */}
        {selectedTransfer?.TrangThai === 2 && (
          <CancelStatusBadge>
            <Cancel fontSize="small" />
            Hủy phiếu Cấp phát tài sản
          </CancelStatusBadge>
        )}

        <Paper
          sx={{
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          {/* --- PHẦN 1: THÔNG TIN CHUNG --- */}
          <Grid container spacing={4}>
            {/* CỘT TRÁI */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số chứng từ *"
                    formik={formik}
                    field="SoQuyetDinh"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên phiếu *"
                    formik={formik}
                    field="TenPhieu"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Trích yếu *"
                    formik={formik}
                    field="TrichYeu"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị giao *"
                    labelkey="handovering-department"
                    data={[]}
                    formik={formik}
                    field="IdDonViGiao"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị nhận *"
                    labelkey="receiving-department"
                    data={[]}
                    formik={formik}
                    field="IdDonViNhan"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="TGCN từ Ngày"
                    formik={formik}
                    field="TGGNTuNgay"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="TGCN đến Ngày"
                    formik={formik}
                    field="TGGNDenNgay"
                    disabled={isFormReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* CỘT PHẢI */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị đề nghị *"
                    labelkey="requesting-department"
                    data={[]}
                    formik={formik}
                    field="IdDonViDeNghi"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Người lập biểu *"
                    formik={formik}
                    field="IdNguoiLapPhieu"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography fontSize={14} color="text.secondary">
                      Người lập phiếu ký nháy :
                    </Typography>
                    <Checkbox
                      checked={formik.values.NguoiLapPhieuKyNhay}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "NguoiLapPhieuKyNhay",
                          e.target.checked
                        )
                      }
                      disabled={isFormReadOnly}
                      color="primary"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Người duyệt *"
                    labelkey="room-approver"
                    data={[]}
                    formik={formik}
                    field="IdTrinhDuyetCapPhong"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                  {" "}
                  {/* Thêm margin top để nút "Thêm người ký" cách ra chút */}
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    startIcon={<Add />}
                    disabled={isFormReadOnly}
                    sx={{
                      bgcolor: "#e0e0e0",
                      color: "#000",
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Thêm người ký
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Người phê duyệt *"
                    labelkey="approver"
                    data={[]}
                    formik={formik}
                    field="IdTrinhDuyetGiamDoc"
                    disabled={isFormReadOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* --- PHẦN 2: TÀI LIỆU QUYẾT ĐỊNH --- */}
          <Box mt={4} mb={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Tài liệu Quyết định
            </Typography>
            <FileUploadBox>
              {formik.values.TenFile ? (
                <Chip
                  icon={<Description color="success" />}
                  label={formik.values.TenFile}
                  onDelete={
                    !isFormReadOnly
                      ? () => formik.setFieldValue("TenFile", "")
                      : undefined
                  }
                  variant="outlined"
                  sx={{
                    border: "none",
                    bgcolor: "transparent",
                    "& .MuiChip-label": { fontSize: "14px" },
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Chưa có tài liệu đính kèm...
                </Typography>
              )}

              <Box>
                {formik.values.TenFile && (
                  <Typography variant="caption" color="text.secondary" mr={2}>
                    Định dạng hỗ trợ: .pdf, .docx
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="small"
                  component="label"
                  disabled={isFormReadOnly}
                  sx={{
                    bgcolor: "#bdbdbd",
                    color: "#000",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#9e9e9e" },
                  }}
                  startIcon={<CloudUpload />}
                >
                  Chọn tệp <input type="file" hidden />
                </Button>
              </Box>
            </FileUploadBox>
          </Box>

          {/* --- PHẦN 3: CHI TIẾT TÀI SẢN --- */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Chi tiết tài sản điều chuyển:
            </Typography>

            <Table
              size="small"
              sx={{
                "& .MuiTableCell-root": { borderBottom: "1px solid #e0e0e0" },
              }}
            >
              <TableHead>
                <TableRow>
                  <CustomTableHeadCell width="25%">Tài sản</CustomTableHeadCell>
                  <CustomTableHeadCell width="15%">
                    Đơn vị tính
                  </CustomTableHeadCell>
                  <CustomTableHeadCell width="15%">
                    Số lượng
                  </CustomTableHeadCell>
                  <CustomTableHeadCell width="20%">
                    Tình trạng kỹ thuật
                  </CustomTableHeadCell>
                  <CustomTableHeadCell width="20%">Ghi chú</CustomTableHeadCell>
                  {!isFormReadOnly && (
                    <CustomTableHeadCell width="5%"></CustomTableHeadCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.assets.map((row, index) => (
                  <TableRow key={index}>
                    <CustomTableCell>
                      {isFormReadOnly ? (
                        <Typography variant="body2">
                          {row.assetId || "-"}
                        </Typography> // Hiển thị text khi ReadOnly
                      ) : (
                        <FieldAutoCompleted
                          title=""
                          labelkey=""
                          data={[]}
                          formik={formik}
                          field={`assets.${index}.assetId`}
                        />
                      )}
                    </CustomTableCell>
                    <CustomTableCell>
                      {isFormReadOnly ? (
                        <Typography variant="body2">
                          {row.uom || "-"}
                        </Typography>
                      ) : (
                        <FieldInput
                          title=""
                          formik={formik}
                          field={`assets.${index}.uom`}
                          disabled={true}
                        />
                      )}
                    </CustomTableCell>
                    <CustomTableCell>
                      {isFormReadOnly ? (
                        <Typography variant="body2">{row.quantity}</Typography>
                      ) : (
                        <FieldInput
                          title=""
                          type="number"
                          formik={formik}
                          field={`assets.${index}.quantity`}
                        />
                      )}
                    </CustomTableCell>
                    <CustomTableCell>
                      {isFormReadOnly ? (
                        <Typography variant="body2">
                          {row.status || "-"}
                        </Typography>
                      ) : (
                        <FieldInput
                          title=""
                          formik={formik}
                          field={`assets.${index}.status`}
                        />
                      )}
                    </CustomTableCell>
                    <CustomTableCell>
                      {isFormReadOnly ? (
                        <Typography variant="body2">
                          {row.note || "-"}
                        </Typography>
                      ) : (
                        <FieldInput
                          title=""
                          formik={formik}
                          field={`assets.${index}.note`}
                        />
                      )}
                    </CustomTableCell>
                    {!isFormReadOnly && (
                      <CustomTableCell align="center">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            const newAssets = [...formik.values.assets];
                            newAssets.splice(index, 1);
                            formik.setFieldValue("assets", newAssets);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </CustomTableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Nút "Thêm tài sản" - Chỉ hiện khi không phải ReadOnly */}
            {!isFormReadOnly && (
              <Box mt={2}>
                <Button
                  startIcon={<Add />}
                  variant="text"
                  onClick={() => {
                    formik.setFieldValue("assets", [
                      ...formik.values.assets,
                      {
                        assetId: "",
                        uom: "",
                        quantity: 1,
                        status: "Đang sử dụng",
                        note: "",
                      },
                    ]);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Thêm một dòng
                </Button>
              </Box>
            )}

            {/* Link "Xem trước tài liệu" */}
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ cursor: "pointer", color: "#1976d2" }}
            >
              <Typography variant="body2">Xem trước tài liệu</Typography>
              <Visibility fontSize="small" />
            </Box>
          </Box>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
