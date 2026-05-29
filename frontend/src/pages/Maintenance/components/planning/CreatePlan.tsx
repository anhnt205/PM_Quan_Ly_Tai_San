import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import FieldYear from "../../../../components/TextField/FieldYear";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import type { PlanSigner } from "../../../../mockdata/mockPlans";
import StepSchedule from "../step/StepSchedule";
import StepPreview from "../step/StepPreview";
import StepAssets from "../step/StepAssets";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { useAssetByDonViQuery } from "../../../AssetTransfer/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import FieldInput from "../../../../components/TextField/FieldInput";
import { Action, ActionType } from "../../../../utils/const";
import { generateCode } from "../../../../utils/helpers";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";
import { listSigneInfo } from "../../config";
import SignerWorkflowSection from "../dialog/SignerWorkflowSection";

interface PlanAsset {
  id?: string;
  deviceId: string;
  quantity: number;
  idDonViBaoTri?: string;
  month1: string;
  month2: string;
  month3: string;
  month4: string;
  month5: string;
  month6: string;
  month7: string;
  month8: string;
  month9: string;
  month10: string;
  month11: string;
  month12: string;
  action?: ActionType;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (plan: any, isEdit?: boolean) => void;
  initialData?: MaintenancePlanData | null;
}

const CreatePlanDialog = ({ open, onClose, onSave, initialData }: Props) => {
  const isEdit = !!initialData;

  const { data: departments = [] } = useAllDepartmentsQuery();
  const { data: users = [] } = useAllStaffsQuery();

  const listInfo = listSigneInfo(initialData, users, departments);

  const formik = useFormik({
    initialValues: {
      planCode: initialData?.id || "",
      planName: initialData?.tenKeHoach || "",
      planYear: initialData?.nam || new Date().getFullYear(),
      nhomTaiSan: initialData?.nhomTaiSan || "MAY_MOC",
      sourceDeptId: initialData?.idDonViGiao || "",
      executionDeptId: initialData?.idDonViNhan || "",
      decisionNo: initialData?.soQuyetDinh || "",
      signers: (listInfo || []).map((item, idx) => ({
        ...item,
        userId: item.idNhanVien,
        userName: item.hoTen,
        departmentId: item.idDonVi,
        departmentName: item.donVi,
        order: idx + 1,
        action: Action.UPDATE,
      })),
      assets: (initialData?.danhSachTaiSan || []).map((item) => ({
        ...item,
        deviceId: item.idTaiSan,
        quantity: item.soLuong ?? 1,
        idDonViBaoTri: item.idDonViBaoTri,
        month1: item.capSuaChuaThang1 ?? "",
        month2: item.capSuaChuaThang2 ?? "",
        month3: item.capSuaChuaThang3 ?? "",
        month4: item.capSuaChuaThang4 ?? "",
        month5: item.capSuaChuaThang5 ?? "",
        month6: item.capSuaChuaThang6 ?? "",
        month7: item.capSuaChuaThang7 ?? "",
        month8: item.capSuaChuaThang8 ?? "",
        month9: item.capSuaChuaThang9 ?? "",
        month10: item.capSuaChuaThang10 ?? "",
        month11: item.capSuaChuaThang11 ?? "",
        month12: item.capSuaChuaThang12 ?? "",
        action: Action.UPDATE,
      })),
      idCongTy: initialData?.idCongTy || "CT001",
      idLoaiKeHoach: initialData?.idLoaiKeHoach || "THIET_BI",
      trangThai: initialData?.trangThai || 0,
      share: initialData?.share ?? false,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // Logic handled via handleSave for draft/approval differentiation
    },
  });

  const { data: fullDeptAssets = { items: [], totalItems: 0 } } =
    useAssetByDonViQuery(2, formik.values.sourceDeptId, "");

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const canSave =
    !!formik.values.sourceDeptId &&
    formik.values.assets.length > 0 &&
    formik.values.signers.length > 0 &&
    formik.values.planCode.trim() !== "" &&
    formik.values.planName.trim() !== "";

  const handleSave = () => {
    // 1. Ánh xạ chi tiết tài sản với 12 tháng
    const danhSachTaiSan = formik.values.assets.map((a: PlanAsset) => ({
      id: a.id,
      idTaiSan: a.deviceId,
      soLuong: a.quantity || 1,
      idDonViBaoTri: a.idDonViBaoTri,
      capSuaChuaThang1: a.month1,
      capSuaChuaThang2: a.month2,
      capSuaChuaThang3: a.month3,
      capSuaChuaThang4: a.month4,
      capSuaChuaThang5: a.month5,
      capSuaChuaThang6: a.month6,
      capSuaChuaThang7: a.month7,
      capSuaChuaThang8: a.month8,
      capSuaChuaThang9: a.month9,
      capSuaChuaThang10: a.month10,
      capSuaChuaThang11: a.month11,
      capSuaChuaThang12: a.month12,
      action: a.action,
    }));

    // 2. Phân tách người ký
    const signers = formik.values.signers;
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

    const newPlanData: any = {
      // Dùng planCode làm ID nếu có, nếu không thì để null để Backend tự tạo hoặc Frontend tạo GUID
      id: formik.values.planCode.trim() || undefined,
      idCongTy: formik.values.idCongTy,
      nhomTaiSan: formik.values.nhomTaiSan,
      soKeHoach: formik.values.planCode,
      tenKeHoach: formik.values.planName,
      soQuyetDinh: formik.values.decisionNo,
      idLoaiKeHoach: formik.values.idLoaiKeHoach,
      nam: formik.values.planYear,
      idDonViGiao: formik.values.sourceDeptId,
      idDonViNhan: formik.values.executionDeptId,
      idNguoiLapBieu: idNguoiLapBieu,
      nguoiLapBieuXacNhan: false,
      idTrinhDuyetGiamDoc: idTrinhDuyetGiamDoc,
      trinhDuyetGiamDocXacNhan: false,
      trangThai: 0,
      share: false,
      ghiChu: `Kế hoạch SCBD - ${departments.find((d: any) => d.id === formik.values.sourceDeptId)?.tenPhongBan || formik.values.sourceDeptId}`,
      danhSachTaiSan: danhSachTaiSan,
      nguoiKyList: intermediateSigners,
    };

    onSave(newPlanData, isEdit);
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
                  gridTemplateColumns: "0.7fr 1.2fr 0.5fr 0.8fr",
                  gap: 2,
                  alignItems: "end",
                }}
              >
                <FieldInput title="Mã phiếu" formik={formik} field="planCode" />
                <FieldInput
                  title="Tên kế hoạch"
                  formik={formik}
                  field="planName"
                />
                <FieldYear title="Năm" formik={formik} field="planYear" />
                <FieldAutoCompleted
                  title="Nhóm tài sản"
                  data={[
                    { id: "MAY_MOC", text: "Máy móc" },
                    { id: "PHUONG_TIEN", text: "Phương tiện" },
                  ]}
                  labelkey="text"
                  formik={formik}
                  field="nhomTaiSan"
                />
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
          <Box>
            <SignerWorkflowSection formik={formik} fieldName="signers" />
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
              assets={formik.values.assets.filter(
                (a: any) => a.action !== Action.DELETE,
              )}
              onAssetsChange={(assets) =>
                formik.setFieldValue("assets", assets)
              }
              deptDevices={fullDeptAssets}
              departments={departments}
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
            assets={formik.values.assets.filter(
              (a: any) => a.action !== Action.DELETE,
            )}
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
        {isEdit ? (
          <Button onClick={() => handleSave()} variant="outlined">
            Cập nhật
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              disabled={!canSave}
              onClick={() => handleSave()}
            >
              Gửi phê duyệt
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreatePlanDialog;
