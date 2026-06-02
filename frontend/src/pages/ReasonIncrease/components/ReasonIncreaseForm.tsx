import {
  InfoOutlineRounded,
  ArrowDropUp,
  ArrowDropDown,
  Remove,
  Close,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
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
import { useDebounce } from "../../../hooks/useDebounce";

export default function ReasonIncreaseForm({
  onEdit,
  onCancel,
  selectedReasonIncrease,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedReasonIncrease?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
  onMinimize: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      ten: initialFormData?.ten ?? "",
      tangGiam: initialFormData?.tangGiam ?? 0,
    },
    validationSchema: ReasonIncreaseValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedReasonIncrease) {
      formik.setValues(selectedReasonIncrease);
      formik.setErrors({}); // Clear errors when selectedReasonIncrease changes
    }
  }, [selectedReasonIncrease, readOnly]); // Add readOnly to dependencies

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1FA463" }}>
          Chi tiết lý do tăng
        </Typography>
        <Box display="flex" gap={0.5}>
          <IconButton size="small" onClick={onMinimize} title="Ẩn tạm">
            <Remove fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onCancel} title="Đóng">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Body */}
      <Paper sx={{ p: 2, borderRadius: "12px" }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <InfoOutlineRounded sx={{ color: "#1FA463" }} />
          <Typography sx={{ fontWeight: 600, color: "#1FA463" }}>
            Thông tin lý do tăng
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Mã lý do tăng *"
              formik={formik}
              field="id"
              disabled={Boolean(selectedReasonIncrease?.id)}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
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

      {/* Footer */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        pt={2.5}
        sx={{ borderTop: "1px solid #f1f5f9" }}
      >
        {readOnly ? (
          <EditButton onClick={onEdit} />
        ) : (
          <>
            <CancelBtn onClick={onCancel} />
            <SaveBtn onSave={formik.submitForm} />
          </>
        )}
      </Box>
    </Box>
  );
}
