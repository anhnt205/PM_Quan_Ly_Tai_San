import {
  Add,
  Close,
  ContentCopy,
  Delete,
  InfoOutlineRounded,
  Remove,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useRef } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { CongTy } from "../../../utils/const";
import { ModelAssetBulkValidation } from "../validation/Validation";

export interface ModelAssetItem {
  id: string;
  tenMoHinh: string;
  phuongPhapKhauHao?: number | string;
  kyKhauHao?: number | string;
  loaiKyKhauHao?: string;
  taiKhoanTaiSan?: string;
  taiKhoanKhauHao?: string;
  taiKhoanChiPhi?: string;
  idCongTy?: string;
}

export interface ModelAssetFormProps {
  /** "create" = thêm mới (hiện nút thêm/copy/xóa), "edit" = sửa (ẩn nút thêm/copy) */
  mode: "create" | "edit";
  initialItems?: ModelAssetItem[];
  onSave: (items: ModelAssetItem[]) => void;
  onCancel: () => void;
  onMinimize: () => void;
  onItemsChange?: (items: ModelAssetItem[]) => void;
  initialFormData?: any;
}

const phuongPhapOptions = [
  { id: 1, label: "Đường thẳng" },
  { id: 0, label: "Khác" },
];

const emptyItem = (): ModelAssetItem => ({
  id: "",
  tenMoHinh: "",
  phuongPhapKhauHao: 1,
  kyKhauHao: "",
  loaiKyKhauHao: "",
  taiKhoanTaiSan: "",
  taiKhoanKhauHao: "",
  taiKhoanChiPhi: "",
  idCongTy: CongTy.CT001,
});

const normalizeItem = (item: any): ModelAssetItem => ({
  id: item?.id ?? "",
  tenMoHinh: item?.tenMoHinh ?? "",
  phuongPhapKhauHao:
    item?.phuongPhapKhauHao !== undefined && item?.phuongPhapKhauHao !== null
      ? item.phuongPhapKhauHao
      : 1,
  kyKhauHao: item?.kyKhauHao ?? "",
  loaiKyKhauHao: item?.loaiKyKhauHao ?? "",
  taiKhoanTaiSan: item?.taiKhoanTaiSan ?? "",
  taiKhoanKhauHao: item?.taiKhoanKhauHao ?? "",
  taiKhoanChiPhi: item?.taiKhoanChiPhi ?? "",
  idCongTy: item?.idCongTy ?? CongTy.CT001,
});

export default function ModelAssetForm({
  mode = "create",
  initialItems,
  onSave,
  onCancel,
  onMinimize,
  onItemsChange,
  initialFormData,
}: ModelAssetFormProps) {
  const isEdit = mode === "edit";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      items:
        initialFormData?.items &&
        Array.isArray(initialFormData.items) &&
        initialFormData.items.length > 0
          ? initialFormData.items.map(normalizeItem)
          : initialItems && initialItems.length > 0
            ? initialItems.map(normalizeItem)
            : [emptyItem()],
    },
    validationSchema: ModelAssetBulkValidation,
    onSubmit: async (values) => {
      onSave(values.items);
    },
  });

  const onItemsChangeRef = useRef(onItemsChange);
  useEffect(() => {
    onItemsChangeRef.current = onItemsChange;
  });

  useEffect(() => {
    onItemsChangeRef.current?.(formik.values.items);
  }, [formik.values.items]);

  const listEndRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(formik.values.items.length);
  useEffect(() => {
    if (formik.values.items.length > prevLengthRef.current) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    prevLengthRef.current = formik.values.items.length;
  }, [formik.values.items.length]);

  const handleMinimize = () => {
    onItemsChange?.(formik.values.items);
    onMinimize();
  };

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        flex: 1,
        overflow: "hidden",
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
        <Box display="flex" alignItems="center" gap={1.5}>
          <InfoOutlineRounded sx={{ color: "#1FA463" }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1FA463" }}>
            {isEdit && formik.values.items.length === 1
              ? "Chỉnh sửa mô hình tài sản"
              : isEdit
                ? "Sửa hàng loạt mô hình tài sản"
                : "Thêm mới mô hình tài sản"}
          </Typography>
          <Chip
            label={`${formik.values.items.length} mô hình`}
            size="small"
            sx={{ bgcolor: "#e8f5e9", color: "#1FA463", fontWeight: 600 }}
          />
        </Box>
        <Box display="flex" gap={0.5}>
          <IconButton size="small" onClick={handleMinimize} title="Ẩn tạm">
            <Remove fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onCancel} title="Đóng">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Formik Provider & Danh sách items */}
      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <FieldArray name="items">
            {({ remove, push, insert }) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {formik.values.items.map((item: any, index: number) => (
                  <Card
                    key={index}
                    sx={{
                      p: 2,
                      flexShrink: 0,
                      borderRadius: "12px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {/* Header từng item */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "#1FA463",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: "#1FA463" }}>
                          {item.tenMoHinh || item.id || `Mô hình tài sản ${index + 1}`}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={0.5}>
                        {/* Sao chép: chỉ hiện khi tạo mới */}
                        {!isEdit && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              insert(index + 1, {
                                ...item,
                                id: "",
                              })
                            }
                            title="Sao chép"
                            sx={{ p: 0.5, color: "primary.main" }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        )}
                        {/* Xóa dòng: chỉ hiện khi có nhiều hơn 1 dòng */}
                        {formik.values.items.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={() => remove(index)}
                            title="Xóa dòng"
                            sx={{ p: 0.5, color: "error.main" }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>

                    {/* Các trường dữ liệu */}
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Mã mô hình *"
                          name={`items.${index}.id`}
                          disabled={isEdit}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Tên mô hình *"
                          name={`items.${index}.tenMoHinh`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldAutoCompleted
                          title="Phương pháp khấu hao"
                          name={`items.${index}.phuongPhapKhauHao`}
                          data={phuongPhapOptions}
                          labelkey="label"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Kỳ khấu hao"
                          name={`items.${index}.kyKhauHao`}
                          type="number"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Loại kỳ khấu hao"
                          name={`items.${index}.loaiKyKhauHao`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Tài khoản tài sản"
                          name={`items.${index}.taiKhoanTaiSan`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Tài khoản khấu hao"
                          name={`items.${index}.taiKhoanKhauHao`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FieldInput
                          title="Tài khoản chi phí"
                          name={`items.${index}.taiKhoanChiPhi`}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <div ref={listEndRef} />
              </Box>
            )}
          </FieldArray>

          {/* Footer */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pt={2.5}
            sx={{ borderTop: "1px solid #f1f5f9" }}
          >
            {/* Nút thêm dòng: chỉ hiện khi tạo mới */}
            {!isEdit ? (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  formik.setFieldValue("items", [
                    ...formik.values.items,
                    emptyItem(),
                  ]);
                }}
                sx={{
                  bgcolor: "#1FA463",
                  color: "#fff",
                  "&:hover": { bgcolor: "#178a52" },
                }}
              >
                Thêm dòng mới
              </Button>
            ) : (
              <Box />
            )}
            <Box display="flex" gap={2}>
              <CancelBtn onClick={onCancel} />
              <SaveBtn onSave={formik.submitForm} />
            </Box>
          </Box>
        </form>
      </FormikProvider>
    </Box>
  );
}
