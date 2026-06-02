import {
  Close,
  InfoOutlineRounded,
  Remove
} from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import SaveBtn from "../../../components/Button/SaveBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldInput from "../../../components/TextField/FieldInput";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  useAllToolGroupQuery
} from "../../ToolGroup/Mutation";
import { ToolTypeValidation } from "../validation/Validation";

export default function ToolTypeForm({
  onEdit,
  onCancel,
  selectedToolType,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedToolType?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
  onMinimize: () => void;
}) {
  const { data: allToolGroup = [] } = useAllToolGroupQuery();
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenLoai: initialFormData?.tenLoai ?? "",
      idLoaiCCDC: initialFormData?.idLoaiCCDC ?? "",
    },
    validationSchema: ToolTypeValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedToolType) {
      formik.setValues(selectedToolType);
      formik.setErrors({});
    }
  }, [selectedToolType, readOnly]);

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
          Chi tiết loại CCDC
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
            Thông tin loại CCDC
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Mã loại CCDC *"
              formik={formik}
              field="id"
              disabled={Boolean(selectedToolType?.id)}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Tên loại CCDC *"
              formik={formik}
              field="tenLoai"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FieldAutoCompleted
              title="Mã loại CCDC cha *"
              data={allToolGroup}
              labelkey="ten"
              formik={formik}
              field="idLoaiCCDC"
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
