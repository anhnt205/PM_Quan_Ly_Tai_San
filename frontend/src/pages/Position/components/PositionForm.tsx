import {
  InfoOutlineRounded,
  ArrowDropUp,
  ArrowDropDown,
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
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import { PositionValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";

export default function PositionForm({
  onEdit,
  onCancel,
  selectedPosition,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedPosition?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      manager_staff: false,
      manager_department: false,
      manager_project: false,
      manager_capital_source: false,
    },
    validationSchema: PositionValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedPosition) {
      formik.setValues(selectedPosition);
      formik.setErrors({}); // Clear errors when selectedPosition changes
    } else {
      formik.resetForm();
    }
  }, [selectedPosition, readOnly]); // Add readOnly to dependencies

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
          <Typography>Chi tiết chức vụ</Typography>
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
            <Typography>Thông tin chức vụ</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Mã chức vụ *"
                formik={formik}
                field="code"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Tên chức vụ *"
                formik={formik}
                field="name"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin chức vụ</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý nhân viên:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.manager_staff}
                  onChange={(e) =>
                    formik.setFieldValue("manager_staff", e.target.checked)
                  }
                  name="manager_staff"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý phòng ban:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.manager_department}
                  onChange={(e) =>
                    formik.setFieldValue("manager_department", e.target.checked)
                  }
                  name="manager_department"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý dự án:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.manager_project}
                  onChange={(e) =>
                    formik.setFieldValue("manager_project", e.target.checked)
                  }
                  name="manager_project"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Box display="flex" alignItems="center">
                <Box width={200}>
                  <Typography>Quản lý nguồn vốn:</Typography>
                </Box>
                <Checkbox
                  checked={formik.values.manager_capital_source}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "manager_capital_source",
                      e.target.checked
                    )
                  }
                  name="manager_capital_source"
                  disabled={readOnly}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
