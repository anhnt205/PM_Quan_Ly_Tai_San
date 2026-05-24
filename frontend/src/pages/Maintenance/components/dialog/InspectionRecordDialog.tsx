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
  Alert,
  IconButton,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSelector } from "react-redux";
import {
  MaintenancePlanData,
  InspectionRecordVatTuData,
  InspectionRecordData,
  InspectionRecordDetailData,
} from "../../../MainenancePlanRepair/types";
import { IncidentInspectionData, MaintenanceRepairData } from "../../types";
import { useMaintenanceInspectionMutation } from "../../../MainenancePlanRepair/Mutation";
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
  initData?: InspectionRecordData | null;
}

const InspectionRecordDialog = ({
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

  const { createMutation, updateMutation } = useMaintenanceInspectionMutation();

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
      soDeLaiPhucHoi: 0,
      soDeLamPheLieu: 0,
      soLuongHuy: 0,
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      danhSachChiTiet: [] as InspectionRecordDetailData[],
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
        soDeLaiPhucHoi: values.soDeLaiPhucHoi,
        soDeLamPheLieu: values.soDeLamPheLieu,
        soLuongHuy: values.soLuongHuy,
        idNguoiLap: idNguoiLapBieu,
        nguoiLapXacNhan: false,
        idGiamDoc: idTrinhDuyetGiamDoc,
        giamDocXacNhan: false,
        trangThai: 0,
        share: false,
        danhSachChiTiet: values.danhSachChiTiet.map((e) => {
          const actualDetailId = e.id ? e.id : generateCode("GDCT_");
          return {
            id: actualDetailId,
            idTaiSan: e.idTaiSan,
            idBienBanChiTiet: e.idBienBanChiTiet,
            danhSachVatTu: (e.danhSachVatTu || []).map((vt) => ({
              id: vt.id ? vt.id : generateCode("GDVT_"),
              idChiTietGiamDinh: actualDetailId,
              idVatTu: vt.idVatTu,
              idChiTietVatTu: vt.idChiTietVatTu,
              soLuong: vt.soLuong,
              tinhTrang: vt.tinhTrang,
              soLuongSuaChua: vt.soLuongSuaChua,
              soLuongThayMoi: vt.soLuongThayMoi,
              ghiChu: vt.ghiChu,
              action: vt.action || Action.CREATE,
            })),
            action: e.action || Action.CREATE,
          };
        }),
        nguoiKyList: intermediateSigners,
      };
      if (initData) {
        updateMutation.mutate(record, {
          onSuccess: () => {
            handleClose();
          },
        });
      } else {
        createMutation.mutate(record, {
          onSuccess: () => {
            handleClose();
          },
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
          idBienBan: initData.idBienBan ?? "",
          loaiBienBan: initData.loaiBienBan ?? "",
          soPhieu: initData.soPhieu ?? "",
          ngayGiamDinh: initData.ngayGiamDinh ?? "",
          viTri: initData.viTri ?? "",
          soDeLaiPhucHoi: initData.soDeLaiPhucHoi ?? 0,
          soDeLamPheLieu: initData.soDeLamPheLieu ?? 0,
          soLuongHuy: initData.soLuongHuy ?? 0,
          idNguoiLap: initData.idNguoiLap ?? "",
          nguoiLapXacNhan: initData.nguoiLapXacNhan ?? false,
          idGiamDoc: initData.idGiamDoc ?? "",
          giamDocXacNhan: initData.giamDocXacNhan ?? false,
          share: initData.share ?? false,
          trangThai: initData.trangThai ?? 0,
          danhSachChiTiet: (initData.danhSachChiTiet ?? []).map((e: any) => ({
            ...e,
            danhSachVatTu: (e.danhSachVatTu || []).map((vt: any) => ({
              ...vt,
              action: Action.UPDATE,
            })),
            action: Action.UPDATE,
          })) as InspectionRecordDetailData[],
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
          soDeLaiPhucHoi: 0,
          soDeLamPheLieu: 0,
          soLuongHuy: 0,
          idNguoiLap: "",
          nguoiLapXacNhan: false,
          idGiamDoc: "",
          giamDocXacNhan: false,
          share: false,
          trangThai: 0,
          danhSachChiTiet: (
            repairRequest?.danhSachTaiSan ||
            incidentInspection?.danhSachChiTiet ||
            []
          ).map((e: any) => ({
            ...e,
            id: "",
            idBienBanChiTiet: e.id,
          })) as InspectionRecordDetailData[],
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

  const addMaterialRow = (assetIdx: number) => {
    const newMaterial: InspectionRecordVatTuData = {
      id: "GDVT_" + Math.random().toString(36).substr(2, 9),
      idChiTietGiamDinh: formik.values.danhSachChiTiet[assetIdx].id,
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
    const updatedEntries = formik.values.danhSachChiTiet.map((e, idx) => {
      if (idx === assetIdx) {
        return {
          ...e,
          danhSachVatTu: [...(e.danhSachVatTu || []), newMaterial],
        };
      }
      return e;
    });
    formik.setFieldValue("danhSachChiTiet", updatedEntries);
  };

  const removeMaterialRow = (assetIdx: number, materialId: string) => {
    const updatedEntries = formik.values.danhSachChiTiet.map((e, idx) => {
      if (idx === assetIdx) {
        const updatedVatTu = (e.danhSachVatTu || []).map((m) => {
          if (m.id === materialId) {
            return { ...m, action: Action.DELETE };
          }
          return m;
        });

        return {
          ...e,
          danhSachVatTu: updatedVatTu,
        };
      }
      return e;
    });
    formik.setFieldValue("danhSachChiTiet", updatedEntries);
  };

  const updateMaterial = (
    assetIdx: number,
    materialId: string,
    fieldOrChanges:
      | keyof InspectionRecordVatTuData
      | Partial<InspectionRecordVatTuData>,
    value?: any,
  ) => {
    const updatedEntries = formik.values.danhSachChiTiet.map((e, idx) => {
      if (idx === assetIdx) {
        return {
          ...e,
          danhSachVatTu: (e.danhSachVatTu || []).map((m) => {
            if (m.id === materialId) {
              if (typeof fieldOrChanges === "string") {
                return { ...m, [fieldOrChanges]: value };
              } else {
                return { ...m, ...fieldOrChanges };
              }
            }
            return m;
          }),
        };
      }
      return e;
    });
    formik.setFieldValue("danhSachChiTiet", updatedEntries);
  };

  const handleQuantityChange = (
    assetIdx: number,
    materialId: string,
    field: "soLuong" | "soLuongSuaChua" | "soLuongThayMoi",
    value: number,
  ) => {
    updateMaterial(assetIdx, materialId, field, value);
  };

  function hasValidationError() {
    for (const entry of formik.values.danhSachChiTiet) {
      if (entry.danhSachVatTu) {
        for (const vt of entry.danhSachVatTu) {
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
    setAddDeptId("");
    setAddUserId("");
    onClose();
    formik.resetForm();
  }

  const referenceLabel = repairRequest
    ? `${repairRequest.soPhieu || repairRequest.id} — Tháng ${repairRequest.thang}/${repairRequest.nam}`
    : `Kế hoạch: ${plan.id}`;

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
          <EngineeringIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biên bản giám định kỹ thuật và bàn giao thiết bị đưa vào sửa chữa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Căn cứ: {referenceLabel}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {repairRequest?.danhSachTaiSan?.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Không có thiết bị nào để giám định. Vui lòng kiểm tra lại dữ liệu
            đầu vào.
          </Alert>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 3 }}>
          {/* Left: Thông tin + Số lượng vật tư */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Thông tin chung
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Số biên bản"
                  name="soPhieu"
                  value={formik.values.soPhieu}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                />
                <FieldDate
                  title="Ngày giám định"
                  selectedDate={formik.values.ngayGiamDinh}
                  setSelectedDate={(val) =>
                    formik.setFieldValue("ngayGiamDinh", val)
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
                {repairRequest ? (
                  <Typography variant="body2" color="text.secondary">
                    Căn cứ vào giấy đề nghị: <b>{repairRequest.soPhieu}</b> —
                    Ngày tạo: <b>{repairRequest.ngayTao}</b>
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Căn cứ vào BB Kiểm tra sự cố — Kế hoạch: <b>{plan.id}</b>
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Số lượng vật tư thu hồi
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  {
                    label: "Số để lại phục hồi phục vụ cho sản xuất",
                    value: formik.values.soDeLaiPhucHoi,
                    setter: (val: number) =>
                      formik.setFieldValue("soDeLaiPhucHoi", val),
                  },
                  {
                    label: "Số để làm phế liệu (mục)",
                    value: formik.values.soDeLamPheLieu,
                    setter: (val: number) =>
                      formik.setFieldValue("soDeLamPheLieu", val),
                  },
                  {
                    label: "Số lượng hủy (mục)",
                    value: formik.values.soLuongHuy,
                    setter: (val: number) =>
                      formik.setFieldValue("soLuongHuy", val),
                  },
                ].map(({ label, value, setter }) => (
                  <Box
                    key={label}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {label}:
                    </Typography>
                    <TextField
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setter(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      size="small"
                      inputProps={{ min: 0, style: { width: 120 } }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

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
                                  size="small"
                                  onClick={handleSaveEdit}
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
                startIcon={<PersonAddIcon />}
                onClick={handleAddSigner}
                disabled={!addUserId}
                fullWidth
              >
                Thêm người duyệt
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Tình trạng thiết bị */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            Tình trạng chi tiết thiết bị & vật tư linh kiện đưa vào sửa chữa
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700, width: 60 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>
                    Tên Thiết bị / Vật tư phụ tùng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 60 }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 70 }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>
                    Tình trạng KT
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: 90 }}>
                    Sửa chữa
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, width: 90 }}>
                    Thay mới
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                    Ghi chú
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 60 }} align="center">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachChiTiet.map((entry, assetIdx) => (
                  <React.Fragment key={entry.idTaiSan}>
                    {/* Hàng thiết bị chính (cha) */}
                    <TableRow sx={{ bgcolor: "#fafafa" }}>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {assetIdx + 1}
                      </TableCell>
                      <TableCell
                        colSpan={3}
                        sx={{ fontWeight: 700, color: "primary.main" }}
                      >
                        Thiết bị: {entry.tenTaiSan}
                      </TableCell>
                      <TableCell colSpan={4}></TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => addMaterialRow(assetIdx)}
                          color="primary"
                          title="Thêm vật tư phụ tùng giám định"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Hàng các vật tư phụ tùng chi tiết (con) */}
                    {!entry.danhSachVatTu ||
                    entry.danhSachVatTu.filter((v) => v.action !== Action.DELETE).length === 0 ? (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell
                          colSpan={8}
                          sx={{
                            fontStyle: "italic",
                            color: "text.secondary",
                            py: 1,
                          }}
                        >
                          Chưa có vật tư/linh kiện phụ tùng nào được chọn để
                          giám định dưới thiết bị này. Nhấp "+" để thêm.
                        </TableCell>
                      </TableRow>
                    ) : (
                      entry.danhSachVatTu
                        .filter((v) => v.action !== Action.DELETE)
                        .map((vt, vtIdx) => {
                        const sumQty =
                          (vt.soLuongSuaChua || 0) + (vt.soLuongThayMoi || 0);
                        const isQtyError = sumQty > (vt.soLuong || 0);

                        return (
                          <TableRow key={vt.id}>
                            <TableCell
                              align="right"
                              sx={{ color: "text.secondary", pr: 2 }}
                            >
                              {assetIdx + 1}.{vtIdx + 1}
                            </TableCell>
                            <TableCell sx={{ width: "220px" }}>
                              <FieldAutoCompleted
                                title=""
                                data={allToolDetail}
                                labelkey="idTaiSan"
                                limitOptions={10}
                                value={vt.idChiTietVatTu}
                                noBorder={true}
                                onChange={(value) => {
                                  if (value) {
                                    updateMaterial(assetIdx, vt.id!, {
                                      idChiTietVatTu: value.id,
                                      idVatTu: value.idTaiSan,
                                      tenVatTu: value.tenTaiSan,
                                      donViTinh: value.donViTinh,
                                    });
                                  } else {
                                    updateMaterial(assetIdx, vt.id!, {
                                      idChiTietVatTu: "",
                                      idVatTu: "",
                                      tenVatTu: "",
                                      donViTinh: "",
                                    });
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{vt.donViTinh || "—"}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={vt.soLuong || 0}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    assetIdx,
                                    vt.id!,
                                    "soLuong",
                                    Math.max(0, parseInt(e.target.value) || 0),
                                  )
                                }
                                size="small"
                                variant="standard"
                                inputProps={{ min: 0, style: { width: 45 } }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={vt.tinhTrang || ""}
                                onChange={(e) =>
                                  updateMaterial(
                                    assetIdx,
                                    vt.id!,
                                    "tinhTrang",
                                    e.target.value,
                                  )
                                }
                                size="small"
                                placeholder="Tình trạng kỹ thuật..."
                                fullWidth
                                variant="outlined"
                                multiline
                                maxRows={2}
                                inputProps={{ style: { fontSize: "0.8rem" } }}
                                error={!vt.tinhTrang}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={vt.soLuongSuaChua || 0}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    assetIdx,
                                    vt.id!,
                                    "soLuongSuaChua",
                                    Math.max(0, parseInt(e.target.value) || 0),
                                  )
                                }
                                size="small"
                                variant="standard"
                                error={isQtyError}
                                inputProps={{ min: 0, style: { width: 55 } }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={vt.soLuongThayMoi || 0}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    assetIdx,
                                    vt.id!,
                                    "soLuongThayMoi",
                                    Math.max(0, parseInt(e.target.value) || 0),
                                  )
                                }
                                size="small"
                                variant="standard"
                                error={isQtyError}
                                inputProps={{ min: 0, style: { width: 55 } }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={vt.ghiChu || ""}
                                onChange={(e) =>
                                  updateMaterial(
                                    assetIdx,
                                    vt.id!,
                                    "ghiChu",
                                    e.target.value,
                                  )
                                }
                                size="small"
                                variant="standard"
                                fullWidth
                                inputProps={{ style: { fontSize: "0.8rem" } }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeMaterialRow(assetIdx, vt.id!)
                                }
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Preview */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }}>
            <Chip label="Xem trước biên bản" size="small" />
          </Divider>
          <Box
            sx={{
              fontFamily: "serif",
              fontSize: "0.875rem",
              lineHeight: 1.8,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 3,
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
                  Công <u>ty than Uông Bí</u> - TKV
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
              variant="subtitle2"
              align="center"
              fontWeight={700}
              display="block"
              sx={{ color: "primary.main", mb: 0.5 }}
            >
              BIÊN BẢN
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              fontWeight={700}
              display="block"
              sx={{ mb: 2 }}
            >
              GIÁM ĐỊNH KỸ THUẬT VÀ BÀN GIAO THIẾT BỊ ĐƯA VÀO SỬA CHỮA
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Hôm nay, ngày {new Date(formik.values.ngayGiamDinh).getDate()}{" "}
              tháng {new Date(formik.values.ngayGiamDinh).getMonth() + 1} năm{" "}
              {new Date(formik.values.ngayGiamDinh).getFullYear()}. Tại{" "}
              {formik.values.viTri || "……………………………"}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Chúng tôi gồm:
            </Typography>
            <Box sx={{ pl: 2, mb: 1 }}>
              {formik.values.nguoiKyList.map((s, i) => (
                <Box key={i} sx={{ display: "flex", gap: 3, mb: 0.25 }}>
                  <Typography variant="caption" sx={{ minWidth: 16 }}>
                    {i + 1}.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ minWidth: 140, fontWeight: 500 }}
                  >
                    {s.userName || "………………………"}
                  </Typography>
                  <Typography variant="caption" sx={{ minWidth: 120 }}>
                    {s.position}
                  </Typography>
                  <Typography variant="caption">{s.departmentName}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              Cùng tiến hành thực hiện giải thể và kiểm tra tình trạng kỹ thuật
              thiết bị theo văn bản đề nghị số{" "}
              <b>{repairRequest?.soPhieu ?? plan.id}</b> ngày{" "}
              {repairRequest?.ngayTao ?? "—"} của phân xưởng{" "}
              {plan.tenDonViGiao || "……………"}.
            </Typography>
            <Typography variant="caption" display="block">
              Số đăng ký: ……………… trước khi đưa vào sửa chữa cấp ………………
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              Với tình trạng kỹ thuật và nội dung sửa chữa như sau:
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ mb: 1.5 }}
            >
              <Table size="small" sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell
                      sx={{ fontWeight: 700, width: 45, fontSize: "0.75rem" }}
                    >
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                      Tên vật tư, thiết bị
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 50, fontSize: "0.75rem" }}
                    >
                      ĐVT
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 40, fontSize: "0.75rem" }}
                    >
                      SL
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                      Tình trạng kỹ thuật
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, width: 65, fontSize: "0.75rem" }}
                    >
                      SL S.chữa
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, width: 65, fontSize: "0.75rem" }}
                    >
                      SL Thay mới
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 90, fontSize: "0.75rem" }}
                    >
                      Ghi chú
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.danhSachChiTiet.map((entry, idx) => (
                    <React.Fragment key={`pv-group-${idx}`}>
                      <TableRow
                        key={`group-${idx}`}
                        sx={{ bgcolor: "#fafafa" }}
                      >
                        <TableCell
                          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          {String.fromCharCode(73 + idx)}/
                        </TableCell>
                        <TableCell
                          colSpan={7}
                          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          Thiết bị: {entry.tenTaiSan}
                        </TableCell>
                      </TableRow>
                      {!entry.danhSachVatTu ||
                      entry.danhSachVatTu.filter((v) => v.action !== Action.DELETE).length === 0 ? (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell></TableCell>
                          <TableCell
                            colSpan={7}
                            sx={{ fontSize: "0.75rem", fontStyle: "italic" }}
                          >
                            Chưa có vật tư/linh kiện nào được giám định.
                          </TableCell>
                        </TableRow>
                      ) : (
                        entry.danhSachVatTu
                          .filter((v) => v.action !== Action.DELETE)
                          .map((vt, vtIdx) => (
                          <TableRow key={`vt-${vt.id || vtIdx}`}>
                            <TableCell
                              sx={{ fontSize: "0.75rem", align: "right" }}
                            >
                              {idx + 1}.{vtIdx + 1}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {vt.tenVatTu || vt.idChiTietVatTu || "—"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {vt.donViTinh}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {vt.soLuong}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {vt.tinhTrang}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {vt.soLuongSuaChua || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {vt.soLuongThayMoi || 0}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>
                              {vt.ghiChu}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" display="block">
              Số để lại phục hồi: {formik.values.soDeLaiPhucHoi || "…………"}.
            </Typography>
            <Typography variant="caption" display="block">
              Số để làm phế liệu: {formik.values.soDeLamPheLieu || "…………"} (mục)
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
              Số lượng hủy: {formik.values.soLuongHuy || "…………"} (mục)
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
              Biên bản được lập xong lúc …… giờ cùng ngày và được các thành phần
              cùng thống nhất thông qua./.
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
            formik.values.nguoiKyList.length === 0 ||
            repairRequest?.danhSachTaiSan?.length === 0 ||
            hasValidationError()
          }
          onClick={() => formik.handleSubmit()}
        >
          {initData ? "Cập nhật" : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InspectionRecordDialog;
