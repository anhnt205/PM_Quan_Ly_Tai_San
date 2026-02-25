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
} from "../types/planning";
import { MaintenancePlanValidation } from "../validation/Validation";

interface MaintenancePlanningFormProps {
  onEdit: () => void;
  onClose: () => void;
  selectedPlan?: MaintenancePlanData | null;
  readOnly?: boolean;
  onSave: (data: MaintenancePlanData) => void;
  onCancel?: () => void;
  departments?: any[];
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
  departments = [],
  staffs = [],
  assets = [],
}: MaintenancePlanningFormProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingWork, setEditingWork] =
    useState<MaintenancePlanDetailItem | null>(null);
  const [editWorkValues, setEditWorkValues] = useState<
    Partial<MaintenancePlanDetailItem>
  >({});

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
      idThietBi: "",
      tenThietBi: "",
      chu_ky_thoi_gian: 30,
      gio_may_bao_duong: 100,
      ngayBatDau: "",
      ngayKetThuc: "",
      ghiChu: "",
      trangThai: 0,
      idNguoiPhuTrach: "",
      tenNguoiPhuTrach: "",
      idDonVi: "",
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
        idThietBi: selectedPlan.idThietBi || "",
        tenThietBi: selectedPlan.tenThietBi || "",
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

  const handleStaffChange = (staffId: string) => {
    const selectedStaff = staffs.find((s) => s.id === staffId);
    formik.setFieldValue("idNguoiPhuTrach", staffId);
    formik.setFieldValue("tenNguoiPhuTrach", selectedStaff?.hoTen || "");
  };

  const handleDepartmentChange = (deptId: string) => {
    const selectedDept = departments.find((d) => d.id === deptId);
    formik.setFieldValue("idDonVi", deptId);
    formik.setFieldValue("tenDonVi", selectedDept?.tenPhongBan || "");
  };

  const handleAssetChange = (assetId: string) => {
    const selectedAsset = assets.find((a) => a.id === assetId);
    formik.setFieldValue("idThietBi", assetId);
    formik.setFieldValue("tenThietBi", selectedAsset?.ten || "");
  };

  const handleAddAsset = () => {
    const newAsset: MaintenancePlanAssetItem = {
      id: `asset-${Date.now()}`,
      idKeHoach: formik.values.id || "",
      idThietBi: "",
      tenThietBi: "",
      loaiThietBi: "tai_san",
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

              <Grid size={{ xs: 12, md: 3 }}>
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

              {/* Thiết bị / CCDC chính - luôn hiển thị */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Thiết bị / CCDC chính"
                  data={assets}
                  labelkey="ten"
                  formik={formik}
                  field="idThietBi"
                  disabled={readOnly}
                  onChange={handleAssetChange}
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

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Người phụ trách *"
                  data={staffs}
                  labelkey="hoTen"
                  formik={formik}
                  field="idNguoiPhuTrach"
                  disabled={readOnly}
                  onChange={handleStaffChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Đơn vị thực hiện *"
                  data={departments}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonVi"
                  disabled={readOnly}
                  onChange={handleDepartmentChange}
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
          <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <InfoOutlineRounded color="primary" />
                <Typography>Danh sách thiết bị / CCDC cần bảo trì</Typography>
              </Box>
              {!readOnly && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddAsset}
                  size="small"
                >
                  Thêm thiết bị
                </Button>
              )}
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Thiết bị / CCDC</TableCell>
                    <TableCell width={120}>Loại</TableCell>
                    <TableCell>Ghi chú</TableCell>
                    {!readOnly && <TableCell width={80}>Xóa</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.danhSachThietBi &&
                  formik.values.danhSachThietBi.length > 0 ? (
                    formik.values.danhSachThietBi.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>
                          {readOnly ? (
                            item.tenThietBi || "—"
                          ) : (
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.idThietBi || ""}
                                displayEmpty
                                onChange={(e) =>
                                  handleAssetItemChange(
                                    index,
                                    e.target.value,
                                    assets,
                                  )
                                }
                              >
                                <MenuItem value="">
                                  <em>-- Chọn thiết bị --</em>
                                </MenuItem>
                                {assets.map((a: any) => (
                                  <MenuItem key={a.id} value={a.id}>
                                    {a.ten}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.loaiThietBi === "ccdc" ? "CCDC" : "Tài sản"}
                        </TableCell>
                        <TableCell>
                          {readOnly ? (
                            item.ghiChu || "—"
                          ) : (
                            <TextField
                              size="small"
                              fullWidth
                              value={item.ghiChu || ""}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `danhSachThietBi[${index}].ghiChu`,
                                  e.target.value,
                                )
                              }
                            />
                          )}
                        </TableCell>
                        {!readOnly && (
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteAsset(item.id || "")}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={readOnly ? 3 : 4}
                        align="center"
                        sx={{ py: 4, color: "text.secondary" }}
                      >
                        Chưa có thiết bị nào được thêm vào kế hoạch
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Chi tiết công việc */}
          <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <InfoOutlineRounded color="primary" />
                <Typography>Chi tiết công việc bảo trì</Typography>
              </Box>
              {!readOnly && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddWork}
                  size="small"
                >
                  Thêm công việc
                </Button>
              )}
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên công việc</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Thời gian dự kiến (phút)</TableCell>
                    <TableCell>Ngày thực hiện</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    {!readOnly && <TableCell width={100}>Hành động</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.chiTietCongViec &&
                  formik.values.chiTietCongViec.length > 0 ? (
                    formik.values.chiTietCongViec.map((work, index) => (
                      <TableRow key={work.id || index}>
                        <TableCell>
                          {work.tenCongViec || "Chưa đặt tên"}
                        </TableCell>
                        <TableCell>{work.moTa || ""}</TableCell>
                        <TableCell>{work.thoiGianDuKien || 0} phút</TableCell>
                        <TableCell>{work.ngayThucHien || ""}</TableCell>
                        <TableCell>
                          {getStatusLabel(work.trangThai || 0)}
                        </TableCell>
                        {!readOnly && (
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingWork(work)}
                                color="primary"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteWork(work.id || "")}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ py: 4, color: "text.secondary" }}
                      >
                        Chưa có công việc nào được thêm
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
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
