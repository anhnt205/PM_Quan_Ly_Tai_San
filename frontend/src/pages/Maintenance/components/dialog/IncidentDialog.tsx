import { useMemo, useState, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IncidentPreview from "../preview/IncidentPreview";
import StepAssets from "../step/StepAssets";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import type { PlanSigner } from "../../../../mockdata/mockPlans";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";
import type { IncidenData, IncidenDetailData } from "../../types/index";
import dayjs from "dayjs";
import { CongTy } from "../../../../utils/const";
import { generateCode } from "../../../../utils/helpers";

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
  selectedPlans: MaintenancePlanData[];
  onSubmit: (rec: IncidenData) => void;
}

const IncidentDialog = ({ open, onClose, selectedPlans, onSubmit }: Props) => {
  const [number, setNumber] = useState("");
  const [detectedAt, setDetectedAt] = useState(
    dayjs().format("YYYY-MM-DD HH:mm:ss"),
  );
  const [reporter, setReporter] = useState("");
  const [systemName, setSystemName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<number>(2); // 0: Nhẹ, 1: Trung bình, 2: Nặng, 3: Nghiêm trọng
  const [subsystem, setSubsystem] = useState("");

  const planIds = selectedPlans.map((p) => p.id);

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [assets, setAssets] = useState<any[]>([]);

  // deviceEntries là state riêng — được sync từ assets rồi có thể edit thủ công trong preview
  const [deviceEntries, setDeviceEntries] = useState<IncidenDetailData[]>([]);

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();

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

  // Reset khi dialog mở hoặc dept thay đổi
  useEffect(() => {
    if (!open) return;
    if (selectedPlans && selectedPlans.length > 0) {
      setSelectedDeptId(selectedPlans[0].idDonViGiao || "");
    } else {
      setAssets([]);
    }
    setDeviceEntries([]);
  }, [open, selectedPlans]);

  // Sync assets → deviceEntries, ưu tiên dữ liệu từ API response
  useEffect(() => {
    setDeviceEntries((prev: IncidenDetailData[]) => {
      return assets.map((a: any) => {
        const id = a.id ?? a.deviceId ?? "";
        const existing = prev.find((e: IncidenDetailData) => e.idTaiSan === id);

        // Map hienTrang (số) sang text dễ đọc;

        return {
          idTaiSan: id,
          tenTaiSan: existing?.tenTaiSan ?? a.tenTaiSan ?? "",
          soLuong: existing?.soLuong ?? a.quantity ?? 1,
          // status: ưu tiên giữ lại nếu user đã sửa, fallback API, fallback mock
          tinhTrang:
            existing?.idTaiSan === id && existing?.tinhTrang !== undefined
              ? existing.tinhTrang
              : (a.tenHienTrang ?? ""),
          tenNhomTaiSan: a.tenNhom || "",
          thuocHeThong: existing?.thuocHeThong ?? a.thuocHeThong ?? "",
          idDonViQuanLyKyThuat:
            existing?.idDonViQuanLyKyThuat ?? a.idDonViQuanLyKyThuat ?? "",
          viTri: existing?.viTri ?? a.viTri ?? "",
        };
      });
    });
  }, [assets]);

  // Signers
  const [signers, setSigners] = useState<PlanSigner[]>([]);
  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

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

  // Validate: bắt buộc có thiết bị, các trường info (trừ mô tả)
  const isSubmitDisabled =
    assets.length === 0 ||
    !selectedDeptId ||
    !detectedAt ||
    !systemName ||
    !subsystem ||
    !severity;

  const handleSubmit = () => {
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

    const rec: any = {
      id: `INC-${Date.now()}`,
      idCongTy: CongTy.CT001,
      idKeHoach: selectedPlans[0]?.id || "",
      soPhieu: number,
      idDonViBaoCao: selectedDeptId,
      ngayPhatHien: dayjs(detectedAt).format("YYYY-MM-DD HH:mm:ss"),
      tenHeThongThietBi: systemName,
      phanHeViTri: subsystem,
      mucDo: severity,
      moTa: description,
      idNguoiLap: idNguoiLapBieu,
      nguoiLapXacNhan: false,
      idGiamDoc: idTrinhDuyetGiamDoc,
      giamDocXacNhan: false,
      trangThai: 0,
      share: false,
      ngayTao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      nguoiKyList: intermediateSigners,
      danhSachTaiSan: deviceEntries,
    };
    onSubmit(rec);
    // reset
    setNumber("");
    setDetectedAt("");
    setReporter("");
    setSystemName("");
    setLocation("");
    setSubsystem("");
    setDescription("");
    setSelectedDeptId("");
    setAssets([]);
    setDeviceEntries([]);
    setSigners([]);
    onClose();
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
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Tạo Phiếu báo sự cố thiết bị
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 380px",
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* ───────── Thông tin chung ───────── */}
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
                    label="Số phiếu"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    size="small"
                    fullWidth
                  />

                  <FormControl size="small" required>
                    <InputLabel required>Đơn vị báo cáo</InputLabel>
                    <Select
                      value={selectedDeptId}
                      label="Đơn vị báo cáo *"
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                    >
                      <MenuItem value="">— Chọn đơn vị —</MenuItem>
                      {departments.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Ngày giờ phát hiện — datetime-local picker */}
                  <TextField
                    label="Ngày giờ phát hiện"
                    type="datetime-local"
                    value={detectedAt}
                    onChange={(e) => setDetectedAt(e.target.value)}
                    size="small"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="Tên hệ thống/thiết bị gặp sự cố"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    size="small"
                    fullWidth
                    required
                  />

                  <TextField
                    label="Phân hệ/vị trí xảy ra sự cố"
                    value={subsystem}
                    onChange={(e) => setSubsystem(e.target.value)}
                    size="small"
                    fullWidth
                    required
                  />

                  <FormControl size="small" required>
                    <InputLabel required>Mức độ</InputLabel>
                    <Select
                      value={severity}
                      label="Mức độ *"
                      onChange={(e) => setSeverity(Number(e.target.value))}
                    >
                      <MenuItem value={0}>Nhẹ</MenuItem>
                      <MenuItem value={1}>Trung bình</MenuItem>
                      <MenuItem value={2}>Nặng</MenuItem>
                      <MenuItem value={3}>Nghiêm trọng</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Mô tả — KHÔNG bắt buộc */}
                  <TextField
                    label="Mô tả tình trạng sự cố"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    size="small"
                    fullWidth
                    placeholder="Mô tả chi tiết tình trạng sự cố (không bắt buộc)"
                  />
                </Box>
              </Box>

              {/* ───────── Danh sách thiết bị liên quan ───────── */}
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: 2.5,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Danh sách thiết bị liên quan{" "}
                  <span style={{ color: "#d32f2f" }}>*</span>
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {!selectedDeptId && (
                    <Typography variant="body2" color="text.secondary">
                      Chọn đơn vị báo cáo để xem thiết bị.
                    </Typography>
                  )}
                  {selectedDeptId && (
                    <StepAssets
                      sourceDeptId={selectedDeptId}
                      assets={assets}
                      onAssetsChange={setAssets}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* ───────── Quy trình duyệt (bên phải) ───────── */}
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

              {/* Form thêm người duyệt */}
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

          {/* ── Preview FULL WIDTH với deviceEntries có thể edit ── */}
          <Box>
            <IncidentPreview
              number={number}
              detectedAt={detectedAt}
              reporter={reporter}
              reporterDeptId={selectedDeptId}
              signers={signers}
              systemName={systemName}
              subsystem={subsystem}
              location={location}
              description={description}
              severity={severity}
              deviceEntries={deviceEntries}
              onDeviceEntriesChange={setDeviceEntries}
              planIds={planIds}
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
          disabled={isSubmitDisabled}
        >
          Tạo Phiếu và Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncidentDialog;
