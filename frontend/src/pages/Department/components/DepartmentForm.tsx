import {
  InfoOutlineRounded,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import { DepartmentValidation } from "../validation";
import ViewBtn from "../../../components/Button/ViewBtn";
import EditButton from "../../../components/Button/EditButton";
import { CongTy } from "../../../utils/const";

export default function DepartmentForm({
  onEdit,
  onCancel,
  selectedDepartment,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedDepartment?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: "",
      tenPhongBan: "",
      idCongTy: CongTy.CT001,
      isKho: false,
      isLanhDao: false,
      loaiKho: undefined as Number | undefined,
    },
    validationSchema: DepartmentValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedDepartment) {
      formik.setValues(selectedDepartment);
      formik.setErrors({}); // Clear errors when selectedDepartment changes
    } else {
      formik.resetForm();
    }
  }, [selectedDepartment, readOnly]); // Add readOnly to dependencies

  return (
    <Accordion sx={{ background: "#f6f8f4ff" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none", // Ngăn không cho xoay
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết phòng ban</Typography>
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
            <Typography>Thông tin phòng ban</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Mã phòng ban *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedDepartment)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Tên phòng ban *"
                formik={formik}
                field="tenPhongBan"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {/* Checkbox: Là kho */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>Là kho:</Typography>
                <Checkbox
                  name="isKho"
                  // Ép kiểu về boolean để checked hoạt động đúng
                  checked={Boolean(formik.values.isKho)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    formik.setFieldValue("isKho", isChecked);
                    // Nếu chọn là kho thì tự động bỏ chọn Lãnh đạo
                    if (isChecked) formik.setFieldValue("isLanhDao", false);
                    // Nếu bỏ chọn kho thì reset luôn loại kho
                    else formik.setFieldValue("loaiKho", undefined);
                  }}
                  disabled={readOnly}
                />
              </Box>

              {/* Phần chọn loại kho (Chỉ hiện khi isKho === 1) */}
              {formik.values.isKho && (
                <Box pl={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Kho cấp phát:</Typography>
                    <Checkbox
                      size="small"
                      checked={formik.values.loaiKho === 1}
                      onChange={() => formik.setFieldValue("loaiKho", 1)}
                      disabled={readOnly}
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Kho thu hồi:</Typography>
                    <Checkbox
                      size="small"
                      checked={formik.values.loaiKho === 2}
                      onChange={() => formik.setFieldValue("loaiKho", 2)}
                      disabled={readOnly}
                    />
                  </Box>
                </Box>
              )}

              {/* Checkbox: Là phòng ban lãnh đạo */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={1}
              >
                <Typography>Là phòng ban lãnh đạo:</Typography>
                <Checkbox
                  name="isLanhDao"
                  checked={Boolean(formik.values.isLanhDao)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    formik.setFieldValue("isLanhDao", isChecked);
                    // Nếu là lãnh đạo thì không thể là kho
                    if (isChecked) {
                      formik.setFieldValue("isKho", false);
                      formik.setFieldValue("loaiKho", undefined);
                    }
                  }}
                  disabled={readOnly}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
