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
import { useAllTypeAssetQuery } from "../../TypeAsset/Mutation";
import { useAllRepairLevelQuery } from "../../RepairLevel/Mutation";

export default function RepairNormForm({
  onEdit,
  onCancel,
  editData,
  readOnly,
  onSave,
}: {
  onEdit: () => void;
  onCancel: () => void;
  editData?: DinhMucSuaChua | null;
  readOnly: boolean;
  onSave: (values: DinhMucSuaChua) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const { data: allRepairLevels = [] } = useAllRepairLevelQuery();

  const formik = useFormik<DinhMucSuaChua>({
    initialValues: {
      id: "",
      idCapSuaChua: "",
      ghiChu: "",
      isActive: true,
      dinhMucVatTuList: [],
    },
    validationSchema: RepairNormValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  useEffect(() => {
    if (editData) {
      formik.setValues({
        ...editData,
        dinhMucVatTuList: editData.dinhMucVatTuList || [],
      });
      formik.setErrors({});
    } else {
      formik.resetForm();
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
                title="Cấp sửa chữa *"
                data={allRepairLevels}
                labelkey="ten"
                formik={formik}
                field="idCapSuaChua"
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
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                  Danh sách định mức vật tư
                </Typography>
                <RepairNormVatTuTable
                  formik={formik}
                  readOnly={readOnly}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
