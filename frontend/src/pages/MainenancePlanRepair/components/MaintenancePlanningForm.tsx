import React, { useState, useEffect } from "react";
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
  MaintenancePlanDetailItem,
  MaintenancePlanAssetItem,
} from "../types";
import { MaintenancePlanValidation } from "../validation/Validation";
import { useDepartmentsPageQuery } from "../../Department/Mutation";
import dayjs from "dayjs";
import ThietBiBaoTriTable from "./tables/ThietBiBaoTriTable/ThietBiBaoTriTable";
import ChiTietCongViecTable from "./tables/ChiTietCongViecTable/ChiTietCongViecTable";

interface MaintenancePlanningFormProps {
  onEdit: () => void;
  onClose: () => void;
  selectedPlan?: MaintenancePlanData | null;
  readOnly?: boolean;
  onSave: (data: MaintenancePlanData) => void;
  onCancel?: () => void;
  staffs?: any[];
  assets?: any[];
}

export default function MaintenancePlanningForm({
  onEdit,
  onClose,
  selectedPlan,
  readOnly = false,
  onSave,
  onCancel,
  staffs = [],
  assets = [],
}: MaintenancePlanningFormProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingWork, setEditingWork] =
    useState<MaintenancePlanDetailItem | null>(null);
  const [editWorkValues, setEditWorkValues] = useState<
    Partial<MaintenancePlanDetailItem>
  >({});

  const { data: allDepartments = { items: [] } } = useDepartmentsPageQuery(
    0,
    10,
    "sửa chữa",
  );

  useEffect(() => {
    if (editingWork) {
      setEditWorkValues({ ...editingWork });
    }
  }, [editingWork]);

  const handleSaveWork = () => {
    if (!editingWork) return;
    const updated = (formik.values.chiTietCongViec || []).map((w) =>
      (w.id && w.id === editingWork.id) || (!w.id && w === editingWork)
        ? { ...w, ...editWorkValues }
        : w,
    );
    formik.setFieldValue("chiTietCongViec", updated);
    setEditingWork(null);
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      tenKeHoach: "",
      loaiKeHoach: "thiet_bi",
      chu_ky: "thang",
      loaiThietBi: "taisan" as "taisan" | "ccdc",
      chu_ky_thoi_gian: 30,
      gio_may_bao_duong: 100,
      ngayBatDau: dayjs(new Date()).format("YYYY-MM-DD"),
      ngayKetThuc: dayjs(new Date()).format("YYYY-MM-DD"),
      ghiChu: "",
      trangThai: 0,
      idNguoiPhuTrach: "",
      tenNguoiPhuTrach: "",
      idDonVi: allDepartments.items[0]?.id || "",
      tenDonVi: "",
      coHieuLuc: 1,
      idCongTy: "ct001",
      ngayTao: "",
      ngayCapNhat: "",
      nguoiTao: "",
      nguoiCapNhat: "",
      chiTietCongViec: [] as MaintenancePlanDetailItem[],
      danhSachThietBi: [] as MaintenancePlanAssetItem[],
    },
    validationSchema: MaintenancePlanValidation,
    onSubmit: (values) => {
      const planData: MaintenancePlanData = {
        ...values,
        loaiKeHoach: values.loaiKeHoach as
          | "thiet_bi"
          | "chu_ky_thoi_gian"
          | "gio_may",
        chu_ky: values.chu_ky as "thang" | "quy" | "nam",
        ngayTao: values.ngayTao || new Date().toLocaleString("vi-VN"),
        ngayCapNhat: new Date().toLocaleString("vi-VN"),
        nguoiCapNhat: "admin", // TODO: Get from user context
      };
      onSave(planData);
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      formik.setValues({
        id: selectedPlan.id || "",
        tenKeHoach: selectedPlan.tenKeHoach || "",
        loaiKeHoach: selectedPlan.loaiKeHoach || "thiet_bi",
        chu_ky: selectedPlan.chu_ky || "thang",
        loaiThietBi: selectedPlan.loaiThietBi || "taisan",
        chu_ky_thoi_gian: selectedPlan.chu_ky_thoi_gian || 30,
        gio_may_bao_duong: selectedPlan.gio_may_bao_duong || 100,
        ngayBatDau: selectedPlan.ngayBatDau || "",
        ngayKetThuc: selectedPlan.ngayKetThuc || "",
        ghiChu: selectedPlan.ghiChu || "",
        trangThai: selectedPlan.trangThai || 0,
        idNguoiPhuTrach: selectedPlan.idNguoiPhuTrach || "",
        tenNguoiPhuTrach: selectedPlan.tenNguoiPhuTrach || "",
        idDonVi: selectedPlan.idDonVi || "",
        tenDonVi: selectedPlan.tenDonVi || "",
        coHieuLuc: selectedPlan.coHieuLuc || 1,
        idCongTy: selectedPlan.idCongTy || "ct001",
        ngayTao: selectedPlan.ngayTao || "",
        ngayCapNhat: selectedPlan.ngayCapNhat || "",
        nguoiTao: selectedPlan.nguoiTao || "",
        nguoiCapNhat: selectedPlan.nguoiCapNhat || "",
        chiTietCongViec: selectedPlan.chiTietCongViec || [],
        danhSachThietBi: selectedPlan.danhSachThietBi || [],
      });
      formik.setErrors({}); // Clear errors when selectedPlan changes
    } else {
      formik.resetForm();
    }
  }, [selectedPlan, readOnly]); // Add readOnly to dependencies

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Chưa thực hiện" color="default" size="small" />;
      case 1:
        return <Chip label="Đang thực hiện" color="warning" size="small" />;
      case 2:
        return <Chip label="Đã hoàn thành" color="success" size="small" />;
      default:
        return <Chip label="Chưa thực hiện" color="default" size="small" />;
    }
  };

  const handleAddAsset = () => {
    const newAsset: MaintenancePlanAssetItem = {
      id: `asset-${Date.now()}`,
      idKeHoach: formik.values.id || "",
      idThietBi: "",
      tenThietBi: "",
      loaiThietBi: "taisan",
      ghiChu: "",
      ngayTao: new Date().toLocaleString("vi-VN"),
      ngayCapNhat: new Date().toLocaleString("vi-VN"),
    };
    const current = formik.values.danhSachThietBi || [];
    formik.setFieldValue("danhSachThietBi", [...current, newAsset]);
  };

  const handleDeleteAsset = (assetId: string) => {
    const current = formik.values.danhSachThietBi || [];
    formik.setFieldValue(
      "danhSachThietBi",
      current.filter((a) => a.id !== assetId),
    );
  };

  const handleAssetItemChange = (
    index: number,
    assetId: string,
    assetList: any[],
  ) => {
    const selected = assetList.find((a) => a.id === assetId);
    formik.setFieldValue(`danhSachThietBi[${index}].idThietBi`, assetId);
    formik.setFieldValue(
      `danhSachThietBi[${index}].tenThietBi`,
      selected?.ten || "",
    );
    formik.setFieldValue(
      `danhSachThietBi[${index}].loaiThietBi`,
      selected?.loaiThietBi || "tai_san",
    );
  };

  const handleAddWork = () => {
    const newWork: MaintenancePlanDetailItem = {
      id: `work-${Date.now()}`,
      idKeHoach: formik.values.id || "",
      tenCongViec: "",
      moTa: "",
      thoiGianDuKien: 60,
      ngayThucHien: new Date().toISOString().split("T")[0],
      trangThai: 0,
      ghiChu: "",
      nguoiThucHien: "",
      ngayTao: new Date().toLocaleString("vi-VN"),
      ngayCapNhat: new Date().toLocaleString("vi-VN"),
    };

    const currentWorks = formik.values.chiTietCongViec || [];
    formik.setFieldValue("chiTietCongViec", [...currentWorks, newWork]);
  };

  const handleDeleteWork = (workId: string) => {
    const currentWorks = formik.values.chiTietCongViec || [];
    const updatedWorks = currentWorks.filter((w) => w.id !== workId);
    formik.setFieldValue("chiTietCongViec", updatedWorks);
  };

  return (
    <>
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
          <Box display="flex" gap={2}>
            {!readOnly && <SaveBtn onSave={formik.submitForm} />}
            {!readOnly && <CancelBtn onClick={onClose} />}
            {readOnly && <EditButton onClick={onEdit} />}
          </Box>

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
                    formik.values.loaiKeHoach === "thiet_bi" ||
                    !formik.values.loaiKeHoach
                      ? 6
                      : 3,
                }}
              >
                <FormControl fullWidth disabled={readOnly} size="small">
                  <InputLabel>Loại kế hoạch</InputLabel>
                  <Select
                    value={formik.values.loaiKeHoach || "thiet_bi"}
                    label="Loại kế hoạch"
                    onChange={(e) =>
                      formik.setFieldValue("loaiKeHoach", e.target.value)
                    }
                  >
                    <MenuItem value="thiet_bi">Theo thiết bị</MenuItem>
                    <MenuItem value="chu_ky_thoi_gian">
                      Theo chu kỳ thời gian
                    </MenuItem>
                    <MenuItem value="gio_may">Theo giờ máy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Số ngày - chỉ cho chu kỳ thời gian */}
              {formik.values.loaiKeHoach === "chu_ky_thoi_gian" && (
                <Grid size={{ xs: 12, md: 3 }}>
                  <FieldInput
                    title="Chu kỳ (ngày)"
                    type="number"
                    formik={formik}
                    field="chu_ky_thoi_gian"
                    disabled={readOnly}
                    slotProps={{ input: { min: 1 } }}
                  />
                </Grid>
              )}

              {/* Giờ máy - chỉ cho loại giờ máy */}
              {formik.values.loaiKeHoach === "gio_may" && (
                <Grid size={{ xs: 12, md: 3 }}>
                  <FieldInput
                    title="Mốc giờ máy (giờ)"
                    type="number"
                    formik={formik}
                    field="gio_may_bao_duong"
                    disabled={readOnly}
                    slotProps={{ input: { min: 1 } }}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Đơn vị thực hiện *"
                  data={allDepartments.items}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonVi"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Người phụ trách *"
                  data={staffs.filter(
                    (i) => i.phongBanId === formik.values.idDonVi,
                  )}
                  labelkey="hoTen"
                  formik={formik}
                  field="idNguoiPhuTrach"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldInput
                  title="Ngày bắt đầu *"
                  type="date"
                  formik={formik}
                  field="ngayBatDau"
                  disabled={readOnly}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldInput
                  title="Ngày kết thúc *"
                  type="date"
                  formik={formik}
                  field="ngayKetThuc"
                  disabled={readOnly}
                  InputLabelProps={{ shrink: true }}
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
            assets={assets}
          />

          {/* Chi tiết công việc */}
          <ChiTietCongViecTable
            formik={formik}
            readOnly={readOnly}
            setEditingWork={setEditingWork}
          />
        </AccordionDetails>
      </Accordion>

      {/* Dialog chỉnh sửa công việc */}
      <Dialog
        open={editingWork !== null}
        onClose={() => setEditingWork(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa công việc bảo trì</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Tên công việc"
              value={editWorkValues.tenCongViec || ""}
              onChange={(e) =>
                setEditWorkValues((v) => ({
                  ...v,
                  tenCongViec: e.target.value,
                }))
              }
              fullWidth
              size="small"
              required
            />
            <TextField
              label="Mô tả"
              value={editWorkValues.moTa || ""}
              onChange={(e) =>
                setEditWorkValues((v) => ({ ...v, moTa: e.target.value }))
              }
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Thời gian dự kiến (phút)"
                  type="number"
                  value={editWorkValues.thoiGianDuKien ?? ""}
                  onChange={(e) =>
                    setEditWorkValues((v) => ({
                      ...v,
                      thoiGianDuKien: Number(e.target.value),
                    }))
                  }
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Ngày thực hiện"
                  type="date"
                  value={editWorkValues.ngayThucHien || ""}
                  onChange={(e) =>
                    setEditWorkValues((v) => ({
                      ...v,
                      ngayThucHien: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    label="Trạng thái"
                    value={editWorkValues.trangThai ?? 0}
                    onChange={(e) =>
                      setEditWorkValues((v) => ({
                        ...v,
                        trangThai: Number(e.target.value),
                      }))
                    }
                  >
                    <MenuItem value={0}>Chưa thực hiện</MenuItem>
                    <MenuItem value={1}>Đang thực hiện</MenuItem>
                    <MenuItem value={2}>Đã hoàn thành</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Người thực hiện"
                  value={editWorkValues.nguoiThucHien || ""}
                  onChange={(e) =>
                    setEditWorkValues((v) => ({
                      ...v,
                      nguoiThucHien: e.target.value,
                    }))
                  }
                  fullWidth
                  size="small"
                />
              </Box>
            </Box>
            <TextField
              label="Ghi chú"
              value={editWorkValues.ghiChu || ""}
              onChange={(e) =>
                setEditWorkValues((v) => ({ ...v, ghiChu: e.target.value }))
              }
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setEditingWork(null)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSaveWork}
            variant="contained"
            disabled={!editWorkValues.tenCongViec?.trim()}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
