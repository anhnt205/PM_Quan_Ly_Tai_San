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
import React, { useState, useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import ToolGroups from "../../../data/ToolGroup.json";
import EditButton from "../../../components/Button/EditButton";
import { ToolTypeValidation } from "../validation/Validation";
import { useToolGroupMutation } from "../../ToolGroup/Mutation";

export default function ToolTypeForm({
  onEdit,
  onCancel,
  selectedToolType,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedToolType?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const { allData } = useToolGroupMutation();
  const formik = useFormik({
    initialValues: {
      id: "",
      tenLoai: "",
      idLoaiCCDC: "",
    },
    validationSchema: ToolTypeValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (selectedToolType) {
      formik.setValues(selectedToolType);
      formik.setErrors({}); // Clear errors when selectedToolType changes
    } else {
      formik.resetForm();
    }
  }, [selectedToolType, readOnly]); // Add readOnly to dependencies

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
          <Typography>Chi tiết loại CCDC</Typography>
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
            <Typography>Thông tin loại CCDC</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Mã loại CCDC *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedToolType)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldAutoCompleted
                title="Mã loại CCDC cha *"
                data={allData}
                labelkey="ten"
                formik={formik}
                field="idLoaiCCDC"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Tên loại CCDC *"
                formik={formik}
                field="tenLoai"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
