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
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { IncidentInspectionItem } from "../../../../mockdata/mockIncidentInspection";
import IncidentInspectionPreview from "../preview/IncidentInspectionPreview";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";
import { IncidenData, IncidentInspectionData } from "../../types";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { generateCode } from "../../../../utils/helpers";
import { CongTy } from "../../../../utils/const";
import { useMaintenanceIncidentInspectionMutation } from "../../../MainenancePlanRepair/Mutation";
import FieldDate from "../../../../components/TextField/FieldDate";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  incidentReport: IncidenData;
}

const IncidentInspectionDialog = ({
  open,
  onClose,
  plan,
  incidentReport,
}: Props) => {
  const [number, setNumber] = useState("");
  const [inspectionDate, setInspectionDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [location, setLocation] = useState("");
  const [findings, setFindings] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [items, setItems] = useState<IncidentInspectionItem[]>([]);

  useEffect(() => {
    if (open && incidentReport?.danhSachTaiSan) {
      setItems(
        incidentReport.danhSachTaiSan.map((d, index) => ({
          stt: index + 1,
          id: d.id,
          idTaiSan: d.idTaiSan,
          itemName: d.tenTaiSan || d.idTaiSan,
          unit: d.donViTinh || "",
          repairLevel: "",
          quantity: d.soLuong || 1,
          condition: d.tinhTrang || "",
          actionRepair: true,
          actionReplace: false,
          note: "",
        })),
      );
    }
  }, [open, incidentReport]);
  const [signers, setSigners] = useState<PlanSigner[]>([]);
  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { createMutation: createIncInspMutation } =
    useMaintenanceIncidentInspectionMutation();

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

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        stt: items.length + 1,
        itemName: "",
        repairLevel: "",
        quantity: 1,
        condition: "",
        actionRepair: false,
        actionReplace: false,
        note: "",
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(
      items
        .filter((_, i) => i !== idx)
        .map((item, i) => ({ ...item, stt: i + 1 })),
    );
  };

  const handleItemChange = (
    idx: number,
    field: keyof IncidentInspectionItem,
    value: any,
  ) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
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

    // Người ký trung gian (nếu có)
    const intermediateSigners =
      signers.length > 2
        ? signers.slice(1, -1).map((s: PlanSigner, idx: number) => ({
            id: `${generateCode("SIG-")}-${idx}`,
            idNguoiKy: s.userId,
            tenNguoiKy: s.userName,
            idPhongBan: s.departmentId,
            trangThai: 0,
          }))
        : [];
    const record: IncidentInspectionData = {
      idCongTy: CongTy.CT001,
      idSuCo: incidentReport.id,
      soPhieu: number,
      ngayKiemTra: inspectionDate,
      viTri: location,
      nhanXetKetLuan: findings,
      bienPhapXuLy: recommendation,

      idNguoiLap: idNguoiLapBieu,
      nguoiLapXacNhan: false,
      idGiamDoc: idTrinhDuyetGiamDoc,
      giamDocXacNhan: false,
      trangThai: 0,
      share: true,
      nguoiKyList: intermediateSigners,
      danhSachChiTiet: items.map((item) => {
        return {
          idKiemTraSuCo: generateCode("KTS-TEST-"),
          idTaiSan: item.idTaiSan,
          idSuCoChiTiet: item.id,
          capBaoDuong: item.repairLevel,
          tinhTrang: item.condition,
          suaChua: item.actionRepair,
          thayMoi: item.actionReplace,
          ghiChu: item.note,
          soLuong: item.quantity,
        };
      }),
    };
    createIncInspMutation.mutate(record, {
      onSuccess: () => {
        onClose();
      },
    });
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
          {/* ──── Top section: 2-column layout ──── */}
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
                  onClick={handleAddSigner}
                  disabled={!addUserId}
                >
                  Thêm người duyệt
                </Button>
              </Box>
            </Box>
          </Box>

          {/* ──── Danh sách kiểm tra (full width) ──── */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
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
              <Typography variant="subtitle1" fontWeight={600}>
                Danh sách kiểm tra sự cố
              </Typography>
              {/* <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Thêm dòng
              </Button> */}
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Tên vật tư, thiết bị
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>ĐVT</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      SL
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Tình trạng thiết bị
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      SC
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">
                      Thay mới
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
                    {/* <TableCell align="center">Xóa</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell align="center">{item.stt}</TableCell>
                      <TableCell>
                        <TextField
                          value={item.itemName}
                          onChange={(e) =>
                            handleItemChange(idx, "itemName", e.target.value)
                          }
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "quantity",
                              parseInt(e.target.value || "1"),
                            )
                          }
                          size="small"
                          inputProps={{ min: 1 }}
                          variant="standard"
                          sx={{ width: "60px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.condition}
                          onChange={(e) =>
                            handleItemChange(idx, "condition", e.target.value)
                          }
                          size="small"
                          fullWidth
                          variant="standard"
                          placeholder="Mô tả tình trạng"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={item.actionRepair}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "actionRepair",
                              e.target.checked,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={item.actionReplace}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "actionReplace",
                              e.target.checked,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.note}
                          onChange={(e) =>
                            handleItemChange(idx, "note", e.target.value)
                          }
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      </TableCell>
                      {/* <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ──── Preview (full width) ──── */}
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
              items={items}
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
          disabled={items.some((item) => !item.itemName)}
        >
          Tạo biên bản
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncidentInspectionDialog;
