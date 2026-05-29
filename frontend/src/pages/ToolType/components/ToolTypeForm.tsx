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
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import EditButton from "../../../components/Button/EditButton";
import { ToolTypeValidation } from "../validation/Validation";
import {
  useAllToolGroupQuery,
  useToolGroupMutation,
} from "../../ToolGroup/Mutation";
import { useDebounce } from "../../../hooks/useDebounce";

export default function ToolTypeForm({
  onEdit,
  onCancel,
  selectedToolType,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedToolType?: any;
  readOnly: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
}) {
  const [expanded, setExpanded] = useState(true);
  const { data: allToolGroup = [] } = useAllToolGroupQuery();
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenLoai: initialFormData?.tenLoai ?? "",
      idLoaiCCDC: initialFormData?.idLoaiCCDC ?? "",
    },
    validationSchema: ToolTypeValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedToolType) {
      formik.setValues(selectedToolType);
      formik.setErrors({});
    }
  }, [selectedToolType, readOnly]);

  return (
    <Accordion sx={{ background: "#f6f8f4ff" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none",
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
                disabled={Boolean(selectedToolType?.id)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldAutoCompleted
                title="Mã loại CCDC cha *"
                data={allToolGroup}
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
