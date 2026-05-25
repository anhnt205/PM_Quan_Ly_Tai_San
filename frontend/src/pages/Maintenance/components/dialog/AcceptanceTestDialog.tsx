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
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFormik } from "formik";
import {
  InspectionRecordData,
  InspectionRecordDetailData,
  MaintenancePlanData,
  AcceptanceTestRecordData,
  AcceptanceTestRecordAssetData,
  AcceptanceTestRecordToolData,
} from "../../../MainenancePlanRepair/types";
import { MaintenanceRepairData } from "../../types";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { generateCode } from "../../../../utils/helpers";
import { useMaintenanceAcceptanceTestMutation } from "../../../MainenancePlanRepair/Mutation";
import { useSelector } from "react-redux";
import { CongTy } from "../../../../utils/const";
import dayjs from "dayjs";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";
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
  repairRequest: MaintenanceRepairData;
  inspectionRecord: InspectionRecordData;
  initData?: AcceptanceTestRecordData;
}

const AcceptanceTestDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  inspectionRecord,
  initData,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { createMutation, updateMutation } =
    useMaintenanceAcceptanceTestMutation();

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();
  const { data: allLevel = [] } = useAllLoaiSCBDQuery();

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

  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      idGiamDinhMayMoc: inspectionRecord?.id || "",
      soPhieu: "",
      ngayNghiemThu: dayjs().format("YYYY-MM-DD"),
      viTri: "",
      tenThietBi: "",
      soDangKi: "",
      capSuaChua: "",
      ketQua: "đảm bảo yêu cầu kỹ thuật",
      noiDung: "",
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      danhSachTaiSan: [] as AcceptanceTestRecordAssetData[],
      nguoiKyList: [] as any[],
    },
    onSubmit: (values) => {
      const idNguoiLapVal =
        values.nguoiKyList.length > 0 ? values.nguoiKyList[0].userId : "";
      const idGiamDocVal =
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

      // Map danhSachTaiSan (with nested danhSachVatTu) to payload giống hệt Giám định
      const mappedDanhSachTaiSan = values.danhSachTaiSan.map((ts) => {
        const actualTsId = ts.id ? ts.id : generateCode("NTTS-");

        return {
          id: actualTsId,
          idBienBan: values.id || "",
          idTaiSan: ts.idTaiSan,
          idChiTietGiamDinhMayMoc: ts.idChiTietGiamDinhMayMoc,
          danhSachVatTu: (ts.danhSachVatTu || []).map((vt) => ({
            id: vt.id ? vt.id : generateCode("NTVT-"),
            idBienBanTaiSan: actualTsId,
            idChiTietVatTu: vt.idChiTietVatTu || "",
            idVatTu: vt.idVatTu || "",
            tenVatTu: vt.tenVatTu || "",
            donViTinh: vt.donViTinh || "Cái",
            soLuong: vt.soLuong,
            ghiChu: vt.ghiChu || "",
          })),
        };
      });

      const payload = {
        ...values,
        idNguoiLap: idNguoiLapVal,
        idGiamDoc: idGiamDocVal,
        nguoiKyList: intermediateSigners,
        danhSachTaiSan: mappedDanhSachTaiSan,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      if (initData) {
        updateMutation.mutate(payload, {
          onSuccess: () => handleClose(),
        });
      } else {
        createMutation.mutate(payload, {
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
          idGiamDinhMayMoc: initData.idGiamDinhMayMoc ?? "",
          soPhieu: initData.soPhieu ?? "",
          ngayNghiemThu: initData.ngayNghiemThu ?? "",
          viTri: initData.viTri ?? "",
          tenThietBi: initData.tenThietBi ?? "",
          soDangKi: initData.soDangKi ?? "",
          capSuaChua: initData.capSuaChua ?? "",
          ketQua: initData.ketQua ?? "đảm bảo yêu cầu kỹ thuật",
          noiDung: initData.noiDung ?? "",
          idNguoiLap: initData.idNguoiLap ?? "",
          nguoiLapXacNhan: initData.nguoiLapXacNhan ?? false,
          idGiamDoc: initData.idGiamDoc ?? "",
          giamDocXacNhan: initData.giamDocXacNhan ?? false,
          share: initData.share ?? false,
          trangThai: initData.trangThai ?? 0,
          danhSachTaiSan: (initData.danhSachTaiSan || []).map((ts) => ({
            ...ts,
            danhSachVatTu: (ts.danhSachVatTu || []).map((vt) => ({
              ...vt,
            })),
          })) as AcceptanceTestRecordAssetData[],
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
        const list: AcceptanceTestRecordAssetData[] = [];
        (inspectionRecord?.danhSachChiTiet || []).forEach(
          (entry: InspectionRecordDetailData, idx: number) => {
            const activeVatTu = entry.danhSachVatTu || [];
            const tsId = `NTTS_${Date.now()}_${idx}`;

            if (activeVatTu.length > 0) {
              list.push({
                id: tsId,
                idTaiSan: entry.idTaiSan || "",
                idChiTietGiamDinhMayMoc: entry.id || "",
                tenTaiSan: entry.tenTaiSan || "",
                donViTinh: entry.donViTinh || "Cái",
                danhSachVatTu: activeVatTu.map((vt: any, vtIdx: number) => {
                  const qty =
                    vt.soLuongThayMoi || vt.soLuongSuaChua
                      ? (vt.soLuongThayMoi || 0) + (vt.soLuongSuaChua || 0)
                      : vt.soLuong || 1;
                  return {
                    id: `NTVT_${Date.now()}_${idx}_${vtIdx}`,
                    idBienBanTaiSan: tsId,
                    idChiTietVatTu: vt.idChiTietVatTu || "",
                    idVatTu: vt.idVatTu || "",
                    tenVatTu: vt.tenVatTu || "",
                    donViTinh: vt.donViTinh || "Cái",
                    soLuong: qty,
                    ghiChu: vt.ghiChu || "",
                  };
                }),
              });
            } else {
              list.push({
                id: tsId,
                idTaiSan: entry.idTaiSan || "",
                idChiTietGiamDinhMayMoc: entry.id || "",
                tenTaiSan: entry.tenTaiSan || "",
                donViTinh: entry.donViTinh || "Cái",
                danhSachVatTu: [
                  {
                    id: `NTVT_${Date.now()}_${idx}_0`,
                    idBienBanTaiSan: tsId,
                    idChiTietVatTu: "",
                    idVatTu: "",
                    tenVatTu: "",
                    donViTinh: "Cái",
                    soLuong: 1,
                    ghiChu: "",
                  },
                ],
              });
            }
          },
        );
        formik.setValues({
          id: "",
          idCongTy: CongTy.CT001,
          idGiamDinhMayMoc: inspectionRecord?.id || "",
          soPhieu: `BB-NT-${repairRequest?.id ?? ""}`,
          ngayNghiemThu: dayjs().format("YYYY-MM-DD"),
          viTri: "",
          tenThietBi:
            inspectionRecord.danhSachChiTiet
              ?.map((e) => e.idTaiSan)
              .join(", ") ?? "",
          soDangKi: "",
          capSuaChua: "",
          ketQua: "đảm bảo yêu cầu kỹ thuật",
          noiDung: "",
          idNguoiLap: "",
          nguoiLapXacNhan: false,
          idGiamDoc: "",
          giamDocXacNhan: false,
          share: false,
          trangThai: 0,
          danhSachTaiSan: list,
          nguoiKyList: [] as any[],
        });
      }
    }
  }, [open, initData, apiUsers, apiDepartments]);

  const addMaterialRow = (assetIdx: number) => {
    const ts = formik.values.danhSachTaiSan[assetIdx];
    const newItem: AcceptanceTestRecordToolData = {
      id: `NTVT_${Date.now()}`,
      idBienBanTaiSan: ts.id || "",
      idChiTietVatTu: "",
      idVatTu: "",
      tenVatTu: "",
      donViTinh: "Cái",
      soLuong: 1,
      ghiChu: "",
    };
    const updatedVatTu = [...(ts.danhSachVatTu || []), newItem];
    formik.setFieldValue(
      `danhSachTaiSan[${assetIdx}].danhSachVatTu`,
      updatedVatTu,
    );
  };

  const removeMaterialRow = (assetIdx: number, materialId: string) => {
    const ts = formik.values.danhSachTaiSan[assetIdx];
    const updatedVatTu = (ts.danhSachVatTu || []).filter(
      (vt) => vt.id !== materialId,
    );
    formik.setFieldValue(
      `danhSachTaiSan[${assetIdx}].danhSachVatTu`,
      updatedVatTu,
    );
  };

  const updateMaterial = (
    assetIdx: number,
    vtId: string,
    fields: Partial<AcceptanceTestRecordToolData>,
  ) => {
    const ts = formik.values.danhSachTaiSan[assetIdx];
    const updatedVatTu = (ts.danhSachVatTu || []).map((vt) =>
      vt.id === vtId ? { ...vt, ...fields } : vt,
    );
    formik.setFieldValue(
      `danhSachTaiSan[${assetIdx}].danhSachVatTu`,
      updatedVatTu,
    );
  };

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (formik.values.nguoiKyList.some((s: any) => s.userId === addUserId))
      return;
    const signerUser = users.find((u) => u.id === addUserId);
    const dept = departments.find((d) => d.id === addDeptId);
    if (!signerUser || !dept) return;
    const updated = [
      ...formik.values.nguoiKyList,
      {
        userId: signerUser.id,
        userName: signerUser.name,
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

  const handleEdit = (signer: PlanSigner) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
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

  const d = new Date(formik.values.ngayNghiemThu);

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
          <FactCheckIcon color="success" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biên bản nghiệm thu chạy thử và bàn giao thiết bị sau sửa chữa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Căn cứ BB giám định: {inspectionRecord?.soPhieu || ""} — GĐN:{" "}
              {repairRequest?.soPhieu || repairRequest?.id}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {/* 2-column layout: form | signers */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 3 }}>
          {/* Col 1: Thông tin */}
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
                Thông tin
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Số biên bản"
                  name="soPhieu"
                  value={formik.values.soPhieu}
                  onChange={formik.handleChange}
                  placeholder={`VD: BB-NT-${repairRequest?.id}`}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Ngày lập"
                  name="ngayNghiemThu"
                  type="date"
                  value={formik.values.ngayNghiemThu}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
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
                <TextField
                  label="Tên thiết bị nghiệm thu"
                  name="tenThietBi"
                  value={formik.values.tenThietBi}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Số đăng ký"
                    name="soDangKi"
                    value={formik.values.soDangKi}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{ flex: 1 }}
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
                </Box>
                <TextField
                  label="Kết quả chạy thử"
                  name="ketQua"
                  value={formik.values.ketQua}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Nội dung nghiệm thu"
                  name="noiDung"
                  value={formik.values.noiDung}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                />
              </Box>
            </Box>

            {/* Vật tư / Thiết bị */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Vật tư / Thiết bị
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: 700, width: 40 }}>
                        STT
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 80 }}>
                        Mã VT
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Tên vật tư, thiết bị
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 55 }}>
                        ĐVT
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 50 }}>
                        SL
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 90 }}>
                        Ghi chú
                      </TableCell>
                      <TableCell sx={{ width: 36 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formik.values.danhSachTaiSan.map((ts, assetIdx) => {
                      const activeVatTu = ts.danhSachVatTu || [];
                      return (
                        <React.Fragment key={ts.id || assetIdx}>
                          <TableRow sx={{ bgcolor: "#fafafa" }}>
                            <TableCell sx={{ fontWeight: 700 }}>
                              {String.fromCharCode(73 + assetIdx)}/
                            </TableCell>
                            <TableCell colSpan={5} sx={{ fontWeight: 600 }}>
                              Thiết bị: {ts.tenTaiSan || ts.idTaiSan}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => addMaterialRow(assetIdx)}
                                color="primary"
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          {activeVatTu.length === 0 ? (
                            <TableRow>
                              <TableCell />
                              <TableCell colSpan={6} align="center">
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ py: 1.5 }}
                                >
                                  Chưa có vật tư/linh kiện phụ tùng nào được
                                  chọn
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            activeVatTu.map((item, rowIdx) => (
                              <TableRow key={item.id || rowIdx}>
                                <TableCell sx={{ pl: 2 }}>
                                  {String(rowIdx + 1).padStart(2, "0")}
                                </TableCell>
                                <TableCell sx={{ width: "200px" }}>
                                  <FieldAutoCompleted
                                    title=""
                                    data={allToolDetail}
                                    labelkey="idTaiSan"
                                    limitOptions={10}
                                    value={item.idChiTietVatTu}
                                    noBorder={true}
                                    onChange={(value) => {
                                      if (value) {
                                        updateMaterial(assetIdx, item.id!, {
                                          idChiTietVatTu: value.id,
                                          idVatTu: value.idTaiSan,
                                          tenVatTu: value.tenTaiSan,
                                          donViTinh: value.donViTinh,
                                        });
                                      } else {
                                        updateMaterial(assetIdx, item.id!, {
                                          idChiTietVatTu: "",
                                          idVatTu: "",
                                          tenVatTu: "",
                                          donViTinh: "",
                                        });
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    maxWidth: "150px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.tenVatTu}
                                </TableCell>
                                <TableCell>{item.donViTinh}</TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    value={item.soLuong}
                                    size="small"
                                    variant="standard"
                                    onChange={(e) =>
                                      updateMaterial(assetIdx, item.id!, {
                                        soLuong: parseInt(e.target.value) || 1,
                                      })
                                    }
                                    inputProps={{
                                      min: 1,
                                      style: { width: 36 },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={item.ghiChu || ""}
                                    size="small"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) =>
                                      updateMaterial(assetIdx, item.id!, {
                                        ghiChu: e.target.value,
                                      })
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      removeMaterialRow(assetIdx, item.id!)
                                    }
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
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
                  {formik.values.nguoiKyList.map((s: any, idx: number) => {
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
                                  {s.userName?.charAt(0) ?? "?"}
                                </Box>
                                <Box>
                                  <Typography fontWeight={600} fontSize={13}>
                                    {s.userName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {users.find((u) => u.id === s.userId)
                                      ?.title || "Người ký"}
                                  </Typography>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {s.departmentName}
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
            NGHIỆM THU CHẠY THỬ VÀ BÀN GIAO THIẾT BỊ SAU SỬA CHỮA
          </Typography>

          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
            {d.getFullYear()}. Tại {formik.values.viTri || "………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Chúng tôi gồm:
          </Typography>
          <Box sx={{ pl: 2, mb: 1.5 }}>
            {formik.values.nguoiKyList.map((s: any, i: number) => (
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
                  {users.find((u) => u.id === s.userId)?.title || "Người ký"}
                </Typography>
                <Typography variant="caption">{s.departmentName}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Cùng tiến hành nghiệm thu thiết bị:{" "}
            <b>{formik.values.tenThietBi}</b>
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
                  <TableCell
                    sx={{ fontWeight: 700, width: 150, fontSize: "0.72rem" }}
                  >
                    Mã VT
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
                  <TableCell
                    sx={{ fontWeight: 700, width: 75, fontSize: "0.72rem" }}
                  >
                    Ghi chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachTaiSan.map((ts, assetIdx) => {
                  const activeVatTu = ts.danhSachVatTu || [];
                  return (
                    <React.Fragment key={`pv-${ts.id || assetIdx}`}>
                      <TableRow sx={{ bgcolor: "#fafafa" }}>
                        <TableCell
                          sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                        >
                          {String.fromCharCode(73 + assetIdx)}/
                        </TableCell>
                        <TableCell
                          colSpan={5}
                          sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                        >
                          Thiết bị: {ts.tenTaiSan || ts.idTaiSan}
                        </TableCell>
                      </TableRow>
                      {activeVatTu.map((item, ri) => (
                        <TableRow key={`pv-vt-${item.id || ri}`}>
                          <TableCell sx={{ fontSize: "0.72rem", pl: 2 }}>
                            {String(ri + 1).padStart(2, "0")}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.72rem" }}>
                            {item.idVatTu}
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
                            {item.ghiChu}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="caption"
            display="block"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            2. Kết quả kiểm tra chạy thử:{" "}
            <span style={{ fontWeight: 400 }}>{formik.values.ketQua}</span>
          </Typography>
          <Typography
            variant="caption"
            display="block"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            3. Các nội dung sửa chữa được nghiệm thu
          </Typography>
          <Typography
            variant="caption"
            display="block"
            sx={{ mb: 0.5, borderBottom: "1px dotted #999", pb: 0.5 }}
          >
            {formik.values.noiDung ||
              "………………………………………………………………………………………………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 2 }}>
            ………………………………………………………………………………………………………………
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
              const cols = sorted.map((s) => ({
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
                        {users.find((u) => u.id === col.signer.userId)?.title ||
                          "Người ký"}
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
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={
            formik.values.nguoiKyList.length === 0 ||
            createMutation.isPending ||
            updateMutation.isPending
          }
          onClick={formik.submitForm}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Đang lưu..."
            : initData
              ? "Cập nhật"
              : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptanceTestDialog;
