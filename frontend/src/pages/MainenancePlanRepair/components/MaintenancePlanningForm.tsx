import React, { useState, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  ArrowDropDown,
  ArrowDropUp,
  InfoOutlineRounded,
} from "@mui/icons-material";
import { useFormik } from "formik";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import {
  MaintenancePlanData,
  MaintenancePlanWorkItem,
  MaintenancePlanAssetItem,
} from "../types";
import { MaintenancePlanValidation } from "../validation/Validation";
import { useDepartmentsPageQuery } from "../../Department/Mutation";
import dayjs from "dayjs";
import ThietBiBaoTriTable from "./tables/ThietBiBaoTriTable/ThietBiBaoTriTable";
import ChiTietCongViecTable from "./tables/ChiTietCongViecTable/ChiTietCongViecTable";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import {
  Action,
  CongTy,
  Devicetype,
  StatusPlan,
  StatusPlanType,
} from "../../../utils/const";
import { generateCode } from "../../../utils/helpers";
import FieldDate from "../../../components/TextField/FieldDate";
import { useAssetByDonViQuery } from "../../AssetTransfer/Mutation";
import { useToolByDepartmentPageQuery } from "../../ToolTransfer/Mutation";
import DialogLoading from "../../../components/common/DialogLoading";

interface MaintenancePlanningFormProps {
  onEdit: () => void;
  onClose: () => void;
  selectedPlan?: MaintenancePlanData | null;
  readOnly?: boolean;
  onSave: (data: MaintenancePlanData) => void;
  onCancel?: () => void;
  staffs?: any[];
}

export default function MaintenancePlanningForm({
  onEdit,
  onClose,
  selectedPlan,
  readOnly = false,
  onSave,
  onCancel,
  staffs = [],
}: MaintenancePlanningFormProps) {
  const [expanded, setExpanded] = useState(true);

  const { data: allDepartments = { items: [] } } = useDepartmentsPageQuery(
    0,
    9999,
  );

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      tenKeHoach: "",
      loaiKeHoach: "THIET_BI" as "THIET_BI" | "CHU_KY" | "GIO_MAY",
      chuKyNgay: 0,
      mocGioMay: 0,
      idDonViGiao: "",
      idDonViThucHien: "",
      idNguoiPhuTrach: "",
      ngayBatDau: dayjs(new Date()).format("YYYY-MM-DD"),
      ngayKetThuc: dayjs(new Date()).format("YYYY-MM-DD"),
      loaiDoiTuong: "TAI_SAN" as "TAI_SAN" | "CCDC",
      ghiChu: "",
      congViecs: [] as MaintenancePlanWorkItem[],
      chiTiets: [] as MaintenancePlanAssetItem[],
    },
    validationSchema: MaintenancePlanValidation,
    onSubmit: (values) => {
      const chiTiets = values.chiTiets.map((item) => {
        return {
          ...item,
          idTaiSan: item.idTaiSan ?? null,
          idCCDC: item.idCCDC ?? null,
        };
      });
      onSave({ ...values, chiTiets });
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      formik.setValues({
        id: selectedPlan.id || "",
        tenKeHoach: selectedPlan.tenKeHoach || "",
        loaiKeHoach: selectedPlan.loaiKeHoach || "THIET_BI",
        chuKyNgay: selectedPlan?.chuKyNgay ?? 0,
        mocGioMay: selectedPlan?.mocGioMay ?? 0,
        loaiDoiTuong: selectedPlan.loaiDoiTuong || Devicetype.ASSET,
        ngayBatDau: selectedPlan.ngayBatDau || "",
        ngayKetThuc: selectedPlan.ngayKetThuc || "",
        ghiChu: selectedPlan.ghiChu || "",
        idDonViGiao: selectedPlan.idDonViGiao || "",
        idDonViThucHien: selectedPlan.idDonViThucHien || "",
        idNguoiPhuTrach: selectedPlan.idNguoiPhuTrach || "",
        idCongTy: selectedPlan.idCongTy || CongTy.CT001,
        congViecs: (selectedPlan.congViecs || []).map((item) => {
          return {
            ...item,
            action: Action.UPDATE,
          };
        }),
        chiTiets: (selectedPlan.chiTiets || []).map((item) => {
          return {
            ...item,
            action: Action.UPDATE,
          };
        }),
      });
      formik.setErrors({}); // Clear errors when selectedPlan changes
    } else {
      formik.resetForm();
    }
  }, [selectedPlan, readOnly]); // Add readOnly to dependencies

  const { data: toolsByDepartment = [], isLoading: isLoadingTool } =
    useToolByDepartmentPageQuery({
      departmentId: formik.values.idDonViGiao,
    });
  const {
    data: allAssetsByDonVi = { items: [] },
    isFetching,
    isLoading: isLoadingAsset,
  } = useAssetByDonViQuery(2, formik.values.idDonViGiao);
  const allEquipment = useMemo(
    () => [
      ...allAssetsByDonVi.items.map((a: any) => ({
        ...a,
        ten: a.tenTaiSan || a.ten || "",
        type: Devicetype.ASSET,
      })),
      ...toolsByDepartment.map((t: any) => ({
        ...t,
        ten: t.ten || t.tenDetailAsset || "",
        type: Devicetype.TOOL,
      })),
    ],
    [toolsByDepartment, allAssetsByDonVi],
  );

  return (
    <>
      <DialogLoading
        loading={isLoadingTool || isLoadingAsset}
        title="Đang tải tài sản/ccdc ..."
      />
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
            <Typography>
              {selectedPlan?.id
                ? "Chi tiết kế hoạch bảo trì - bảo dưỡng"
                : "Lập kế hoạch bảo trì - bảo dưỡng mới"}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {![StatusPlan.PROGRESS, StatusPlan.COMPLETED].includes(
            selectedPlan?.trangThai as StatusPlanType,
          ) && (
            <Box display="flex" gap={2}>
              {!readOnly && <SaveBtn onSave={formik.submitForm} />}
              {!readOnly && <CancelBtn onClick={onClose} />}
              {readOnly && <EditButton onClick={onEdit} />}
            </Box>
          )}

          {/* Thông tin cơ bản */}
          <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <InfoOutlineRounded color="primary" />
              <Typography>Thông tin kế hoạch</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldInput
                  title="Tên kế hoạch *"
                  formik={formik}
                  field="tenKeHoach"
                  disabled={readOnly}
                />
              </Grid>

              {/* Loại kế hoạch - Tự động co dãn size dựa trên điều kiện */}
              <Grid
                size={{
                  xs: 12,
                  md:
                    formik.values.loaiKeHoach === "THIET_BI" ||
                    !formik.values.loaiKeHoach
                      ? 6
                      : 3,
                }}
              >
                <FormControl fullWidth disabled={readOnly} size="small">
                  <InputLabel>Loại kế hoạch</InputLabel>
                  <Select
                    value={formik.values.loaiKeHoach || "THIET_BI"}
                    label="Loại kế hoạch"
                    onChange={(e) =>
                      formik.setFieldValue("loaiKeHoach", e.target.value)
                    }
                  >
                    <MenuItem value="THIET_BI">Theo thiết bị</MenuItem>
                    <MenuItem value="CHU_KY">Theo chu kỳ thời gian</MenuItem>
                    <MenuItem value="GIO_MAY">Theo giờ máy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Số ngày - chỉ cho chu kỳ thời gian */}
              {formik.values.loaiKeHoach === "CHU_KY" && (
                <Grid size={{ xs: 12, md: 3 }}>
                  <FieldInput
                    title="Chu kỳ (ngày)"
                    type="number"
                    formik={formik}
                    field="chuKy"
                    disabled={readOnly}
                    slotProps={{ input: { min: 1 } }}
                  />
                </Grid>
              )}

              {/* Giờ máy - chỉ cho loại giờ máy */}
              {formik.values.loaiKeHoach === "GIO_MAY" && (
                <Grid size={{ xs: 12, md: 3 }}>
                  <FieldInput
                    title="Mốc giờ máy (giờ)"
                    type="number"
                    formik={formik}
                    field="mocGioMay"
                    disabled={readOnly}
                    slotProps={{ input: { min: 1 } }}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Đơn vị giao *"
                  data={allDepartments.items}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonViGiao"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Người phụ trách *"
                  data={staffs.filter(
                    (i) => i.phongBanId === formik.values.idDonViThucHien,
                  )}
                  labelkey="hoTen"
                  formik={formik}
                  field="idNguoiPhuTrach"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Đơn vị thực hiện *"
                  data={allDepartments.items.filter((i: any) =>
                    i.tenPhongBan
                      ?.toLowerCase()
                      .includes("sửa chữa".toLowerCase()),
                  )}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonViThucHien"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldDate
                  title="Ngày bắt đầu *"
                  formik={formik}
                  field="ngayBatDau"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldDate
                  title="Ngày kết thúc *"
                  formik={formik}
                  field="ngayKetThuc"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FieldInput
                  title="Ghi chú"
                  formik={formik}
                  field="ghiChu"
                  disabled={readOnly}
                  slotProps={{
                    input: { multiline: true, rows: 3 },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Danh sách thiết bị / CCDC */}
          <ThietBiBaoTriTable
            formik={formik}
            readOnly={readOnly}
            assets={allEquipment}
          />

          {/* Chi tiết công việc */}
          <ChiTietCongViecTable
            formik={formik}
            readOnly={readOnly}
            staffs={staffs}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
