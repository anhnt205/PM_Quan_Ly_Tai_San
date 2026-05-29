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
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import RepairNormVatTuTable from "./RepairNormVatTuTable";
import { DinhMucSuaChua, DinhMucVatTu } from "../types";
import { RepairNormValidation } from "../validation";
import { useAllLoaiSCBDQuery } from "../../MaintenanceRepairType/Mutation";
import { useDebounce } from "../../../hooks/useDebounce";

export default function RepairNormForm({
  onEdit,
  onCancel,
  editData,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
}: {
  onEdit: () => void;
  onCancel: () => void;
  editData?: DinhMucSuaChua | null;
  readOnly: boolean;
  onSave: (values: DinhMucSuaChua) => void;
  onFormChange?: (values: any) => void;
  initialFormData?: Record<string, any>;
}) {
  const [expanded, setExpanded] = useState(true);
  const { data: allRepairTypes = [] } = useAllLoaiSCBDQuery();

  const formik = useFormik<DinhMucSuaChua>({
    initialValues: {
      id: initialFormData?.id ?? "",
      idLoaiSuaChua: initialFormData?.idLoaiSuaChua ?? "",
      ghiChu: initialFormData?.ghiChu ?? "",
      isActive: initialFormData?.isActive ?? true,
      dinhMucVatTuList: initialFormData?.dinhMucVatTuList ?? [],
    },
    validationSchema: RepairNormValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 800);
  useEffect(() => {
    if (!editData) {
      onFormChange?.(debouncedValues);
    }
  }, [debouncedValues]);

  useEffect(() => {
    if (editData) {
      formik.setValues({
        ...editData,
        dinhMucVatTuList: editData.dinhMucVatTuList || [],
      });
      formik.setErrors({});
    }
  }, [editData, readOnly]);

  return (
    <Accordion
      sx={{
        background: "#f6f8f4ff",
        mb: 2,
        borderRadius: "12px",
        "&:before": { display: "none" },
      }}
      expanded={expanded}
    >
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
          <Typography>Chi tiết định mức sửa chữa</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" gap={2} mb={2}>
          {!readOnly && <SaveBtn onSave={formik.submitForm} />}
          {!readOnly && <CancelBtn onClick={onCancel} />}
          {readOnly && <EditButton onClick={onEdit} />}
        </Box>
        <Paper sx={{ p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2} mb={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin định mức sửa chữa</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FieldAutoCompleted
                title="Loại sửa chữa *"
                data={allRepairTypes}
                labelkey="ten"
                formik={formik}
                field="idLoaiSuaChua"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldInput
                title="Ghi chú"
                formik={formik}
                field="ghiChu"
                disabled={readOnly}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Danh sách định mức vật tư
                </Typography>
                <RepairNormVatTuTable formik={formik} readOnly={readOnly} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
