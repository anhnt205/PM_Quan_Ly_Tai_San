import {
  InfoOutlineRounded,
  ArrowDropUp,
  ArrowDropDown,
  Remove,
  Close,
  ContentCopy,
  Delete,
  Add,
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
  Button,
  Card,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { AssetGroupValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";
import { CongTy } from "../../../utils/const";
import { useDebounce } from "../../../hooks/useDebounce";

interface BulkItem {
  id: string;
  tenNhom: string;
  idCongTy: string;
  errors?: Record<string, string>;
}

export default function AssetGroupForm({
  onEdit,
  onCancel,
  selectedAssetGroup,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
  isBulkMode = false,
  bulkItems = [],
  onBulkItemsChange,
  bulkEditType = "create",
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedAssetGroup?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
  onMinimize: () => void;
  isBulkMode?: boolean;
  bulkItems?: BulkItem[];
  onBulkItemsChange?: (items: BulkItem[]) => void;
  bulkEditType?: "create" | "edit";
}) {
  const [expanded, setExpanded] = useState(true);
  const [localBulkItems, setLocalBulkItems] = useState<BulkItem[]>(bulkItems);
  const debouncedBulkItems = useDebounce(localBulkItems, 600);
  useEffect(() => {
    onBulkItemsChange?.(debouncedBulkItems);
  }, [debouncedBulkItems]);

  // Single mode formik
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenNhom: initialFormData?.tenNhom ?? "",
      idCongTy: initialFormData?.idCongTy ?? CongTy.CT001,
    },
    validationSchema: AssetGroupValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedAssetGroup) {
      formik.setValues(selectedAssetGroup);
      formik.setErrors({});
    }
  }, [selectedAssetGroup, readOnly]);

  useEffect(() => {
    if (initialFormData?.items && initialFormData.items.length > 0) {
      setLocalBulkItems(initialFormData.items);
    }
  }, []);

  const validateBulkItems = async () => {
    const updatedItems = [...localBulkItems];
    let hasError = false;

    for (let i = 0; i < updatedItems.length; i++) {
      try {
        await AssetGroupValidation.validate(updatedItems[i]);
        updatedItems[i].errors = undefined;
      } catch (error: any) {
        hasError = true;
        updatedItems[i].errors = {
          [error.path]: error.message,
        };
      }
    }

    setLocalBulkItems(updatedItems);
    onBulkItemsChange?.(updatedItems);
    return { hasError, items: updatedItems };
  };

  const handleBulkSave = async () => {
    const { hasError } = await validateBulkItems();
    if (hasError) {
      return;
    }
    onSave(localBulkItems);
  };

  const handleAddItem = () => {
    const newItem: BulkItem = {
      id: "",
      tenNhom: "",
      idCongTy: CongTy.CT001,
    };
    const updatedItems = [...localBulkItems, newItem];
    setLocalBulkItems(updatedItems);
  };

  const handleCopyItem = (index: number) => {
    const itemToCopy = localBulkItems[index];
    const newItem: BulkItem = {
      ...itemToCopy,
      id: "",
    };
    const updatedItems = [
      ...localBulkItems.slice(0, index + 1),
      newItem,
      ...localBulkItems.slice(index + 1),
    ];
    setLocalBulkItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    if (localBulkItems.length === 1) return;
    const updatedItems = localBulkItems.filter((_, i) => i !== index);
    setLocalBulkItems(updatedItems);
  };

  const handleBulkItemChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedItems = [...localBulkItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setLocalBulkItems(updatedItems);
  };

  // Render single mode
  if (!isBulkMode) {
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
            Chi tiết nhóm tài sản
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

        {/* Thông tin */}
        <Paper sx={{ p: 2, borderRadius: "12px" }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <InfoOutlineRounded sx={{ color: "#1FA463" }} />
            <Typography sx={{ fontWeight: 600, color: "#1FA463" }}>
              Thông tin nhóm tài sản
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Mã nhóm tài sản *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedAssetGroup?.id)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Tên nhóm tài sản *"
                formik={formik}
                field="tenNhom"
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

  // Render bulk mode
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
            ? `Thêm mới nhóm tài sản (${localBulkItems.length})`
            : `Sửa hàng loạt nhóm tài sản (${localBulkItems.length})`}
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
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {localBulkItems.map((item, index) => (
          <Card
            key={index}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: item.errors ? "1px solid #d32f2f" : "1px solid #e0e0e0",
              backgroundColor: item.errors ? "#ffebee" : "#ffffff",
            }}
          >
            {/* Item Header */}
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

            {/* Item Fields */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Mã nhóm tài sản *"
                  value={item.id}
                  onChange={(e) =>
                    handleBulkItemChange(index, "id", e.target.value)
                  }
                  disabled={bulkEditType === "edit"}
                  error={!!item.errors?.id}
                  helperText={item.errors?.id}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Tên nhóm tài sản *"
                  value={item.tenNhom}
                  onChange={(e) =>
                    handleBulkItemChange(index, "tenNhom", e.target.value)
                  }
                  error={!!item.errors?.tenNhom}
                  helperText={item.errors?.tenNhom}
                  size="small"
                />
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>

      {/* Add Item Button */}
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
