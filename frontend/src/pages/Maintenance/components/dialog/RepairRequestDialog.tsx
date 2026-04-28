import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { departments, users } from "../../../../mockdata/mockDepartments";
import type { PlanSigner } from "../../../../mockdata/mockPlans";
import type { RepairRequest } from "../../../../mockdata/mockRepairRequests";
import RepairRequestPreview from "../preview/RepairRequestPreview";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  selectedDeviceIds: string[];
  selectedMonth: number;
  onSubmit: (req: RepairRequest) => void;
}

const RepairRequestDialog = ({
  open,
  onClose,
  plan,
  selectedDeviceIds,
  selectedMonth,
  onSubmit,
}: Props) => {
  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");

  // const [signers, setSigners] = useState<PlanSigner[]>(() =>
  //   (plan.signers as PlanSigner[] | undefined)?.map(s => ({ ...s, signed: false, signedAt: undefined })) ?? []
  // );
  const [signers, setSigners] = useState<PlanSigner[]>([]);

  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const sourceDeptId = plan.idDonViGiao || "";
  const execDeptId = plan.idDonViNhan || "";

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
    const today = new Date().toLocaleDateString("vi-VN");
    const req: RepairRequest = {
      id: `GDN-${Date.now()}`,
      planId: plan.id,
      number:
        number ||
        `${sourceDeptId}-${String(selectedMonth + 1).padStart(2, "0")}-${plan.nam}`,
      month: selectedMonth + 1,
      year: plan.nam,
      deviceIds: selectedDeviceIds,
      sourceDepartmentId: sourceDeptId,
      executionDepartmentId: execDeptId,
      signers,
      status: "cho-duyet",
      createdDate: today,
      createdBy: signers[0]?.userId || "",
      note,
    };
    onSubmit(req);
    setNumber("");
    setNote("");
    setSigners(
      (plan.nguoiKyList as PlanSigner[] | undefined)?.map((s) => ({
        ...s,
        signed: false,
        signedAt: undefined,
      })) ?? [],
    );
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
          Tạo Giấy đề nghị sửa chữa
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ── Hàng trên: 2 cột ── */}
          <Box
            sx={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 3 }}
          >
            {/* ── Cột trái: Thông tin ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                    label="Số giấy đề nghị"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder={`VD: ${sourceDeptId}-001`}
                    size="small"
                    fullWidth
                  />
                  <Typography variant="body2" color="text.secondary">
                    Căn cứ Kế hoạch SCBD tháng <b>{selectedMonth + 1}</b> năm{" "}
                    <b>{plan.nam}</b>
                    &nbsp;—&nbsp;Số thiết bị: <b>{selectedDeviceIds.length}</b>
                  </Typography>
                  <TextField
                    label="Ghi chú / Nội dung sửa chữa"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    multiline
                    rows={3}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>

            {/* ── Cột phải: Quy trình duyệt (CHUYỂN SANG) ── */}
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

              {/* giữ nguyên toàn bộ nội dung bên trong */}
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
                              transition: "all 0.2s",
                              "&:hover": !isEditingThis
                                ? { boxShadow: 1, borderColor: "grey.300" }
                                : {},
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
                                  <InputLabel>Phòng ban</InputLabel>
                                  <Select
                                    value={editDeptId}
                                    label="Phòng ban"
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
                                      <Chip
                                        label={
                                          departments.find(
                                            (d) => d.id === s.departmentId,
                                          )?.name ?? s.departmentId
                                        }
                                        size="small"
                                        sx={{
                                          fontSize: 10,
                                          height: 18,
                                          bgcolor: "grey.100",
                                        }}
                                      />
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

              {/* Form thêm giữ nguyên */}
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
                  fullWidth
                >
                  Thêm người duyệt
                </Button>
              </Box>
              {/* (copy nguyên block add signer của bạn xuống đây) */}
            </Box>
          </Box>

          {/* ── Hàng dưới: Preview FULL WIDTH ── */}
          <Box>
            <RepairRequestPreview
              plan={plan}
              deviceIds={selectedDeviceIds}
              month={selectedMonth + 1}
              year={plan.nam}
              number={number}
              signers={signers}
              sourceDeptId={sourceDeptId}
              execDeptId={execDeptId}
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
          disabled={signers.length === 0}
          onClick={handleSubmit}
        >
          Tạo &amp; Gửi duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepairRequestDialog;
