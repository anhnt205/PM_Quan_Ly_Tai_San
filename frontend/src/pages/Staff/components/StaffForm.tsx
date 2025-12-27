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
import Positions from "../../../data/Position.json";
import Departments from "../../../data/Department.json";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { useFormik } from "formik";
import { StaffValidation } from "../validation/Validation";
import UploadButton from "../../../components/Button/UploadButton";
import ViewBtn from "../../../components/Button/ViewBtn";
import EditButton from "../../../components/Button/EditButton";

export default function StaffForm({
  onEdit,
  onCancel,
  selectedStaff,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedStaff?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [showPin, setShowPin] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      phone: "",
      email: "",
      department: "",
      position: "",
      isFlashSign: false, // Ký nháy
      isNormalSign: false, // Ký thường
      isDigitalSign: false, // Ký số
      agreementUuid: "",
      pin: "",
      savePin: false,
    },
    validationSchema: StaffValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedStaff) {
      formik.setValues(selectedStaff);
      formik.setErrors({}); // Clear errors when selectedStaff changes
    }else{
      formik.resetForm();
    }
  }, [selectedStaff, readOnly]); // Add readOnly to dependencies

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
                    field="code"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên nhân viên *"
                    formik={formik}
                    field="name"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Email *"
                    formik={formik}
                    field="email"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số điện thoại *"
                    formik={formik}
                    field="phone"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Chức vụ *"
                    data={Positions}
                    labelkey="name"
                    formik={formik}
                    field="position"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Phòng ban/Bộ phận *"
                    data={Departments}
                    labelkey="name"
                    formik={formik}
                    field="department"
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
                    name="isFlashSign"
                    checked={formik.values.isFlashSign}
                    onChange={!readOnly ? formik.handleChange : undefined}
                    disabled={readOnly}
                  />
                  {formik.values.isFlashSign && (
                    <Box flex={1} ml={1}>
                      <UploadButton label="Nhấn để chọn file chữ ký (.png, .jpg...)" disabled={readOnly} />
                    </Box>
                  )}
                </Box>

                {/* Dòng 2: Ký thường */}
                <Box display="flex" alignItems="center">
                  <Box width={100}>
                    <Typography>Ký thường:</Typography>
                  </Box>
                  <Checkbox
                    name="isNormalSign"
                    checked={formik.values.isNormalSign}
                    onChange={!readOnly ? formik.handleChange : undefined}
                    disabled={readOnly}
                  />
                  {formik.values.isNormalSign && (
                    <Box flex={1} ml={1}>
                      <UploadButton label="Nhấn để chọn file chữ ký (.png, .jpg...)" disabled ={readOnly} />
                    </Box>
                  )}
                </Box>

                {/* Dòng 3: Ký số */}
                <Box display="flex" alignItems="center">
                  <Box width={100}>
                    <Typography>Ký số:</Typography>
                  </Box>
                  <Checkbox
                    name="isDigitalSign"
                    checked={formik.values.isDigitalSign}
                    onChange={!readOnly ? formik.handleChange : undefined}
                    disabled={readOnly}
                  />
                </Box>
                {formik.values.isDigitalSign && (
                  <Box display="flex" flexDirection={"column"} gap={1}>
                    {/* Dòng 4: Agreement UUID */}
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Agreement UUID"
                      name="agreementUuid"
                      value={formik.values.agreementUuid}
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
                        checked={formik.values.savePin}
                        onChange={!readOnly ? formik.handleChange : undefined}
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

