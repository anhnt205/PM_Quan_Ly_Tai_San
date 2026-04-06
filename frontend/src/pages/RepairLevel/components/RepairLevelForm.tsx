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
} from "@mui/material";
import { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { RepairLevelValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";
import { RepairLevel } from "../types";

export default function RepairLevelForm({
  onEdit,
  onCancel,
  selectedRepairLevel,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedRepairLevel?: RepairLevel;
  readOnly: boolean;
  onSave: (values: RepairLevel) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik<RepairLevel>({
    initialValues: {
      id: "",
      kyHieu: "",
      ten: "",
      chuKyThucHien: "",
      soLanTrongChuKy: 0,
      thoiGianSuaChua: "",
      ghiChu: "",
    },
    validationSchema: RepairLevelValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedRepairLevel) {
      formik.setValues(selectedRepairLevel);
      formik.setErrors({});
    } else {
      formik.resetForm();
    }
  }, [selectedRepairLevel, readOnly]);

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
          <Typography>Chi tiết cấp sửa chữa</Typography>
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
            <Typography>Thông tin cấp sửa chữa</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Ký hiệu *"
                formik={formik}
                field="kyHieu"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Cấp sửa chữa bảo dưỡng *"
                formik={formik}
                field="ten"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Chu kỳ thực hiện (giờ máy) *"
                formik={formik}
                field="chuKyThucHien"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Số lần thực hiện trong 1 chu kỳ *"
                formik={formik}
                field="soLanTrongChuKy"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Thời gian dùng để sửa chữa *"
                formik={formik}
                field="thoiGianSuaChua"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Ghi chú"
                formik={formik}
                field="ghiChu"
                disabled={readOnly}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
