import { InfoOutlineRounded, Remove, Close } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import EditButton from "../../../components/Button/EditButton";
import { useDebounce } from "../../../hooks/useDebounce";
import * as Yup from "yup";
import { RepairReportValidation } from "../validation";
import StepPreview from "../../Maintenance/components/step/StepPreview";

interface MauBienBanSuaChua {
  id?: string;
  ma: string;
  ten: string;
  macDinh: boolean;
}

export default function RepairReportForm({
  onEdit,
  onCancel,
  editData,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
}: {
  onEdit: () => void;
  onCancel: () => void;
  editData?: MauBienBanSuaChua | null;
  readOnly: boolean;
  onSave: (values: MauBienBanSuaChua) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
  onMinimize: () => void;
}) {
  const formik = useFormik<MauBienBanSuaChua>({
    initialValues: {
      ma: initialFormData?.ma ?? "",
      ten: initialFormData?.ten ?? "",
      macDinh: initialFormData?.macDinh ?? false,
    },
    validationSchema: RepairReportValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    if (!editData) {
      onFormChange?.(debouncedValues);
    }
  }, [debouncedValues]);

  useEffect(() => {
    if (editData) {
      formik.setValues(editData);
      formik.setErrors({});
    }
  }, [editData, readOnly]);

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 11,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1FA463" }}>
            Mẫu biên bản sửa chữa
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
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Grid container spacing={2}>
          {/* Row 1: fields ngang hàng */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FieldInput
              title="Mã *"
              formik={formik}
              field="ma"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FieldInput
              title="Tên *"
              formik={formik}
              field="ten"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.macDinh}
                  onChange={(e) =>
                    formik.setFieldValue("macDinh", e.target.checked)
                  }
                  disabled={readOnly}
                />
              }
              label="Mặc định"
            />
          </Grid>

          {/* Row 2: preview full width */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#1FA463", mb: 1 }}
            >
              Xem trước mẫu
            </Typography>
            <StepPreview
              idDonViGiao=""
              idDonViNhan=""
              assets={[]}
              signers={[]}
              deptDevices={{ items: [] }}
              departments={[]}
              tenMau={formik.values.ten}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        p={2}
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
