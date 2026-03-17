import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ViewBtn from "../../../components/Button/ViewBtn";
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  Cancel,
  Visibility, // Icon xem trước
} from "@mui/icons-material";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import CustomStepper from "../../../components/common/CustomStepper";
import FileAttachmentInput from "../../../components/TextField/FileAttachmentInput";
import SignDocumentForm from "./SignDocumentForm";
import { generateCode } from "../../../utils/helpers";
import { useAssetByDonViQuery } from "../Mutation";
import dayjs from "dayjs";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { generateBangKePdf, mergeBangKeWithOriginalPdf } from "../config";
import S3Service from "../../../services/S3Service";
import { assetTransferValidationSchema } from "../validation";
import { CongTy } from "../../../utils/const";

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
export default function AssetTransferForm({
  onEdit,
  onClose,
  selectedTransfer,
  readOnly,
  type,
  onSave,
  onCancel,
  label,
  isSignedForm = false,
  departments,
  staffs,
  allUnits,
  allCurrentStatus,
}: {
  onEdit: () => void;
  onClose: () => void;
  selectedTransfer?: any;
  readOnly?: boolean;
  type: number;
  onSave: (values: any) => void;
  onCancel: () => void;
  label?: string;
  isSignedForm?: boolean;
  departments: any[];
  staffs: any[];
  allUnits: any[];
  allCurrentStatus: any[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [document, setDocument] = useState<File | string | any>("");
  const { user } = useSelector((state: RootState) => state.user);

  // Logic trạng thái
  const currentStatus = selectedTransfer?.trangThai ?? 0; // 0: Nháp, 1: Duyệt, 2: Hủy, 3: Hoàn thành

  const formik = useFormik({
    initialValues: {
      id: "",
      soQuyetDinh: "",
      tenPhieu: "",
      idDonViGiao: type === 1 ? "K30" : "",
      idDonViNhan: type === 3 ? "kth" : "",
      idNguoiKyNhay: "",
      trangThaiKyNhay: false,
      nguoiLapPhieuKyNhay: false,
      idDonViDeNghi: user?.taiKhoan?.phongBanId || "",
      tgGnTuNgay: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      tgGnDenNgay: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      idTrinhDuyetCapPhong: "",
      trinhDuyetCapPhongXacNhan: false,
      idTrinhDuyetGiamDoc: "",
      trinhDuyetGiamDocXacNhan: false,
      diaDiemGiaoNhan: "",
      idPhongBanXemPhieu: "",
      noiNhan: "",
      trangThai: 0,
      idCongTy: CongTy.CT001,
      ngayTao: "",
      ngayCapNhat: "",
      nguoiTao: "",
      nguoiCapNhat: "",
      coHieuLuc: 1,
      loai: type,
      share: false,
      trichYeu: "",
      duongDanFile: "",
      tenFile: "",
      ngayKy: "",
      daBanGiao: false,
      byStep: false,
      coPhieuBanGiao: false,
      taiLieuCuoi: "",
      nguoiKyList: [],
      chiTietDieuDongTaiSanDTOS: [
        {
          id: "",
          idDieuDongTaiSan: "",
          tentaiSan: "",
          idTaiSan: "",
          soLuong: 0,
          ghiChu: "",
          ngayTao: "",
          ngayCapNhat: "",
          nguoiTao: "",
          nguoiCapNhat: "",
          isActive: true,
          hienTrang: "",
          moTa: "",
          daBanGiao: false,
        },
      ],
      initialChiTiet: [],
      initialNguoiKy: [],
    },
    validationSchema: assetTransferValidationSchema,
    onSubmit: async (values) => {
      const chiTietDieuDongTaiSanDTOS = values.chiTietDieuDongTaiSanDTOS.map(
        (item, index) => ({
          ...item,
          id: `${generateCode("CTDD-")}-${index}`,
          idDieuDongTaiSan: values.id,
        }),
      );
      const nguoiKyList = values.nguoiKyList.map((item: any, index) => ({
        ...item,
        id: `${generateCode("NK-")}-${index}`,
        idTaiLieu: values.id,
        idPhongBan: values.idDonViDeNghi,
      }));
      const bangKeBytes = await generateBangKePdf(
        values.chiTietDieuDongTaiSanDTOS,
        allUnits,
        allCurrentStatus,
      );

      // 2. Xử lý Key tài liệu gốc (duongDanFile)
      let keyTailieu = values.duongDanFile;
      let keyTaiLieuCuoi = values.taiLieuCuoi;

      // Nếu 'document' là File (người dùng vừa chọn file mới)
      if (document instanceof File) {
        keyTailieu = await S3Service.put({
          name: document.name,
          file: document,
          type: "tailieu",
        });
      }

      // 3. Merge và Upload tài liệu cuối (taiLieuCuoi)
      const mergePdf = await mergeBangKeWithOriginalPdf(
        keyTailieu,
        bangKeBytes,
      );
      if (!mergePdf) throw new Error("Không thể tạo tài liệu");

      if (!keyTaiLieuCuoi) {
        keyTaiLieuCuoi = await S3Service.put({
          name: `DDTS_${values.tenPhieu}.pdf`,
          file: mergePdf,
          type: "tailieu",
        });
      } else {
        await S3Service.updatePresignedPutUrl(keyTaiLieuCuoi, mergePdf);
      }
      onSave({
        ...values,
        chiTietDieuDongTaiSanDTOS,
        nguoiKyList,
        duongDanFile: keyTailieu,
        taiLieuCuoi: keyTaiLieuCuoi,
      });
    },
  });
  useEffect(() => {
    if (selectedTransfer) {
      formik.setValues({
        ...selectedTransfer,
        initialChiTiet: selectedTransfer.chiTietDieuDongTaiSanDTOS.map(
          (i: any) => i.id,
        ),
        initialNguoiKy: selectedTransfer.nguoiKyList.map((i: any) => i.id),
      });
      setDocument(
        [0].includes(selectedTransfer.trangThai ?? 0)
          ? selectedTransfer.duongDanFile
          : selectedTransfer.taiLieuCuoi,
      );
    } else formik.resetForm();
  }, [selectedTransfer]);

  const isCapPhat = type === 1;
  const isThuHoi = type === 3;
  const dvGiao = departments.filter((i) =>
    isCapPhat ? i.isKho === true && i.loaiKho === 1 : i.isKho === false,
  );
  const dvNhan = departments.filter((i) =>
    isThuHoi ? i.isKho === true && i.loaiKho === 2 : i.isKho === false,
  );

  const [nvThamMuu, setNVThamMuu] = useState<any[]>([]);
  const [nvPGD, setNVPGD] = useState<any[]>([]);

  useEffect(() => {
    if (formik.values.idDonViDeNghi && departments && staffs) {
      console.log(
        "donvidenghi",
        staffs.filter((i) => i.phongBanId === formik.values.idDonViDeNghi),
      );
      console.log("staffs", staffs);
      setNVThamMuu(
        staffs.filter((i) => i.phongBanId === formik.values.idDonViDeNghi),
      );
      const lanhDaoDeptIds = departments
        .filter((d) => d.isLanhDao === true)
        .map((d) => d.id);

      // Bước B: Lọc nhân viên có phongBanId nằm trong danh sách ID vừa tìm được
      const filteredPGD = staffs.filter((s) =>
        lanhDaoDeptIds.includes(s.phongBanId),
      );
      setNVPGD(filteredPGD);
    }
  }, [formik.values.idDonViDeNghi, departments, staffs]);

  const {
    data: allAssetsByDonVi = { items: [] },
    isFetching,
    isLoading,
  } = useAssetByDonViQuery(type, formik.values.idDonViGiao);
  return (
    <>
      {isPreview && (
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
          assetTransferDetail={formik.values.chiTietDieuDongTaiSanDTOS}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
          isEdit={[0].includes(selectedTransfer?.trangThai ?? 0) ? true : false}
        />
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
            <Typography>Chi tiết {label}</Typography>
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
          {/* THANH CÔNG CỤ: NÚT HÀNH ĐỘNG VÀ STEPPER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              {[0].includes(currentStatus) && (
                <Box display="flex" gap={2}>
                  {!readOnly && <SaveBtn onSave={formik.submitForm} />}
                  {!readOnly && <CancelBtn onClick={onClose} />}
                  {readOnly && <EditButton onClick={onEdit} />}
                </Box>
              )}
              {![0, 2, 3, 4].includes(currentStatus) && (
                <Button
                  size="small"
                  sx={{ bgcolor: "red", color: "white" }}
                  startIcon={<Cancel />}
                  onClick={onCancel}
                >
                  Hủy phiếu {label}
                </Button>
              )}
            </Box>
            {/* Tích hợp Component CustomStepper của bạn */}
            <CustomStepper activeStep={currentStatus} />
          </Box>

          <Paper
            sx={{
              p: 3,
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            {/* --- PHẦN 1: THÔNG TIN CHUNG (Sử dụng Grid size MUI v7) --- */}
            <Grid container spacing={4}>
              {/* CỘT TRÁI */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  {selectedTransfer && (
                    <Grid size={12}>
                      <FieldInput
                        title="Số chứng từ *"
                        formik={formik}
                        field="id"
                        disabled={true}
                      />
                    </Grid>
                  )}
                  <Grid size={12}>
                    <FieldInput
                      title="Tên phiếu *"
                      formik={formik}
                      field="tenPhieu"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldInput
                      title="Trích yếu *"
                      formik={formik}
                      field="trichYeu"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị giao *"
                      labelkey="tenPhongBan"
                      data={dvGiao}
                      formik={formik}
                      field="idDonViGiao"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị nhận *"
                      labelkey="tenPhongBan"
                      data={dvNhan}
                      formik={formik}
                      field="idDonViNhan"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldDateTime
                      title="TGCN từ Ngày"
                      formik={formik}
                      field="tgGnTuNgay"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldDateTime
                      title="TGCN đến Ngày"
                      formik={formik}
                      field="tgGnDenNgay"
                      disabled={readOnly}
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
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người lập biểu *"
                      labelkey="hoTen"
                      data={nvThamMuu}
                      formik={formik}
                      field="idNguoiKyNhay"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography fontSize={14} color="text.secondary">
                        Người lập phiếu ký nháy :
                      </Typography>
                      <Checkbox
                        checked={formik.values.nguoiLapPhieuKyNhay}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "nguoiLapPhieuKyNhay",
                            e.target.checked,
                          )
                        }
                        disabled={readOnly}
                        color="primary"
                      />
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người duyệt *"
                      labelkey="hoTen"
                      data={nvThamMuu}
                      formik={formik}
                      field="idTrinhDuyetCapPhong"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="inherit"
                      size="small"
                      startIcon={<Add />}
                      disabled={readOnly}
                      sx={{
                        bgcolor: "#e0e0e0",
                        color: "#000",
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                      onClick={() => {
                        const newNguoiKy = [
                          ...formik.values.nguoiKyList,
                          {
                            id: "",
                            idTaiLieu: "",
                            idNguoiKy: "",
                            tenNguoiKy: "",
                            idPhongBan: "",
                            trangThai: 0,
                          },
                        ];
                        formik.setFieldValue("nguoiKyList", newNguoiKy);
                      }}
                    >
                      Thêm người ký
                    </Button>
                  </Grid>

                  {formik.values.nguoiKyList.map((row, index) => (
                    <Grid size={12}>
                      <Box display="flex">
                        <FieldAutoCompleted
                          title={`Người đại diện ${index + 1}`}
                          labelkey="hoTen"
                          data={nvThamMuu}
                          formik={formik}
                          field={`nguoiKyList[${index}].idNguoiKy`}
                          onChange={(value) => {
                            formik.setFieldValue(
                              `nguoiKyList[${index}].tenNguoiKy`,
                              value?.hoTen,
                            );
                          }}
                          disabled={readOnly}
                        />
                        <IconButton
                          onClick={() => {
                            const newNguoiKy = [...formik.values.nguoiKyList];
                            newNguoiKy.splice(index, 1);
                            formik.setFieldValue("nguoiKyList", newNguoiKy);
                          }}
                        >
                          <Delete sx={{ color: "red" }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Người phê duyệt *"
                      labelkey="hoTen"
                      data={nvPGD}
                      formik={formik}
                      field={`idTrinhDuyetGiamDoc`}
                      disabled={readOnly}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* --- PHẦN 2: TÀI LIỆU QUYẾT ĐỊNH --- */}
            <Box mt={4} mb={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Tài liệu Quyết định
              </Typography>

              <FileAttachmentInput
                formik={formik}
                fileName="tenFile"
                filePath="duongDanFile"
                setDocument={setDocument}
                disabled={readOnly}
              />
            </Box>

            {/* --- PHẦN 3: CHI TIẾT TÀI SẢN --- */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Chi tiết tài sản điều chuyển:
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
                    <CustomTableHeadCell width="25%">
                      Tài sản
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="15%">
                      Đơn vị tính
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="15%">
                      Số lượng
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="20%">
                      Tình trạng kỹ thuật
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="20%">
                      Ghi chú
                    </CustomTableHeadCell>
                    {!readOnly && (
                      <CustomTableHeadCell width="5%"></CustomTableHeadCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.chiTietDieuDongTaiSanDTOS.map((row, index) => (
                    <TableRow key={index}>
                      <CustomTableCell>
                        <FieldAutoCompleted
                          title=""
                          labelkey="tenTaiSan"
                          labelOption="id"
                          data={[
                            ...allAssetsByDonVi.items,
                            ...(
                              selectedTransfer?.chiTietDieuDongTaiSanDTOS || []
                            ).map((i: any) => ({
                              ...i,
                              id: i.idTaiSan,
                            })),
                          ]}
                          formik={formik}
                          field={`chiTietDieuDongTaiSanDTOS.${index}.idTaiSan`}
                          onChange={(value) => {
                            formik.setFieldValue(
                              `chiTietDieuDongTaiSanDTOS.${index}.donViTinh`,
                              value?.donViTinh,
                            );
                            formik.setFieldValue(
                              `chiTietDieuDongTaiSanDTOS.${index}.tenTaiSan`,
                              value?.tenTaiSan,
                            );
                            formik.setFieldValue(
                              `chiTietDieuDongTaiSanDTOS.${index}.soLuong`,
                              value?.soLuong,
                            );
                            formik.setFieldValue(
                              `chiTietDieuDongTaiSanDTOS.${index}.hienTrang`,
                              value?.hienTrang,
                            );
                            formik.setFieldValue(
                              `chiTietDieuDongTaiSanDTOS.${index}.moTa`,
                              value?.moTa,
                            );
                            formik.setFieldValue(
                              `chiTietDieuDongTaiSanDTOS.${index}.ghiChu`,
                              value?.ghiChu,
                            );
                          }}
                          disabled={readOnly}
                        />
                      </CustomTableCell>
                      <CustomTableCell>
                        <FieldAutoCompleted
                          title=""
                          labelkey="tenDonVi"
                          data={allUnits}
                          formik={formik}
                          field={`chiTietDieuDongTaiSanDTOS.${index}.donViTinh`}
                          disabled={readOnly}
                        />
                      </CustomTableCell>
                      <CustomTableCell>
                        <FieldInput
                          title=""
                          type="number"
                          formik={formik}
                          field={`chiTietDieuDongTaiSanDTOS.${index}.soLuong`}
                          disabled={readOnly}
                        />
                      </CustomTableCell>
                      <CustomTableCell>
                        <FieldAutoCompleted
                          title=""
                          labelkey="tenHTKT"
                          data={allCurrentStatus}
                          formik={formik}
                          field={`chiTietDieuDongTaiSanDTOS.${index}.hienTrang`}
                          disabled={readOnly}
                        />
                      </CustomTableCell>
                      <CustomTableCell>
                        <FieldInput
                          title=""
                          formik={formik}
                          field={`chiTietDieuDongTaiSanDTOS.${index}.ghiChu`}
                          disabled={readOnly}
                        />
                      </CustomTableCell>
                      {!readOnly && (
                        <CustomTableCell align="center">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              const newAssets = [
                                ...formik.values.chiTietDieuDongTaiSanDTOS,
                              ];
                              newAssets.splice(index, 1);
                              formik.setFieldValue(
                                "chiTietDieuDongTaiSanDTOS",
                                newAssets,
                              );
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </CustomTableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!readOnly && (
                <Box mt={2}>
                  <Button
                    startIcon={<Add />}
                    variant="text"
                    onClick={() => {
                      formik.setFieldValue("chiTietDieuDongTaiSanDTOS", [
                        ...formik.values.chiTietDieuDongTaiSanDTOS,
                        {
                          assetId: "",
                          uom: "",
                          quantity: 1,
                          status: "Đang sử dụng",
                          note: "",
                        },
                      ]);
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Thêm một dòng
                  </Button>
                </Box>
              )}
              <Box
                mt={2}
                display="flex"
                alignItems="center"
                gap={0.5}
                sx={{ cursor: "pointer", color: "#1976d2" }}
                onClick={() => setIsPreview(true)}
              >
                <Typography variant="body2">Xem trước tài liệu</Typography>
                <Visibility fontSize="small" />
              </Box>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
