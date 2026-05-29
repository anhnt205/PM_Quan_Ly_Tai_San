import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
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
} from "@mui/material";
import RecyclingIcon from "@mui/icons-material/Recycling";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { MaintenancePlanData } from "../../../MainenancePlanRepair/types";
import {
  MaintenanceRepairData,
  DanhGiaVatTuData,
  ChiTietVatTuThuHoiData,
} from "../../types";
import FieldDate from "../../../../components/TextField/FieldDate";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { generateCode } from "../../../../utils/helpers";
import { useMaintenanceMaterialAssessmentMutation } from "../../../MainenancePlanRepair/Mutation";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";
import { CongTy, Action } from "../../../../utils/const";
import { listSigneInfo } from "../../config";
import FieldInput from "../../../../components/TextField/FieldInput";
import TextFieldNumber from "../../../../components/TextField/TextFieldNumber";
import SignerWorkflowSection from "./SignerWorkflowSection";

export const BIEN_PHAP_XU_LY = {
  PHUC_HOI: "Phục hồi",
  PHE_LIEU: "Phế liệu",
  HUY: "Hủy",
} as const;

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  repairRequest: MaintenanceRepairData;
  acceptanceRecord: any;
  initData?: DanhGiaVatTuData | null;
}

const MaterialDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  acceptanceRecord,
  initData,
}: Props) => {
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();
  const { data: allLevel = [] } = useAllLoaiSCBDQuery();
  const { createMutation, updateMutation } =
    useMaintenanceMaterialAssessmentMutation();

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      soPhieu: `BB-DG-`,
      ngayDanhGia: dayjs().format("YYYY-MM-DD"),
      viTri: acceptanceRecord.viTri || "",
      capSuaChua: acceptanceRecord.capSuaChua || "",
      tenThietBi: acceptanceRecord.tenThietBi || "",
      kieu: "",
      soDangKi: acceptanceRecord.soDangKi || "",
      idDonViQuanLy: plan.tenDonViGiao || "",
      idNghiemThu: acceptanceRecord.id || "",
      soLuongPhucHoi: 0,
      soLuongPheLieu: 0,
      soLuongHuy: 0,
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      danhSachChiTiet: [] as ChiTietVatTuThuHoiData[],
      nguoiKyList: [] as any[],
    },
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

      const record: DanhGiaVatTuData = {
        id: values.id || undefined,
        idCongTy: values.idCongTy,
        soPhieu: values.soPhieu,
        ngayDanhGia: values.ngayDanhGia,
        viTri: values.viTri,
        capSuaChua: values.capSuaChua,
        tenThietBi: values.tenThietBi,
        kieu: values.kieu,
        soDangKi: values.soDangKi,
        idDonViQuanLy: values.idDonViQuanLy,
        idNghiemThu: values.idNghiemThu,
        soLuongPhucHoi: Number(values.soLuongPhucHoi || 0),
        soLuongPheLieu: Number(values.soLuongPheLieu || 0),
        soLuongHuy: Number(values.soLuongHuy || 0),
        idNguoiLap: idNguoiLapBieu,
        nguoiLapXacNhan: values.nguoiLapXacNhan || false,
        idGiamDoc: idTrinhDuyetGiamDoc,
        giamDocXacNhan: values.giamDocXacNhan || false,
        share: values.share || false,
        trangThai: values.trangThai || 0,
        nguoiKyList: intermediateSigners,
        danhSachChiTiet: values.danhSachChiTiet.map((vt) => ({
          id: vt.id || undefined,
          idDanhGiaVatTu: values.id || undefined,
          idChiTietVatTu: vt.idChiTietVatTu || "",
          idVatTu: vt.idVatTu || "",
          tenVatTu: vt.tenVatTu || "",
          donViTinh: vt.donViTinh || "Cái",
          soLuong: Number(vt.soLuong || 0),
          tinhTrang: vt.tinhTrang || "",
          bienPhapXuLy: vt.bienPhapXuLy || "",
          ghiChu: vt.ghiChu || "",
        })),
      };

      if (initData) {
        updateMutation.mutate(record, {
          onSuccess: () => handleClose(),
        });
      } else {
        createMutation.mutate(record, {
          onSuccess: () => handleClose(),
        });
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (initData) {
        const listInfo = listSigneInfo(initData, apiUsers, apiDepartments);
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
          id: initData.id || "",
          idCongTy: initData.idCongTy || CongTy.CT001,
          soPhieu: initData.soPhieu || "",
          ngayDanhGia: initData.ngayDanhGia || dayjs().format("YYYY-MM-DD"),
          viTri: initData.viTri || "",
          capSuaChua: initData.capSuaChua || "",
          tenThietBi: initData.tenThietBi || "",
          kieu: initData.kieu || "",
          soDangKi: initData.soDangKi || "",
          idDonViQuanLy: initData.idDonViQuanLy || "",
          idNghiemThu: initData.idNghiemThu || "",
          soLuongPhucHoi: initData.soLuongPhucHoi || 0,
          soLuongPheLieu: initData.soLuongPheLieu || 0,
          soLuongHuy: initData.soLuongHuy || 0,
          idNguoiLap: initData.idNguoiLap || "",
          nguoiLapXacNhan: initData.nguoiLapXacNhan || false,
          idGiamDoc: initData.idGiamDoc || "",
          giamDocXacNhan: initData.giamDocXacNhan || false,
          share: initData.share || false,
          trangThai: initData.trangThai || 0,
          danhSachChiTiet: (initData.danhSachChiTiet || []).map((vt: any) => ({
            ...vt,
            action: Action.UPDATE,
          })),
          nguoiKyList: signersList,
        });
      } else {
        const list: ChiTietVatTuThuHoiData[] = [];
        console.log("acceptanceRecord:", acceptanceRecord);
        if ((acceptanceRecord?.danhSachTaiSan || []).length > 0) {
          (acceptanceRecord?.danhSachTaiSan || [])
            .filter((t: any) => t.danhSachVatTu && t.danhSachVatTu.length > 0)
            .forEach((t: any) => {
              (t.danhSachVatTu || []).forEach((vt: any) => {
                list.push({
                  idChiTietVatTu: vt.idChiTietVatTu || "",
                  idVatTu: vt.idVatTu || "",
                  tenVatTu: vt.tenVatTu || "",
                  donViTinh: vt.donViTinh || "Cái",
                  soLuong: vt.soLuong || 1,
                  tinhTrang: "",
                  bienPhapXuLy: "",
                  ghiChu: "",
                });
              });
            });
        } else if ((acceptanceRecord?.danhSachChiTiet || []).length > 0) {
          (acceptanceRecord?.danhSachChiTiet || []).forEach((vt: any) => {
            list.push({
              idChiTietVatTu: vt.idChiTietVatTu || "",
              idVatTu: vt.idVatTu || "",
              tenVatTu: vt.tenVatTu || "",
              donViTinh: vt.donViTinh || "Cái",
              soLuong: vt.soLuongThayThe || vt.soLuong || 1,
              tinhTrang: "",
              bienPhapXuLy: "",
              ghiChu: "",
            });
          });
        }

        formik.setValues({
          id: "",
          idCongTy: CongTy.CT001,
          soPhieu: `BB-DG-${repairRequest?.id || Date.now()}`,
          ngayDanhGia: dayjs().format("YYYY-MM-DD"),
          viTri: acceptanceRecord.viTri || "",
          capSuaChua: acceptanceRecord.capSuaChua || "",
          tenThietBi:
            acceptanceRecord.tenThietBi || acceptanceRecord?.idTaiSan || "",
          kieu: "",
          soDangKi: acceptanceRecord.soDangKi || "",
          idDonViQuanLy: plan.tenDonViGiao || "",
          idNghiemThu: acceptanceRecord.id || "",
          soLuongPhucHoi: 0,
          soLuongPheLieu: 0,
          soLuongHuy: 0,
          idNguoiLap: "",
          nguoiLapXacNhan: false,
          idGiamDoc: "",
          giamDocXacNhan: false,
          share: false,
          trangThai: 0,
          danhSachChiTiet:
            list.length > 0
              ? list
              : [
                  {
                    idChiTietVatTu: "",
                    idVatTu: "",
                    tenVatTu: "",
                    donViTinh: "Cái",
                    soLuong: 1,
                    tinhTrang: "",
                    bienPhapXuLy: "",
                    ghiChu: "",
                  },
                ],
          nguoiKyList: [] as any[],
        });
      }
    }
  }, [
    open,
    initData,
    acceptanceRecord,
    apiUsers,
    apiDepartments,
    plan,
    repairRequest,
  ]);

  const listItems = formik.values.danhSachChiTiet;
  useEffect(() => {
    let phucHoi = 0;
    let pheLieu = 0;
    let huy = 0;
    listItems.forEach((item) => {
      const qty = Number(item.soLuong) || 0;
      if (item.bienPhapXuLy === BIEN_PHAP_XU_LY.PHUC_HOI) {
        phucHoi += qty;
      } else if (item.bienPhapXuLy === BIEN_PHAP_XU_LY.PHE_LIEU) {
        pheLieu += qty;
      } else if (item.bienPhapXuLy === BIEN_PHAP_XU_LY.HUY) {
        huy += qty;
      }
    });

    if (
      formik.values.soLuongPhucHoi !== phucHoi ||
      formik.values.soLuongPheLieu !== pheLieu ||
      formik.values.soLuongHuy !== huy
    ) {
      formik.setFieldValue("soLuongPhucHoi", phucHoi);
      formik.setFieldValue("soLuongPheLieu", pheLieu);
      formik.setFieldValue("soLuongHuy", huy);
    }
  }, [
    listItems,
    formik.values.soLuongPhucHoi,
    formik.values.soLuongPheLieu,
    formik.values.soLuongHuy,
  ]);

  const addItem = () => {
    const newItem = {
      idChiTietVatTu: "",
      idVatTu: "",
      tenVatTu: "",
      donViTinh: "Cái",
      soLuong: 1,
      tinhTrang: "",
      bienPhapXuLy: "",
      ghiChu: "",
      action: Action.CREATE,
    };
    formik.setFieldValue("danhSachChiTiet", [
      ...formik.values.danhSachChiTiet,
      newItem,
    ]);
  };

  const removeItem = (idx: number) => {
    const updatedList = formik.values.danhSachChiTiet.filter(
      (_, i) => i !== idx,
    );
    formik.setFieldValue("danhSachChiTiet", updatedList);
  };

  const updateItemFields = (
    idx: number,
    fields: Partial<ChiTietVatTuThuHoiData>,
  ) => {
    const updatedList = formik.values.danhSachChiTiet.map((it, i) => {
      if (i === idx) {
        return {
          ...it,
          ...fields,
        };
      }
      return it;
    });
    formik.setFieldValue("danhSachChiTiet", updatedList);
  };

  const handleClose = () => {
    onClose();
  };

  const d = formik.values.ngayDanhGia
    ? new Date(formik.values.ngayDanhGia)
    : new Date();

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
          <RecyclingIcon color="warning" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Biên bản đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Căn cứ BB nghiệm thu: {acceptanceRecord.soPhieu || ""}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3, overflow: "auto" }}>
        {/* 2-column grid: Thông tin | Quy trình duyệt */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 3 }}>
          {/* Col 1: Thông tin */}
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
                title="Số biên bản"
                formik={formik}
                field="soBienBan"
              />
              <FieldDate
                title="Ngày lập biên bản"
                selectedDate={formik.values.ngayDanhGia}
                setSelectedDate={(date) =>
                  formik.setFieldValue("ngayDanhGia", date)
                }
              />
              <FieldInput
                title="Địa điểm (Tại...)"
                formik={formik}
                field="viTri"
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
              <FieldInput
                title="Của thiết bị"
                formik={formik}
                field="tenThietBi"
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <FieldInput title="Kiểu" formik={formik} field="kieu" />
                <FieldInput
                  title="Số (đăng ký)"
                  formik={formik}
                  field="soDangKi"
                />
              </Box>
              <FieldAutoCompleted
                title="Đơn vị quản lý vận hành"
                data={apiDepartments}
                value={formik.values.idDonViQuanLy}
                setValue={(val) => formik.setFieldValue("idDonViQuanLy", val)}
                labelkey="tenPhongBan"
              />
            </Box>
          </Box>

          {/* Col 2: Quy trình duyệt */}
          <Box>
            <SignerWorkflowSection formik={formik} />
          </Box>
        </Box>

        {/* Full-width: Danh mục vật tư thu hồi */}
        <Box
          sx={{
            mt: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
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
            <Typography variant="subtitle2" fontWeight={600}>
              Danh mục vật tư thu hồi
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addItem}
              variant="outlined"
            >
              Thêm dòng
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Tên vật tư, thiết bị
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 55 }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Biện pháp xử lý
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 150 }}>
                    Ghi chú
                  </TableCell>
                  <TableCell sx={{ width: 36 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachChiTiet
                  .map((item, originalIdx) => ({ item, originalIdx }))
                  .map(({ item, originalIdx }, idx) => (
                    <TableRow key={originalIdx}>
                      <TableCell>{String(idx + 1).padStart(2, "0")}</TableCell>
                      <TableCell>
                        <FieldAutoCompleted
                          title=""
                          data={allToolDetail}
                          labelkey="tenTaiSan"
                          limitOptions={10}
                          value={item.idChiTietVatTu}
                          noBorder={true}
                          onChange={(value) => {
                            updateItemFields(originalIdx, {
                              idChiTietVatTu: value?.id ?? "",
                              idVatTu: value?.idTaiSan ?? "",
                              tenVatTu: value?.tenTaiSan ?? "",
                              donViTinh: value?.donViTinh ?? "Cái",
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.donViTinh}</TableCell>
                      <TableCell>
                        <TextFieldNumber
                          formik={formik}
                          field={`danhSachChiTiet.${originalIdx}.soLuong`}
                          noBorder={true}
                        />
                      </TableCell>
                      <TableCell>
                        <FieldInput
                          formik={formik}
                          field={`danhSachChiTiet.${originalIdx}.tinhTrang`}
                          noBorder={true}
                        />
                      </TableCell>
                      <TableCell>
                        <FieldAutoCompleted
                          title=""
                          data={[
                            {
                              id: BIEN_PHAP_XU_LY.HUY,
                              name: BIEN_PHAP_XU_LY.HUY,
                            },
                            {
                              id: BIEN_PHAP_XU_LY.PHE_LIEU,
                              name: BIEN_PHAP_XU_LY.PHE_LIEU,
                            },
                            {
                              id: BIEN_PHAP_XU_LY.PHUC_HOI,
                              name: BIEN_PHAP_XU_LY.PHUC_HOI,
                            },
                          ]}
                          formik={formik}
                          field={`danhSachChiTiet.${originalIdx}.bienPhapXuLy`}
                          labelkey="name"
                          noBorder={true}
                        />
                      </TableCell>
                      <TableCell>
                        <FieldInput
                          formik={formik}
                          field={`danhSachChiTiet.${originalIdx}.ghiChu`}
                          noBorder={true}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(originalIdx)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Số lượng phân loại */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <FieldInput
              title="Số để lại phục hồi"
              type="number"
              formik={formik}
              field="soLuongPhucHoi"
              noBorder={true}
              sx={{ width: 200 }}
            />
            <FieldInput
              title="Số phế liệu"
              type="number"
              formik={formik}
              field="soLuongPheLieu"
              noBorder={true}
              sx={{ width: 200 }}
            />
            <FieldInput
              title="Số hủy"
              type="number"
              formik={formik}
              field="soLuongHuy"
              noBorder={true}
              sx={{ width: 200 }}
            />
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
            ĐÁNH GIÁ CHẤT LƯỢNG VẬT TƯ PHỤ TÙNG THU HỒI SAU SỬA CHỮA
          </Typography>

          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hôm nay, ngày {d.getDate()} tháng {d.getMonth() + 1} năm{" "}
            {d.getFullYear()}. Tại {formik.values.viTri || "………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Hội đồng đánh giá chất lượng vật tư phụ tùng thu hồi sau sửa chữa
            cấp: <b>{formik.values.capSuaChua || "……………"}</b>
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Của thiết bị: <b>{formik.values.tenThietBi || "……………"}</b> Kiểu:{" "}
            {formik.values.kieu || "………"} Số:{" "}
            {formik.values.soDangKi || "……………………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Đơn vị quản lý vận hành: {formik.values.idDonViQuanLy || "………………"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
            Thành phần gồm:
          </Typography>
          <Box sx={{ pl: 2, mb: 1.5 }}>
            {formik.values.nguoiKyList.map((s, i) => (
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
                  {s.position || "………………………"}
                </Typography>
                <Typography variant="caption">{s.departmentName}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Đã tiến hành kiểm tra chi tiết các vật tư phụ tùng thu hồi sau sửa
            chữa cụ thể như sau:
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
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Tình trạng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem" }}>
                    Biện pháp xử lý
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, width: 70, fontSize: "0.72rem" }}
                  >
                    Ghi chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachChiTiet.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {String(idx + 1).padStart(2, "0")}
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
                      {item.tinhTrang}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.bienPhapXuLy}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.72rem" }}>
                      {item.ghiChu}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" display="block">
            Số để lại phục hồi phục vụ cho sản xuất:{" "}
            {formik.values.soLuongPhucHoi || "…………"}.
          </Typography>
          <Typography variant="caption" display="block">
            Số để làm phế liệu: {formik.values.soLuongPheLieu || "…………"} (mục)
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1.5 }}>
            Số lượng hủy: {formik.values.soLuongHuy || "…………"} (mục)
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

          <Box sx={{ mt: 2 }}>
            <Chip label="Trạng thái: Chờ duyệt" color="warning" size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              * Biên bản này thực tế có thể có hoặc không (tùy trường hợp cụ
              thể)
            </Typography>
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
          color="warning"
          disabled={formik.values.nguoiKyList.length === 0}
          onClick={() => formik.handleSubmit()}
        >
          {initData ? "Cập nhật biên bản" : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDialog;
