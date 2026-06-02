import {
  InfoOutlineRounded,
  ArrowDropDown,
  ArrowDropUp,
  Remove,
  Close,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import { MaintenanceRepairTypeValidation } from "../validation";
import ViewBtn from "../../../components/Button/ViewBtn";
import EditButton from "../../../components/Button/EditButton";
import { useDebounce } from "../../../hooks/useDebounce";

export default function MaintenanceRepairTypeForm({
  onEdit,
  onCancel,
  selectedRepairType,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedRepairType?: any;
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
      ghiChu: initialFormData?.ghiChu ?? "",
    },
    validationSchema: MaintenanceRepairTypeValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedRepairType) {
      formik.setValues(selectedRepairType);
      formik.setErrors({}); // Clear errors when selectedRepairType changes
    }
  }, [selectedRepairType, readOnly]); // Add readOnly to dependencies

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
          Chi tiết loại sửa chữa
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
            Thông tin loại sửa chữa
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Mã loại sửa chữa *"
              formik={formik}
              field="id"
              disabled={Boolean(selectedRepairType?.id)}
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
          <Grid size={{ xs: 12 }}>
            <FieldInput
              title="Ghi chú"
              formik={formik}
              field="ghiChu"
              disabled={readOnly}
            />
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
