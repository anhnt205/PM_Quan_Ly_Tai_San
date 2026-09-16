import {
  Add,
  Close,
  Delete,
  InfoOutlineRounded,
  Remove,
  Security,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
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
import { useFormik, FieldArray, FormikProvider } from "formik";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import UploadButton from "../../../components/Button/UploadButton";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { useAllPositionsQuery } from "../../Position/Mutation";
import { useAllDepartmentsQuery } from "../../Department/Mutation";
import { CongTy } from "../../../utils/const";
import { StaffType } from "../types";
import { StaffBulkValidation } from "../validation/Validation";

const defaultRow: StaffType = {
  id: "",
  hoTen: "",
  diDong: "",
  emailCongViec: "",
  kyNhay: false,
  kyThuong: false,
  kySo: false,
  chuKyNhay: "",
  chuKyThuong: "",
  agreementUUId: "",
  pin: "",
  boPhan: "",
  chucVu: "",
  laQuanLy: true,
  idCongTy: CongTy.CT001,
  isActive: true,
  savePin: false,
};

/** Panel quyền ký duyệt dùng chung cho từng dòng nhân viên */
function SignaturePanel({
  index,
  item,
  formik,
  readOnly = false,
}: {
  index: number;
  item: any;
  formik: any;
  readOnly?: boolean;
}) {
  const [showPin, setShowPin] = useState(false);

  const handleFileSelect = (fieldPath: string, fileKey: string) => {
    formik.setFieldValue(fieldPath, fileKey);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: "12px",
        bgcolor: "#fcfdfe",
        borderColor: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        mt: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={1.2}>
        <Security sx={{ color: "#1FA463", fontSize: "20px" }} />
        <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1FA463" }}>
          Quyền ký duyệt
        </Typography>
      </Box>

      {/* Ký nháy */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          pb: item?.kyNhay ? 2 : 0,
          borderBottom: item?.kyNhay ? "1px dashed #e2e8f0" : "none",
        }}
      >
        <Box display="flex" alignItems="center">
          <Checkbox
            name={`items.${index}.kyNhay`}
            checked={item?.kyNhay || false}
            onChange={(e) =>
              !readOnly &&
              formik.setFieldValue(`items.${index}.kyNhay`, e.target.checked)
            }
            disabled={readOnly}
            sx={{ color: "#e2e8f0", p: 0, mr: 1.5, "&.Mui-checked": { color: "#1FA463" } }}
          />
          <Typography sx={{ fontWeight: 500, color: "#334155" }}>Ký nháy</Typography>
        </Box>
        {item?.kyNhay && (
          <Box sx={{ pl: 4, width: "100%" }}>
            <UploadButton
              label="Nhấn để chọn file chữ ký nháy (.png, .jpg...)"
              disabled={readOnly}
              name={`items.${index}.chuKyNhay`}
              onChange={(fileKey: string) =>
                handleFileSelect(`items.${index}.chuKyNhay`, fileKey)
              }
              nameFile={item?.chuKyNhay}
            />
          </Box>
        )}
      </Box>

      {/* Ký thường */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          pb: item?.kyThuong ? 2 : 0,
          borderBottom: item?.kyThuong ? "1px dashed #e2e8f0" : "none",
        }}
      >
        <Box display="flex" alignItems="center">
          <Checkbox
            name={`items.${index}.kyThuong`}
            checked={item?.kyThuong || false}
            onChange={(e) =>
              !readOnly &&
              formik.setFieldValue(`items.${index}.kyThuong`, e.target.checked)
            }
            disabled={readOnly}
            sx={{ color: "#e2e8f0", p: 0, mr: 1.5, "&.Mui-checked": { color: "#1FA463" } }}
          />
          <Typography sx={{ fontWeight: 500, color: "#334155" }}>Ký thường</Typography>
        </Box>
        {item?.kyThuong && (
          <Box sx={{ pl: 4, width: "100%" }}>
            <UploadButton
              label="Nhấn để chọn file chữ ký thường (.png, .jpg...)"
              disabled={readOnly}
              name={`items.${index}.chuKyThuong`}
              onChange={(fileKey: string) =>
                handleFileSelect(`items.${index}.chuKyThuong`, fileKey)
              }
              nameFile={item?.chuKyThuong}
            />
          </Box>
        )}
      </Box>

      {/* Ký số */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box display="flex" alignItems="center">
          <Checkbox
            name={`items.${index}.kySo`}
            checked={item?.kySo || false}
            onChange={(e) =>
              !readOnly &&
              formik.setFieldValue(`items.${index}.kySo`, e.target.checked)
            }
            disabled={readOnly}
            sx={{ color: "#e2e8f0", p: 0, mr: 1.5, "&.Mui-checked": { color: "#1FA463" } }}
          />
          <Typography sx={{ fontWeight: 500, color: "#334155" }}>Ký số</Typography>
        </Box>
        {item?.kySo && (
          <Box sx={{ pl: 4, display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Agreement UUID"
                  name={`items.${index}.agreementUUId`}
                  value={item?.agreementUUId || ""}
                  onChange={!readOnly ? formik.handleChange : undefined}
                  InputProps={{ sx: { borderRadius: "8px" }, readOnly }}
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="PIN"
                  type={showPin ? "text" : "password"}
                  name={`items.${index}.pin`}
                  value={item?.pin || ""}
                  onChange={!readOnly ? formik.handleChange : undefined}
                  InputProps={{
                    sx: { borderRadius: "8px" },
                    readOnly,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPin(!showPin)}
                          edge="end"
                          disabled={readOnly}
                        >
                          {showPin ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={readOnly}
                />
              </Grid>
            </Grid>
            <Box display="flex" alignItems="center" gap={1.2}>
              <Checkbox
                name={`items.${index}.savePin`}
                checked={item?.savePin || false}
                onChange={(e) =>
                  !readOnly &&
                  formik.setFieldValue(`items.${index}.savePin`, e.target.checked)
                }
                disabled={readOnly}
                sx={{ color: "#e2e8f0", p: 0, "&.Mui-checked": { color: "#1FA463" } }}
              />
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                Lưu mã PIN
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default function StaffBulkForm({
  mode = "add",
  onCancel,
  onMinimize,
  onSave,
  initialItems,
  onFormChange,
  initialFormData,
}: {
  mode?: "add" | "edit";
  onCancel: () => void;
  onMinimize?: () => void;
  onSave: (items: StaffType[]) => void;
  initialItems?: StaffType[];
  onFormChange?: (values: any) => void;
  initialFormData?: any;
}) {
  const { data: allPositions = [] } = useAllPositionsQuery();
  const { data: allDepartments = [] } = useAllDepartmentsQuery();

  const isEdit = mode === "edit";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialFormData || {
      items:
        initialItems && initialItems.length > 0
          ? initialItems.map((item) => ({ ...defaultRow, ...item }))
          : [{ ...defaultRow }],
    },
    validationSchema: StaffBulkValidation,
    onSubmit: async (values) => {
      onSave(values.items);
    },
  });

  useEffect(() => {
    if (!initialFormData && initialItems && initialItems.length > 0) {
      formik.setValues({
        items: initialItems.map((item: any) => ({
          ...defaultRow,
          ...item,
          boPhan: item?.phongBanId,
          chucVu: item?.chucVuId,
        })),
      });
    }
  }, [initialItems, initialFormData]);

  useEffect(() => {
    onFormChange?.(formik.values);
  }, [formik.values]);

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          transition: "all 0.2s",
          "& fieldset": { borderColor: "#e2e8f0" },
          "&:hover fieldset": { borderColor: "#1FA463" },
          "&.Mui-focused fieldset": { borderColor: "#1FA463", borderWidth: "1.5px" },
        },
        "& .MuiInputLabel-root": {
          color: "#64748b",
          "&.Mui-focused": { color: "#1FA463" },
        },
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
          {isEdit ? "Sửa nhiều nhân viên" : "Thêm nhiều nhân viên"}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          {onMinimize && (
            <IconButton
              size="small"
              onClick={() => {
                onFormChange?.(formik.values);
                onMinimize?.();
              }}
              title="Ẩn tạm"
            >
              <Remove fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={onCancel} title="Đóng">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <FieldArray name="items">
            {({ remove }) => (
              <Box display="flex" flexDirection="column" gap={3}>
                {formik.values.items.map((item: any, index: number) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{ p: 3, borderRadius: "12px" }}
                  >
                    {/* Card header */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2.5}
                    >
                      <Box display="flex" alignItems="center" gap={1.2}>
                        <InfoOutlineRounded sx={{ color: "#1FA463", fontSize: "20px" }} />
                        <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#1FA463" }}>
                          {item.hoTen ? item.hoTen : `Nhân viên ${index + 1}`}
                        </Typography>
                      </Box>
                      {/* Chỉ hiện nút xóa dòng khi mode=add và có nhiều hơn 1 dòng */}
                      {!isEdit && formik.values.items.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => remove(index)}
                          sx={{ color: "#ef4444" }}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>

                    {/* Thông tin chính */}
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FieldInput
                          title="Mã nhân viên *"
                          name={`items.${index}.id`}
                          disabled={isEdit}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FieldInput
                          title="Tên nhân viên *"
                          name={`items.${index}.hoTen`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FieldInput
                          title="Email *"
                          name={`items.${index}.emailCongViec`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FieldInput
                          title="Số điện thoại *"
                          name={`items.${index}.diDong`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FieldAutoCompleted
                          title="Chức vụ *"
                          data={allPositions}
                          labelkey="tenChucVu"
                          name={`items.${index}.chucVu`}
                          disabled={false}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FieldAutoCompleted
                          title="Phòng ban/Bộ phận *"
                          data={allDepartments}
                          labelkey="tenPhongBan"
                          name={`items.${index}.boPhan`}
                          disabled={false}
                        />
                      </Grid>
                    </Grid>

                    {/* Quyền ký duyệt */}
                    <SignaturePanel index={index} item={item} formik={formik} />
                  </Paper>
                ))}
              </Box>
            )}
          </FieldArray>

          {/* Footer */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            mt={3}
            pt={2.5}
            sx={{ borderTop: "1px solid #f1f5f9" }}
          >
            {/* Nút "Thêm dòng mới" chỉ hiện khi mode=add */}
            {!isEdit ? (
              <Button
                startIcon={<Add />}
                onClick={() => {
                  formik.setFieldValue("items", [
                    ...formik.values.items,
                    { ...defaultRow },
                  ]);
                }}
                variant="contained"
                size="small"
                sx={{
                  borderRadius: "10px",
                  bgcolor: "#1FA463",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
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
