import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { PlanSigner } from "../../../../mockdata/mockPlans";
import RepairRequestPreview from "../preview/RepairRequestPreview";
import { MaintenancePlanData } from "../../types";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { generateCode } from "../../../../utils/helpers";
import { Action, CongTy } from "../../../../utils/const";
import dayjs from "dayjs";
import { MaintenanceRepairData } from "../../types";
import { listSigneInfo } from "../../config";
import FieldInput from "../../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import SignerWorkflowSection from "../signdocument/SignerWorkflowSection";
import { MaintenanceValidation } from "../../validation";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  selectedDeviceIds: string[];
  selectedMonth: number;
  onSubmit: (req: MaintenanceRepairData) => void;
  initialData?: MaintenanceRepairData | null;
}

const RepairRequestDialog = ({
  open,
  onClose,
  plan,
  selectedDeviceIds,
  selectedMonth,
  onSubmit,
  initialData,
}: Props) => {
  const sourceDeptId = plan.idDonViGiao || "";
  const execDeptId = plan.idDonViNhan || "";

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      soPhieu: "",
      idKeHoach: plan?.id || "",
      thang: selectedMonth + 1,
      nam: plan?.nam || 2026,
      ghiChu: "",
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      ngayTao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      ngayCapNhat: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      danhSachTaiSan: [] as any[],
      nguoiKyList: [] as any[],
    },
    // validationSchema: MaintenanceValidation,
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

      const req: MaintenanceRepairData = {
        ...values,
        idNguoiLap: idNguoiLapBieu,
        idGiamDoc: idTrinhDuyetGiamDoc,
        nguoiKyList: intermediateSigners,
        ngayTao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ngayCapNhat: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      onSubmit(req);
      formik.resetForm();
      onClose();
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const listInfo = listSigneInfo(initialData, apiUsers, apiDepartments);
      const signersList = (listInfo || []).map((item, idx) => ({
        ...item,
        userId: item.idNhanVien,
        userName: item.hoTen,
        departmentId: item.idDonVi,
        departmentName: item.donVi,
        order: idx + 1,
        action: Action.UPDATE,
      }));

      formik.setValues({
        id: initialData.id || "",
        idCongTy: initialData.idCongTy || CongTy.CT001,
        soPhieu: initialData.soPhieu ?? "",
        idKeHoach: initialData.idKeHoach ?? plan?.id ?? "",
        thang: initialData.thang ?? selectedMonth + 1,
        nam: plan?.nam ?? 2026,
        ghiChu: initialData.ghiChu ?? "",
        idNguoiLap: initialData.idNguoiLap ?? "",
        nguoiLapXacNhan: initialData.nguoiLapXacNhan ?? false,
        idGiamDoc: initialData.idGiamDoc ?? "",
        giamDocXacNhan: initialData.giamDocXacNhan ?? false,
        share: initialData.share ?? false,
        trangThai: initialData.trangThai ?? 0,
        ngayTao:
          initialData.ngayTao ||
          dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ngayCapNhat: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        danhSachTaiSan: initialData.danhSachTaiSan ?? [],
        nguoiKyList: signersList,
      });
    } else {
      const assetsList = (plan?.danhSachTaiSan || [])
        ?.filter((item) => selectedDeviceIds.includes(item.id ?? ""))
        ?.map((s: any) => {
          const level = s[`capSuaChuaThang${selectedMonth + 1}`] || "";
          return {
            idKeHoachChiTiet: s.id || "",
            idTaiSan: s.idTaiSan || "",
            tenTaiSan: s.tenTaiSan || "",
            nhomTaiSan: s.idNhomTaiSan || "",
            capSuaChua: level,
            soLuong: s.soLuong,
            donViQuanLy: plan.idDonViGiao || "",
            donViBaoTri: s.idDonViBaoTri || "",
            action: Action.CREATE,
          };
        });

      formik.setValues({
        id: "",
        idCongTy: CongTy.CT001,
        soPhieu: "",
        idKeHoach: plan?.id || "",
        thang: selectedMonth + 1,
        nam: plan?.nam || 2026,
        ghiChu: "",
        idNguoiLap: "",
        nguoiLapXacNhan: false,
        idGiamDoc: "",
        giamDocXacNhan: false,
        share: false,
        trangThai: 0,
        ngayTao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ngayCapNhat: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        danhSachTaiSan: assetsList,
        nguoiKyList: [] as any[],
      });
    }
  }, [open, initialData, apiUsers, apiDepartments, selectedDeviceIds, plan]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

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
        <Typography variant="h6" fontWeight={600}>
          Tạo Giấy đề nghị sửa chữa
        </Typography>
        <IconButton size="small" onClick={handleClose}>
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
                  <FieldInput
                    title="Số giấy đề nghị"
                    field="soPhieu"
                    formik={formik}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Căn cứ Kế hoạch SCBD tháng <b>{selectedMonth + 1}</b> năm{" "}
                    <b>{plan.nam}</b>
                    &nbsp;—&nbsp;Số thiết bị: <b>{selectedDeviceIds.length}</b>
                  </Typography>
                  <FieldInput
                    title="Nội dung sửa chữa"
                    field="ghiChu"
                    formik={formik}
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>
            </Box>

            {/* ── Cột phải: Quy trình duyệt ── */}
            <Box>
              <SignerWorkflowSection formik={formik} />
            </Box>
          </Box>

          {/* ── Hàng dưới: Preview FULL WIDTH ── */}
          <Box>
            <RepairRequestPreview
              plan={plan}
              assets={formik.values.danhSachTaiSan}
              month={
                initialData?.thang ? initialData?.thang : selectedMonth + 1
              }
              year={plan.nam}
              number={formik.values.soPhieu}
              signers={formik.values.nguoiKyList}
              sourceDeptId={sourceDeptId}
              execDeptId={execDeptId}
              note={formik.values.ghiChu}
            />
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
          onClick={() => formik.handleSubmit()}
        >
          Tạo &amp; Gửi duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepairRequestDialog;
