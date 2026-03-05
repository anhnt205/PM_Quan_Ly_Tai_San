import {
  InfoOutlineRounded,
  ArrowDropUp,
  ArrowDropDown,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { ModelAssetValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";
import { CongTy } from "../../../utils/const";

export default function ModelAssetForm({
  onEdit,
  onCancel,
  selectedModelAsset,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedModelAsset?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: "",
      tenMoHinh: "",
      phuongPhapKhauHao: "",
      kyKhauHao: "",
      loaiKyKhauHao: "",
      taiKhoanTaiSan: "",
      taiKhoanKhauHao: "",
      taiKhoanChiPhi: "",
      idCongTy: CongTy.CT001,
    },
    validationSchema: ModelAssetValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const phuongPhapOptions = [
    { value: 1, label: "Đường thẳng" },
    { value: 0, label: "Khác" },
  ];

  useEffect(() => {
    if (selectedModelAsset) {
      formik.setValues(selectedModelAsset);
      formik.setErrors({});
    } else {
      formik.resetForm();
    }
  }, [selectedModelAsset, readOnly]);

  return (
    <Accordion sx={{ background: "#f6f8f4ff" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết mô hình tài sản</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" gap={2}>
          {!readOnly && <SaveBtn onSave={formik.submitForm} />}
          {!readOnly && <CancelBtn onClick={onCancel} />}
          {readOnly && <EditButton onClick={onEdit} />}
        </Box>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin mô hình tài sản</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Mã mô hình *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedModelAsset?.id)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Tên mô hình *"
                formik={formik}
                field="tenMoHinh"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                size="small"
                error={
                  formik.touched.phuongPhapKhauHao &&
                  Boolean(formik.errors.phuongPhapKhauHao)
                }
              >
                <InputLabel>Phương pháp khấu hao</InputLabel>
                <Select
                  name="phuongPhapKhauHao"
                  value={formik.values.phuongPhapKhauHao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={readOnly}
                  label="Phương pháp khấu hao"
                >
                  <MenuItem value={1}>Đường thẳng</MenuItem>
                  <MenuItem value={0}>Khác</MenuItem>
                </Select>
                {formik.touched.phuongPhapKhauHao &&
                  formik.errors.phuongPhapKhauHao && (
                    <FormHelperText>
                      {formik.errors.phuongPhapKhauHao}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Kỳ khấu hao"
                formik={formik}
                field="kyKhauHao"
                disabled={readOnly}
                type="number"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Loại kỳ khấu hao"
                formik={formik}
                field="loaiKyKhauHao"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Tài khoản tài sản"
                formik={formik}
                field="taiKhoanTaiSan"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Tài khoản khấu hao"
                formik={formik}
                field="taiKhoanKhauHao"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldInput
                title="Tài khoản chi phí"
                formik={formik}
                field="taiKhoanChiPhi"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
