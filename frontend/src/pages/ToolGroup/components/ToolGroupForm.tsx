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
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { ToolGroupValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";
import { CongTy } from "../../../utils/const";

export default function ToolGroupForm({
  onEdit,
  onCancel,
  selectedToolGroup,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedToolGroup?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: "",
      ten: "",
      idCongTy: CongTy.CT001,
    },
    validationSchema: ToolGroupValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedToolGroup) {
      formik.setValues(selectedToolGroup);
      formik.setErrors({}); // Clear errors when selectedToolGroup changes
    } else {
      formik.resetForm();
    }
  }, [selectedToolGroup, readOnly]);

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
          <Typography>Chi tiết nhóm ccdc</Typography>
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
            <Typography>Thông tin nhóm ccdc</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Mã nhóm ccdc *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedToolGroup?.id)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Tên nhóm ccdc *"
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
