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
import { AssetProfileValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";

export default function AssetProfileForm({
  onEdit,
  onCancel,
  selectedAssetProfile,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedAssetProfile?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      maLyLich: "",
      tenLyLich: "",
      moTa: "",
    },
    validationSchema: AssetProfileValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedAssetProfile) {
      formik.setValues(selectedAssetProfile);
      formik.setErrors({}); // Clear errors when selectedAssetProfile changes
    } else {
      formik.resetForm();
    }
  }, [selectedAssetProfile, readOnly]);

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
          <Typography>Chi tiết lý lịch tài sản</Typography>
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
            <Typography>Thông tin lý lịch tài sản</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Mã lý lịch *"
                formik={formik}
                field="maLyLich"
                disabled={Boolean(selectedAssetProfile?.id)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Tên lý lịch *"
                formik={formik}
                field="tenLyLich"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Mô tả"
                formik={formik}
                field="moTa"
                disabled={readOnly}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
