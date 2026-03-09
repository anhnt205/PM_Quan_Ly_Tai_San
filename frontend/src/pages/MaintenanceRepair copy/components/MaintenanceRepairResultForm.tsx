import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ViewBtn from "../../../components/Button/ViewBtn";
import {
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  Visibility,
} from "@mui/icons-material";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FileAttachmentInput from "../../../components/TextField/FileAttachmentInput";
import CustomStepper from "../../../components/common/CustomStepper";
import { generateCode } from "../../../utils/helpers";
import SignDocumentForm from "../../AssetTransfer/components/SignDocumentForm";

export default function MaintenanceRepairResultForm({
  onClose,
  selectedRepair,
  readOnly,
  onSave,
  onCancel,
  departments,
  staffs,
}: {
  onClose: () => void;
  selectedRepair?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  onCancel: () => void;
  departments: any[];
  staffs: any[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [nvThamMuu, setNVThamMuu] = useState<any[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [document, setDocument] = useState<File | string | any>("");

  const CustomTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    padding: "16px 8px",
    fontSize: "14px",
  }));

  const CustomTableHeadCell = styled(CustomTableCell)(({ theme }) => ({
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
    backgroundColor: "transparent",
  }));

  const formik = useFormik({
    initialValues: {
      id: "",
      soPhieu: "",
      ngayLapPhieu: new Date().toISOString().split("T")[0],
      loaiPhieu: selectedRepair?.idLoaiSuaChua || "",
      idPhanXuong: selectedRepair?.idPhanXuong || "",
      idDonViTiepNhanTaiSan: selectedRepair?.idDonViTiepNhanTaiSan || "",
      ngayYeuCauHoanThanh: selectedRepair?.ngayYeuCauHoanThanh || "",
      idDonViDeNghi: selectedRepair?.idDonViDeNghi || "",
      idNguoiKyNhay: selectedRepair?.idNguoiKyNhay || "",
      idNguoiDaiDienDonVi: "",
      idTrinhDuyetCapPhong: selectedRepair?.idTrinhDuyetCapPhong || "",
      idTrinhDuyetGiamDoc: selectedRepair?.idTrinhDuyetGiamDoc || "",
      tenFile: selectedRepair?.tenFile || "",
      duongDanFile: selectedRepair?.duongDanFile || "",
      chiTietSuaChuaBaoDuongDTOS:
        selectedRepair?.chiTietSuaChuaBaoDuongDTOS || [
          {
            id: "",
            idSuaChuaBaoDuong: "",
            tentaiSan: "",
            idTaiSan: "",
            soLuong: 0,
            donGia: 0,
            ghiChu: "",
            ngayTao: "",
            ngayCapNhat: "",
            nguoiTao: "",
            nguoiCapNhat: "",
            isActive: true,
            hienTrang: "",
            moTa: "",
            daBanGiao: true,
          },
        ],
      trangThai: 0,
      coHieuLuc: 1,
      chiPhiNhanCong: 0,
      chiPhiThueNgoai: 0,
    },
    onSubmit: (values) => {
      onSave({
        ...values,
        id: generateCode("KQ-"),
      });
    },
  });

  useEffect(() => {
    if (selectedRepair && departments && staffs) {
      const nvDeNghi = staffs.filter(
        (i) => i.phongBanId === selectedRepair?.idDonViDeNghi,
      );
      setNVThamMuu(nvDeNghi);
      setDocument(selectedRepair?.duongDanFile || "");
    }
  }, [selectedRepair, departments, staffs]);

  // Staff từ đơn vị tiếp nhận
  const staffInDonViTiepNhan = staffs.filter(
    (s) => s.phongBanId === formik.values.idDonViTiepNhanTaiSan,
  );

  // Hàm lấy tên phòng ban từ ID
  const getDepartmentName = (id: string) => {
    const dept = departments.find((d: any) => d.id === id);
    return dept?.tenPhongBan || id || "";
  };

  const currentStatus = selectedRepair?.trangThai ?? 0;

  return (
    <>
      {isPreview &&
        createPortal(
          <SignDocumentForm
            selectedIds={[]}
            document={document}
            onCancel={() => {
              setIsPreview(false);
            }}
            onSign={() => {
              console.log("Ký tài liệu thành công");
            }}
            showSignerSidebar={false}
            fullscreen={true}
            assetTransferDetail={[]}
            allUnits={[]}
            allCurrentStatus={[]}
            staffs={staffs}
          />,
          document.body,
        )}
      <Accordion
        sx={{
          background: "#f6f8f4ff",
          boxShadow: "none",
          margin: "0 !important",
          "&:before": { display: "none" },
          "&.Mui-expanded": { margin: "0 !important" },
        }}
        expanded={expanded}
      >
        <AccordionSummary
          expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
          sx={{
            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
              transform: "none",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
            <Typography>Lập phiếu kết quả sửa chữa bảo dưỡng</Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            pt: 0,
            pb: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* THANH CÔNG CỤ */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Box display="flex" gap={2}>
                <SaveBtn onSave={formik.submitForm} />
                <CancelBtn onClick={onClose} />
              </Box>
            </Box>
            <CustomStepper activeStep={currentStatus} />
          </Box>

          <Paper
            sx={{
              p: 3,
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* THÔNG TIN CHUNG */}
            <Grid container spacing={4}>
              {/* CỘT TRÁI */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FieldInput
                      title="Số phiếu *"
                      formik={formik}
                      field="soPhieu"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Ngày lập phiếu *"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      value={formik.values.ngayLapPhieu}
                      onChange={(e) =>
                        formik.setFieldValue("ngayLapPhieu", e.target.value)
                      }
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldInput
                      title="Loại phiếu"
                      formik={formik}
                      field="loaiPhieu"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Phân xưởng quản lý"
                      fullWidth
                      size="small"
                      value={getDepartmentName(formik.values.idPhanXuong)}
                      disabled={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Đơn vị tiếp nhận"
                      fullWidth
                      size="small"
                      value={getDepartmentName(
                        formik.values.idDonViTiepNhanTaiSan,
                      )}
                      disabled={true}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Thời gian yêu cầu hoàn thành"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      value={formik.values.ngayYeuCauHoanThanh}
                      disabled={true}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* CỘT PHẢI */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị đề nghị *"
                      labelkey="tenPhongBan"
                      data={departments.filter((i) => !i.isKho)}
                      formik={formik}
                      field="idDonViDeNghi"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người lập biểu *"
                      labelkey="hoTen"
                      data={nvThamMuu}
                      formik={formik}
                      field="idNguoiKyNhay"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người duyệt *"
                      labelkey="hoTen"
                      data={nvThamMuu}
                      formik={formik}
                      field="idTrinhDuyetCapPhong"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người phê duyệt *"
                      labelkey="hoTen"
                      data={nvThamMuu}
                      formik={formik}
                      field="idTrinhDuyetGiamDoc"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người đại diện đơn vị sửa chữa *"
                      labelkey="hoTen"
                      data={staffInDonViTiepNhan}
                      formik={formik}
                      field="idNguoiDaiDienDonVi"
                      disabled={readOnly}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* --- TÀI LIỆU QUYẾT ĐỊNH --- */}
            <Box mt={4} mb={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Tài liệu Quyết định
              </Typography>
              <FileAttachmentInput
                formik={formik}
                fileName="tenFile"
                filePath="duongDanFile"
                setDocument={setDocument}
                disabled={true}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={() => setIsPreview(true)}
                sx={{ mt: 1 }}
              >
                <Typography variant="body2">Xem tài liệu</Typography>
              </Button>
            </Box>

            {/* CHI TIẾT TÀI SẢN */}
            <Box mb={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Chi tiết tài sản sửa chữa bảo dưỡng:
              </Typography>
              <Table
                size="small"
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid #e0e0e0",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <CustomTableHeadCell width="4%">STT</CustomTableHeadCell>
                    <CustomTableHeadCell width="15%">
                      Tên tài sản
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="12%">
                      Mã tài sản
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="12%">
                      Đơn vị
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="8%">
                      Số lượng
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="10%">
                      Đơn giá
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="10%">
                      Thành tiền
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="12%">
                      Trạng thái
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="12%">
                      Ghi chú
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="5%"></CustomTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.chiTietSuaChuaBaoDuongDTOS.map(
                    (row: any, index: number) => {
                      const donViName =
                        departments.find(
                          (d) => d.id === formik.values.idPhanXuong,
                        )?.tenPhongBan || "";
                      const soLuong =
                        formik.values.chiTietSuaChuaBaoDuongDTOS[index]
                          .soLuong || 0;
                      const donGia =
                        formik.values.chiTietSuaChuaBaoDuongDTOS[index]
                          .donGia || 0;
                      const thanhTien = soLuong * donGia;

                      return (
                        <TableRow key={index}>
                          <CustomTableCell align="center">
                            {index + 1}
                          </CustomTableCell>
                          <CustomTableCell>
                            <FieldAutoCompleted
                              title=""
                              labelkey="tenTaiSan"
                              data={[]}
                              formik={formik}
                              field={`chiTietSuaChuaBaoDuongDTOS.${index}.tentaiSan`}
                              disabled={false}
                            />
                          </CustomTableCell>
                          <CustomTableCell>
                            <TextField
                              size="small"
                              fullWidth
                              value={
                                formik.values.chiTietSuaChuaBaoDuongDTOS[index]
                                  .idTaiSan || ""
                              }
                              disabled={true}
                              variant="outlined"
                              sx={{
                                "& .MuiInputBase-root": {
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            />
                          </CustomTableCell>
                          <CustomTableCell>
                            <TextField
                              size="small"
                              fullWidth
                              value={donViName}
                              disabled={true}
                              variant="outlined"
                              sx={{
                                "& .MuiInputBase-root": {
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            />
                          </CustomTableCell>
                          <CustomTableCell>
                            <FieldInput
                              title=""
                              type="number"
                              formik={formik}
                              field={`chiTietSuaChuaBaoDuongDTOS.${index}.soLuong`}
                              disabled={false}
                            />
                          </CustomTableCell>
                          <CustomTableCell>
                            <FieldInput
                              title=""
                              type="number"
                              formik={formik}
                              field={`chiTietSuaChuaBaoDuongDTOS.${index}.donGia`}
                              disabled={false}
                            />
                          </CustomTableCell>
                          <CustomTableCell align="right">
                            <TextField
                              size="small"
                              fullWidth
                              value={thanhTien.toLocaleString("vi-VN")}
                              disabled={true}
                              variant="outlined"
                              sx={{
                                "& .MuiInputBase-root": {
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            />
                          </CustomTableCell>
                          <CustomTableCell>
                            <FieldInput
                              title=""
                              formik={formik}
                              field={`chiTietSuaChuaBaoDuongDTOS.${index}.hienTrang`}
                              disabled={false}
                            />
                          </CustomTableCell>
                          <CustomTableCell>
                            <FieldInput
                              title=""
                              formik={formik}
                              field={`chiTietSuaChuaBaoDuongDTOS.${index}.ghiChu`}
                              disabled={false}
                            />
                          </CustomTableCell>
                          <CustomTableCell align="center">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => {
                                const newAssets = [
                                  ...formik.values.chiTietSuaChuaBaoDuongDTOS,
                                ];
                                newAssets.splice(index, 1);
                                formik.setFieldValue(
                                  "chiTietSuaChuaBaoDuongDTOS",
                                  newAssets,
                                );
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </CustomTableCell>
                        </TableRow>
                      );
                    },
                  )}
                </TableBody>
              </Table>

              <Box mt={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    formik.setFieldValue("chiTietSuaChuaBaoDuongDTOS", [
                      ...formik.values.chiTietSuaChuaBaoDuongDTOS,
                      {
                        id: "",
                        idSuaChuaBaoDuong: "",
                        tentaiSan: "",
                        idTaiSan: "",
                        soLuong: 0,
                        donGia: 0,
                        ghiChu: "",
                        ngayTao: "",
                        ngayCapNhat: "",
                        nguoiTao: "",
                        nguoiCapNhat: "",
                        isActive: true,
                        hienTrang: "",
                        moTa: "",
                        daBanGiao: true,
                      },
                    ]);
                  }}
                >
                  + Thêm tài sản
                </Button>
              </Box>

              {/* CÁC CHI PHÍ KHÁC */}
              <Box mt={4}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Các chi phí khác:
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldInput
                      title="Chi phí nhân công"
                      type="number"
                      formik={formik}
                      field="chiPhiNhanCong"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldInput
                      title="Chi phí thuê ngoài"
                      type="number"
                      formik={formik}
                      field="chiPhiThueNgoai"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
