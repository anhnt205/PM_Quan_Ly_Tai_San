import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IncidentInspectionPreview from "../preview/IncidentInspectionPreview";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";
import {
  IncidenData,
  IncidentInspectionData,
  IncidentInspectionDetailData,
  IncidentInspectionVatTuData,
} from "../../types";
import { listSigneInfo } from "../../config";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { generateCode } from "../../../../utils/helpers";
import { CongTy } from "../../../../utils/const";
import { useMaintenanceIncidentInspectionMutation } from "../../../MainenancePlanRepair/Mutation";
import FieldDate from "../../../../components/TextField/FieldDate";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import dayjs from "dayjs";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  incidentReport: IncidenData;
  selectedDeviceIds: string[];
  initData?: IncidentInspectionData | null;
}

const IncidentInspectionDialog = ({
  open,
  onClose,
  plan,
  incidentReport,
  selectedDeviceIds,
  initData,
}: Props) => {
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();
  const {
    createMutation: createIncInspMutation,
    updateMutation: updateIncInspMutation,
  } = useMaintenanceIncidentInspectionMutation();

  const [number, setNumber] = useState("");
  const [inspectionDate, setInspectionDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [location, setLocation] = useState("");
  const [findings, setFindings] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const [danhSachChiTiet, setDanhSachChiTiet] = useState<
    IncidentInspectionDetailData[]
  >([]);
  const [signers, setSigners] = useState<PlanSigner[]>([]);

  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  useEffect(() => {
    if (open) {
      if (initData) {
        setNumber(initData.soPhieu ?? "");
        setInspectionDate(initData.ngayKiemTra ?? dayjs().format("YYYY-MM-DD"));
        setLocation(initData.viTri ?? "");
        setFindings(initData.nhanXetKetLuan ?? "");
        setRecommendation(initData.bienPhapXuLy ?? "");

        const listInfo = listSigneInfo(initData, apiUsers, apiDepartments);
        setSigners(
          (listInfo ?? []).map((item: any) => ({
            userId: item.idNhanVien || item.userId,
            userName: item.hoTen || item.userName,
            departmentId: item.idDonVi || item.departmentId,
            departmentName: item.donVi || item.departmentName,
            position: item.tenChucVu || item.position || "",
            order: item.order || 1,
            signed: item.signed || false,
          })),
        );

        setDanhSachChiTiet(
          (initData.danhSachChiTiet || []).map((d: any) => ({
            ...d,
            danhSachVatTu: (d.danhSachVatTu || []).map((vt: any) => ({
              ...vt,
            })),
          })),
        );
      } else if (incidentReport?.danhSachTaiSan) {
        setNumber(`BB-KT-${incidentReport.id || Date.now()}`);
        setInspectionDate(dayjs().format("YYYY-MM-DD"));
        setLocation(incidentReport.phanHeViTri || "");
        setFindings("");
        setRecommendation("");
        setSigners([]);
        setDanhSachChiTiet(
          incidentReport.danhSachTaiSan
            .filter((d: any) => selectedDeviceIds.includes(String(d.id ?? "")))
            .map((d: any) => ({
              id: "",
              idTaiSan: d.idTaiSan,
              idSuCoChiTiet: d.id,
              tenTaiSan: d.tenTaiSan || d.idTaiSan,
              donViTinh: d.donViTinh || "",
              danhSachVatTu: [],
            })),
        );
      }
    }
  }, [
    open,
    initData,
    incidentReport,
    selectedDeviceIds,
    apiUsers,
    apiDepartments,
  ]);

  type SimpleDept = { id: string; name: string };
  type SimpleUser = {
    id: string;
    name: string;
    departmentId?: string;
    title?: string;
  };

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

  const addMaterialRow = (assetIdx: number) => {
    const newMaterial: IncidentInspectionVatTuData = {
      id: "KSVT_" + Math.random().toString(36).substr(2, 9),
      idChiTietKiemTraSuCo: danhSachChiTiet[assetIdx].id,
      idVatTu: "",
      idChiTietVatTu: "",
      soLuong: 1,
      tinhTrang: "",
      soLuongSuaChua: 0,
      soLuongThayMoi: 0,
      ghiChu: "",
      tenVatTu: "",
      donViTinh: "",
    };

    setDanhSachChiTiet((prev) => {
      const copy = [...prev];
      const detail = { ...copy[assetIdx] };
      detail.danhSachVatTu = [...(detail.danhSachVatTu || []), newMaterial];
      copy[assetIdx] = detail;
      return copy;
    });
  };

  const updateMaterial = (
    assetIdx: number,
    materialId: string,
    updatedFields: Partial<IncidentInspectionVatTuData> | string,
    value?: any,
  ) => {
    setDanhSachChiTiet((prev) => {
      const copy = [...prev];
      const detail = { ...copy[assetIdx] };
      detail.danhSachVatTu = (detail.danhSachVatTu || []).map((vt) => {
        if (vt.id === materialId) {
          if (typeof updatedFields === "string") {
            return { ...vt, [updatedFields]: value };
          } else {
            return { ...vt, ...updatedFields };
          }
        }
        return vt;
      });
      copy[assetIdx] = detail;
      return copy;
    });
  };

  const removeMaterialRow = (assetIdx: number, materialId: string) => {
    setDanhSachChiTiet((prev) => {
      const copy = [...prev];
      const detail = { ...copy[assetIdx] };
      detail.danhSachVatTu = (detail.danhSachVatTu || [])
        .map((vt) => {
          if (vt.id === materialId) {
            return null;
          }
          return vt;
        })
        .filter(Boolean) as IncidentInspectionVatTuData[];
      copy[assetIdx] = detail;
      return copy;
    });
  };

  const handleQuantityChange = (
    assetIdx: number,
    materialId: string,
    field: "soLuong" | "soLuongSuaChua" | "soLuongThayMoi",
    value: number,
  ) => {
    setDanhSachChiTiet((prev) => {
      const copy = [...prev];
      const detail = { ...copy[assetIdx] };
      detail.danhSachVatTu = (detail.danhSachVatTu || []).map((vt) => {
        if (vt.id === materialId) {
          return { ...vt, [field]: value };
        }
        return vt;
      });
      copy[assetIdx] = detail;
      return copy;
    });
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
        position: user.title ?? "",
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
              position: users.find((u) => u.id === editUserId)?.title || "",
              departmentName:
                departments.find((d) => d.id === editDeptId)?.name || "",
            }
          : s,
      ),
    );
    setEditingSignerId(null);
  };

  const handleSubmit = async () => {
    const idNguoiLapBieu = signers.length > 0 ? signers[0].userId : "";
    const idTrinhDuyetGiamDoc =
      signers.length > 1 ? signers[signers.length - 1].userId : "";

    const intermediateSigners =
      signers.length > 2
        ? signers.slice(1, -1).map((s: PlanSigner, idx: number) => ({
            id: (s as any).id || `${generateCode("SIG-")}-${idx}`,
            idNguoiKy: s.userId,
            tenNguoiKy: s.userName,
            idPhongBan: s.departmentId,
            trangThai: 0,
          }))
        : [];

    const record: IncidentInspectionData = {
      ...initData,
      idCongTy: CongTy.CT001,
      idSuCo: incidentReport.id,
      soPhieu: number,
      ngayKiemTra: inspectionDate,
      viTri: location,
      nhanXetKetLuan: findings,
      bienPhapXuLy: recommendation,

      idNguoiLap: idNguoiLapBieu,
      nguoiLapXacNhan: initData ? initData.nguoiLapXacNhan : false,
      idGiamDoc: idTrinhDuyetGiamDoc,
      giamDocXacNhan: initData ? initData.giamDocXacNhan : false,
      trangThai: initData ? initData.trangThai : 0,
      share: initData ? initData.share : false,
      nguoiKyList: intermediateSigners,
      danhSachChiTiet: danhSachChiTiet.map((entry) => {
        const actualDetailId = entry.id ? entry.id : generateCode("KSCT_");
        return {
          id: actualDetailId,
          idTaiSan: entry.idTaiSan,
          idSuCoChiTiet: entry.idSuCoChiTiet,
          danhSachVatTu: (entry.danhSachVatTu || []).map((vt) => ({
            id: vt.id ? vt.id : generateCode("KSVT_"),
            idChiTietKiemTraSuCo: actualDetailId,
            idVatTu: vt.idVatTu,
            idChiTietVatTu: vt.idChiTietVatTu,
            soLuong: vt.soLuong,
            tinhTrang: vt.tinhTrang,
            soLuongSuaChua: vt.soLuongSuaChua,
            soLuongThayMoi: vt.soLuongThayMoi,
            ghiChu: vt.ghiChu,
          })),
        };
      }),
    };

    if (initData) {
      updateIncInspMutation.mutate(record, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      createIncInspMutation.mutate(record, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Tạo Biên bản kiểm tra sự cố — {incidentReport.soPhieu}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Top section: 2-column layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 380px",
              gap: 3,
            }}
          >
            {/* Left column: Thông tin cơ bản */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Thông tin
              </Typography>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Số biên bản"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  size="small"
                  fullWidth
                />
                <FieldDate
                  title="Ngày kiểm tra"
                  selectedDate={inspectionDate}
                  setSelectedDate={setInspectionDate}
                />
                <TextField
                  label="Vị trí"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ gridColumn: "1 / -1" }}
                />
                <TextField
                  label="Nhận xét, kết luận"
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  sx={{ gridColumn: "1 / -1" }}
                />
                <TextField
                  label="Đề nghị biện pháp xử lý"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  sx={{ gridColumn: "1 / -1" }}
                />
              </Box>
            </Box>

            {/* Right column: Người ký */}
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
                          disabled={signers.some((s) => s.userId === u.id)}
                        >
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
                >
                  Thêm người duyệt
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Tình trạng thiết bị & vật tư phụ tùng đưa vào kiểm tra */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              Tình trạng chi tiết thiết bị & vật tư linh kiện kiểm tra sự cố
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 700, width: 60 }}>
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>
                      Tên Thiết bị / Vật tư phụ tùng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 60 }}>
                      ĐVT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 70 }}>
                      SL
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>
                      Tình trạng KT
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, width: 90 }}
                    >
                      Sửa chữa
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 700, width: 90 }}
                    >
                      Thay mới
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                      Ghi chú
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, width: 60 }}
                      align="center"
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {danhSachChiTiet.map((entry, assetIdx) => (
                    <React.Fragment key={entry.idTaiSan || assetIdx}>
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
                            title="Thêm vật tư phụ tùng kiểm tra"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Hàng các vật tư phụ tùng chi tiết (con) */}
                      {!entry.danhSachVatTu ||
                      entry.danhSachVatTu.length === 0 ? (
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
                            Chưa có vật tư/linh kiện phụ tùng nào được chọn dưới
                            thiết bị này. Nhấp "+" để thêm.
                          </TableCell>
                        </TableRow>
                      ) : (
                        entry.danhSachVatTu.map((vt, vtIdx) => {
                          const sumQty =
                            (vt.soLuongSuaChua || 0) + (vt.soLuongThayMoi || 0);
                          const isQtyError = sumQty > (vt.soLuong || 0);

                          return (
                            <TableRow key={vt.id || vtIdx}>
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
                                      Math.max(
                                        0,
                                        parseInt(e.target.value) || 0,
                                      ),
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
                                      Math.max(
                                        0,
                                        parseInt(e.target.value) || 0,
                                      ),
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
                                      Math.max(
                                        0,
                                        parseInt(e.target.value) || 0,
                                      ),
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
                                  placeholder="Ghi chú..."
                                  fullWidth
                                  variant="outlined"
                                  multiline
                                  maxRows={2}
                                  inputProps={{ style: { fontSize: "0.8rem" } }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    removeMaterialRow(assetIdx, vt.id!)
                                  }
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

          {/* Preview section */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Xem trước biên bản
            </Typography>
            <IncidentInspectionPreview
              number={number}
              inspectionDate={inspectionDate}
              location={location}
              findings={findings}
              recommendation={recommendation}
              danhSachChiTiet={danhSachChiTiet}
              signers={signers}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={danhSachChiTiet.some((entry) =>
            (entry.danhSachVatTu || []).some((vt) => !vt.idChiTietVatTu),
          )}
        >
          {initData?.id ? "Cập nhật biên bản" : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncidentInspectionDialog;
