import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
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
import CustomStepper from "../../../components/common/CustomStepper";
import FileAttachmentInput from "./FileAttachmentInput";

export default function AssetTransferForm({
  onEdit,
  onCancel,
  selectedTransfer,
  readOnly,
  onSave,
  label,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedTransfer?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  label?: string;
}) {
  const [expanded, setExpanded] = useState(true);

  // Styled Component cho nút Hủy Phiếu
  const CancelStatusBadge = styled(Box)(({ theme }) => ({
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "6px 16px",
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  }));

  // Styled Component cho vùng File Upload
  const FileUploadBox = styled(Box)(({ theme }) => ({
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
    "&:hover": { borderColor: "rgba(0, 0, 0, 0.87)" },
  }));

  const CustomTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    padding: "16px 8px",
    fontSize: "14px",
  }));

  const CustomTableHeadCell = styled(CustomTableCell)(({ theme }) => ({
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
    backgroundColor: "transparent",
  }));

  // Logic trạng thái
  const currentStatus = selectedTransfer?.TrangThai ?? 0; // 0: Nháp, 1: Duyệt, 2: Hủy, 3: Hoàn thành
  const isDraftOrNew = !selectedTransfer || currentStatus === 0;
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
      assets: [{ assetId: "", uom: "", quantity: 1, status: "", note: "" }],
    },
    onSubmit: (values) => onSave(values),
  });

  useEffect(() => {
    if (selectedTransfer) formik.setValues(selectedTransfer);
    else formik.resetForm();
  }, [selectedTransfer]);

  return (
    <Accordion
      sx={{
        background: "#f6f8f4ff",
        boxShadow: "none",
        margin: "0 !important",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: "0 !important" },
      }}
      expanded={expanded}
    >
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết {label}</Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          pt: 0,
          pb: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* THANH CÔNG CỤ: NÚT HÀNH ĐỘNG VÀ STEPPER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" gap={2}>
            {!isFormReadOnly && <SaveBtn onSave={formik.submitForm} />}
            {!isFormReadOnly && <CancelBtn onClick={onCancel} />}
            {isFormReadOnly && isDraftOrNew && <EditButton onClick={onEdit} />}
          </Box>

          {/* Tích hợp Component CustomStepper của bạn */}
          <CustomStepper activeStep={currentStatus} />
        </Box>

        {currentStatus === 2 && (
          <CancelStatusBadge>
            <Cancel fontSize="small" /> Hủy phiếu {label}
          </CancelStatusBadge>
        )}

        <Paper
          sx={{
            p: 3,
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          {/* --- PHẦN 1: THÔNG TIN CHUNG (Sử dụng Grid size MUI v7) --- */}
          <Grid container spacing={4}>
            {/* CỘT TRÁI */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <FieldInput
                    title="Số chứng từ *"
                    formik={formik}
                    field="SoQuyetDinh"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Tên phiếu *"
                    formik={formik}
                    field="TenPhieu"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Trích yếu *"
                    formik={formik}
                    field="TrichYeu"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldAutoCompleted
                    title="Đơn vị giao *"
                    labelkey="handovering-department"
                    data={[]}
                    formik={formik}
                    field="IdDonViGiao"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldAutoCompleted
                    title="Đơn vị nhận *"
                    labelkey="receiving-department"
                    data={[]}
                    formik={formik}
                    field="IdDonViNhan"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldDateTime
                    title="TGCN từ Ngày"
                    formik={formik}
                    field="TGGNTuNgay"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
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
                <Grid size={12}>
                  <FieldAutoCompleted
                    title="Đơn vị đề nghị *"
                    labelkey="requesting-department"
                    data={[]}
                    formik={formik}
                    field="IdDonViDeNghi"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12}>
                  <FieldInput
                    title="Người lập biểu *"
                    formik={formik}
                    field="IdNguoiLapPhieu"
                    disabled={true}
                  />
                </Grid>
                <Grid size={12}>
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
                <Grid size={12}>
                  <FieldAutoCompleted
                    title="Người duyệt *"
                    labelkey="room-approver"
                    data={[]}
                    formik={formik}
                    field="IdTrinhDuyetCapPhong"
                    disabled={isFormReadOnly}
                  />
                </Grid>
                <Grid size={12} sx={{ mt: 1 }}>
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
                <Grid size={12}>
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

            <FileAttachmentInput
              formik={formik}
              field="TenFile"
              disabled={isFormReadOnly}
            />
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
                        </Typography>
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
