import { Close, Remove } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { FormikProvider, useFormik } from "formik";
import EditButton from "../../../components/Button/EditButton";
import { useDebounce } from "../../../hooks/useDebounce";
import { RepairReportValidation } from "../validation";

import MeasureMachinPreview from "../../Maintenance/components/preview/MeasureMachinPreview";
import MeasureVehiclePreview from "../../Maintenance/components/preview/MeasureVehiclePreview";
import IncidentPreview from "../../Maintenance/components/preview/IncidentPreview";
import IncidentInspectionPreview from "../../Maintenance/components/preview/IncidentInspectionPreview";
import AcceptanceVehiclePreview from "../../Maintenance/components/preview/AcceptanceVehiclePreview";
import AcceptanceTestPreview from "../../Maintenance/components/preview/AcceptanceTestPreview";
import InspectionRecordPreview from "../../Maintenance/components/preview/InspectionRecordPreview";
import InspectionRecordVehiclePreview from "../../Maintenance/components/preview/InspectionRecordVehiclePreview";
import MaterialPreview from "../../Maintenance/components/preview/MaterialPreview";
import RepairRequestPreview from "../../Maintenance/components/preview/RepairRequestPreview";
import { BienBanSuaChua } from "../types";
import PlanPreview from "../../Maintenance/components/preview/PlanPreview";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { LOAI_BIEN_BAN_OPTIONS } from "../../../utils/const";

// ── Section label helper ──────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 1, mt: 0.5 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, color: "#1FA463", fontSize: 13 }}
      >
        {children}
      </Typography>
      <Divider sx={{ mt: 0.5, borderColor: "#e0f2ec" }} />
    </Box>
  );
}

// ── Preview helper ───────────────────────────────────────────
const renderPreviewComponent = (loai: string, values: BienBanSuaChua) => {
  if (!loai) return <Typography>Vui lòng chọn Loại biên bản</Typography>;

  switch (loai) {
    case "KE_HOACH":
      return (
        <PlanPreview
          idDonViGiao=""
          idDonViNhan=""
          signers={[]}
          tieude={values?.ten || ""}
        />
      );
    case "SUA_CHUA":
      return (
        <RepairRequestPreview
          assets={[] as any}
          month={0}
          year={0}
          number=""
          signers={[]}
          sourceDeptId=""
          execDeptId=""
          note=""
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "PHIEU_SU_CO":
      return (
        <IncidentPreview
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "GIAM_DINH_MAY_MOC":
      return (
        <InspectionRecordPreview
          formik={undefined}
          plan={undefined}
          repairRequest={undefined}
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "GIAM_DINH_PHUONG_TIEN":
      return (
        <InspectionRecordVehiclePreview
          formik={undefined}
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "NGHIEM_THU_MAY_MOC":
      return (
        <AcceptanceTestPreview
          formik={undefined}
          d={new Date()}
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "DANH_GIA_VAT_TU":
      return (
        <MaterialPreview
          d={new Date()}
          formik={undefined}
          congty={values?.congTy || ""}
          tieude={values?.ten || ""}
        />
      );
    case "KIEM_TRA_SU_CO":
      return (
        <IncidentInspectionPreview
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "BIEN_PHAP_MAY_MOC":
      return (
        <MeasureMachinPreview
          row={{ ...values }}
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "BIEN_PHAP_PHUONG_TIEN":
      return (
        <MeasureVehiclePreview
          row={{ ...values }}
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    case "NGHIEM_THU_PHUONG_TIEN":
      return (
        <AcceptanceVehiclePreview
          row={values as any}
          tieude={values?.ten || ""}
          congty={values?.congTy || ""}
        />
      );
    default:
      return <Typography>Vui lòng chọn Loại biên bản</Typography>;
  }
};

export interface RepairReportFormProps {
  onEdit: () => void;
  onCancel: () => void;
  editData?: BienBanSuaChua | null;
  readOnly: boolean;
  onSave: (values: BienBanSuaChua) => void;
  onFormChange?: (values: BienBanSuaChua) => void;
  initialFormData?: BienBanSuaChua;
  onMinimize: () => void;
  isCopy?: boolean;
}

export default function RepairReportForm({
  onEdit,
  onCancel,
  editData,
  readOnly,
  onSave,
  initialFormData,
  onFormChange,
  onMinimize,
  isCopy = false,
}: RepairReportFormProps) {
  const isEdit = Boolean(editData?.id) && !isCopy;

  const source =
    initialFormData && Object.keys(initialFormData).length > 0
      ? initialFormData
      : editData;

  const formik = useFormik<BienBanSuaChua>({
    enableReinitialize: true,
    initialValues: {
      id: source?.id,
      ma: source?.ma ?? "",
      ten: source?.ten ?? "",
      congTy: source?.congTy ?? "",
      loaiBienBan: source?.loaiBienBan ?? "",
      macDinh: source?.macDinh ?? false,
    },
    validationSchema: RepairReportValidation,
    onSubmit(values) {
      onSave(values);
    },
  });

  const debouncedValues = useDebounce(formik.values, 500);

  useEffect(() => {
    onFormChange?.(debouncedValues);
  }, [debouncedValues]);

  const handleMinimize = () => {
    onFormChange?.(formik.values);
    onMinimize();
  };

  return (
    <FormikProvider value={formik}>
      <Box
        sx={{
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "#fff",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1FA463" }}>
              {isEdit
                ? readOnly
                  ? "Chi tiết mẫu biên bản sửa chữa"
                  : "Chỉnh sửa mẫu biên bản sửa chữa"
                : isCopy
                  ? "Sao chép mẫu biên bản sửa chữa"
                  : "Thêm mới mẫu biên bản sửa chữa"}
            </Typography>
            <Box display="flex" gap={0.5}>
              <IconButton size="small" onClick={handleMinimize} title="Ẩn tạm">
                <Remove fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onCancel} title="Đóng">
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* ── Body ── */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <Grid container spacing={2}>
            {/* ── Thông tin chung ── */}
            <Grid size={{ xs: 12 }}>
              <SectionLabel>Thông tin chung</SectionLabel>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <FieldInput
                title="Mã *"
                name="ma"
                disabled={isEdit || readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldAutoCompleted
                data={LOAI_BIEN_BAN_OPTIONS}
                name="loaiBienBan"
                labelkey="label"
                title="Loại biên bản *"
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.macDinh}
                    onChange={(e) =>
                      formik.setFieldValue("macDinh", e.target.checked)
                    }
                    disabled={readOnly}
                    sx={{
                      color: "#1FA463",
                      "&.Mui-checked": { color: "#1FA463" },
                    }}
                  />
                }
                label="Mặc định"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldInput title="Công ty *" name="congTy" disabled={readOnly} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldInput title="Tiêu đề *" name="ten" disabled={readOnly} />
            </Grid>

            {/* ── Preview ── */}
            <Grid size={{ xs: 12 }}>
              <SectionLabel>Xem trước</SectionLabel>
              <Box
                sx={{
                  mt: 1.5,
                  bgcolor: "#f8fafc",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {renderPreviewComponent(
                  formik.values.loaiBienBan || "",
                  formik.values,
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ── Footer ── */}
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          p={2}
          sx={{ borderTop: "1px solid #f1f5f9" }}
        >
          {readOnly ? (
            <EditButton onClick={onEdit} />
          ) : (
            <>
              <CancelBtn onClick={onCancel} />
              <SaveBtn onSave={formik.submitForm} />
            </>
          )}
        </Box>
      </Box>
    </FormikProvider>
  );
}
