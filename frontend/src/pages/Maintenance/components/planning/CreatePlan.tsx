import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
} from "@mui/material";
import FieldYear from "../../../../components/TextField/FieldYear";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFormik } from "formik";
import type {
  MaintenanceLevel,
  PlanSigner,
} from "../../../../mockdata/mockPlans";
import type { AnnualPlan } from "../../../../mockdata/mockWorkflow";
import StepSchedule from "../step/StepSchedule";
import StepPreview from "../step/StepPreview";
import StepAssets from "../step/StepAssets";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useAssetByDonViQuery } from "../../../AssetTransfer/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import FieldInput from "../../../../components/TextField/FieldInput";

interface PlanAsset {
  deviceId: string;
  quantity: number;
  month1: MaintenanceLevel;
  month2: MaintenanceLevel;
  month3: MaintenanceLevel;
  month4: MaintenanceLevel;
  month5: MaintenanceLevel;
  month6: MaintenanceLevel;
  month7: MaintenanceLevel;
  month8: MaintenanceLevel;
  month9: MaintenanceLevel;
  month10: MaintenanceLevel;
  month11: MaintenanceLevel;
  month12: MaintenanceLevel;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (plan: AnnualPlan) => void;
}

const CreatePlanDialog = ({ open, onClose, onSave }: Props) => {
  const [addDeptId, setAddDeptId] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [editingSignerId, setEditingSignerId] = useState<string | null>(null);
  const [editDeptId, setEditDeptId] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const formik = useFormik({
    initialValues: {
      planCode: "",
      planName: "",
      planYear: new Date().getFullYear(),
      sourceDeptId: "",
      executionDeptId: "",
      decisionNo: "",
      signers: [] as PlanSigner[],
      assets: [] as PlanAsset[],
    },
    onSubmit: (values) => {
      // Logic handled via handleSave for draft/approval differentiation
    },
  });

  const { data: fullDeptAssets = { items: [], totalItems: 0 } } =
    useAssetByDonViQuery(2, formik.values.sourceDeptId, "");

  const { data: departments = [] } = useAllDepartmentsQuery();
  const { data: users = [] } = useAllStaffsQuery();

  const handleClose = () => {
    formik.resetForm();
    setAddDeptId("");
    setAddUserId("");
    onClose();
  };

  const handleAddSigner = () => {
    if (!addUserId || !addDeptId) return;
    if (formik.values.signers.some((s) => s.userId === addUserId)) return;
    const user = users.find((u: any) => u.id === addUserId);
    const dept = departments.find((d: any) => d.id === addDeptId);
    if (!user || !dept) return;

    const newSigner: PlanSigner = {
      userId: user.id,
      userName: user.hoTen,
      departmentId: dept.id,
      departmentName: dept.tenPhongBan,
      order: formik.values.signers.length + 1,
      signed: false,
    };

    formik.setFieldValue("signers", [...formik.values.signers, newSigner]);
    setAddDeptId("");
    setAddUserId("");
  };

  const handleRemoveSigner = (userId: string) => {
    const updatedSigners = formik.values.signers
      .filter((s) => s.userId !== userId)
      .map((s, i) => ({ ...s, order: i + 1 }));
    formik.setFieldValue("signers", updatedSigners);
  };

  const handleEdit = (signer: PlanSigner) => {
    setEditingSignerId(signer.userId);
    setEditDeptId(signer.departmentId);
    setEditUserId(signer.userId);
  };

  const handleSaveEdit = () => {
    const updatedSigners = formik.values.signers.map((s) =>
      s.userId === editingSignerId
        ? {
            ...s,
            userId: editUserId,
            userName: users.find((u: any) => u.id === editUserId)?.hoTen || "",
            departmentId: editDeptId,
            departmentName:
              departments.find((d: any) => d.id === editDeptId)?.tenPhongBan ||
              "",
          }
        : s,
    );
    formik.setFieldValue("signers", updatedSigners);
    setEditingSignerId(null);
  };

  const canSave =
    !!formik.values.sourceDeptId &&
    !!formik.values.executionDeptId &&
    formik.values.sourceDeptId !== formik.values.executionDeptId &&
    formik.values.assets.length > 0 &&
    formik.values.signers.length > 0 &&
    formik.values.planCode.trim() !== "" &&
    formik.values.planName.trim() !== "";

  const handleSave = (status: "draft" | "cho-duyet") => {
    // Chuyển đổi assets và schedule về định dạng cũ để tương thích với onSave hiện tại
    const schedule: Record<string, MaintenanceLevel[]> = {};
    formik.values.assets.forEach((a) => {
      schedule[a.deviceId] = [
        a.month1,
        a.month2,
        a.month3,
        a.month4,
        a.month5,
        a.month6,
        a.month7,
        a.month8,
        a.month9,
        a.month10,
        a.month11,
        a.month12,
      ];
    });

    const newPlan: AnnualPlan = {
      id:
        formik.values.planCode.trim() ||
        `KH-${formik.values.planYear}-${Date.now().toString().slice(-4)}`,
      year: formik.values.planYear,
      deviceIds: formik.values.assets.map((a) => a.deviceId),
      status,
      createdDate: new Date().toISOString().slice(0, 10),
      description:
        formik.values.planName ||
        `Kế hoạch SCBD - ${departments.find((d: any) => d.id === formik.values.sourceDeptId)?.tenPhongBan || formik.values.sourceDeptId}`,
      sourceDepartmentId: formik.values.sourceDeptId,
      executionDepartmentId: formik.values.executionDeptId,
      monthlySchedule: schedule as any,
      signers: formik.values.signers,
    };
    onSave(newPlan);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
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
          Tạo kế hoạch mới
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {/* ── ROW 1: 2 cột trên cùng ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 380px",
            gap: 3,
            mb: 3,
          }}
        >
          {/* ── CỘT TRÁI: Đơn vị + Chọn thiết bị ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Thông tin kế hoạch */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Thông tin kế hoạch
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "0.7fr 1fr 0.5fr",
                  gap: 2,
                }}
              >
                <FieldInput title="Mã phiếu" formik={formik} field="planCode" />
                <FieldInput
                  title="Tên kế hoạch"
                  formik={formik}
                  field="planName"
                />
                <FieldYear title="Năm" formik={formik} field="planYear" />
              </Box>
            </Box>

            {/* Đơn vị */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                1. Đơn vị
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FieldAutoCompleted
                  title="Đơn vị quản lý (Nguồn)"
                  data={departments}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="sourceDeptId"
                  onChange={(value) => {
                    formik.setFieldValue("assets", []);
                  }}
                />
                <FieldAutoCompleted
                  title="Đơn vị thực hiện"
                  data={departments.filter((d: any) => d.id !== formik.values.sourceDeptId)}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="executionDeptId"
                />
              </Box>
            </Box>

            {/* Chọn thiết bị */}
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                2. Chọn thiết bị
              </Typography>
              {!formik.values.sourceDeptId ? (
                <Alert severity="info">
                  Vui lòng chọn đơn vị quản lý trước
                </Alert>
              ) : (
                <StepAssets
                  sourceDeptId={formik.values.sourceDeptId}
                  assets={formik.values.assets}
                  onAssetsChange={(assets) =>
                    formik.setFieldValue("assets", assets)
                  }
                />
              )}
            </Box>
          </Box>

          {/* ── CỘT PHẢI: Quy trình duyệt ── */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              mb={3}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              Quy trình duyệt
              <Chip
                label={`${formik.values.signers.length} người`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 400 }}
              />
            </Typography>

            {/* Timeline */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {formik.values.signers.length > 0 ? (
                <Box sx={{ position: "relative", pl: 5, mb: 3 }}>
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
                  {formik.values.signers.map((s, idx) => {
                    const user = users.find((u: any) => u.id === s.userId);
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
                            bgcolor: "green",
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
                            borderRadius: 3,
                            p: 2,
                            bgcolor: isEditingThis
                              ? "primary.50"
                              : "background.paper",
                            transition: "all 0.2s",
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": !isEditingThis
                              ? {
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                  borderColor: "grey.300",
                                }
                              : {},
                          }}
                        >
                          {/* Role Indicator - Decorative side bar */}
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 4,
                              bgcolor:
                                idx === 0
                                  ? "primary.main"
                                  : idx === formik.values.signers.length - 1 &&
                                      idx > 0
                                    ? "error.main"
                                    : "grey.300",
                            }}
                          />

                          {isEditingThis ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight={700}
                                color="primary"
                                sx={{ mb: -0.5 }}
                              >
                                ĐANG CHỈNH SỬA
                              </Typography>
                              <FieldAutoCompleted
                                title="Phòng ban"
                                data={departments}
                                labelkey="tenPhongBan"
                                value={editDeptId}
                                onChange={(value) => {
                                  setEditDeptId(value?.id || "");
                                  setEditUserId("");
                                }}
                              />
                              <FieldAutoCompleted
                                title="Người duyệt"
                                data={users.filter(
                                  (u: any) =>
                                    u.hasAccount &&
                                    u.phongBanId ===
                                      formik.values.signers[idx].departmentId &&
                                    (!formik.values.signers.some(
                                      (s) => s.userId === u.id,
                                    ) ||
                                      u.id === s.userId),
                                )}
                                labelkey="hoTen"
                                value={editUserId}
                                setValue={setEditUserId}
                              />
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
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: idx === 0 ? "primary.main" : (idx === formik.values.signers.length - 1 && idx > 0 ? "error.main" : "grey.400"),
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    flexShrink: 0,
                                  }}
                                >
                                  {user?.hoTen?.charAt(0) ?? "?"}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                    <Typography fontWeight={600} fontSize={13} noWrap>
                                      {user?.hoTen}
                                    </Typography>
                                    {idx === 0 && (
                                      <Typography
                                        sx={{
                                          color: "primary.dark",
                                          fontWeight: 700,
                                          fontSize: 10,
                                          bgcolor: "primary.50",
                                          px: 0.5,
                                          borderRadius: 0.5,
                                          border: "1px solid",
                                          borderColor: "primary.100",
                                        }}
                                      >
                                        Người lập biểu
                                      </Typography>
                                    )}
                                    {idx === formik.values.signers.length - 1 && idx > 0 && (
                                      <Typography
                                        sx={{
                                          color: "error.dark",
                                          fontWeight: 700,
                                          fontSize: 10,
                                          bgcolor: "error.50",
                                          px: 0.5,
                                          borderRadius: 0.5,
                                          border: "1px solid",
                                          borderColor: "error.100",
                                        }}
                                      >
                                        Giám đốc
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {user?.tenChucVu || "Cán bộ"}
                                  </Typography>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                      label={departments.find((d: any) => d.id === s.departmentId)?.tenPhongBan ?? s.departmentId}
                                      size="small"
                                      sx={{ fontSize: 10, height: 18, bgcolor: "grey.100" }}
                                    />
                                  </Box>
                                </Box>
                              </Box>

                              <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleEdit(s)}
                                  sx={{ minWidth: 0, px: 1, fontSize: 12 }}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  onClick={() => handleRemoveSigner(s.userId)}
                                  sx={{ minWidth: 0, px: 1, fontSize: 12 }}
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

            {/* Add signer form */}
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
                mt: "auto",
              }}
            >
              <FieldAutoCompleted
                title="Phòng ban"
                data={departments}
                labelkey="tenPhongBan"
                value={addDeptId}
                onChange={(value) => {
                  setAddDeptId(value?.id || "");
                  setAddUserId("");
                }}
              />
              <FieldAutoCompleted
                title="Người duyệt"
                data={users.filter(
                  (u: any) =>
                    u.hasAccount &&
                    u.phongBanId === addDeptId &&
                    !formik.values.signers.some((s) => s.userId === u.id),
                )}
                labelkey="hoTen"
                value={addUserId}
                setValue={setAddUserId}
                disabled={!addDeptId}
              />
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

        <Divider sx={{ my: 1 }} />

        {/* ── Lịch sửa chữa ── */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            3. Lịch sửa chữa bảo dưỡng
          </Typography>
          {formik.values.assets.length === 0 ? (
            <Alert severity="info">Vui lòng chọn thiết bị trước</Alert>
          ) : (
            <StepSchedule
              assets={formik.values.assets}
              onAssetsChange={(assets) =>
                formik.setFieldValue("assets", assets)
              }
              deptDevices={fullDeptAssets}
            />
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* ── Xem trước ── */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
            4. Xem trước kế hoạch
          </Typography>
          <StepPreview
            sourceDeptId={formik.values.sourceDeptId}
            executionDeptId={formik.values.executionDeptId}
            assets={formik.values.assets}
            signers={formik.values.signers}
            deptDevices={fullDeptAssets}
            departments={departments}
            formik={formik}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="outlined"
          disabled={!canSave}
          onClick={() => handleSave("draft")}
        >
          Lưu nháp
        </Button>
        <Button
          variant="contained"
          disabled={!canSave}
          onClick={() => handleSave("cho-duyet")}
        >
          Gửi phê duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePlanDialog;
