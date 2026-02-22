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
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import { MaintenanceRepairTypeValidation } from "../validation";
import ViewBtn from "../../../components/Button/ViewBtn";
import EditButton from "../../../components/Button/EditButton";

export default function MaintenanceRepairTypeForm({
  onEdit,
  onCancel,
  selectedRepairType,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedRepairType?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: "",
      ten: "",
    },
    validationSchema: MaintenanceRepairTypeValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedRepairType) {
      formik.setValues(selectedRepairType);
      formik.setErrors({}); // Clear errors when selectedRepairType changes
    } else {
      formik.resetForm();
    }
  }, [selectedRepairType, readOnly]); // Add readOnly to dependencies

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
          <Typography>Chi tiết loại sửa chữa</Typography>
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
            <Typography>Thông tin loại sửa chữa</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Mã loại sửa chữa *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedRepairType)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Tên loại sửa chữa *"
                formik={formik}
                field="ten"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
