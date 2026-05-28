import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Alert,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSelector } from "react-redux";
import {
  MaintenancePlanData,
  VehicleInspectionRecordData,
  VehicleInspectionRecordDetailData,
} from "../../../MainenancePlanRepair/types";
import { IncidentInspectionData, MaintenanceRepairData } from "../../types";
import { useMaintenanceVehicleInspectionMutation } from "../../../MainenancePlanRepair/Mutation";
import { Action, CongTy, TypeBienBan } from "../../../../utils/const";
import { generateCode } from "../../../../utils/helpers";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import dayjs from "dayjs";
import FieldDate from "../../../../components/TextField/FieldDate";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { listSigneInfo } from "../../config";
import FieldInput from "../../../../components/TextField/FieldInput";

type SimpleDept = { id: string; name: string };
type SimpleUser = {
  id: string;
  name: string;
  departmentId?: string;
  title?: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  repairRequest: MaintenanceRepairData | null;
  incidentInspection?: IncidentInspectionData;
  initData?: VehicleInspectionRecordData | null;
}

const InspectionRecordVehicleDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  incidentInspection,
  initData,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);

  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();

  const departments: SimpleDept[] = (apiDepartments || []).map((d: any) => ({
    id: String(d?.id ?? ""),
    name: String(d?.tenPhongBan ?? d?.name ?? ""),
  }));

  const users: SimpleUser[] = (apiUsers || [])
    .filter((u: any) => u.hasAccount)
    .map((u: any) => ({
      id: String(u?.id ?? ""),
      name: String(u?.hoTen ?? u?.name ?? ""),
      departmentId: String(u?.phongBanId ?? u?.departmentId ?? ""),
      title: String(u?.tenChucVu ?? u?.chucVu ?? u?.title ?? ""),
    }));

  const { createMutation, updateMutation } =
    useMaintenanceVehicleInspectionMutation();

  const groupSignersByDept = (signerList: any[]) => {
    const groups: { deptName: string; members: any[] }[] = [];
    signerList.forEach((s) => {
      const deptName = s.departmentName || "Bộ phận khác";
      let group = groups.find((g) => g.deptName === deptName);
      if (!group) {
        group = { deptName, members: [] };
        groups.push(group);
      }
      group.members.push(s);
    });
    return groups;
  };

  const parentAsset =
    incidentInspection?.danhSachChiTiet?.[0] ||
    repairRequest?.danhSachTaiSan?.[0];

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      idBienBan: incidentInspection?.id || repairRequest?.id || "",
      loaiBienBan: incidentInspection
        ? TypeBienBan.SU_CO
        : TypeBienBan.SUA_CHUA,
      soPhieu: "",
      ngayGiamDinh: dayjs().format("YYYY-MM-DD"),
      viTri: "",
      capBaoDuong: "",
      donViSuaChua: repairRequest?.ghiChu || "",
      noiDungKhac: "",
      idTaiSan: parentAsset?.idTaiSan || "",
      tenTaiSan: parentAsset?.tenTaiSan || "",
      tinhTrang: "",
      share: false,
      trangThai: 0,
      danhSachChiTiet: [] as VehicleInspectionRecordDetailData[],
      nguoiKyList: [] as any[],
    },
    onSubmit: (values) => {
      if (hasValidationError()) return;
      const idNguoiLapBieu =
        values.nguoiKyList.length > 0 ? values.nguoiKyList[0].userId : "";
      const idTrinhDuyetGiamDoc =
        values.nguoiKyList.length > 1
          ? values.nguoiKyList[values.nguoiKyList.length - 1].userId
          : "";

      const intermediateSigners =
        values.nguoiKyList.length > 2
          ? values.nguoiKyList
              .slice(1, -1)
              .map((s: PlanSigner, idx: number) => ({
                id: `${generateCode("SIG-")}-${idx}`,
                idNguoiKy: s.userId,
                tenNguoiKy: s.userName,
                idPhongBan: s.departmentId,
                trangThai: 0,
              }))
          : [];

      const record: any = {
        id: values.id,
        idBienBan: values.idBienBan,
        loaiBienBan: values.loaiBienBan,
        idCongTy: values.idCongTy,
        soPhieu: values.soPhieu,
        ngayGiamDinh: values.ngayGiamDinh,
        viTri: values.viTri,
        capBaoDuong: values.capBaoDuong,
        donViSuaChua: values.donViSuaChua,
        noiDungKhac: values.noiDungKhac,
        idTaiSan: values.idTaiSan,
        tinhTrang: values.tinhTrang,
        idNguoiLap: idNguoiLapBieu,
        nguoiLapXacNhan: false,
        idGiamDoc: idTrinhDuyetGiamDoc,
        giamDocXacNhan: false,
        trangThai: 0,
        share: false,
        danhSachChiTiet: values.danhSachChiTiet.map((e) => {
          const actualDetailId = e.id ? e.id : generateCode("GDPTCT_");
          return {
            id: actualDetailId,
            idGiamDinhPhuongTien: values.id,
            idVatTu: e.idVatTu,
            idChiTietVatTu: e.idChiTietVatTu,
            soLuong: e.soLuong,
            tinhTrang: e.tinhTrang,
            soLuongSuaChua: e.soLuongSuaChua,
            soLuongThayMoi: e.soLuongThayMoi,
            ghiChu: e.ghiChu,
            action: e.action || Action.CREATE,
          };
        }),
        nguoiKyList: intermediateSigners,
      };

      if (initData) {
        updateMutation.mutateAsync(record).then(() => onClose());
      } else {
        createMutation.mutateAsync(record).then(() => onClose());
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (initData) {
        const listInfo = listSigneInfo(initData, apiUsers, apiDepartments);

        formik.setValues({
          id: initData.id ?? "",
          idCongTy: initData.idCongTy ?? CongTy.CT001,
          idBienBan: initData.idBienBan ?? "",
          loaiBienBan: initData.loaiBienBan ?? "",
          soPhieu: initData.soPhieu ?? "",
          ngayGiamDinh: initData.ngayGiamDinh ?? "",
          viTri: initData.viTri ?? "",
          capBaoDuong: initData.capBaoDuong ?? "",
          donViSuaChua: initData.donViSuaChua ?? "",
          noiDungKhac: initData.noiDungKhac ?? "",
          idTaiSan: initData.idTaiSan ?? "",
          tenTaiSan: initData.tenTaiSan ?? "",
          tinhTrang: initData.tinhTrang ?? "",
          share: initData.share ?? false,
          trangThai: initData.trangThai ?? 0,
          danhSachChiTiet: (initData.danhSachChiTiet ?? []).map((e: any) => ({
            ...e,
            action: Action.UPDATE,
          })) as VehicleInspectionRecordDetailData[],
          nguoiKyList: (listInfo ?? []).map((item: any) => {
            return {
              userId: item.idNhanVien,
              userName: item.hoTen,
              departmentId: item.idDonVi,
              departmentName: item.donVi,
            };
          }),
        });
      } else {
        formik.setValues({
          id: "",
          idCongTy: CongTy.CT001,
          idBienBan: incidentInspection?.id || repairRequest?.id || "",
          loaiBienBan: incidentInspection
            ? TypeBienBan.SU_CO
            : TypeBienBan.SUA_CHUA,
          soPhieu: "",
          ngayGiamDinh: dayjs().format("YYYY-MM-DD"),
          viTri: "",
          capBaoDuong: "",
          donViSuaChua: repairRequest?.ghiChu || "",
          noiDungKhac: "",
          idTaiSan: parentAsset?.idTaiSan || "",
          tenTaiSan: parentAsset?.tenTaiSan || "",
          tinhTrang: "",
          share: false,
          trangThai: 0,
          danhSachChiTiet: [] as VehicleInspectionRecordDetailData[],
          nguoiKyList: [] as any[],
        });
      }
    }
  }, [
    open,
    initData,
    repairRequest,
    incidentInspection,
    apiDepartments,
    apiUsers,
  ]);

  const addMaterialRow = () => {
    const newMaterial: VehicleInspectionRecordDetailData = {
      id: "GDPTCT_" + Math.random().toString(36).substr(2, 9),
      idGiamDinhPhuongTien: formik.values.id,
      idVatTu: "",
      idChiTietVatTu: "",
      soLuong: 1,
      tinhTrang: "",
      soLuongSuaChua: 0,
      soLuongThayMoi: 0,
      ghiChu: "",
      tenVatTu: "",
      donViTinh: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("danhSachChiTiet", [
      ...formik.values.danhSachChiTiet,
      newMaterial,
    ]);
  };

  const removeMaterialRow = (materialId: string) => {
    const updated = formik.values.danhSachChiTiet.map((e) => {
      if (e.id === materialId) {
        return { ...e, action: Action.DELETE };
      }
      return e;
    });
    formik.setFieldValue("danhSachChiTiet", updated);
  };

  const updateMaterialField = (
    materialId: string,
    fieldOrChanges:
      | keyof VehicleInspectionRecordDetailData
      | Partial<VehicleInspectionRecordDetailData>,
    value?: any,
  ) => {
    const updated = formik.values.danhSachChiTiet.map((e) => {
      if (e.id === materialId) {
        if (typeof fieldOrChanges === "string") {
          return { ...e, [fieldOrChanges]: value };
        } else {
          return { ...e, ...fieldOrChanges };
        }
      }
      return e;
    });
    formik.setFieldValue("danhSachChiTiet", updated);
  };

  function hasValidationError() {
    for (const vt of formik.values.danhSachChiTiet) {
      if (vt.action === Action.DELETE) continue;
      const soLuong = vt.soLuong || 0;
      const suaChua = vt.soLuongSuaChua || 0;
      const thayMoi = vt.soLuongThayMoi || 0;
      if (suaChua + thayMoi > soLuong) {
        return true;
      }
      if (!vt.idChiTietVatTu) {
        return true;
      }
    }
    return false;
  }

  const handleAddSigner = () => {
    if (!addDeptId || !addUserId) return;
    const userItem = users.find((u: any) => u.id === addUserId);
    const dept = departments.find((d: any) => d.id === addDeptId);
    if (!userItem || !dept) return;
    if (
      formik.values.nguoiKyList.some(
        (s: any) => s.userId === userItem.id && s.departmentId === dept.id,
      )
    )
      return;
    const newSigner = {
      userId: userItem.id,
      userName: userItem.name,
      departmentId: dept.id,
      departmentName: dept.name,
      position: userItem.title ?? "",
      order: formik.values.nguoiKyList.length + 1,
      signed: false,
    };
    formik.setFieldValue("nguoiKyList", [
      ...formik.values.nguoiKyList,
      newSigner,
    ]);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    const updatedSigners = formik.values.nguoiKyList
      .filter((s) => s.userId !== userId)
      .map((s, i) => ({ ...s, order: i + 1 }));
    formik.setFieldValue("nguoiKyList", updatedSigners);
  };

  const handleEdit = (signer: PlanSigner) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
    const updatedSigners = formik.values.nguoiKyList.map((s) =>
      s.userId === editingSignerId
        ? {
            ...s,
            userId: editUserId,
            userName: users.find((u) => u.id === editUserId)?.name || "",
            departmentId: editDeptId,
            departmentName:
              departments.find((d) => d.id === editDeptId)?.name || "",
          }
        : s,
    );
    formik.setFieldValue("nguoiKyList", updatedSigners);
    setEditingSignerId(null);
  };

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <DirectionsCarIcon />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {initData
                ? "CẬP NHẬT BIÊN BẢN GIÁM ĐỊNH PHƯƠNG TIỆN"
                : "TẠO BIÊN BẢN GIÁM ĐỊNH PHƯƠNG TIỆN"}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Nửa bên phải: Thông tin giám định */}
          <Grid size={{ xs: 12, md: 8 }}>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FieldInput title="Số phiếu" formik={formik} field="soPhieu" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FieldDate
                  title="Ngày giám định"
                  formik={formik}
                  field="ngayGiamDinh"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FieldInput
                  title="Vị trí giám định"
                  formik={formik}
                  field="viTri"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FieldInput
                  title="Cấp bảo dưỡng"
                  formik={formik}
                  field="capBaoDuong"
                />
              </Grid>

              <Grid size={{ xs: 12}}>
                <FieldAutoCompleted
                  title="Đơn vị sửa chữa"
                  formik={formik}
                  field="donViSuaChua"
                  data={apiDepartments}
                  labelkey="tenPhongBan"
                  
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FieldInput
                  title="Nội dung khác"
                  formik={formik}
                  field="noiDungKhac"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Right: Quy trình duyệt */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mb={2}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                Quy trình duyệt
                <Chip
                  label={`${formik.values.nguoiKyList.length} người`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 400 }}
                />
              </Typography>

              <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
                {formik.values.nguoiKyList.length > 0 ? (
                  <Box sx={{ position: "relative", pl: 5 }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: 16,
                        top: 8,
                        bottom: 8,
                        width: "1px",
                        bgcolor: "divider",
                      }}
                    />
                    {formik.values.nguoiKyList.map((s, idx) => {
                      const userItem = users.find((u) => u.id === s.userId);
                      const isEditingThis = editingSignerId === s.userId;
                      return (
                        <Box
                          key={s.userId}
                          sx={{ position: "relative", mb: 1.5 }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: -40,
                              top: 6,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              bgcolor: "background.paper",
                              border: "2px solid",
                              borderColor: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 600,
                              zIndex: 1,
                              boxShadow: "0 0 0 3px white",
                            }}
                          >
                            {idx + 1}
                          </Box>

                          <Box
                            sx={{
                              border: "1px solid",
                              borderColor: isEditingThis
                                ? "primary.main"
                                : "divider",
                              borderRadius: 2,
                              p: 1.5,
                              bgcolor: isEditingThis
                                ? "primary.50"
                                : "background.paper",
                            }}
                          >
                            {isEditingThis ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1.5,
                                }}
                              >
                                <FormControl size="small" fullWidth>
                                  <InputLabel>Đơn vị</InputLabel>
                                  <Select
                                    value={editDeptId}
                                    label="Đơn vị"
                                    onChange={(e) => {
                                      setEditDeptId(e.target.value);
                                      setEditUserId("");
                                    }}
                                  >
                                    {departments.map((d) => (
                                      <MenuItem key={d.id} value={d.id}>
                                        {d.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                  <InputLabel>Người duyệt</InputLabel>
                                  <Select
                                    value={editUserId}
                                    label="Người duyệt"
                                    onChange={(e) =>
                                      setEditUserId(e.target.value)
                                    }
                                  >
                                    {users
                                      .filter(
                                        (u) => u.departmentId === editDeptId,
                                      )
                                      .map((u) => (
                                        <MenuItem key={u.id} value={u.id}>
                                          {u.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={handleSaveEdit}
                                  >
                                    Lưu
                                  </Button>
                                  <Button
                                    size="small"
                                    color="inherit"
                                    onClick={() => setEditingSignerId(null)}
                                  >
                                    Hủy
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: "50%",
                                      bgcolor: "primary.main",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 600,
                                      fontSize: 13,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {userItem?.name?.charAt(0) ?? "?"}
                                  </Box>
                                  <Box>
                                    <Typography fontWeight={600} fontSize={13}>
                                      {userItem?.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {userItem?.title}
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {
                                          departments.find(
                                            (d) => d.id === s.departmentId,
                                          )?.name
                                        }
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Button
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => handleEdit(s)}
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleRemoveSigner(s.userId)}
                                  >
                                    Xóa
                                  </Button>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Chưa có người duyệt
                  </Alert>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel>Phòng ban</InputLabel>
                  <Select
                    value={addDeptId}
                    label="Phòng ban"
                    onChange={(e) => {
                      setAddDeptId(e.target.value);
                      setAddUserId("");
                    }}
                  >
                    {departments.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth disabled={!addDeptId}>
                  <InputLabel>Người duyệt</InputLabel>
                  <Select
                    value={addUserId}
                    label="Người duyệt"
                    onChange={(e) => setAddUserId(e.target.value)}
                  >
                    {users
                      .filter((u) => u.departmentId === addDeptId)
                      .map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.name} – {u.title}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddSigner}
                  disabled={!addUserId}
                  fullWidth
                >
                  Thêm người duyệt
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box>
          {/* Bảng chi tiết vật tư */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              DANH SÁCH CHI TIẾT VẬT TƯ
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={addMaterialRow}
            >
              Thêm dòng vật tư
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ mb: 3, maxHeight: 350 }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell width={50} sx={{ fontWeight: 700 }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Tên vật tư, chi tiết
                  </TableCell>
                  <TableCell width={100} sx={{ fontWeight: 700 }}>
                    ĐVT
                  </TableCell>
                  <TableCell width={90} sx={{ fontWeight: 700 }}>
                    Số lượng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Tình trạng kỹ thuật
                  </TableCell>
                  <TableCell width={90} sx={{ fontWeight: 700 }} align="center">
                    Thay mới
                  </TableCell>
                  <TableCell width={90} sx={{ fontWeight: 700 }} align="center">
                    Sửa chữa
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
                  <TableCell
                    width={60}
                    align="center"
                    sx={{ fontWeight: 700 }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachChiTiet
                  .map((item, origIdx) => ({ item, origIdx }))
                  .filter(({ item }) => item.action !== Action.DELETE)
                  .map(({ item: vt, origIdx }, idx) => {
                    const validationError =
                      (vt.soLuongSuaChua || 0) + (vt.soLuongThayMoi || 0) >
                      (vt.soLuong || 0);

                    return (
                      <TableRow
                        key={vt.id}
                        sx={{
                          bgcolor: validationError
                            ? "error.lighter"
                            : undefined,
                        }}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>
                          <FieldAutoCompleted
                            title="Chọn vật tư"
                            formik={formik}
                            field={`danhSachChiTiet.${origIdx}.idChiTietVatTu`}
                            value={
                              allToolDetail.find(
                                (t: any) => String(t.id) === vt.idChiTietVatTu,
                              ) || null
                            }
                            onChange={(newValue: any) => {
                              console.log("newValue", newValue);
                              updateMaterialField(vt.id!, {
                                idChiTietVatTu: newValue
                                  ? String(newValue.id)
                                  : "",
                                idVatTu: newValue
                                  ? String(newValue.idTaiSan || newValue.idVatTu || "")
                                  : "",
                                tenVatTu: newValue
                                  ? String(newValue.tenTaiSan || "")
                                  : "",
                                donViTinh: newValue
                                  ? String(newValue.donViTinh || "Cái")
                                  : "",
                              });
                            }}
                            data={allToolDetail}
                            labelkey="tenTaiSan"
                            limitOptions={20}
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            title=""
                            formik={formik}
                            field={`danhSachChiTiet.${origIdx}.donViTinh`}
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            variant="standard"
                            value={vt.soLuong || 0}
                            onChange={(e) => {
                              const val = Math.max(
                                0,
                                parseInt(e.target.value) || 0,
                              );
                              updateMaterialField(vt.id!, "soLuong", val);
                            }}
                            inputProps={{
                              style: { fontSize: "0.85rem" },
                              min: 0,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            title=""
                            formik={formik}
                            field={`danhSachChiTiet.${origIdx}.tinhTrang`}
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            variant="standard"
                            value={vt.soLuongThayMoi || 0}
                            onChange={(e) => {
                              const val = Math.max(
                                0,
                                parseInt(e.target.value) || 0,
                              );
                              updateMaterialField(
                                vt.id!,
                                "soLuongThayMoi",
                                val,
                              );
                            }}
                            inputProps={{
                              style: {
                                fontSize: "0.85rem",
                                textAlign: "center",
                              },
                              min: 0,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            variant="standard"
                            value={vt.soLuongSuaChua || 0}
                            onChange={(e) => {
                              const val = Math.max(
                                0,
                                parseInt(e.target.value) || 0,
                              );
                              updateMaterialField(
                                vt.id!,
                                "soLuongSuaChua",
                                val,
                              );
                            }}
                            inputProps={{
                              style: {
                                fontSize: "0.85rem",
                                textAlign: "center",
                              },
                              min: 0,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            variant="standard"
                            fullWidth
                            value={vt.ghiChu || ""}
                            onChange={(e) =>
                              updateMaterialField(
                                vt.id!,
                                "ghiChu",
                                e.target.value,
                              )
                            }
                            inputProps={{ style: { fontSize: "0.85rem" } }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeMaterialRow(vt.id!)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {formik.values.danhSachChiTiet.filter(
                  (v) => v.action !== Action.DELETE,
                ).length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      Chưa có dòng vật tư nào. Nhấp "Thêm dòng vật tư" để bắt
                      đầu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Live Preview */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }}>
            <Chip label="XEM TRƯỚC BIÊN BẢN GIÁM ĐỊNH" size="small" />
          </Divider>
          <Box
            sx={{
              fontFamily: "serif",
              fontSize: "0.875rem",
              lineHeight: 1.8,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              bgcolor: "#fff",
              color: "#333",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" display="block">
                  TẬP ĐOÀN CÔNG NGHIỆP
                </Typography>
                <Typography variant="caption" display="block">
                  THAN – KHOÁNG SẢN VIỆT NAM
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  fontWeight={700}
                  sx={{ textTransform: "uppercase" }}
                >
                  <u>CÔNG TY THAN UÔNG BÍ - TKV</u>
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" display="block" fontWeight={700}>
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </Typography>
                <Typography variant="caption" display="block" fontWeight={700}>
                  <u>Độc lập – Tự do – Hạnh phúc</u>
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="caption"
              display="block"
              sx={{ textAlign: "right", fontStyle: "italic", mb: 2 }}
            >
              Quảng Ninh, ngày {new Date(formik.values.ngayGiamDinh).getDate()}{" "}
              tháng {new Date(formik.values.ngayGiamDinh).getMonth() + 1} năm{" "}
              {new Date(formik.values.ngayGiamDinh).getFullYear()}
            </Typography>

            <Typography
              variant="subtitle1"
              align="center"
              fontWeight={700}
              display="block"
              sx={{ color: "primary.main", mb: 0.5 }}
            >
              BIÊN BẢN GIÁM ĐỊNH KỸ THUẬT VÀ BÀN GIAO THIẾT BỊ
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              fontWeight={700}
              display="block"
              sx={{ mb: 2 }}
            >
              VÀO SỬA CHỮA
            </Typography>

            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Hôm nay, ngày {new Date(formik.values.ngayGiamDinh).getDate()}{" "}
              tháng {new Date(formik.values.ngayGiamDinh).getMonth() + 1} năm{" "}
              {new Date(formik.values.ngayGiamDinh).getFullYear()}. Tại{" "}
              {formik.values.viTri || "……………………………"}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Chúng tôi gồm :
            </Typography>

            <Box sx={{ pl: 2, mb: 1.5 }}>
              {groupSignersByDept(formik.values.nguoiKyList).map(
                (group, gIdx) => (
                  <Box key={gIdx} sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      display="block"
                      sx={{ mb: 0.25 }}
                    >
                      * {group.deptName}:
                    </Typography>
                    <Box sx={{ pl: 3 }}>
                      {group.members.map((member, mIdx) => (
                        <Box
                          key={member.userId || mIdx}
                          sx={{
                            display: "flex",
                            mb: 0.25,
                            alignItems: "baseline",
                          }}
                        >
                          <Typography variant="caption" sx={{ width: 25 }}>
                            {mIdx + 1}.
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ width: 200, fontWeight: 500 }}
                          >
                            Ông: {member.userName || "………………………"}
                          </Typography>
                          <Typography variant="caption">
                            Chức vụ: {member.position || "—"}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ),
              )}
              {formik.values.nguoiKyList.length === 0 && (
                <Typography
                  variant="caption"
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  (Chưa chọn thành phần tham gia)
                </Typography>
              )}
            </Box>

            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              Cùng thực hiện giải thể kiểm tra tình trạng kỹ thuật thiết bị:{" "}
              {formik.values.tenTaiSan || ".............."} trước khi vào sửa
              chữa bảo dưỡng cấp {formik.values.capBaoDuong || "............"}{" "}
              và bàn giao cho phân xưởng{" "}
              {formik.values.donViSuaChua || "............."} sửa chữa với tình
              trạng kỹ thuật và nội dung sửa chữa sau:
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell
                      sx={{ fontWeight: 700, width: 45, fontSize: "0.75rem" }}
                    >
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                      TÊN CHI TIẾT
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 70, fontSize: "0.75rem" }}
                    >
                      ĐVT
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 50, fontSize: "0.75rem" }}
                    >
                      Số lượng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                      Tình trạng kỹ thuật
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, width: 80, fontSize: "0.75rem" }}
                    >
                      Thay mới
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, width: 80, fontSize: "0.75rem" }}
                    >
                      Sửa chữa
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 120, fontSize: "0.75rem" }}
                    >
                      Ghi chú
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.danhSachChiTiet
                    .filter((v) => v.action !== Action.DELETE)
                    .map((vt, vtIdx) => (
                      <TableRow key={vt.id || vtIdx}>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vtIdx + 1}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.tenVatTu || vt.idChiTietVatTu || "—"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.donViTinh || "—"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.soLuong || 0}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.tinhTrang || "—"}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                          {vt.soLuongThayMoi || 0}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.75rem" }}>
                          {vt.soLuongSuaChua || 0}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem" }}>
                          {vt.ghiChu || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  {formik.values.danhSachChiTiet.filter(
                    (v) => v.action !== Action.DELETE,
                  ).length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        align="center"
                        sx={{ py: 2, fontSize: "0.75rem", fontStyle: "italic" }}
                      >
                        Chưa có vật tư nào được liệt kê trong biên bản giám định
                        phương tiện.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography
              variant="caption"
              display="block"
              sx={{ mb: 1.5, whiteSpace: "pre-line" }}
            >
              Các nội dung cần thống nhất khác:{" "}
              {formik.values.noiDungKhac || "................."}
            </Typography>

            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
              Biên bản lập xong hồi: .... giờ ....cùng ngày, đã được mọi người
              nhất trí thông qua
            </Typography>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {(() => {
                const sorted = [...(formik.values.nguoiKyList || [])].sort(
                  (a, b) => (a.order || 0) - (b.order || 0),
                );

                if (sorted.length === 0) {
                  return (
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography variant="caption" color="text.disabled">
                        Chưa có người ký duyệt
                      </Typography>
                    </Box>
                  );
                }

                return sorted.map((col, idx) => (
                  <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      display="block"
                      sx={{ textTransform: "uppercase", mb: 0.5 }}
                    >
                      {(col.departmentName || "").toUpperCase()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ fontStyle: "italic", mb: 4 }}
                    >
                      (Ký, ghi rõ họ tên)
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "text.primary",
                        width: "70%",
                        mx: "auto",
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      display="block"
                    >
                      {col.userName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {col.position}
                    </Typography>
                  </Box>
                ));
              })()}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={
            formik.values.nguoiKyList.length === 0 || hasValidationError()
          }
          onClick={() => formik.handleSubmit()}
        >
          {initData ? "Cập nhật" : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InspectionRecordVehicleDialog;
