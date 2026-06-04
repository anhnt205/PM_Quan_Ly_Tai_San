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
  IconButton,
  Divider,
} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import {
  InspectionRecordData,
  InspectionRecordDetailData,
  MaintenancePlanData,
  AcceptanceTestRecordData,
  AcceptanceTestRecordAssetData,
  AcceptanceTestRecordToolData,
} from "../../types";
import { MaintenanceRepairData } from "../../types";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { generateCode } from "../../../../utils/helpers";
import { useMaintenanceAcceptanceTestMutation } from "../../mutation";
import { useSelector } from "react-redux";
import { CongTy } from "../../../../utils/const";
import dayjs from "dayjs";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAllLoaiSCBDQuery } from "../../../MaintenanceRepairType/Mutation";
import { listSigneInfo } from "../../config";
import FieldInput from "../../../../components/TextField/FieldInput";
import FieldDate from "../../../../components/TextField/FieldDate";
import SignerWorkflowSection from "../signdocument/SignerWorkflowSection";
import AcceptanceTestPreview from "../preview/AcceptanceTestPreview";
import { AcceptanceMachineValidation } from "../../validation";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: MaintenancePlanData;
  repairRequest: MaintenanceRepairData;
  inspectionRecord: InspectionRecordData;
  initData?: AcceptanceTestRecordData;
  bienPhapId?: string;
}

const AcceptanceTestDialog = ({
  open,
  onClose,
  plan,
  repairRequest,
  inspectionRecord,
  initData,
  bienPhapId,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { createMutation, updateMutation } =
    useMaintenanceAcceptanceTestMutation();

  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();
  const { data: allLevel = [] } = useAllLoaiSCBDQuery();

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      idBienPhapMayMoc: bienPhapId || inspectionRecord?.id || "",
      soPhieu: "",
      ngayNghiemThu: dayjs().format("YYYY-MM-DD"),
      viTri: "",
      tenThietBi: "",
      soDangKi: "",
      capSuaChua: "",
      ketQua: "đảm bảo yêu cầu kỹ thuật",
      noiDung: "",
      idNguoiLap: "",
      nguoiLapXacNhan: false,
      idGiamDoc: "",
      giamDocXacNhan: false,
      share: false,
      trangThai: 0,
      danhSachTaiSan: [] as AcceptanceTestRecordAssetData[],
      nguoiKyList: [] as any[],
    },
    // validationSchema: AcceptanceMachineValidation,
    onSubmit: (values) => {
      const idNguoiLapVal =
        values.nguoiKyList.length > 0 ? values.nguoiKyList[0].userId : "";
      const idGiamDocVal =
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

      const mappedDanhSachTaiSan = values.danhSachTaiSan.map((ts) => {
        const actualTsId = ts.id ? ts.id : generateCode("NTTS-");

        return {
          id: actualTsId,
          idBienBan: values.id || "",
          idTaiSan: ts.idTaiSan,
          idChiTietGiamDinhMayMoc: ts.idChiTietGiamDinhMayMoc,
          danhSachVatTu: (ts.danhSachVatTu || []).map((vt) => ({
            id: vt.id ? vt.id : generateCode("NTVT-"),
            idBienBanTaiSan: actualTsId,
            idChiTietVatTu: vt.idChiTietVatTu || "",
            idVatTu: vt.idVatTu || "",
            tenVatTu: vt.tenVatTu || "",
            donViTinh: vt.donViTinh || "Cái",
            soLuong: vt.soLuong,
            ghiChu: vt.ghiChu || "",
          })),
        };
      });

      const payload = {
        ...values,
        idNguoiLap: idNguoiLapVal,
        idGiamDoc: idGiamDocVal,
        nguoiKyList: intermediateSigners,
        danhSachTaiSan: mappedDanhSachTaiSan,
        nguoiTao: user?.taiKhoan?.tenDangNhap,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      if (initData) {
        updateMutation.mutate(payload, {
          onSuccess: () => handleClose(),
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => handleClose(),
        });
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (initData) {
        const listInfo = listSigneInfo(initData, apiUsers, apiDepartments);
        formik.setValues({
          id: initData.id ?? "",
          idCongTy: initData.idCongTy ?? CongTy.CT001,
          idBienPhapMayMoc: initData.idBienPhapMayMoc ?? "",
          soPhieu: initData.soPhieu ?? "",
          ngayNghiemThu: initData.ngayNghiemThu ?? "",
          viTri: initData.viTri ?? "",
          tenThietBi: initData.tenThietBi ?? "",
          soDangKi: initData.soDangKi ?? "",
          capSuaChua: initData.capSuaChua ?? "",
          ketQua: initData.ketQua ?? "đảm bảo yêu cầu kỹ thuật",
          noiDung: initData.noiDung ?? "",
          idNguoiLap: initData.idNguoiLap ?? "",
          nguoiLapXacNhan: initData.nguoiLapXacNhan ?? false,
          idGiamDoc: initData.idGiamDoc ?? "",
          giamDocXacNhan: initData.giamDocXacNhan ?? false,
          share: initData.share ?? false,
          trangThai: initData.trangThai ?? 0,
          danhSachTaiSan: (initData.danhSachTaiSan || []).map((ts) => ({
            ...ts,
            danhSachVatTu: (ts.danhSachVatTu || []).map((vt) => ({
              ...vt,
            })),
          })) as AcceptanceTestRecordAssetData[],
          nguoiKyList: (listInfo ?? []).map((item: any) => {
            return {
              userId: item.idNhanVien,
              userName: item.hoTen,
              departmentId: item.idDonVi,
              departmentName: item.donVi,
            };
          }),
        });
      } else {
        const list: AcceptanceTestRecordAssetData[] = [];
        (inspectionRecord?.danhSachChiTiet || []).forEach(
          (entry: InspectionRecordDetailData, idx: number) => {
            const activeVatTu = entry.danhSachVatTu || [];
            const tsId = `NTTS_${Date.now()}_${idx}`;

            if (activeVatTu.length > 0) {
              list.push({
                id: tsId,
                idTaiSan: entry.idTaiSan || "",
                idChiTietGiamDinhMayMoc: entry.id || "",
                tenTaiSan: entry.tenTaiSan || "",
                donViTinh: entry.donViTinh || "Cái",
                danhSachVatTu: activeVatTu.map((vt: any, vtIdx: number) => {
                  const qty =
                    vt.soLuongThayMoi || vt.soLuongSuaChua
                      ? (vt.soLuongThayMoi || 0) + (vt.soLuongSuaChua || 0)
                      : vt.soLuong || 1;
                  return {
                    id: `NTVT_${Date.now()}_${idx}_${vtIdx}`,
                    idBienBanTaiSan: tsId,
                    idChiTietVatTu: vt.idChiTietVatTu || "",
                    idVatTu: vt.idVatTu || "",
                    tenVatTu: vt.tenVatTu || "",
                    donViTinh: vt.donViTinh || "Cái",
                    soLuong: qty,
                    ghiChu: vt.ghiChu || "",
                  };
                }),
              });
            } else {
              list.push({
                id: tsId,
                idTaiSan: entry.idTaiSan || "",
                idChiTietGiamDinhMayMoc: entry.id || "",
                tenTaiSan: entry.tenTaiSan || "",
                donViTinh: entry.donViTinh || "Cái",
                danhSachVatTu: [
                  {
                    id: `NTVT_${Date.now()}_${idx}_0`,
                    idBienBanTaiSan: tsId,
                    idChiTietVatTu: "",
                    idVatTu: "",
                    tenVatTu: "",
                    donViTinh: "Cái",
                    soLuong: 1,
                    ghiChu: "",
                  },
                ],
              });
            }
          },
        );
        formik.setValues({
          id: "",
          idCongTy: CongTy.CT001,
          idBienPhapMayMoc: bienPhapId || inspectionRecord?.id || "",
          soPhieu: `BB-NT-${repairRequest?.id ?? ""}`,
          ngayNghiemThu: dayjs().format("YYYY-MM-DD"),
          viTri: "",
          tenThietBi:
            inspectionRecord.danhSachChiTiet
              ?.map((e) => e.idTaiSan)
              .join(", ") ?? "",
          soDangKi: "",
          capSuaChua: "",
          ketQua: "đảm bảo yêu cầu kỹ thuật",
          noiDung: "",
          idNguoiLap: "",
          nguoiLapXacNhan: false,
          idGiamDoc: "",
          giamDocXacNhan: false,
          share: false,
          trangThai: 0,
          danhSachTaiSan: list,
          nguoiKyList: [] as any[],
        });
      }
    }
  }, [open, initData, apiUsers, apiDepartments]);

  const addMaterialRow = (assetIdx: number) => {
    const ts = formik.values.danhSachTaiSan[assetIdx];
    const newItem: AcceptanceTestRecordToolData = {
      id: `NTVT_${Date.now()}`,
      idBienBanTaiSan: ts.id || "",
      idChiTietVatTu: "",
      idVatTu: "",
      tenVatTu: "",
      donViTinh: "Cái",
      soLuong: 1,
      ghiChu: "",
    };
    const updatedVatTu = [...(ts.danhSachVatTu || []), newItem];
    formik.setFieldValue(
      `danhSachTaiSan[${assetIdx}].danhSachVatTu`,
      updatedVatTu,
    );
  };

  const removeMaterialRow = (assetIdx: number, materialId: string) => {
    const ts = formik.values.danhSachTaiSan[assetIdx];
    const updatedVatTu = (ts.danhSachVatTu || []).filter(
      (vt) => vt.id !== materialId,
    );
    formik.setFieldValue(
      `danhSachTaiSan[${assetIdx}].danhSachVatTu`,
      updatedVatTu,
    );
  };

  const updateMaterial = (
    assetIdx: number,
    vtId: string,
    fields: Partial<AcceptanceTestRecordToolData>,
  ) => {
    const ts = formik.values.danhSachTaiSan[assetIdx];
    const updatedVatTu = (ts.danhSachVatTu || []).map((vt) =>
      vt.id === vtId ? { ...vt, ...fields } : vt,
    );
    formik.setFieldValue(
      `danhSachTaiSan[${assetIdx}].danhSachVatTu`,
      updatedVatTu,
    );
  };

  const handleClose = () => {
    onClose();
  };

  const d = new Date(formik.values.ngayNghiemThu);

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
                <FieldInput title="Số phiếu" field="soPhieu" formik={formik} />
                <FieldDate
                  title="Ngày lập"
                  field="ngayNghiemThu"
                  formik={formik}
                />
                <FieldInput
                  title="Địa điểm (Tại...)"
                  field="viTri"
                  formik={formik}
                />
                <FieldInput
                  title="Tên thiết bị nghiệm thu"
                  field="tenThietBi"
                  formik={formik}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FieldInput
                    title="Số đăng ký"
                    field="soDangKi"
                    formik={formik}
                  />
                  <FieldAutoCompleted
                    title="Cấp sửa chữa"
                    labelkey="ten"
                    data={allLevel}
                    value={formik.values.capSuaChua}
                    onChange={(value) =>
                      formik.setFieldValue("capSuaChua", value.id)
                    }
                  />
                </Box>
                <FieldInput
                  title="Kết quả chạy thử"
                  field="ketQua"
                  formik={formik}
                />
                <FieldInput
                  title="Nội dung nghiệm thu"
                  field="noiDung"
                  formik={formik}
                  multiline
                  rows={3}
                />
              </Box>
            </Box>
          </Box>

          {/* Col 2: Quy trình duyệt */}
          <Box>
            <SignerWorkflowSection formik={formik} />
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
                  <TableCell sx={{ fontWeight: 700, width: 40 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>
                    Mã VT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Tên vật tư, thiết bị
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>
                    ĐVT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 100 }}>SL</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 150 }}>
                    Ghi chú
                  </TableCell>
                  <TableCell sx={{ width: 36 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {formik.values.danhSachTaiSan.map((ts, assetIdx) => {
                  const activeVatTu = ts.danhSachVatTu || [];
                  return (
                    <React.Fragment key={ts.id || assetIdx}>
                      <TableRow sx={{ bgcolor: "#fafafa" }}>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {String.fromCharCode(73 + assetIdx)}/
                        </TableCell>
                        <TableCell colSpan={5} sx={{ fontWeight: 600 }}>
                          Thiết bị: {ts.tenTaiSan || ts.idTaiSan}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => addMaterialRow(assetIdx)}
                            color="primary"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {activeVatTu.length === 0 ? (
                        <TableRow>
                          <TableCell />
                          <TableCell colSpan={6} align="center">
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ py: 1.5 }}
                            >
                              Chưa có vật tư/linh kiện phụ tùng nào được chọn
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        activeVatTu.map((item, rowIdx) => (
                          <TableRow key={item.id || rowIdx}>
                            <TableCell sx={{ pl: 2 }}>
                              {String(rowIdx + 1).padStart(2, "0")}
                            </TableCell>
                            <TableCell sx={{ width: "200px" }}>
                              <FieldAutoCompleted
                                title=""
                                data={allToolDetail}
                                labelkey="idTaiSan"
                                limitOptions={10}
                                value={item.idChiTietVatTu}
                                noBorder={true}
                                onChange={(value) => {
                                  if (value) {
                                    updateMaterial(assetIdx, item.id!, {
                                      idChiTietVatTu: value.id,
                                      idVatTu: value.idTaiSan,
                                      tenVatTu: value.tenTaiSan,
                                      donViTinh: value.donViTinh,
                                    });
                                  } else {
                                    updateMaterial(assetIdx, item.id!, {
                                      idChiTietVatTu: "",
                                      idVatTu: "",
                                      tenVatTu: "",
                                      donViTinh: "",
                                    });
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
                              {item.tenVatTu}
                            </TableCell>
                            <TableCell>{item.donViTinh}</TableCell>
                            <TableCell>
                              <FieldInput
                                title=""
                                field={`danhSachTaiSan.${assetIdx}.danhSachVatTu.${rowIdx}.soLuong`}
                                formik={formik}
                                noBorder={true}
                              />
                            </TableCell>
                            <TableCell>
                              <FieldInput
                                title=""
                                field={`danhSachTaiSan.${assetIdx}.danhSachVatTu.${rowIdx}.ghiChu`}
                                formik={formik}
                                noBorder={true}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeMaterialRow(assetIdx, item.id!)
                                }
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Full-width Preview */}
        <AcceptanceTestPreview formik={formik} d={d}/>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={
            createMutation.isPending ||
            updateMutation.isPending
          }
          onClick={formik.submitForm}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Đang lưu..."
            : initData
              ? "Cập nhật"
              : "Tạo biên bản"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptanceTestDialog;
