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
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import EditButton from "../../../components/Button/EditButton";
import { ReasonIncreaseValidation } from "../validation/Validation";

export default function ReasonIncreaseForm({
  onEdit,
  onCancel,
  selectedReasonIncrease,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedReasonIncrease?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: "",
      ten: "",
      tangGiam: 0,
    },
    validationSchema: ReasonIncreaseValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedReasonIncrease) {
      formik.setValues(selectedReasonIncrease);
      formik.setErrors({}); // Clear errors when selectedReasonIncrease changes
    } else {
      formik.resetForm();
    }
  }, [selectedReasonIncrease, readOnly]); // Add readOnly to dependencies

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
          <Typography>Chi tiết lý do tăng</Typography>
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
            <Typography>Thông tin lý do tăng</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Mã lý do tăng *"
                formik={formik}
                field="id"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Tên lý do tăng *"
                formik={formik}
                field="ten"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <RadioGroup
                row
                name="tangGiam"
                value={formik.values.tangGiam}
                onChange={(e) => formik.setFieldValue("tangGiam", e.target.value)}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Tăng"
                  disabled={readOnly}
                />
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label="Giảm"
                  disabled={readOnly}
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
