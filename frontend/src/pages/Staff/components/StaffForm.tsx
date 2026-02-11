import {
  ArrowDropDown,
  ArrowDropUp,
  InfoOutlineRounded,
  Visibility,
  VisibilityOff,
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
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { useFormik } from "formik";
import { StaffValidation } from "../validation/Validation";
import UploadButton from "../../../components/Button/UploadButton";
import ViewBtn from "../../../components/Button/ViewBtn";
import EditButton from "../../../components/Button/EditButton";
import {
  useAllPositionsQuery,
  usePositionMutation,
} from "../../Position/Mutation";
import {
  useAllDepartmentsQuery,
  useDepartmentMutation,
} from "../../Department/Mutation";

export default function StaffForm({
  onEdit,
  onCancel,
  selectedStaff,
  readOnly,
  onSave,
  onUpload,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedStaff?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onUpload: (file: File) => void;
}) {
  const [showPin, setShowPin] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const { data: allPositions } = useAllPositionsQuery();
  const { data: allDepartments = [] } = useAllDepartmentsQuery();

  const formik = useFormik({
    initialValues: {
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
      idCongTy: "ct001",
      isActive: true,
      savePin: false,
      // tempFileKyNhay: null as File | null,
      // tempFileKyThuong: null as File | null,
    },
    validationSchema: StaffValidation,
    onSubmit: async (values) => {
      try {
        // 1. Kiểm tra và Upload Chữ ký nháy (nếu có file mới)
        // if (values.tempFileKyNhay) {
        //   await onUpload(values.tempFileKyNhay);
        // }

        // // 2. Kiểm tra và Upload Chữ ký thường (nếu có file mới)
        // if (values.tempFileKyThuong) {
        //   await onUpload(values.tempFileKyThuong);
        // }

        // 3. Chuẩn bị dữ liệu để Save (Loại bỏ 2 trường temp file thừa)
        // const { tempFileKyNhay, tempFileKyThuong, ...dataToSave } = values;

        // 4. Gọi hàm Save cuối cùng
        onSave(values);
      } catch (error) {
        console.error("Lỗi khi upload file:", error);
        // Có thể show alert lỗi ở đây nếu cần
      }
    },
  });
  console.log("formik.errors", formik.values);
  useEffect(() => {
    if (selectedStaff) {
      formik.setValues({
        ...selectedStaff,
        boPhan: selectedStaff?.phongBanId,
        chucVu: selectedStaff?.chucVuId,
      });
      formik.setErrors({}); // Clear errors when selectedStaff changes
    } else {
      formik.resetForm();
    }
  }, [selectedStaff, readOnly]); // Add readOnly to dependencies

  // Hàm xử lý chung cho input file
  const handleFileSelect = (
    file: string, // Nhận trực tiếp File hoặc null từ UploadButton
    fieldName: "chuKyNhay" | "chuKyThuong",
    tempFieldName: "tempFileKyNhay" | "tempFileKyThuong",
  ) => {
    if (file) {
      // Lưu tên file vào Formik để hiển thị/gửi DB
      formik.setFieldValue(fieldName, file);
      // Lưu file thực tế vào trường tạm để chờ submit
      // formik.setFieldValue(tempFieldName, file);
    } else {
      // Nếu xóa file (handleRemove từ nút Delete)
      formik.setFieldValue(fieldName, "");
      // formik.setFieldValue(tempFieldName, null);
    }
  };

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
          <Typography>Chi tiết nhân viên</Typography>
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
            <Typography>Thông tin nhân viên</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Mã nhân viên *"
                    formik={formik}
                    field="id"
                    disabled={Boolean(selectedStaff)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên nhân viên *"
                    formik={formik}
                    field="hoTen"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Email *"
                    formik={formik}
                    field="emailCongViec"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số điện thoại *"
                    formik={formik}
                    field="diDong"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Chức vụ *"
                    data={allPositions}
                    labelkey="tenChucVu"
                    formik={formik}
                    field="chucVu"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Phòng ban/Bộ phận *"
                    data={allDepartments}
                    labelkey="tenPhongBan"
                    formik={formik}
                    field="boPhan"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" flexDirection="column" gap={2.5}>
                {/* Dòng 1: Ký nháy */}
                <Box display="flex" alignItems="center">
                  <Box width={100}>
                    <Typography>Ký nháy:</Typography>
                  </Box>
                  <Checkbox
                    name="kyNhay"
                    checked={formik.values.kyNhay}
                    onChange={!readOnly ? formik.handleChange : undefined}
                    disabled={readOnly}
                  />
                  {formik.values.kyNhay && (
                    <Box flex={1} ml={1}>
                      <UploadButton
                        label="Nhấn để chọn file chữ ký (.png, .jpg...)"
                        disabled={readOnly}
                        name="chuKyNhay"
                        onChange={(file: string) =>
                          handleFileSelect(file, "chuKyNhay", "tempFileKyNhay")
                        }
                        nameFile={formik.values.chuKyNhay}
                      />
                    </Box>
                  )}
                </Box>

                {/* Dòng 2: Ký thường */}
                <Box display="flex" alignItems="center">
                  <Box width={100}>
                    <Typography>Ký thường:</Typography>
                  </Box>
                  <Checkbox
                    name="kyThuong"
                    checked={formik.values.kyThuong}
                    onChange={!readOnly ? formik.handleChange : undefined}
                    disabled={readOnly}
                  />
                  {formik.values.kyThuong && (
                    <Box flex={1} ml={1}>
                      <UploadButton
                        label="Nhấn để chọn file chữ ký (.png, .jpg...)"
                        disabled={readOnly}
                        name="chuKyThuong"
                        onChange={(e: any) =>
                          handleFileSelect(e, "chuKyThuong", "tempFileKyThuong")
                        }
                        nameFile={formik.values.chuKyThuong}
                      />
                    </Box>
                  )}
                </Box>

                {/* Dòng 3: Ký số */}
                <Box display="flex" alignItems="center">
                  <Box width={100}>
                    <Typography>Ký số:</Typography>
                  </Box>
                  <Checkbox
                    name="kySo"
                    checked={formik.values.kySo}
                    onChange={!readOnly ? formik.handleChange : undefined}
                    disabled={readOnly}
                  />
                </Box>
                {formik.values.kySo && (
                  <Box display="flex" flexDirection={"column"} gap={1}>
                    {/* Dòng 4: Agreement UUID */}
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Agreement UUID"
                      name="agreementUUId"
                      value={formik.values.agreementUUId}
                      onChange={!readOnly ? formik.handleChange : undefined}
                      InputProps={{
                        sx: { borderRadius: "8px" },
                        readOnly: readOnly,
                      }}
                      disabled={readOnly}
                    />
                    {/* Dòng 5: PIN */}
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="PIN"
                      type={showPin ? "text" : "password"}
                      name="pin"
                      value={formik.values.pin}
                      onChange={!readOnly ? formik.handleChange : undefined}
                      InputProps={{
                        sx: { borderRadius: "8px" },
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
                        readOnly: readOnly,
                      }}
                      disabled={readOnly}
                    />
                    {/* Dòng 6: Lưu mã PIN */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography>Lưu mã PIN :</Typography>
                      <Checkbox
                        name="savePin"
                        checked={formik.values.savePin || false}
                        onChange={
                          !readOnly
                            ? (e) => {
                                formik.setFieldValue(
                                  "savePin",
                                  e.target.checked,
                                );
                              }
                            : undefined
                        }
                        disabled={readOnly}
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 28 },
                          color: "#aaa",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
