import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useAllDepartmentsQuery } from "../../../Department/Mutation";
import { useAllStaffsQuery } from "../../../Staff/Mutation";
import { useMaintenanceAcceptanceTestVehicleMutation } from "../../mutation";
import {
  NghiemThuPhuongTienData,
  NghiemThuPhuongTienChiTietData,
  BienPhapPhuongTienChiTietData,
} from "../../types";
import { CongTy } from "../../../../utils/const";
import { generateCode } from "../../../../utils/helpers";
import { PlanSigner } from "../../../../mockdata/mockPlans";
import { listSigneInfo } from "../../config";
import dayjs from "dayjs";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { useAllToolDetailQuery } from "../../../ToolManager/Mutation";
import FieldInput from "../../../../components/TextField/FieldInput";
import TextFieldNumber from "../../../../components/TextField/TextFieldNumber";
import { BienPhapPhuongTienData } from "../../types";
import SignerWorkflowSection from "../signdocument/SignerWorkflowSection";
import { AcceptanceVehicleValidation } from "../../validation";

interface Props {
  open: boolean;
  onClose: () => void;
  idBienPhapPhuongTien: string;
  idTaiSan?: string;
  tenTaiSan?: string;
  soBienBanBienPhap?: string;
  initData?: NghiemThuPhuongTienData | null;
  bienPhap?: BienPhapPhuongTienData | null;
}

const NghiemThuPhuongTienDialog = ({
  open,
  onClose,
  idBienPhapPhuongTien,
  idTaiSan,
  tenTaiSan,
  soBienBanBienPhap,
  initData,
  bienPhap,
}: Props) => {
  const { user } = useSelector((state: any) => state.user);
  const { data: apiDepartments = [] } = useAllDepartmentsQuery();
  const { data: apiUsers = [] } = useAllStaffsQuery();
  const { data: allToolDetail = [] } = useAllToolDetailQuery();

  const { createMutation, updateMutation } =
    useMaintenanceAcceptanceTestVehicleMutation();

  const initialValues: NghiemThuPhuongTienData & { nguoiKyList: any[] } = {
    id: "",
    idCongTy: CongTy.CT001,
    idBienPhapPhuongTien: idBienPhapPhuongTien || "",
    idTaiSan: idTaiSan || "",
    soPhieu: "",
    noiDung: "",
    tinhTrang: "",
    congViecPhatSinh: "",
    chiPhiNhanCong: 0,
    ketLuan: "Đảm bảo yêu cầu kỹ thuật đưa vào sử dụng",
    idNguoiLap: "",
    nguoiLapXacNhan: false,
    idGiamDoc: "",
    giamDocXacNhan: false,
    share: false,
    trangThai: 0,
    danhSachChiTiet: [],
    nguoiKyList: [],
  };

  const formik = useFormik({
    initialValues,
    // validationSchema: AcceptanceVehicleValidation,
    onSubmit: async (values) => {
      const list: any[] = values.nguoiKyList ?? [];
      const idNguoiLap = list.length > 0 ? list[0].userId : "";
      const idGiamDoc = list.length > 1 ? list[list.length - 1].userId : "";
      const nguoiKyList =
        list.length > 2
          ? list.slice(1, -1).map((s: PlanSigner, idx: number) => ({
              id: `${generateCode("SIG-")}-${idx}`,
              idNguoiKy: s.userId,
              tenNguoiKy: s.userName,
              idPhongBan: s.departmentId,
              trangThai: 0,
            }))
          : [];

      const payload: NghiemThuPhuongTienData = {
        ...values,
        idNguoiLap,
        idGiamDoc,
        nguoiKyList,
        danhSachChiTiet: (values.danhSachChiTiet || []).map((item) => ({
          ...item,
          idNghiemThuPhuongTien: values.id || "",
          id: item.id || `${generateCode("NTPTCT-")}`,
        })),
        nguoiTao: user?.taiKhoan?.tenDangNhap,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        ngayCapNhat: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      if (values.id) {
        updateMutation.mutate(payload, { onSuccess: handleClose });
      } else {
        createMutation.mutate(payload, { onSuccess: handleClose });
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initData) {
      const listInfo = listSigneInfo(initData as any, apiUsers, apiDepartments);
      formik.setValues({
        ...initData,
        nguoiKyList: (listInfo ?? []).map((item: any) => ({
          userId: item.idNhanVien,
          userName: item.hoTen,
          departmentId: item.idDonVi,
          departmentName: item.donVi,
        })),
      } as any);
    } else {
      formik.setValues({
        ...initialValues,
        idBienPhapPhuongTien: bienPhap?.id || "",
        idTaiSan: bienPhap?.idTaiSan || "",
        danhSachChiTiet: (bienPhap?.danhSachChiTiet || []).map(
          (item: BienPhapPhuongTienChiTietData) => {
            return {
              idChiTietVatTu: item.idChiTietVatTu,
              idVatTu: item.idVatTu,
              soLuongThayThe: item.soLuongCap,
              soLuongThuHoi: item.soLuongThuHoi,
              phanTramConLai: 0,
              bienPhapXuLy: "",
              ghiChu: "",
              donViTinh: item.donViTinh,
            };
          },
        ),
      });
    }
  }, [open, initData, bienPhap, apiUsers, apiDepartments]);

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  const handleAddMaterial = () => {
    formik.setFieldValue("danhSachChiTiet", [
      ...(formik.values.danhSachChiTiet || []),
      {
        id: "",
        idNghiemThuPhuongTien: formik.values.id || "",
        idVatTu: "",
        idChiTietVatTu: "",
        tenVatTu: "",
        donViTinh: "Cái",
        soLuongThayThe: 1,
        soLuongThuHoi: 0,
        phanTramConLai: 0,
        bienPhapXuLy: "Nhập kho tái sử dụng",
        ghiChu: "",
      },
    ]);
  };

  const handleRemoveMaterial = (index: number) => {
    const list = [...(formik.values.danhSachChiTiet || [])];
    list.splice(index, 1);
    formik.setFieldValue("danhSachChiTiet", list);
  };

  const updateMaterialField = (index: number, field: string, value: any) => {
    formik.setFieldValue(`danhSachChiTiet.${index}.${field}`, value);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh", borderRadius: 3 } }}
    >
      {/* Header Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <BuildIcon />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Nghiệm thu sửa chữa phương tiện
            </Typography>
            {bienPhap && (
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.85)" }}
              >
                Căn cứ Biện pháp: {bienPhap.soBienBan} • Thiết bị: {tenTaiSan}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, overflow: "auto", bgcolor: "grey.50" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 3,
            height: "100%",
          }}
        >
          {/* ── LEFT COLUMN: Input Fields and Materials Table ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              overflowY: "auto",
              pr: 1,
            }}
          >
            {/* General Info Card */}
            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 3,
                p: 2.5,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary.main"
                mb={2}
              >
                Thông tin chung
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FieldInput
                    title="Số phiếu"
                    formik={formik}
                    field="soPhieu"
                  />
                  <TextFieldNumber
                    title="Chi phí nhân công"
                    formik={formik}
                    field="chiPhiNhanCong"
                  />
                </Box>
                <FieldInput
                  title="Nội dung"
                  formik={formik}
                  field="noiDung"
                  multiline
                  rows={2}
                />
                <FieldInput
                  title="Tình trạng sau sửa chữa"
                  formik={formik}
                  field="tinhTrang"
                  multiline
                  rows={2}
                />
                <FieldInput
                  title="Công việc phát sinh"
                  formik={formik}
                  field="congViecPhatSinh"
                  multiline
                  rows={2}
                />

                <FieldInput
                  title="Kết luận nghiệm thu"
                  formik={formik}
                  field="ketLuan"
                  multiline
                  rows={2}
                />
              </Box>
            </Box>
          </Box>

          {/* ── RIGHT COLUMN: Approval Workflow ── */}
          <Box>
            <SignerWorkflowSection formik={formik} />
          </Box>
        </Box>
        {/* Materials/Parts Table Card */}
        <Box
          sx={{
            bgcolor: "white",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 3,
            p: 2.5,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
            mt: 5,
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
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="primary.main"
            >
              Chi phí vật tư, phụ tùng
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell align="center" width={50}>
                    STT
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    Tên vật tư, phụ tùng
                  </TableCell>
                  <TableCell width={100}>ĐVT</TableCell>
                  <TableCell width={100}>Thay thế</TableCell>
                  <TableCell width={100}>Thu hồi</TableCell>
                  <TableCell width={100}>% còn lại</TableCell>
                  <TableCell width={150}>Biện pháp xử lý</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell align="center" width={50}>
                    <IconButton onClick={handleAddMaterial}>
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(formik.values.danhSachChiTiet || []).length > 0 ? (
                  (formik.values.danhSachChiTiet || []).map(
                    (vt: NghiemThuPhuongTienChiTietData, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell>
                          <FieldAutoCompleted
                            title=""
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.idChiTietVatTu`}
                            onChange={(newValue: any) => {
                              updateMaterialField(
                                idx,
                                "idVatTu",
                                newValue
                                  ? String(
                                      newValue.idTaiSan ||
                                        newValue.idVatTu ||
                                        "",
                                    )
                                  : "",
                              );
                              updateMaterialField(
                                idx,
                                "tenVatTu",
                                newValue
                                  ? String(newValue.tenTaiSan || "")
                                  : "",
                              );
                              updateMaterialField(
                                idx,
                                "donViTinh",
                                newValue
                                  ? String(newValue.donViTinh || "")
                                  : "",
                              );
                            }}
                            data={allToolDetail}
                            labelkey="tenTaiSan"
                            limitOptions={20}
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.donViTinh`}
                            title=""
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.soLuongThayThe`}
                            title=""
                            noBorder={true}
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.soLuongThuHoi`}
                            title=""
                            noBorder={true}
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.phanTramConLai`}
                            title=""
                            noBorder={true}
                            type="number"
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.bienPhapXuLy`}
                            title=""
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`danhSachChiTiet.${idx}.ghiChu`}
                            title=""
                            noBorder={true}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveMaterial(idx)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 3, color: "text.secondary" }}
                    >
                      Chưa có vật tư. Nhấn "+" để thêm mới.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1, bgcolor: "grey.100" }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isPending}
          onClick={() => formik.submitForm()}
          sx={{ px: 3, fontWeight: 700 }}
        >
          {isPending
            ? "Đang lưu..."
            : initData?.id
              ? "Cập nhật"
              : "Tạo nghiệm thu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NghiemThuPhuongTienDialog;
