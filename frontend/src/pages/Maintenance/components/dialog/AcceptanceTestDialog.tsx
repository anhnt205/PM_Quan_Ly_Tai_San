import React, { useState } from "react";
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
  Alert,
} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import type { MaterialItem } from "../../../../mockdata/mockInspectionRecords";
import {
  InspectionRecordData,
  InspectionRecordDetailData,
  MaintenancePlanData,
} from "../../../MainenancePlanRepair/types";
import { MaintenanceRepairData } from "../../types";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { generateCode } from "../../../../utils/helpers";
import { useMaintenanceAcceptanceTestMutation } from "../../../MainenancePlanRepair/Mutation";
import { useSelector } from "react-redux";
import { CongTy, Action } from "../../../../utils/const";
import dayjs from "dayjs";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";

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
}

const AcceptanceTestDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  inspectionRecord,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { createMutation } = useMaintenanceAcceptanceTestMutation();
  const [number, setNumber] = useState(`BB-NT-${repairRequest?.id ?? ""}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [deviceName, setDeviceName] = useState(
    inspectionRecord.danhSachChiTiet?.map((e) => e.idTaiSan).join(", ") ?? "",
  );
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [repairLevel, setRepairLevel] = useState("");
  const [testResult, setTestResult] = useState("đảm bảo yêu cầu kỹ thuật");
  const [acceptanceContent, setAcceptanceContent] = useState("");

  const [materialItems, setMaterialItems] = useState<MaterialItem[]>(() => {
    const list: MaterialItem[] = [];
    (inspectionRecord?.danhSachChiTiet || []).forEach(
      (entry: InspectionRecordDetailData, idx: number) => {
        const activeVatTu = (entry.danhSachVatTu || []).filter(
          (vt: any) => vt.action !== Action.DELETE,
        );
        if (activeVatTu.length > 0) {
          activeVatTu.forEach((vt: any) => {
            const qty =
              vt.soLuongThayMoi || vt.soLuongSuaChua
                ? (vt.soLuongThayMoi || 0) + (vt.soLuongSuaChua || 0)
                : vt.soLuong || 1;
            list.push({
              groupLabel: `${String.fromCharCode(73 + idx)}/`,
              groupDevice: entry?.idTaiSan ?? "",
              code: vt.idChiTietVatTu || "",
              idVatTu: vt.idVatTu || "",
              name: vt.tenVatTu || "",
              unit: vt.donViTinh || "Cái",
              quantity: qty,
              note: vt.ghiChu || "",
            });
          });
        } else {
          list.push({
            groupLabel: `${String.fromCharCode(73 + idx)}/`,
            groupDevice: entry?.idTaiSan ?? "",
            code: "",
            idVatTu: "",
            name: "",
            unit: "Cái",
            quantity: 1,
            note: "",
          });
        }
      },
    );
    return list;
  });

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

  const [signers, setSigners] = useState<PlanSigner[]>([]);
  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const addMaterialRow = (groupIdx: number) => {
    const group = materialItems[groupIdx];
    const newItem: MaterialItem = {
      groupLabel: group.groupLabel,
      groupDevice: group.groupDevice,
      code: "",
      idVatTu: "",
      name: "",
      unit: "",
      quantity: 1,
      note: "",
    };
    const insertAt =
      materialItems.lastIndexOf(
        materialItems
          .filter((m) => m.groupLabel === group.groupLabel)
          .slice(-1)[0],
      ) + 1;
    setMaterialItems((prev) => [
      ...prev.slice(0, insertAt),
      newItem,
      ...prev.slice(insertAt),
    ]);
  };

  const removeMaterialRow = (idx: number) => {
    setMaterialItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMaterial = (
    idx: number,
    field: keyof MaterialItem,
    value: string | number,
  ) => {
    setMaterialItems((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  };

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (signers.some((s) => s.userId === addUserId)) return;
    const user = users.find((u) => u.id === addUserId);
    const dept = departments.find((d) => d.id === addDeptId);
    if (!user || !dept) return;
    setSigners((prev) => [
      ...prev,
      {
        userId: user.id,
        userName: user.name,
        departmentId: dept.id,
        departmentName: dept.name,
        order: prev.length + 1,
        signed: false,
      },
    ]);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    setSigners((prev) =>
      prev
        .filter((s) => s.userId !== userId)
        .map((s, i) => ({ ...s, order: i + 1 })),
    );
  };

  const handleEdit = (signer: PlanSigner) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
    setSigners((prev) =>
      prev.map((s) =>
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
      ),
    );
    setEditingSignerId(null);
  };
  const handleSubmit = () => {
    const idNguoiLap = signers.length > 0 ? signers[0].userId : "";
    const idGiamDoc =
      signers.length > 1 ? signers[signers.length - 1].userId : "";

    // Người ký trung gian
    const nguoiKyList =
      signers.length > 2
        ? signers.slice(1, -1).map((s: PlanSigner, idx: number) => ({
            id: `${generateCode("SIG-")}-${idx}`,
            idNguoiKy: s.userId,
            tenNguoiKy: s.userName,
            idPhongBan: s.departmentId,
            trangThai: 0,
          }))
        : [];

    // Map materialItems -> danhSachTaiSan với danhSachVatTu
    // Group theo groupLabel (mỗi group = 1 tài sản)
    const groupMap = materialItems.reduce<Record<string, MaterialItem[]>>(
      (acc, item) => {
        if (!acc[item.groupDevice]) acc[item.groupDevice] = [];
        acc[item.groupDevice].push(item);
        return acc;
      },
      {},
    );

    // Tìm idChiTietGiamDinh tương ứng với từng tài sản trong inspectionRecord
    const chiTietMap: Record<string, string> = {};
    (inspectionRecord?.danhSachChiTiet || []).forEach((ct: any) => {
      chiTietMap[ct.idTaiSan] = ct.id;
    });

    const danhSachTaiSan = Object.entries(groupMap).map(
      ([idTaiSan, items]) => {
        const id = generateCode("NTTS-");
        return {
          id,
          idTaiSan,
          action: Action.CREATE,
          idChiTietGiamDinh: chiTietMap[idTaiSan] || "",
          danhSachVatTu: items.map((m) => ({
            idChiTietVatTu: m.code || "",
            idVatTu: m.idVatTu || "",
            soLuong: m.quantity,
            ghiChu: m.note || "",
            idBienBanTaiSan: id,
            action: Action.CREATE,
          })),
        };
      },
    );

    const payload = {
      idCongTy: CongTy.CT001,
      idGiamDinh: inspectionRecord?.id ?? "",
      soPhieu: number,
      ngayNghiemThu: dayjs(date).format("YYYY-MM-DD"),
      viTri: location,
      tenThietBi: deviceName,
      soDangKi: registrationNumber,
      capSuaChua: repairLevel,
      ketQua: testResult,
      noiDung: acceptanceContent,
      idNguoiLap,
      nguoiLapXacNhan: false,
      idGiamDoc,
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      nguoiTao: user?.taiKhoan?.tenDangNhap,
      ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      nguoiKyList,
      danhSachTaiSan,
    };

    createMutation.mutate(payload, {
      onSuccess: () => handleClose(),
    });
  };

  const handleClose = () => {
    setEditingSignerId(null);
    onClose();
  };

  const groupedMaterials = materialItems.reduce<Record<string, MaterialItem[]>>(
    (acc, item) => {
      if (!acc[item.groupLabel]) acc[item.groupLabel] = [];
      acc[item.groupLabel].push(item);
      return acc;
    },
    {},
  );

  const d = new Date(date);

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
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder={`VD: BB-NT-${repairRequest?.id}`}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Ngày lập"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Địa điểm (Tại...)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="vd: Phân xưởng khai thác 1, khu vực A"
                />
                <TextField
                  label="Tên thiết bị nghiệm thu"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Số đăng ký"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <FieldAutoCompleted
                    title="Cấp sửa chữa"
                    labelkey="ten"
                    data={allLevel}
                    value={repairLevel}
                    onChange={(value) => setRepairLevel(value.id)}
                    autocompleteSx={{ flex: 1 }}
                  />
                </Box>
                <TextField
                  label="Kết quả chạy thử"
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Nội dung nghiệm thu"
                  value={acceptanceContent}
                  onChange={(e) => setAcceptanceContent(e.target.value)}
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
                    {Object.entries(groupedMaterials).map(
                      ([groupLabel, items]) => {
                        const globalGroupIdx =
                          Object.keys(groupedMaterials).indexOf(groupLabel);
                        return (
                          <React.Fragment key={groupLabel}>
                            <TableRow sx={{ bgcolor: "#fafafa" }}>
                              <TableCell sx={{ fontWeight: 700 }}>
                                {groupLabel}
                              </TableCell>
                              <TableCell colSpan={5} sx={{ fontWeight: 600 }}>
                                Thiết bị: {items[0].groupDevice}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() => addMaterialRow(globalGroupIdx)}
                                  color="primary"
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                            {items.map((item, rowIdx) => {
                              const globalIdx = materialItems.indexOf(item);
                              return (
                                <TableRow key={`${groupLabel}-${rowIdx}`}>
                                  <TableCell sx={{ pl: 2 }}>
                                    {String(rowIdx + 1).padStart(2, "0")}
                                  </TableCell>
                                  <TableCell sx={{ width: "200px" }}>
                                    <FieldAutoCompleted
                                      title=""
                                      data={allToolDetail}
                                      labelkey="idTaiSan"
                                      limitOptions={10}
                                      value={item.code}
                                      noBorder={true}
                                      onChange={(value) => {
                                        if (value) {
                                          updateMaterial(
                                            globalIdx,
                                            "code",
                                            value.id,
                                          );
                                          updateMaterial(
                                            globalIdx,
                                            "idVatTu",
                                            value.idTaiSan,
                                          );
                                          updateMaterial(
                                            globalIdx,
                                            "name",
                                            value.tenTaiSan,
                                          );
                                          updateMaterial(
                                            globalIdx,
                                            "unit",
                                            value.donViTinh,
                                          );
                                        } else {
                                          updateMaterial(globalIdx, "code", "");
                                          updateMaterial(globalIdx, "idVatTu", "");
                                          updateMaterial(globalIdx, "name", "");
                                          updateMaterial(globalIdx, "unit", "");
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
                                    {item.name}
                                  </TableCell>
                                  <TableCell>{item.unit}</TableCell>
                                  <TableCell>
                                    <TextField
                                      type="number"
                                      value={item.quantity}
                                      size="small"
                                      variant="standard"
                                      onChange={(e) =>
                                        updateMaterial(
                                          globalIdx,
                                          "quantity",
                                          parseInt(e.target.value) || 1,
                                        )
                                      }
                                      inputProps={{
                                        min: 1,
                                        style: { width: 36 },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={item.note}
                                      size="small"
                                      variant="standard"
                                      fullWidth
                                      onChange={(e) =>
                                        updateMaterial(
                                          globalIdx,
                                          "note",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        removeMaterialRow(globalIdx)
                                      }
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </React.Fragment>
                        );
                      },
                    )}
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
                label={`${signers.length} người`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 400 }}
              />
            </Typography>

            <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
              {signers.length > 0 ? (
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
                  {signers.map((s, idx) => {
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
            {d.getFullYear()}. Tại {location || "………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Chúng tôi gồm:
          </Typography>
          <Box sx={{ pl: 2, mb: 1.5 }}>
            {signers.map((s, i) => (
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
                  {s.position}
                </Typography>
                <Typography variant="caption">{s.departmentName}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Cùng tiến hành nghiệm thu thiết bị: <b>{deviceName}</b>
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
                {Object.entries(groupedMaterials).map(([groupLabel, items]) => (
                  <React.Fragment key={`pv-${groupLabel}`}>
                    <TableRow sx={{ bgcolor: "#fafafa" }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                        {groupLabel}
                      </TableCell>
                      <TableCell
                        colSpan={5}
                        sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                      >
                        Thiết bị: {items[0].groupDevice}
                      </TableCell>
                    </TableRow>
                    {items.map((item, ri) => (
                      <TableRow key={`${groupLabel}-pv-${ri}`}>
                        <TableCell sx={{ fontSize: "0.72rem", pl: 2 }}>
                          {String(ri + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.72rem" }}>
                          {item.code}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.72rem" }}>
                          {item.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.72rem" }}>
                          {item.unit}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.72rem" }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.72rem" }}>
                          {item.note}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
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
            <span style={{ fontWeight: 400 }}>{testResult}</span>
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
            {acceptanceContent || "………………………………………………………………………………………………………………"}
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
              const sorted = [...(signers || [])].sort(
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
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={signers.length === 0 || createMutation.isPending}
          onClick={handleSubmit}
        >
          {createMutation.isPending ? "Đang lưu..." : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptanceTestDialog;
