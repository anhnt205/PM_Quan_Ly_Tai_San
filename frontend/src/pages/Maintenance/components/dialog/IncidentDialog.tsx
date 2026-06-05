import { useEffect, useState } from "react";
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
import IncidentPreview from "../preview/IncidentPreview";
import StepAssets from "../step/StepAssets";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import type { PlanSigner } from "../../../../mockdata/mockPlans";
import { MaintenancePlanData } from "../../types";
import type { IncidenData, IncidenDetailData } from "../../types/index";
import dayjs from "dayjs";
import { Action, CongTy } from "../../../../utils/const";
import { generateCode } from "../../../../utils/helpers";
import { listSigneInfo } from "../../config";
import { useFormik } from "formik";
import FieldInput from "../../../../components/TextField/FieldInput";
import FieldDateTime from "../../../../components/TextField/FieldDateTime";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import SignerWorkflowSection from "../signdocument/SignerWorkflowSection";
import { IncidentValidation } from "../../validation";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { updateTabFormData } from "../../../../redux/tabsSlice";
import { Remove } from "@mui/icons-material";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedPlans: MaintenancePlanData[];
  onSubmit: (rec: IncidenData) => void;
  initialIncident: IncidenData | null;
}

const IncidentDialog = ({
  open,
  onClose,
  selectedPlans,
  onSubmit,
  initialIncident,
}: Props) => {
  const planIds = selectedPlans.map((p) => p.id);
  const [assets, setAssets] = useState<any[]>([]);

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();

  const location = useLocation();
  const tabPath = location.pathname;
  const dispatch = useAppDispatch();

  const savedDraft = useAppSelector((state) => {
    const tab = state.tabs.tabs.find((t) => t.path === tabPath);
    return tab?.formData?.incidentDraft ?? null;
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      idKeHoach: "",
      soPhieu: "",
      idDonViBaoCao: "",
      ngayPhatHien: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      tenHeThongThietBi: "",
      phanHeViTri: "",
      mucDo: 2,
      moTa: "",
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      trangThai: 0,
      share: false,
      ngayTao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      nguoiKyList: [] as any[],
      danhSachTaiSan: [] as any[],
    },
    // validationSchema: IncidentValidation,
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

      const rec: any = {
        ...values,
        idNguoiLap: idNguoiLapBieu,
        idGiamDoc: idTrinhDuyetGiamDoc,
        nguoiKyList: intermediateSigners,
        ngayPhatHien: dayjs(values.ngayPhatHien).format("YYYY-MM-DD HH:mm:ss"),
        ngayTao: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };

      dispatch(
        updateTabFormData({
          path: tabPath,
          data: { incidentDraft: null, lastMinimizedIncidentDialog: null },
        }),
      );

      onSubmit(rec);
      formik.resetForm();
      setAssets([]);
      onClose();
    },
  });

  // Load and Reset initial values
  useEffect(() => {
    if (!open) return;

    if (initialIncident) {
      const listInfo = listSigneInfo(initialIncident, apiUsers, apiDepartments);
      const signersList = (listInfo || []).map((item, idx) => ({
        ...item,
        userId: item.idNhanVien,
        userName: item.hoTen,
        departmentId: item.idDonVi,
        departmentName: item.donVi,
        order: idx + 1,
        action: Action.UPDATE,
      }));

      const mappedAssets = (initialIncident.danhSachTaiSan || []).map(
        (a: IncidenDetailData) => ({
          id: a.id,
          deviceId: a.idTaiSan,
          tenTaiSan: a.tenTaiSan,
          tenNhom: a.tenNhomTaiSan,
          tenDonVi: a.tenDonViQuanLyKyThuat,
          tenHienTrang: a.tinhTrang,
          idDonViQuanLyKyThuat: a.idDonViQuanLyKyThuat,
          viTri: a.viTri,
          quantity: a.soLuong,
          thuocHeThong: a.thuocHeThong,
          action: Action.UPDATE,
        }),
      );
      setAssets(mappedAssets);

      formik.setValues({
        id: initialIncident.id ?? "",
        idCongTy: initialIncident.idCongTy ?? CongTy.CT001,
        idKeHoach: initialIncident.idKeHoach ?? selectedPlans[0]?.id ?? "",
        soPhieu: initialIncident.soPhieu ?? "",
        idDonViBaoCao: initialIncident.idDonViBaoCao ?? "",
        ngayPhatHien:
          initialIncident.ngayPhatHien || dayjs().format("YYYY-MM-DD HH:mm:ss"),
        tenHeThongThietBi: initialIncident.tenHeThongThietBi ?? "",
        phanHeViTri: initialIncident.phanHeViTri ?? "",
        mucDo: initialIncident.mucDo ?? 2,
        moTa: initialIncident.moTa ?? "",
        idNguoiLap: initialIncident.idNguoiLap ?? "",
        nguoiLapXacNhan: initialIncident.nguoiLapXacNhan ?? false,
        idGiamDoc: initialIncident.idGiamDoc ?? "",
        giamDocXacNhan: initialIncident.giamDocXacNhan ?? false,
        trangThai: initialIncident.trangThai ?? 0,
        share: initialIncident.share ?? false,
        ngayTao:
          initialIncident.ngayTao ||
          dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        nguoiKyList: signersList,
        danhSachTaiSan: initialIncident.danhSachTaiSan || [],
      });
      return;
    }

    if (savedDraft) {
      setAssets(savedDraft.assets);
      formik.setValues({
        id: "",
        idCongTy: CongTy.CT001,
        idKeHoach: selectedPlans[0]?.id ?? "",
        soPhieu: savedDraft.soPhieu,
        idDonViBaoCao: savedDraft.idDonViBaoCao,
        ngayPhatHien: savedDraft.ngayPhatHien,
        tenHeThongThietBi: savedDraft.tenHeThongThietBi,
        phanHeViTri: savedDraft.phanHeViTri,
        mucDo: savedDraft.mucDo,
        moTa: savedDraft.moTa,
        idNguoiLap: "",
        nguoiLapXacNhan: false,
        idGiamDoc: "",
        giamDocXacNhan: false,
        trangThai: 0,
        share: false,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        nguoiKyList: savedDraft.nguoiKyList,
<<<<<<< HEAD
        danhSachTaiSan: savedDraft.danhSachTaiSan ?? [],
      });
      return;
    }
=======
        danhSachTaiSan: [],
      });
      return;
    }

    setAssets([]);
    const defaultDept =
      selectedPlans && selectedPlans.length > 0
        ? selectedPlans[0].idDonViGiao || ""
        : "";
    formik.setValues({
      id: "",
      idCongTy: CongTy.CT001,
      idKeHoach:
        selectedPlans && selectedPlans.length > 0 ? selectedPlans[0].id : "",
      soPhieu: "",
      idDonViBaoCao: defaultDept,
      ngayPhatHien: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      tenHeThongThietBi: "",
      phanHeViTri: "",
      mucDo: 2,
      moTa: "",
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      trangThai: 0,
      share: false,
      ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      nguoiKyList: [],
      danhSachTaiSan: [],
    });
  }, [
    open,
    initialIncident,
    selectedPlans,
    apiUsers,
    apiDepartments,
    savedDraft,
  ]);
>>>>>>> 0230394 ([fix] Sua loi bulk form, lam keep alive cho sua chua bao duong)

    setAssets([]);
    const defaultDept =
      selectedPlans && selectedPlans.length > 0
        ? selectedPlans[0].idDonViGiao || ""
        : "";
    formik.setValues({
      id: "",
      idCongTy: CongTy.CT001,
      idKeHoach:
        selectedPlans && selectedPlans.length > 0 ? selectedPlans[0].id : "",
      soPhieu: "",
      idDonViBaoCao: defaultDept,
      ngayPhatHien: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      tenHeThongThietBi: "",
      phanHeViTri: "",
      mucDo: 2,
      moTa: "",
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      trangThai: 0,
      share: false,
      ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      nguoiKyList: [],
      danhSachTaiSan: [],
    });
  }, [
    open,
    initialIncident,
    selectedPlans,
    apiUsers,
    apiDepartments,
    savedDraft,
  ]);

  const handleAssetsChange = (newAssets: any[]) => {
    setAssets(newAssets);
    const nextList = newAssets.map((a: any) => ({
      id: a?.id,
      idTaiSan: a.deviceId ?? "",
      tenTaiSan: a.tenTaiSan ?? "",
      soLuong: a.quantity ?? 1,
      tinhTrang: a.tenHienTrang ?? "",
      tenNhomTaiSan: a.tenNhom || "",
      thuocHeThong: a.thuocHeThong ?? "",
      idDonViQuanLyKyThuat: a.idDonViQuanLyKyThuat ?? "",
      viTri: a.viTri ?? "",
      action: a.action ?? Action.CREATE,
    }));
    formik.setFieldValue("danhSachTaiSan", nextList);
  };

  const handleClose = () => {
    dispatch(
      updateTabFormData({
        path: tabPath,
        data: { incidentDraft: null, lastMinimizedIncidentDialog: null },
      }),
    );
    formik.resetForm();
    setAssets([]);
    onClose();
  };

  const handleMinimize = () => {
    dispatch(
      updateTabFormData({
        path: tabPath,
        data: {
          incidentDraft: {
            soPhieu: formik.values.soPhieu,
            idDonViBaoCao: formik.values.idDonViBaoCao,
            ngayPhatHien: formik.values.ngayPhatHien,
            tenHeThongThietBi: formik.values.tenHeThongThietBi,
            phanHeViTri: formik.values.phanHeViTri,
            mucDo: formik.values.mucDo,
            moTa: formik.values.moTa,
            nguoiKyList: formik.values.nguoiKyList,
            assets,
<<<<<<< HEAD
            danhSachTaiSan: formik.values.danhSachTaiSan,
=======
>>>>>>> 0230394 ([fix] Sua loi bulk form, lam keep alive cho sua chua bao duong)
          },
          lastMinimizedIncidentDialog: "incident",
        },
      }),
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleMinimize}
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
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={handleMinimize}>
            <Remove />
          </IconButton>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
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
                  <FieldInput
                    title="Số phiếu"
                    field="soPhieu"
                    formik={formik}
                  />

                  <FieldAutoCompleted
                    title="Đơn vị báo cáo"
                    data={apiDepartments}
                    labelkey="tenPhongBan"
                    field="idDonViBaoCao"
                    formik={formik}
                    onChange={() => {
                      handleAssetsChange([]);
                    }}
                  />

                  {/* Ngày giờ phát hiện */}
                  <FieldDateTime
                    title="Ngày giờ phát hiện"
                    field="ngayPhatHien"
                    formik={formik}
                  />

                  <FieldInput
                    title="Tên hệ thống/thiết bị gặp sự cố"
                    field="tenHeThongThietBi"
                    formik={formik}
                  />

                  <FieldInput
                    title="Phân hệ/vị trí xảy ra sự cố"
                    field="phanHeViTri"
                    formik={formik}
                  />

                  <FieldAutoCompleted
                    title="Mức độ"
                    field="mucDo"
                    formik={formik}
                    data={[
                      { id: 0, name: "Nhẹ" },
                      { id: 1, name: "Trung bình" },
                      { id: 2, name: "Nặng" },
                      { id: 3, name: "Nghiêm trọng" },
                    ]}
                    labelkey="name"
                  />

                  <FieldInput
                    title="Mô tả tình trạng sự cố"
                    field="moTa"
                    formik={formik}
                    multiline
                    rows={4}
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
                  {!formik.values.idDonViBaoCao && (
                    <Typography variant="body2" color="text.secondary">
                      Chọn đơn vị báo cáo để xem thiết bị.
                    </Typography>
                  )}
                  {formik.values.idDonViBaoCao && (
                    <StepAssets
                      idDonViGiao={formik.values.idDonViBaoCao}
                      assets={assets}
                      onAssetsChange={handleAssetsChange}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* ───────── Quy trình duyệt (bên phải) ───────── */}
            <Box>
              <SignerWorkflowSection formik={formik} />
            </Box>
          </Box>

          {/* ── Preview FULL WIDTH với deviceEntries có thể edit ── */}
          <Box>
            <IncidentPreview
              number={formik.values.soPhieu}
              detectedAt={formik.values.ngayPhatHien}
              reporter={""}
              reporterDeptId={formik.values.idDonViBaoCao}
              signers={formik.values.nguoiKyList}
              systemName={formik.values.tenHeThongThietBi}
              subsystem={formik.values.phanHeViTri}
              location={""}
              description={formik.values.moTa}
              severity={formik.values.mucDo}
              deviceEntries={formik.values.danhSachTaiSan.filter(
                (item) => item.action !== Action.DELETE,
              )}
              onDeviceEntriesChange={(newEntries) => {
                formik.setFieldValue("danhSachTaiSan", newEntries);
              }}
              planIds={planIds}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        {initialIncident?.id ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => formik.handleSubmit()}
          >
            Cập Nhật
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => formik.handleSubmit()}
          >
            Tạo Phiếu và Lưu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default IncidentDialog;
