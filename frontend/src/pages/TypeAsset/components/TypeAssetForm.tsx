import {
  InfoOutlineRounded,
  Remove,
  Close,
  Add,
  Delete,
  ContentCopy,
} from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
  Autocomplete,
  Button,
  Card,
  TextField as MuiTextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import { TypeAssetValidation } from "../validation/Validation";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import EditButton from "../../../components/Button/EditButton";
import { useAllAssetGroupQuery } from "../Mutation";
import { useDebounce } from "../../../hooks/useDebounce";

export default function TypeAssetForm({
  onEdit,
  onCancel,
  selectedTypeAsset,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
  isBulkMode,
  bulkItems,
  onBulkItemsChange,
  bulkEditType,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedTypeAsset?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
  onMinimize: () => void;
  isBulkMode?: boolean;
  bulkItems?: any[];
  onBulkItemsChange?: (items: any[]) => void;
  bulkEditType?: "create" | "edit";
}) {
  const { data: assetGroups = [] } = useAllAssetGroupQuery();
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenLoai: initialFormData?.tenLoai ?? "",
      idLoaiTs: initialFormData?.idLoaiTs ?? "",
    },
    validationSchema: TypeAssetValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedTypeAsset) {
      formik.setValues(selectedTypeAsset);
      formik.setErrors({});
    }
  }, [selectedTypeAsset, readOnly]);

  const [localBulkItems, setLocalBulkItems] = useState<any[]>(bulkItems ?? []);

  const debouncedBulkItems = useDebounce(localBulkItems, 600);
  useEffect(() => {
    onBulkItemsChange?.(debouncedBulkItems);
  }, [debouncedBulkItems]);

  useEffect(() => {
    if (
      initialFormData?.items &&
      Array.isArray(initialFormData.items) &&
      initialFormData.items.length > 0
    ) {
      setLocalBulkItems(initialFormData.items);
    }
  }, []);

  const handleAddItem = () => {
    const newItem = { id: "", tenLoai: "", idLoaiTs: "" };
    const updated = [...localBulkItems, newItem];
    setLocalBulkItems(updated);
  };

  const handleCopyItem = (index: number) => {
    const { id, ...rest } = localBulkItems[index];
    const newItem = { ...rest, id: "" };
    const updated = [
      ...localBulkItems.slice(0, index + 1),
      newItem,
      ...localBulkItems.slice(index + 1),
    ];
    setLocalBulkItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    if (localBulkItems.length === 1) return;
    const updated = localBulkItems.filter((_, i) => i !== index);
    setLocalBulkItems(updated);
  };

  const handleBulkItemChange = (index: number, field: string, value: any) => {
    const updated = [...localBulkItems];
    updated[index] = { ...updated[index], [field]: value };
    setLocalBulkItems(updated);
  };

  const validateBulkItems = async () => {
    let hasError = false;
    const updated = await Promise.all(
      localBulkItems.map(async (item) => {
        try {
          await TypeAssetValidation.validate(item);
          return { ...item, errors: undefined };
        } catch (error: any) {
          hasError = true;
          return { ...item, errors: { [error.path]: error.message } };
        }
      }),
    );
    setLocalBulkItems(updated);
    onBulkItemsChange?.(updated);
    return { hasError, items: updated };
  };

  const handleBulkSave = async () => {
    const { hasError } = await validateBulkItems();
    if (hasError) return;
    onSave(localBulkItems);
  };

  if (isBulkMode) {
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
            {bulkEditType === "create"
              ? `Thêm mới loại tài sản (${localBulkItems.length})`
              : `Sửa hàng loạt loại tài sản (${localBulkItems.length})`}
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

        {/* Items */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "65vh",
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
          }}
        >
          {localBulkItems.map((item, index) => (
            <Card
              key={index}
              sx={{
                flexShrink: 0,
                p: 2,
                borderRadius: "12px",
                border: item.errors ? "1px solid #d32f2f" : "1px solid #e0e0e0",
                backgroundColor: item.errors ? "#ffebee" : "#ffffff",
              }}
            >
              {/* Card Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography sx={{ fontWeight: 600, color: "#1FA463" }}>
                  Item {index + 1}
                </Typography>
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyItem(index)}
                    title="Sao chép"
                  >
                    <ContentCopy fontSize="small" color="primary" />
                  </IconButton>
                  {localBulkItems.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(index)}
                      title="Xóa"
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Fields */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MuiTextField
                    fullWidth
                    size="small"
                    label="Mã loại tài sản *"
                    value={item.id}
                    onChange={(e) =>
                      handleBulkItemChange(index, "id", e.target.value)
                    }
                    disabled={bulkEditType === "edit"}
                    error={!!item.errors?.id}
                    helperText={item.errors?.id}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MuiTextField
                    fullWidth
                    size="small"
                    label="Tên loại tài sản *"
                    value={item.tenLoai}
                    onChange={(e) =>
                      handleBulkItemChange(index, "tenLoai", e.target.value)
                    }
                    error={!!item.errors?.tenLoai}
                    helperText={item.errors?.tenLoai}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    size="small"
                    options={assetGroups}
                    getOptionLabel={(option: any) => option.tenNhom ?? ""}
                    value={
                      assetGroups.find((g: any) => g.id === item.idLoaiTs) ??
                      null
                    }
                    onChange={(_, newValue) =>
                      handleBulkItemChange(
                        index,
                        "idLoaiTs",
                        newValue?.id ?? "",
                      )
                    }
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        label="Mã loại tài sản cha *"
                        error={!!item.errors?.idLoaiTs}
                        helperText={item.errors?.idLoaiTs}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>
          ))}
        </Box>

        {/* Add button */}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddItem}
          sx={{
            alignSelf: "flex-start",
            textTransform: "none",
            borderColor: "#1FA463",
            color: "#1FA463",
            "&:hover": {
              borderColor: "#1FA463",
              backgroundColor: "rgba(31, 164, 99, 0.04)",
            },
          }}
        >
          Thêm item
        </Button>

        {/* Footer */}
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          pt={2.5}
          sx={{ borderTop: "1px solid #f1f5f9" }}
        >
          <CancelBtn onClick={onCancel} />
          <SaveBtn onSave={handleBulkSave} />
        </Box>
      </Box>
    );
  }

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
          Chi tiết loại tài sản
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
            Thông tin loại tài sản
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Mã loại tài sản *"
              formik={formik}
              field="id"
              disabled={Boolean(selectedTypeAsset?.id)}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldInput
              title="Tên loại tài sản *"
              formik={formik}
              field="tenLoai"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FieldAutoCompleted
              title="Mã loại tài sản cha *"
              data={assetGroups}
              labelkey="tenNhom"
              formik={formik}
              field="idLoaiTs"
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
