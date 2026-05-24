import React, { useState, useEffect } from "react";
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
  Chip,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import RecyclingIcon from "@mui/icons-material/Recycling";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  AcceptanceTestRecordData,
  MaintenancePlanData,
} from "../../../MainenancePlanRepair/types";
import {
  MaintenanceRepairData,
  DanhGiaVatTuData,
  ChiTietVatTuThuHoiData,
} from "../../types";
import FieldDate from "../../../../components/TextField/FieldDate";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { generateCode } from "../../../../utils/helpers";
import { useMaintenanceMaterialAssessmentMutation } from "../../../MainenancePlanRepair/Mutation";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";
import { CongTy, Action } from "../../../../utils/const";
import { listSigneInfo } from "../../config";

export const BIEN_PHAP_XU_LY = {
  PHUC_HOI: "Phục hồi",
  PHE_LIEU: "Phế liệu",
  HUY: "Hủy",
} as const;

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
  repairRequest: MaintenanceRepairData;
  acceptanceRecord: AcceptanceTestRecordData;
  initData?: DanhGiaVatTuData | null;
}

const MaterialDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  acceptanceRecord,
  initData,
}: Props) => {
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();
  const { data: allLevel = [] } = useAllLoaiSCBDQuery();
  const { createMutation, updateMutation } =
    useMaintenanceMaterialAssessmentMutation();

  const { user } = useSelector((state: any) => state.user);

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

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      soPhieu: `BB-DG-`,
      ngayDanhGia: dayjs().format("YYYY-MM-DD"),
      viTri: acceptanceRecord.viTri || "",
      capSuaChua: acceptanceRecord.capSuaChua || "",
      tenThietBi: acceptanceRecord.tenThietBi || "",
      kieu: "",
      soDangKi: acceptanceRecord.soDangKi || "",
      idDonViQuanLy: plan.tenDonViGiao || "",
      idNghiemThu: acceptanceRecord.id || "",
      soLuongPhucHoi: 0,
      soLuongPheLieu: 0,
      soLuongHuy: 0,
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      danhSachChiTiet: [] as ChiTietVatTuThuHoiData[],
      nguoiKyList: [] as any[],
    },
    onSubmit: (values) => {
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

      const record: DanhGiaVatTuData = {
        id: values.id || undefined,
        idCongTy: values.idCongTy,
        soPhieu: values.soPhieu,
        ngayDanhGia: values.ngayDanhGia,
        viTri: values.viTri,
        capSuaChua: values.capSuaChua,
        tenThietBi: values.tenThietBi,
        kieu: values.kieu,
        soDangKi: values.soDangKi,
        idDonViQuanLy: values.idDonViQuanLy,
        idNghiemThu: values.idNghiemThu,
        soLuongPhucHoi: Number(values.soLuongPhucHoi || 0),
        soLuongPheLieu: Number(values.soLuongPheLieu || 0),
        soLuongHuy: Number(values.soLuongHuy || 0),
        idNguoiLap: idNguoiLapBieu,
        nguoiLapXacNhan: values.nguoiLapXacNhan || false,
        idGiamDoc: idTrinhDuyetGiamDoc,
        giamDocXacNhan: values.giamDocXacNhan || false,
        share: values.share || false,
        trangThai: values.trangThai || 0,
        nguoiKyList: intermediateSigners,
        danhSachChiTiet: values.danhSachChiTiet.map((vt) => ({
          id: vt.id || undefined,
          idDanhGiaVatTu: values.id || undefined,
          idChiTietVatTu: vt.idChiTietVatTu || "",
          idVatTu: vt.idVatTu || "",
          tenVatTu: vt.tenVatTu || "",
          donViTinh: vt.donViTinh || "Cái",
          soLuong: Number(vt.soLuong || 0),
          tinhTrang: vt.tinhTrang || "",
          bienPhapXuLy: vt.bienPhapXuLy || "",
          ghiChu: vt.ghiChu || "",
        })),
      };

      if (initData) {
        updateMutation.mutate(record, {
          onSuccess: () => handleClose(),
        });
      } else {
        createMutation.mutate(record, {
          onSuccess: () => handleClose(),
        });
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
          soPhieu: initData.soPhieu ?? `BB-DG-`,
          ngayDanhGia: initData.ngayDanhGia ?? dayjs().format("YYYY-MM-DD"),
          viTri: initData.viTri ?? "",
          capSuaChua: initData.capSuaChua ?? "",
          tenThietBi: initData.tenThietBi ?? "",
          kieu: initData.kieu ?? "",
          soDangKi: initData.soDangKi ?? "",
          idDonViQuanLy: initData.idDonViQuanLy ?? "",
          idNghiemThu: initData.idNghiemThu ?? "",
          soLuongPhucHoi: initData.soLuongPhucHoi ?? 0,
          soLuongPheLieu: initData.soLuongPheLieu ?? 0,
          soLuongHuy: initData.soLuongHuy ?? 0,
          idNguoiLap: initData.idNguoiLap ?? "",
          nguoiLapXacNhan: initData.nguoiLapXacNhan ?? false,
          idGiamDoc: initData.idGiamDoc ?? "",
          giamDocXacNhan: initData.giamDocXacNhan ?? false,
          share: initData.share ?? false,
          trangThai: initData.trangThai ?? 0,
          danhSachChiTiet: (initData.danhSachChiTiet || []).map((vt) => ({
            ...vt,
            action: Action.UPDATE,
          })) as ChiTietVatTuThuHoiData[],
          nguoiKyList: (listInfo ?? []).map((item: any) => ({
            userId: item.idNhanVien,
            userName: item.hoTen,
            departmentId: item.idDonVi,
            departmentName: item.donVi,
          })),
        });
      } else {
        const list: ChiTietVatTuThuHoiData[] = [];
        (acceptanceRecord.danhSachTaiSan || []).forEach((ts) => {
          (ts.danhSachVatTu || []).forEach((vt) => {
            if (vt.action !== Action.DELETE) {
              list.push({
                idChiTietVatTu: vt.idChiTietVatTu || "",
                idVatTu: vt.idVatTu || "",
                tenVatTu: vt.tenVatTu || "",
                donViTinh: vt.donViTinh || "Cái",
                soLuong: vt.soLuong || 1,
                tinhTrang: "",
                bienPhapXuLy: "",
                ghiChu: "",
              });
            }
          });
        });

        formik.setValues({
          id: "",
          idCongTy: CongTy.CT001,
          soPhieu: `BB-DG-${repairRequest?.id || Date.now()}`,
          ngayDanhGia: dayjs().format("YYYY-MM-DD"),
          viTri: acceptanceRecord.viTri || "",
          capSuaChua: acceptanceRecord.capSuaChua || "",
          tenThietBi: acceptanceRecord.tenThietBi || "",
          kieu: "",
          soDangKi: acceptanceRecord.soDangKi || "",
          idDonViQuanLy: plan.tenDonViGiao || "",
          idNghiemThu: acceptanceRecord.id || "",
          soLuongPhucHoi: 0,
          soLuongPheLieu: 0,
          soLuongHuy: 0,
          idNguoiLap: "",
          nguoiLapXacNhan: false,
          idGiamDoc: "",
          giamDocXacNhan: false,
          share: false,
          trangThai: 0,
          danhSachChiTiet:
            list.length > 0
              ? list
              : [
                  {
                    idChiTietVatTu: "",
                    idVatTu: "",
                    tenVatTu: "",
                    donViTinh: "Cái",
                    soLuong: 1,
                    tinhTrang: "",
                    bienPhapXuLy: "",
                    ghiChu: "",
                  },
                ],
          nguoiKyList: [] as any[],
        });
      }
    }
  }, [
    open,
    initData,
    acceptanceRecord,
    apiUsers,
    apiDepartments,
    plan,
    repairRequest,
  ]);

  // Automatically calculate quantities based on selected treatment action (bienPhapXuLy)
  const listItems = formik.values.danhSachChiTiet;
  useEffect(() => {
    let phucHoi = 0;
    let pheLieu = 0;
    let huy = 0;
    listItems.forEach((item) => {
      const qty = Number(item.soLuong) || 0;
      if (item.bienPhapXuLy === BIEN_PHAP_XU_LY.PHUC_HOI) {
        phucHoi += qty;
      } else if (item.bienPhapXuLy === BIEN_PHAP_XU_LY.PHE_LIEU) {
        pheLieu += qty;
      } else if (item.bienPhapXuLy === BIEN_PHAP_XU_LY.HUY) {
        huy += qty;
      }
    });

    if (
      formik.values.soLuongPhucHoi !== phucHoi ||
      formik.values.soLuongPheLieu !== pheLieu ||
      formik.values.soLuongHuy !== huy
    ) {
      formik.setFieldValue("soLuongPhucHoi", phucHoi);
      formik.setFieldValue("soLuongPheLieu", pheLieu);
      formik.setFieldValue("soLuongHuy", huy);
    }
  }, [
    listItems,
    formik.values.soLuongPhucHoi,
    formik.values.soLuongPheLieu,
    formik.values.soLuongHuy,
  ]);

  // Signers local states
  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const addItem = () => {
    const newItem = {
      idChiTietVatTu: "",
      idVatTu: "",
      tenVatTu: "",
      donViTinh: "Cái",
      soLuong: 1,
      tinhTrang: "",
      bienPhapXuLy: "",
      ghiChu: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("danhSachChiTiet", [
      ...formik.values.danhSachChiTiet,
      newItem,
    ]);
  };

  const removeItem = (idx: number) => {
    const updatedList = formik.values.danhSachChiTiet.filter(
      (_, i) => i !== idx,
    );
    formik.setFieldValue("danhSachChiTiet", updatedList);
  };

  const updateItemFields = (
    idx: number,
    fields: Partial<ChiTietVatTuThuHoiData>,
  ) => {
    const updatedList = formik.values.danhSachChiTiet.map((it, i) => {
      if (i === idx) {
        return {
          ...it,
          ...fields,
        };
      }
      return it;
    });
    formik.setFieldValue("danhSachChiTiet", updatedList);
  };

  const updateItem = (
    idx: number,
    field: keyof ChiTietVatTuThuHoiData,
    value: string | number,
  ) => {
    updateItemFields(idx, { [field]: value });
  };

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (formik.values.nguoiKyList.some((s) => s.userId === addUserId)) return;
    const user = users.find((u) => u.id === addUserId);
    const dept = departments.find((d) => d.id === addDeptId);
    if (!user || !dept) return;
    const updated = [
      ...formik.values.nguoiKyList,
      {
        userId: user.id,
        userName: user.name,
        departmentId: dept.id,
        departmentName: dept.name,
        order: formik.values.nguoiKyList.length + 1,
        signed: false,
      },
    ];
    formik.setFieldValue("nguoiKyList", updated);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    const updated = formik.values.nguoiKyList
      .filter((s: any) => s.userId !== userId)
      .map((s: any, i: number) => ({ ...s, order: i + 1 }));
    formik.setFieldValue("nguoiKyList", updated);
  };

  const handleEditSigner = (signer: any) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEditSigner = () => {
    const updated = formik.values.nguoiKyList.map((s: any) =>
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
    formik.setFieldValue("nguoiKyList", updated);
    setEditingSignerId(null);
  };

  const handleClose = () => {
    setEditingSignerId(null);
    onClose();
  };

  const d = formik.values.ngayDanhGia
    ? new Date(formik.values.ngayDanhGia)
    : new Date();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RecyclingIcon color="warning" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biên bản đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Căn cứ BB nghiệm thu: {acceptanceRecord.soPhieu || ""}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {/* 2-column grid: Thông tin | Quy trình duyệt */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 3 }}>
          {/* Col 1: Thông tin */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 2.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Thông tin
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Số biên bản"
                name="soPhieu"
                value={formik.values.soPhieu}
                onChange={formik.handleChange}
                placeholder={`VD: BB-DG-${repairRequest?.id}`}
                size="small"
                fullWidth
              />
              <FieldDate
                title="Ngày lập biên bản"
                selectedDate={formik.values.ngayDanhGia}
                setSelectedDate={(date) =>
                  formik.setFieldValue("ngayDanhGia", date)
                }
              />
              <TextField
                label="Địa điểm (Tại...)"
                name="viTri"
                value={formik.values.viTri}
                onChange={formik.handleChange}
                size="small"
                fullWidth
                placeholder="vd: Phân xưởng khai thác 1, khu vực A"
              />
              <FieldAutoCompleted
                title="Cấp sửa chữa"
                labelkey="ten"
                data={allLevel}
                value={formik.values.capSuaChua}
                onChange={(value) =>
                  formik.setFieldValue("capSuaChua", value.id)
                }
                autocompleteSx={{ flex: 1 }}
              />
              <TextField
                label="Của thiết bị"
                name="tenThietBi"
                value={formik.values.tenThietBi}
                onChange={formik.handleChange}
                size="small"
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Kiểu"
                  name="kieu"
                  value={formik.values.kieu}
                  onChange={formik.handleChange}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Số (đăng ký)"
                  name="soDangKi"
                  value={formik.values.soDangKi}
                  onChange={formik.handleChange}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
              <FieldAutoCompleted
                title="Đơn vị quản lý vận hành"
                data={apiDepartments}
                value={formik.values.idDonViQuanLy}
                setValue={(val) => formik.setFieldValue("idDonViQuanLy", val)}
                labelkey="tenPhongBan"
              />
            </Box>
          </Box>

          {/* Col 2: Quy trình duyệt */}
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
                    const user = users.find((u) => u.id === s.userId);
                    const isEditingThis = editingSignerId === s.userId;
                    return (
                      <Box
                        key={s.userId}
                        sx={{ position: "relative", mb: 1.5 }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: -37,
                            top: 14,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
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
                                  size="small"
                                  onClick={handleSaveEditSigner}
                                >
                                  Lưu
                                </Button>
                                <Button
                                  size="small"
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
                                  {user?.name?.charAt(0) ?? "?"}
                                </Box>
                                <Box>
                                  <Typography fontWeight={600} fontSize={13}>
                                    {user?.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {user?.title}
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
                                  variant="outlined"
                                  onClick={() => handleEditSigner(s)}
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
                <Typography variant="body2" color="text.secondary">
                  Chưa có người duyệt
                </Typography>
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
                <InputLabel>Đơn vị</InputLabel>
                <Select
                  value={addDeptId}
                  label="Đơn vị"
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
                      <MenuItem
                        key={u.id}
                        value={u.id}
                        disabled={formik.values.nguoiKyList.some(
                          (s) => s.userId === u.id,
                        )}
                      >
                        {u.name} – {u.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleAddSigner}
                disabled={!addUserId}
              >
                Thêm người duyệt
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Full-width: Danh mục vật tư thu hồi */}
        <Box
          sx={{
            mt: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Danh mục vật tư thu hồi
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addItem}
              variant="outlined"
            >
              Thêm dòng
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Tên vật tư, thiết bị
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 55 }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 50 }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Biện pháp xử lý
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>
                    Ghi chú
                  </TableCell>
                  <TableCell sx={{ width: 36 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachChiTiet
                  .map((item, originalIdx) => ({ item, originalIdx }))
                  .map(({ item, originalIdx }, idx) => (
                    <TableRow key={originalIdx}>
                      <TableCell>{String(idx + 1).padStart(2, "0")}</TableCell>
                      <TableCell>
                        <FieldAutoCompleted
                          title=""
                          data={allToolDetail}
                          labelkey="tenTaiSan"
                          limitOptions={10}
                          value={item.idChiTietVatTu}
                          noBorder={true}
                          onChange={(value) => {
                             updateItemFields(originalIdx, {
                               idChiTietVatTu: value?.id ?? "",
                               idVatTu: value?.idTaiSan ?? "",
                               tenVatTu: value?.tenTaiSan ?? "",
                               donViTinh: value?.donViTinh ?? "Cái",
                             });
                           }}
                        />
                      </TableCell>
                      <TableCell>{item.donViTinh}</TableCell>
                      <TableCell>
                        <TextField
                          value={item.soLuong}
                          size="small"
                          variant="standard"
                          onChange={(e) =>
                            updateItem(
                              originalIdx,
                              "soLuong",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          inputProps={{ style: { width: 36 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.tinhTrang}
                          size="small"
                          variant="standard"
                          fullWidth
                          onChange={(e) =>
                            updateItem(originalIdx, "tinhTrang", e.target.value)
                          }
                          placeholder="Mô tả tình trạng..."
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.bienPhapXuLy || ""}
                          size="small"
                          variant="standard"
                          fullWidth
                          displayEmpty
                          onChange={(e) =>
                            updateItem(
                              originalIdx,
                              "bienPhapXuLy",
                              e.target.value as string,
                            )
                          }
                        >
                          <MenuItem value="">
                            <span style={{ color: "#aaa" }}>-- Chọn --</span>
                          </MenuItem>
                          <MenuItem value={BIEN_PHAP_XU_LY.PHUC_HOI}>
                            {BIEN_PHAP_XU_LY.PHUC_HOI}
                          </MenuItem>
                          <MenuItem value={BIEN_PHAP_XU_LY.PHE_LIEU}>
                            {BIEN_PHAP_XU_LY.PHE_LIEU}
                          </MenuItem>
                          <MenuItem value={BIEN_PHAP_XU_LY.HUY}>
                            {BIEN_PHAP_XU_LY.HUY}
                          </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.ghiChu}
                          size="small"
                          variant="standard"
                          fullWidth
                          onChange={(e) =>
                            updateItem(originalIdx, "ghiChu", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(originalIdx)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Số lượng phân loại */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Số để lại phục hồi"
              type="number"
              size="small"
              value={formik.values.soLuongPhucHoi}
              onChange={(e) =>
                formik.setFieldValue(
                  "soLuongPhucHoi",
                  Math.max(0, parseInt(e.target.value) || 0),
                )
              }
              sx={{ width: 200 }}
            />
            <TextField
              label="Số phế liệu"
              type="number"
              size="small"
              value={formik.values.soLuongPheLieu}
              onChange={(e) =>
                formik.setFieldValue(
                  "soLuongPheLieu",
                  Math.max(0, parseInt(e.target.value) || 0),
                )
              }
              sx={{ width: 200 }}
            />
            <TextField
              label="Số hủy"
              type="number"
              size="small"
              value={formik.values.soLuongHuy}
              onChange={(e) =>
                formik.setFieldValue(
                  "soLuongHuy",
                  Math.max(0, parseInt(e.target.value) || 0),
                )
              }
              sx={{ width: 200 }}
            />
          </Box>
        </Box>

        {/* Full-width Preview */}
        <Box
          sx={{
            mt: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 2.5,
            fontFamily: "serif",
            fontSize: "0.875rem",
            lineHeight: 1.8,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="caption" display="block">
                TẬP ĐOÀN CÔNG NGHIỆP
              </Typography>
              <Typography variant="caption" display="block">
                THAN – KHOÁNG SẢN VIỆT NAM
              </Typography>
              <Typography variant="caption" display="block" fontWeight={700}>
                CÔNG <u>TY THAN UÔNG BÍ</u> - TKV
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
            Quảng Ninh, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
            {d.getFullYear()}
          </Typography>

          <Typography
            variant="subtitle2"
            align="center"
            fontWeight={700}
            sx={{ color: "primary.main", mb: 0.25 }}
          >
            BIÊN BẢN
          </Typography>
          <Typography
            variant="subtitle2"
            align="center"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            ĐÁNH GIÁ CHẤT LƯỢNG VẬT TƯ PHỤ TÙNG THU HỒI SAU SỬA CHỮA
          </Typography>

          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
            {d.getFullYear()}. Tại {formik.values.viTri || "………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hội đồng đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            cấp: <b>{formik.values.capSuaChua || "……………"}</b>
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Của thiết bị: <b>{formik.values.tenThietBi || "……………"}</b> Kiểu:{" "}
            {formik.values.kieu || "………"} Số:{" "}
            {formik.values.soDangKi || "……………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Đơn vị quản lý vận hành: {formik.values.idDonViQuanLy || "………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Thành phần gồm:
          </Typography>
          <Box sx={{ pl: 2, mb: 1.5 }}>
            {formik.values.nguoiKyList.map((s, i) => (
              <Box key={i} sx={{ display: "flex", gap: 3, mb: 0.25 }}>
                <Typography variant="caption" sx={{ minWidth: 16 }}>
                  {i + 1}.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ minWidth: 150, fontWeight: 500 }}
                >
                  {s.userName || "………………………"}
                </Typography>
                <Typography variant="caption" sx={{ minWidth: 120 }}>
                  {s.position || "………………………"}
                </Typography>
                <Typography variant="caption">{s.departmentName}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Đã tiến hành kiểm tra chi tiết các vật tư phụ tùng thu hồi sau sửa
            chữa cụ thể như sau:
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell
                    sx={{ fontWeight: 700, width: 40, fontSize: "0.72rem" }}
                  >
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Tên vật tư, thiết bị
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 45, fontSize: "0.72rem" }}
                  >
                    ĐVT
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 40, fontSize: "0.72rem" }}
                  >
                    SL
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Tình trạng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Biện pháp xử lý
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 70, fontSize: "0.72rem" }}
                  >
                    Ghi chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachChiTiet.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.tenVatTu}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.donViTinh}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.soLuong}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.tinhTrang}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.bienPhapXuLy}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.ghiChu}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" display="block">
            Số để lại phục hồi phục vụ cho sản xuất:{" "}
            {formik.values.soLuongPhucHoi || "…………"}.
          </Typography>
          <Typography variant="caption" display="block">
            Số để làm phế liệu: {formik.values.soLuongPheLieu || "…………"} (mục)
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Số lượng hủy: {formik.values.soLuongHuy || "…………"} (mục)
          </Typography>

          <Divider sx={{ mb: 2 }} />

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
              const cols = sorted.map((s, idx) => ({
                label: (s.departmentName || "").toUpperCase(),
                signer: s,
              }));

              if (cols.length === 0) {
                return (
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography variant="caption" color="text.disabled">
                      Chưa có người duyệt
                    </Typography>
                  </Box>
                );
              }

              return cols.map((col, idx) => (
                <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    display="block"
                    sx={{ textTransform: "uppercase", mb: 0.5 }}
                  >
                    {col.label}
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
                  {col.signer ? (
                    <>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        display="block"
                      >
                        {col.signer.userName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {col.signer.departmentName}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      Chưa chọn
                    </Typography>
                  )}
                </Box>
              ));
            })()}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip label="Trạng thái: Chờ duyệt" color="warning" size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              * Biên bản này thực tế có thể có hoặc không (tùy trường hợp cụ
              thể)
            </Typography>
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
          color="warning"
          disabled={formik.values.nguoiKyList.length === 0}
          onClick={() => formik.handleSubmit()}
        >
          {initData ? "Cập nhật biên bản" : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDialog;
