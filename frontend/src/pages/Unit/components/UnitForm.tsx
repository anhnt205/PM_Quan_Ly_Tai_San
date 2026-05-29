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
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";

import EditButton from "../../../components/Button/EditButton";
import { UnitValidation } from "../validation/Validation";
import { useDebounce } from "../../../hooks/useDebounce";

export default function UnitForm({
  onEdit,
  onCancel,
  selectedUnit,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedUnit?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenDonVi: initialFormData?.tenDonVi ?? "",
      note: initialFormData?.note ?? "",
    },
    validationSchema: UnitValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedUnit) {
      formik.setValues(selectedUnit);
      formik.setErrors({}); // Clear errors when selectedUnit changes
    }
  }, [selectedUnit, readOnly]); // Add readOnly to dependencies

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
          <Typography>Chi tiết đơn vị tính</Typography>
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
            <Typography>Thông tin đơn vị tính</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Mã đơn vị tính *"
                formik={formik}
                field="id"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Tên đơn vị tính *"
                formik={formik}
                field="tenDonVi"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Ghi chú *"
                formik={formik}
                field="note"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
