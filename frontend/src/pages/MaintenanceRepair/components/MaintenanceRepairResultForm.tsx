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
  Checkbox,
  Collapse,
  TableContainer,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ViewBtn from "../../../components/Button/ViewBtn";
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
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
import EditButton from "../../../components/Button/EditButton";
import FieldDate from "../../../components/TextField/FieldDate";
import { Action, StatusPlan } from "../../../utils/const";
import { useAllLoaiSCBDQuery } from "../../MaintenanceRepairType/Mutation";
import { useMaintenancePlanningPageQuery } from "../../MainenancePlanRepair/Mutation";
import dayjs from "dayjs";
import {
  getAssetMaintenanceQuery,
  getToolMaintenanceQuery,
  useMaintenanceRepairMutation,
} from "../Mutation";
import { useAllCurrentStatusQuery } from "../../CurrentStatus/Mutation";
import TextFieldNumber from "../../../components/TextField/TextFieldNumber";
import S3Service from "../../../services/S3Service";
import { generateBangKeKetQuaPdf, mergeBangKeWithOriginalPdf } from "../config";
import SignDocumentResultForm from "./SignDocumentResultForm";

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

export default function MaintenanceRepairResultForm({
  onClose,
  selectedRepair,
  readOnly,
  onSave,
  onEdit,
  onCancel,
  departments,
  staffs,
  repairs = [],
  allUnits,
  allCurrentStatus,
}: {
  onClose: () => void;
  selectedRepair?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  onEdit: () => void;
  onCancel: () => void;
  departments: any[];
  staffs: any[];
  repairs?: any[];
  allUnits: any[];
  allCurrentStatus: any[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [nvThamMuu, setNVThamMuu] = useState<any[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [document, setDocument] = useState<File | string | any>("");

  const { data: maintenanceRepairTypes = [] } = useAllLoaiSCBDQuery();

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: "",
      tenPhieu: "",
      ngayBatDauThucte: dayjs(new Date()).format("YYYY-MM-DD"),
      ngayKetThucThucte: dayjs(new Date()).format("YYYY-MM-DD"),
      idDonViGiao: "",
      idDonViNhan: "",
      idNguoiKyNhay: "",
      trangThaiKyNhay: false,
      nguoiLapPhieuKyNhay: false,
      idTrinhDuyetCapPhong: "",
      trinhDuyetCapPhongXacNhan: false,
      idTrinhDuyetGiamDoc: "",
      trinhDuyetGiamDocXacNhan: false,
      idDonViDeNghi: "",
      duongDanFile: "",
      tenFile: "",
      taiLieuBanGhi: "",
      byStep: false,
      soQuyetDinh: "",
      nguoiTao: "",
      share: false,
      ngayTao: "",
      taiLieuCuoi: "",
      trangThai: 0,
      ngayCapNhat: "",
      idLoaiSuaChua: "",
      ghiChu: "",
      idSuaChua: "",
      chiPhiPhanCong: 0,
      chiPhiThueNgoai: 0,
      nguoiKyList: [] as any[],
      // initialTaiSan: [],
      // initialVatTu: [],
      chiTietTaiSanList: [] as any[],
    },
    onSubmit: async (values) => {
      const nguoiKyList = values.nguoiKyList.map((item: any, index) => ({
        ...item,
        id: `${generateCode("SIG-")}-${index}`,
        idTaiLieu: values.id,
      }));
      const bangKeBytes = await generateBangKeKetQuaPdf(
        values,
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
          name: `KQSC_${values.tenPhieu}.pdf`,
          file: mergePdf,
          type: "tailieu",
        });
      } else {
        await S3Service.updatePresignedPutUrl(keyTaiLieuCuoi, mergePdf);
      }
      onSave({
        ...values,
        trangThai: 0,
        nguoiKyList,
        duongDanFile: keyTailieu,
        taiLieuCuoi: keyTaiLieuCuoi,
      });
    },
  });

  useEffect(() => {
    if (selectedRepair) {
      formik.setValues({
        ...formik.initialValues,
        ...selectedRepair,
        chiTietTaiSanList: (selectedRepair.chiTietTaiSanList || []).map(
          (i: any) => ({
            ...i,
            action: i.id ? Action.UPDATE : Action.CREATE,
            vatTuList: (i.vatTuList || []).map((j: any) => ({
              ...j,
              action: j.id ? Action.UPDATE : Action.CREATE,
            })),
          }),
        ),
        // initialTaiSan: (selectedRepair.chiTietTaiSanList || []).map(
        //   (i: any) => i.id,
        // ),
        // initialvatTu: (selectedRepair.danhSachVatTu || []).map(
        //   (i: any) => i.id,
        // ),
      });
      setDocument(selectedRepair.taiLieuCuoi || "");
    } else {
      formik.resetForm();
      setDocument("");
    }
  }, [selectedRepair]);

  const { data: allAsset } = getAssetMaintenanceQuery(formik.values.idSuaChua);
  const { data: allCCDC } = getToolMaintenanceQuery(formik.values.idSuaChua);

  const currentStatus = selectedRepair?.trangThai ?? 0;

  const [nvPGD, setNVPGD] = useState<any[]>([]);

  useEffect(() => {
    if (formik.values.idDonViDeNghi && departments && staffs) {
      setNVThamMuu(
        staffs.filter((i) => i.phongBanId === formik.values.idDonViDeNghi),
      );
      const lanhDaoDeptIds = departments
        .filter((d) => d.isLanhDao === true)
        .map((d) => d.id);

      const filteredPGD = staffs.filter((s) =>
        lanhDaoDeptIds.includes(s.phongBanId),
      );
      setNVPGD(filteredPGD);
    }
  }, [formik.values.idDonViDeNghi, departments, staffs]);

  return (
    <>
      {isPreview && (
        <SignDocumentResultForm
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
          data={formik.values}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
          staffs={staffs}
          isEdit={[0].includes(selectedRepair?.trangThai ?? 0) ? true : false}
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
                <Box display="flex" gap={2}>
                  {!readOnly && <SaveBtn onSave={formik.submitForm} />}
                  {!readOnly && <CancelBtn onClick={onClose} />}
                  {readOnly && <EditButton onClick={onEdit} />}
                </Box>
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
                  {selectedRepair.id && readOnly && (
                    <Grid size={12}>
                      <FieldInput
                        title="Số phiếu *"
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
                  <FieldAutoCompleted
                    title="Phiếu sửa chữa bảo dưỡng"
                    labelkey="tenSuaChua"
                    data={repairs}
                    formik={formik}
                    field="idSuaChua"
                    disabled={true}
                  />
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Loại sửa chữa *"
                      labelkey="ten"
                      data={maintenanceRepairTypes}
                      formik={formik}
                      field="idLoaiSuaChua"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị giao *"
                      labelkey="tenPhongBan"
                      data={departments}
                      formik={formik}
                      field="idDonViGiao"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị nhận *"
                      labelkey="tenPhongBan"
                      data={departments}
                      formik={formik}
                      field="idDonViNhan"
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldDate
                      title="Ngày bắt đầu thực tế"
                      formik={formik}
                      field="ngayBatDauThucTe"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldDate
                      title="Ngày kết thúc thực tế"
                      formik={formik}
                      field="ngayKetThucThucTe"
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
                        Người lập phiếu ký nháy:
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
                      color="success"
                      size="small"
                      startIcon={<Add />}
                      disabled={readOnly}
                      sx={{
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                      onClick={() => {
                        const newNguoiKy = [
                          ...formik.values.nguoiKyList,
                          {
                            id: "",
                            idTaiLieu: "",
                            idPhongBan: "",
                            idNguoiKy: "",
                            tenNguoiKy: "",
                            trangThai: 0,
                          },
                        ];
                        formik.setFieldValue("nguoiKyList", newNguoiKy);
                      }}
                    >
                      Thêm người ký
                    </Button>
                  </Grid>

                  {formik.values.nguoiKyList.map((row: any, index) => {
                    const staffInDept = staffs.filter(
                      (s) => s.phongBanId === row.idPhongBan,
                    );

                    return (
                      <Grid
                        key={index}
                        container
                        spacing={1}
                        alignItems="center"
                        sx={{ width: "100%", mt: 1 }}
                      >
                        <Grid size={11}>
                          <Grid container spacing={1}>
                            <Grid size={12}>
                              <FieldAutoCompleted
                                title={`Đơn vị ${index + 1}`}
                                labelkey="tenPhongBan"
                                data={departments}
                                formik={formik}
                                field={`nguoiKyList[${index}].idPhongBan`}
                                onChange={() => {
                                  formik.setFieldValue(
                                    `nguoiKyList[${index}].idNguoiKy`,
                                    "",
                                  );
                                  formik.setFieldValue(
                                    `nguoiKyList[${index}].tenNguoiKy`,
                                    "",
                                  );
                                }}
                                disabled={readOnly}
                              />
                            </Grid>
                            <Grid size={12}>
                              <FieldAutoCompleted
                                title={`Người ký ${index + 1}`}
                                labelkey="hoTen"
                                data={staffInDept}
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
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid
                          size={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              const newNguoiKy = [...formik.values.nguoiKyList];
                              newNguoiKy.splice(index, 1);
                              formik.setFieldValue("nguoiKyList", newNguoiKy);
                            }}
                            disabled={readOnly}
                            size="small"
                          >
                            <Delete sx={{ color: "red" }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
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
                disabled={readOnly}
              />
            </Box>

            {/* CHI TIẾT TÀI SẢN */}
            <AssetTableSection
              formik={formik}
              readOnly={readOnly}
              assets={allAsset}
              tools={allCCDC}
            />

            {/* CÁC CHI PHÍ KHÁC */}
            <Box mt={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Các chi phí khác:
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextFieldNumber
                    title="Chi phí phân công"
                    formik={formik}
                    field="chiPhiPhanCong"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextFieldNumber
                    title="Chi phí thuê ngoài"
                    formik={formik}
                    field="chiPhiThueNgoai"
                  />
                </Grid>
              </Grid>
            </Box>
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
          </Paper>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

// =================================================================
// Asset Row Component for nested table
// =================================================================
const AssetRow = ({
  row,
  index,
  formik,
  assets=[],
  tools=[],
  readOnly,
  onRemove,
}: {
  row: any;
  index: number;
  formik: any;
  assets: any[];
  tools: any[];
  readOnly?: boolean;
  onRemove: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const { data: allCurrentStatus } = useAllCurrentStatusQuery();

  const getMaxAvailable = (
    toolId: string,
    currentAssetIndex: number,
    currentMaterialIndex: number,
  ) => {
    if (!toolId) return 0;

    // Tìm tổng số lượng ban đầu của vật tư trong kho
    const toolInfo = tools.find((t) => t.idChiTietCCDC === toolId);
    const initialMax = toolInfo?.soLuongConLai || 0;

    // Tính tổng số lượng vật tư này đã được chọn ở CÁC DÒNG KHÁC trong toàn bộ phiếu
    let usedElsewhere = 0;
    const allAssets = formik.values.chiTietTaiSanList || [];

    allAssets.forEach((assetItem: any, aIdx: number) => {
      (assetItem.vatTuList || []).forEach((matItem: any, mIdx: number) => {
        // Cộng dồn nếu đúng id vật tư và KHÔNG phải là chính cái ô chúng ta đang nhập
        if (
          matItem.idChiTietCcdc === toolId &&
          !(aIdx === currentAssetIndex && mIdx === currentMaterialIndex)
        ) {
          usedElsewhere += Number(matItem.soLuong || 0);
        }
      });
    });

    // Số lượng còn lại = Tổng ban đầu - Tổng đã dùng ở các dòng khác
    return Math.max(0, initialMax - usedElsewhere);
  };

  const handleAddMaterial = () => {
    const newMaterials = [
      ...(row.vatTuList || []),
      {
        id: "",
        idKetQuaSuaChua: "",
        idCcdc: "",
        idChiTietCcdc: "",
        idNhomCCDC: "",
        soLuong: 0,
        donGia: 0,
        thanhTien: 0,
        ghiChu: "",
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: "",
        action: Action.CREATE,
      },
    ];
    formik.setFieldValue(`chiTietTaiSanList[${index}].vatTuList`, newMaterials);
  };

  const handleRemoveMaterial = (materialIndex: number) => {
    formik.setFieldValue(
      `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].action`,
      Action.DELETE,
    );
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <CustomTableCell width="4%">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </CustomTableCell>
        <CustomTableCell align="center">{index + 1}</CustomTableCell>
        <CustomTableCell>
          <FieldAutoCompleted
            title=""
            labelkey="tenTaiSan"
            data={assets.map((i: any) => ({
              ...i,
              id: i.idTaiSan,
            }))} // Replace with actual asset data source
            formik={formik}
            field={`chiTietTaiSanList[${index}].idTaiSan`}
            onChange={(values) => {
              formik.setFieldValue(
                `chiTietTaiSanList[${index}].hienTrang`,
                values?.hienTrang,
              );
              formik.setFieldValue(
                `chiTietTaiSanList[${index}].soLuong`,
                values?.soLuong,
              );
              formik.setFieldValue(
                `chiTietTaiSanList[${index}].tenTaiSan`,
                values?.tenTaiSan,
              );
            }}
            disabled={readOnly}
          />
        </CustomTableCell>
        <CustomTableCell>
          <FieldInput
            title=""
            type="number"
            formik={formik}
            field={`chiTietTaiSanList[${index}].soLuong`}
            disabled={true}
          />
        </CustomTableCell>
        <CustomTableCell>
          <FieldAutoCompleted
            title=""
            labelkey="tenHTKT"
            data={allCurrentStatus} // Replace with actual asset data source
            formik={formik}
            field={`chiTietTaiSanList[${index}].hienTrang`}
            onChange={(values) => {}}
            disabled={readOnly}
          />
        </CustomTableCell>
        <CustomTableCell>
          <FieldInput
            title=""
            formik={formik}
            field={`chiTietTaiSanList[${index}].ghiChu`}
            disabled={readOnly}
          />
        </CustomTableCell>
        <CustomTableCell align="center">
          <IconButton
            color="error"
            size="small"
            onClick={onRemove}
            disabled={readOnly}
          >
            <Delete fontSize="small" />
          </IconButton>
        </CustomTableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: "1px 1px 16px 1px",
                padding: 2,
              }}
            >
              <Typography variant="subtitle2" gutterBottom component="div">
                Vật tư tiêu hao cho:{" "}
                <b>{row.tenTaiSan || "Tài sản chưa chọn"}</b>
              </Typography>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Table size="small" aria-label="purchases">
                  <TableHead sx={{ bgcolor: "success.main" }}>
                    <TableRow>
                      <CustomTableHeadCell
                        sx={{
                          color: "primary.contrastText",
                        }}
                        width="25%"
                      >
                        Tên vật tư
                      </CustomTableHeadCell>
                      <CustomTableHeadCell
                        width="10%"
                        sx={{
                          color: "primary.contrastText",
                        }}
                      >
                        Số lượng
                      </CustomTableHeadCell>
                      <CustomTableHeadCell
                        width="10%"
                        sx={{
                          color: "primary.contrastText",
                        }}
                      >
                        Đơn giá
                      </CustomTableHeadCell>
                      <CustomTableHeadCell
                        width="10%"
                        sx={{
                          color: "primary.contrastText",
                        }}
                      >
                        Thành tiền
                      </CustomTableHeadCell>
                      <CustomTableHeadCell
                        sx={{
                          color: "primary.contrastText",
                        }}
                      >
                        Ghi chú
                      </CustomTableHeadCell>
                      <CustomTableHeadCell
                        width="5%"
                        sx={{
                          color: "primary.contrastText",
                        }}
                      ></CustomTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(row.vatTuList || [])
                      .filter((i: any) => i.action !== Action.DELETE)
                      .map((materialRow: any, materialIndex: number) => {
                        return (
                          <TableRow key={materialIndex}>
                            <CustomTableCell>
                              <FieldAutoCompleted
                                title=""
                                labelkey="tenVatTu"
                                data={tools.map((i: any) => ({
                                  ...i,
                                  id: i.idChiTietCCDC,
                                }))} // Replace with actual material data source
                                formik={formik}
                                field={`chiTietTaiSanList[${index}].vatTuList[${materialIndex}].idChiTietCcdc`}
                                onChange={(values) => {
                                  const newToolId = values?.id;
                                  const price = values?.donGia || 0;

                                  // Kiểm tra xem nếu đổi vật tư mới thì mức max của nó là bao nhiêu
                                  const maxAllowed = getMaxAvailable(
                                    newToolId,
                                    index,
                                    materialIndex,
                                  );
                                  const currentInputQty =
                                    formik.values.chiTietTaiSanList[index]
                                      .vatTuList[materialIndex].soLuong || 0;

                                  // Ép số lượng hiện hành xuống nếu vượt quá max của vật tư mới
                                  const safeQty = Math.min(
                                    currentInputQty,
                                    maxAllowed,
                                  );
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].donGia`,
                                    values?.donGia,
                                  );
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].soLuong`,
                                    safeQty,
                                  );
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].thanhTien`,
                                    (values?.donGia || 0) * safeQty,
                                  );
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].ghiChu`,
                                    values?.ghiChu,
                                  );
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].idCcdc`,
                                    values?.idCCDC,
                                  );
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].tenVatTu`,
                                    values?.tenVatTu,
                                  );
                                }}
                                disabled={readOnly}
                              />
                            </CustomTableCell>
                            <CustomTableCell>
                              <TextFieldNumber
                                formik={formik}
                                field={`chiTietTaiSanList[${index}].vatTuList[${materialIndex}].soLuong`}
                                onChange={(value) => {
                                  const inputValue = Number(value || 0);
                                  const currentToolId =
                                    formik.values.chiTietTaiSanList[index]
                                      .vatTuList[materialIndex].idChiTietCcdc;

                                  // Tính toán giới hạn được phép nhập
                                  const maxAllowed = getMaxAvailable(
                                    currentToolId,
                                    index,
                                    materialIndex,
                                  );
                                  console.log(currentToolId);
                                  console.log(maxAllowed);

                                  // Ép giá trị nhập vào nằm trong khoảng từ 0 đến maxAllowed
                                  const finalValue = Math.min(
                                    Math.max(0, inputValue),
                                    maxAllowed,
                                  );

                                  // Set số lượng an toàn
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].soLuong`,
                                    finalValue,
                                  );

                                  // Tính lại tiền theo số lượng an toàn
                                  const currentPrice =
                                    formik.values.chiTietTaiSanList[index]
                                      .vatTuList[materialIndex].donGia || 0;
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].thanhTien`,
                                    currentPrice * finalValue,
                                  );
                                }}
                                disabled={
                                  readOnly ||
                                  !formik.values.chiTietTaiSanList[index]
                                    .vatTuList[materialIndex].idChiTietCcdc
                                }
                              />
                            </CustomTableCell>
                            <CustomTableCell>
                              <TextFieldNumber
                                title=""
                                formik={formik}
                                field={`chiTietTaiSanList[${index}].vatTuList[${materialIndex}].donGia`}
                                onChange={(value) => {
                                  formik.setFieldValue(
                                    `chiTietTaiSanList[${index}].vatTuList[${materialIndex}].thanhTien`,
                                    (formik.values.chiTietTaiSanList[index]
                                      .vatTuList[materialIndex].soLuong || 0) *
                                      (value || 0),
                                  );
                                }}
                                disabled={readOnly}
                              />
                            </CustomTableCell>
                            <CustomTableCell>
                              <TextFieldNumber
                                title=""
                                formik={formik}
                                field={`chiTietTaiSanList[${index}].vatTuList[${materialIndex}].thanhTien`}
                                disabled={true}
                              />
                            </CustomTableCell>
                            <CustomTableCell>
                              <FieldInput
                                title=""
                                formik={formik}
                                field={`chiTietTaiSanList[${index}].vatTuList[${materialIndex}].ghiChu`}
                                disabled={readOnly}
                              />
                            </CustomTableCell>
                            <CustomTableCell>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={readOnly}
                                onClick={() =>
                                  handleRemoveMaterial(materialIndex)
                                }
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </CustomTableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              {!readOnly && (
                <Button
                  startIcon={<Add />}
                  onClick={handleAddMaterial}
                  sx={{ mt: 1, textTransform: "none" }}
                  size="small"
                >
                  Thêm vật tư
                </Button>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// =================================================================
// Main Asset Table Section Component
// =================================================================
const AssetTableSection = ({
  formik,
  readOnly,
  assets,
  tools,
}: {
  formik: any;
  readOnly?: boolean;
  assets: any[];
  tools: any[];
}) => {
  const handleAddAsset = () => {
    formik.setFieldValue("chiTietTaiSanList", [
      ...formik.values.chiTietTaiSanList,
      {
        id: "",
        idKetQuaSuaChua: "",
        idTaiSan: "",
        hienTrang: "",
        soLuong: 0,
        ghiChu: "",
        ngayTao: "",
        ngayCapNhat: "",
        nguoiTao: "",
        nguoiCapNhat: "",
        action: Action.CREATE,
        vatTuList: [],
      },
    ]);
  };

  const handleRemoveAsset = (index: number) => {
    formik.setFieldValue(`chiTietTaiSanList[${index}].action`, Action.DELETE);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Chi tiết tài sản sửa chữa bảo dưỡng:
        </Typography>
        {!readOnly && (
          <Button
            startIcon={<Add />}
            variant="contained"
            size="small"
            onClick={handleAddAsset}
            sx={{ textTransform: "none", mb: 2 }}
          >
            Thêm tài sản
          </Button>
        )}
      </Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #e0e0e0",
            },
          }}
        >
          <TableHead sx={{ bgcolor: "success.main" }}>
            <TableRow>
              <CustomTableHeadCell
                width="4%"
                sx={{
                  color: "primary.contrastText",
                }}
              ></CustomTableHeadCell>
              <CustomTableHeadCell
                width="4%"
                sx={{
                  color: "primary.contrastText",
                }}
              >
                STT
              </CustomTableHeadCell>
              <CustomTableHeadCell
                width="25%"
                sx={{
                  color: "primary.contrastText",
                }}
              >
                Tên tài sản
              </CustomTableHeadCell>
              <CustomTableHeadCell
                width="8%"
                sx={{
                  color: "primary.contrastText",
                }}
              >
                Số lượng
              </CustomTableHeadCell>
              <CustomTableHeadCell
                width="15%"
                sx={{
                  color: "primary.contrastText",
                }}
              >
                Hiện trạng
              </CustomTableHeadCell>
              <CustomTableHeadCell
                sx={{
                  color: "primary.contrastText",
                }}
              >
                Ghi chú
              </CustomTableHeadCell>
              <CustomTableHeadCell
                width="5%"
                sx={{
                  color: "primary.contrastText",
                }}
              ></CustomTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formik.values.chiTietTaiSanList
              .filter((item: any) => item.action !== Action.DELETE)
              .map((row: any) => {
                const originalIndex =
                  formik.values.chiTietTaiSanList.indexOf(row);
                if (originalIndex === -1) return null;
                return (
                  <AssetRow
                    key={originalIndex}
                    row={row}
                    index={originalIndex}
                    formik={formik}
                    assets={assets}
                    tools={tools}
                    readOnly={readOnly}
                    onRemove={() => handleRemoveAsset(originalIndex)}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
