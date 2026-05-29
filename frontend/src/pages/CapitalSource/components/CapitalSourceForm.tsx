import {
  InfoOutlineRounded,
  ArrowDropDown,
  ArrowDropUp,
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
import { CapitalSourceValidation } from "../validation/Validation";
import EditButton from "../../../components/Button/EditButton";
import { CongTy } from "../../../utils/const";
import { useDebounce } from "../../../hooks/useDebounce";

export default function CapitalSourceForm({
  onEdit,
  onCancel,
  selectedCapitalSource,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedCapitalSource?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
}) {
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      id: initialFormData?.id ?? "",
      tenNguonKinhPhi: initialFormData?.tenNguonKinhPhi ?? "",
      idCongTy: initialFormData?.idCongTy ?? CongTy.CT001,
      ghiChu: initialFormData?.ghiChu ?? "",
      hieuLuc: initialFormData?.hieuLuc ?? true,
      isActive: initialFormData?.isActive ?? true,
    },
    validationSchema: CapitalSourceValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  useEffect(() => {
    if (selectedCapitalSource) {
      formik.setValues(selectedCapitalSource);
    }
  }, [selectedCapitalSource]);

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
          <Typography>Chi tiết nguồn vốn</Typography>
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
            <Typography>Thông tin nguồn vốn</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Mã nguồn kinh phí *"
                formik={formik}
                field="id"
                disabled={Boolean(selectedCapitalSource?.id)}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldInput
                title="Tên nguồn kinh phí *"
                formik={formik}
                field="tenNguonKinhPhi"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Ghi chú"
                formik={formik}
                field="ghiChu"
                disabled={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
