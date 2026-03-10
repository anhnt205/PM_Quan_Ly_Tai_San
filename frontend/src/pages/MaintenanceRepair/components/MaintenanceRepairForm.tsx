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
  TextField,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import ViewBtn from "../../../components/Button/ViewBtn";
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  Cancel,
  Visibility,
} from "@mui/icons-material";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FileAttachmentInput from "../../../components/TextField/FileAttachmentInput";
import CustomStepper from "../../../components/common/CustomStepper";
import { useAllLoaiSCBDQuery } from "../../MaintenanceRepairType/Mutation";
import { CongTy, Devicetype, StatusPlan } from "../../../utils/const";
import dayjs from "dayjs";
import FieldDate from "../../../components/TextField/FieldDate";
import {
  useMaintenancePlanningMutation,
  useMaintenancePlanningPageQuery,
} from "../../MainenancePlanRepair/Mutation";
import { generateBangKePdf, mergeBangKeWithOriginalPdf } from "../config";
import S3Service from "../../../services/S3Service";
import SignDocumentForm from "./SignDocumentForm";
import { useAssetByDonViQuery } from "../../AssetTransfer/Mutation";
import { useToolByDepartmentPageQuery } from "../../ToolTransfer/Mutation";
import DialogLoading from "../../../components/common/DialogLoading";
import { MaintenanceRepairData } from "../types";
import { generateCode } from "../../../utils/helpers";
import { MaintenanceValidation } from "../validation/Validation";
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

export default function MaintenanceRepairForm({
  onEdit,
  onClose,
  selectedRepair,
  readOnly,
  onSave,
  onCancel,
  departments,
  staffs,
  allUnits,
  allCurrentStatus,
}: {
  onEdit: () => void;
  onClose: () => void;
  selectedRepair?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  onCancel: () => void;
  departments: any[];
  staffs: any[];
  allUnits: any[];
  allCurrentStatus: any[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [document, setDocument] = useState<File | string | any>("");
  const [selectedPlanRawChiTiets, setSelectedPlanRawChiTiets] = useState<any[]>(
    [],
  );
  const [chiTietKeHoach, setChiTietKeHoach] = useState<any[]>([]);

  const { data: MaintenancePlanningPage = { items: [] } } =
    useMaintenancePlanningPageQuery(0, 9999, undefined, StatusPlan.PENDING);
  const { data: maintenanceRepairTypes = [] } = useAllLoaiSCBDQuery();
  const { getPlanningDetailMutation } = useMaintenancePlanningMutation();

  const currentStatus = selectedRepair?.trangThai ?? 0;

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      idKeHoach: "",
      maSuaChua: "",
      tenSuaChua: "",
      loaiDoiTuong: "",
      idLoaiSuaChua: "",
      idDonViGiao: "",
      idDonViNhan: "",
      idNguoiKyNhay: "",
      trangThaiKyNhay: false,
      nguoiLapPhieuKyNhay: false,
      ngayKetThucDuKien: dayjs(new Date()).format("YYYY-MM-DD"),
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
      daBanGiao: false,
      coPhieuBanGiao: false,
      taiLieuCuoi: "",
      loai: 0,
      tenDonViGiao: "",
      tenDonViNhan: "",
      tenDonViDeNghi: "",
      tenNguoiKyNhay: "",
      tenTrinhDuyetCapPhong: "",
      tenTrinhDuyetGiamDoc: "",
      trangThai: 0,
      ghiChu: "",
      nguoiKyList: [] as any[],
      initialChiTiet: [] as any[],
      chiTietSuaChuas: [
        {
          id: "",
          idSuaChua: "",
          tenTaiSan: null,
          idTaiSan: null,
          idCCDC: null,
          idChiTietCCDC: null,
          soLuong: 0,
          ghiChu: "",
          isActive: true,
          hienTrang: "",
          moTa: "",
        },
      ],
    },
    validationSchema: MaintenanceValidation,
    onSubmit: async (values) => {
      const chiTietSuaChuas = values.chiTietSuaChuas.map((item, index) => ({
        ...item,
        id: `${generateCode("CTSC-")}-${index}`,
      }));
      const nguoiKyList = values.nguoiKyList.map((item: any, index) => ({
        ...item,
        id: `${generateCode("SIG-")}-${index}`,
        idTaiLieu: values.id,
      }));
      const bangKeBytes = await generateBangKePdf(
        values.chiTietSuaChuas,
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
          name: `SCBD_${values.tenSuaChua}.pdf`,
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
        chiTietSuaChuas,
        duongDanFile: keyTailieu,
        taiLieuCuoi: keyTaiLieuCuoi,
      });
    },
  });

  useEffect(() => {
    if (selectedRepair) {
      // 1. Tạo hàm async
      const fetchAndSetData = async () => {
        // 2. Sử dụng mutateAsync để có thể await lấy dữ liệu
        try {
          const data = await getPlanningDetailMutation.mutateAsync(
            selectedRepair.idKeHoach,
          );
          console.log(data);
          setSelectedPlanRawChiTiets(data || []);
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết kế hoạch:", error);
        }
        formik.setValues({
          ...formik.initialValues,
          ...selectedRepair,
          initialChiTiet: (selectedRepair.chiTietSuaChuas || []).map(
            (i: any) => i.id,
          ),
        });
        setDocument(selectedRepair.taiLieuCuoi || "");
      };

      // 3. GỌI HÀM NÀY
      fetchAndSetData();
    } else {
      formik.resetForm();
      setDocument("");
      setSelectedPlanRawChiTiets([]);
    }
  }, [selectedRepair]);

  const [nvThamMuu, setNVThamMuu] = useState<any[]>([]);
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

  // Assets & Tools for planning
  const { data: toolsByDepartment = [], isLoading: isLoadingTool } =
    useToolByDepartmentPageQuery({
      departmentId: formik.values.idDonViGiao,
    });
  const {
    data: allAssetsByDonVi = { items: [] },
    isFetching,
    isLoading: isLoadingAsset,
  } = useAssetByDonViQuery(2, formik.values.idDonViGiao);
  const allEquipment = useMemo(
    () => [
      ...allAssetsByDonVi.items.map((a: any) => ({
        ...a,
        ten: a.tenTaiSan || a.ten || "",
        type: Devicetype.ASSET,
      })),
      ...toolsByDepartment.map((t: any) => ({
        ...t,
        ten: t.ten || t.tenDetailAsset || "",
        type: Devicetype.TOOL,
      })),
    ],
    [toolsByDepartment, allAssetsByDonVi],
  );

  // useEffect to populate chiTietSuaChuas when allEquipment is loaded
  useEffect(() => {
    if (
      selectedPlanRawChiTiets.length > 0 &&
      allEquipment.length > 0 &&
      formik.values.loaiDoiTuong
    ) {
      const loaiDoiTuong = formik.values.loaiDoiTuong;
      const populatedDetails = selectedPlanRawChiTiets.map((chiTiet: any) => {
        let equipmentInfo = null;
        let equipmentIdToSearch = "";

        if (loaiDoiTuong === Devicetype.ASSET) {
          equipmentIdToSearch = chiTiet.idTaiSan;
          equipmentInfo = allEquipment.find(
            (eq: any) =>
              eq.id === equipmentIdToSearch && eq.type === Devicetype.ASSET,
          );
        } else if (loaiDoiTuong === Devicetype.TOOL) {
          equipmentIdToSearch = chiTiet.idChiTietCCDC;
          equipmentInfo = allEquipment.find(
            (eq: any) =>
              eq.id === equipmentIdToSearch && eq.type === Devicetype.TOOL,
          );
        }

        return {
          id: "", // This will be generated on save
          idSuaChua: "",
          ten: equipmentInfo?.ten || "",
          idTaiSan:
            equipmentInfo?.type === Devicetype.ASSET ? equipmentInfo?.id : null,
          idCCDC:
            equipmentInfo?.type === Devicetype.TOOL
              ? equipmentInfo?.idCCDCVatTu || chiTiet.idCCDC
              : null,
          idChiTietCCDC:
            equipmentInfo?.type === Devicetype.TOOL ? equipmentInfo?.id : null,
          soLuong: equipmentInfo?.soLuong || chiTiet.soLuong || 1,
          ghiChu: equipmentInfo?.ghiChu || chiTiet.ghiChu || "",
          isActive: true,
          hienTrang: equipmentInfo?.hienTrang || chiTiet.hienTrang || "",
          moTa: equipmentInfo?.moTa || chiTiet.moTa || "",
          daBanGiao: true,
          donViTinh: equipmentInfo?.donViTinh || chiTiet.donViTinh || "",
        };
      });
      // formik.setFieldValue("chiTietSuaChuas", populatedDetails);
      setChiTietKeHoach(
        populatedDetails
          .filter((item: any) => item.idTaiSan || item.idChiTietCCDC)
          .map((item: any) => ({
            ...item,
            id:
              loaiDoiTuong === Devicetype.TOOL
                ? item?.idChiTietCCDC
                : item?.idTaiSan,
          })),
      );
    }
  }, [selectedPlanRawChiTiets, allEquipment.length]);

  return (
    <>
      <DialogLoading
        loading={isLoadingTool || isLoadingAsset}
        title="Đang tải tài sản/ccdc ..."
      />
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
          assetTransferDetail={formik.values.chiTietSuaChuas}
          ghiChu={formik.values.ghiChu}
          allUnits={allUnits}
          allCurrentStatus={allCurrentStatus}
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
            <Typography>Chi tiết phiếu sửa chữa bảo dưỡng</Typography>
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
              {[0].includes(currentStatus) && (
                <Box display="flex" gap={2}>
                  {!readOnly && <SaveBtn onSave={formik.submitForm} />}
                  {!readOnly && <CancelBtn onClick={onClose} />}
                  {readOnly && <EditButton onClick={onEdit} />}
                </Box>
              )}
              {![0, 2, 3].includes(currentStatus) && (
                <Button
                  size="small"
                  sx={{ bgcolor: "red", color: "white" }}
                  startIcon={<Cancel />}
                  onClick={onCancel}
                >
                  Hủy phiếu
                </Button>
              )}
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
                  {readOnly && (
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
                      field="tenSuaChua"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Kế hoạch *"
                      labelkey="tenKeHoach"
                      data={MaintenancePlanningPage.items}
                      formik={formik}
                      field="idKeHoach"
                      onChange={async (value) => {
                        formik.setFieldValue(
                          "loaiDoiTuong",
                          value.loaiDoiTuong,
                        );
                        formik.setFieldValue(
                          "idDonViNhan",
                          value.idDonViThucHien,
                        );
                        setChiTietKeHoach([]);
                        setSelectedPlanRawChiTiets(value?.chiTiets || []);
                        formik.setFieldValue("chiTietSuaChuas", []);
                      }}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Loại sửa chữa *"
                      labelkey="ten"
                      data={maintenanceRepairTypes}
                      formik={formik}
                      field="idLoaiSuaChua"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị giao *"
                      labelkey="tenPhongBan"
                      data={departments}
                      formik={formik}
                      field="idDonViGiao"
                      onChange={() => {
                        setChiTietKeHoach([]);
                        formik.setFieldValue("chiTietSuaChuas", []);
                      }}
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldAutoCompleted
                      title="Đơn vị nhận *"
                      labelkey="tenPhongBan"
                      data={departments}
                      formik={formik}
                      field="idDonViNhan"
                      disabled={readOnly}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FieldDate
                      title="Ngày kết thúc dự kiến *"
                      formik={formik}
                      field="ngayKetThucDuKien"
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

            {/* CHI TIẾT TÀI SẢN */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Chi tiết tài sản sửa chữa bảo dưỡng:
              </Typography>
              {/* TOGGLE TÀI SẢN / CCDC */}
              {/* <Box mb={2}>
                          <ToggleButtonGroup
                            value={activeDetailTab}
                            exclusive
                            onChange={(_, val) => {
                              if (val) setActiveDetailTab(val);
                            }}
                            size="small"
                            disabled={readOnly}
                            sx={{
                              bgcolor: "#f0f0f0",
                              borderRadius: "20px",
                              p: "3px",
                              gap: "2px",
                              "& .MuiToggleButtonGroup-grouped": {
                                border: "none",
                                borderRadius: "16px !important",
                              },
                            }}
                          >
                            <ToggleButton
                              value="taisan"
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                px: 2.5,
                                py: 0.5,
                                borderRadius: "16px",
                                color: "text.secondary",
                                "&.Mui-selected": {
                                  bgcolor: "white",
                                  color: "success.main",
                                  fontWeight: 600,
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                                  "&:hover": { bgcolor: "white" },
                                },
                                "&:hover": { bgcolor: "transparent" },
                              }}
                            >
                              Tài sản
                            </ToggleButton>
                            <ToggleButton
                              value="ccdc"
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                px: 2.5,
                                py: 0.5,
                                borderRadius: "16px",
                                color: "text.secondary",
                                "&.Mui-selected": {
                                  bgcolor: "white",
                                  color: "success.main",
                                  fontWeight: 600,
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                                  "&:hover": { bgcolor: "white" },
                                },
                                "&:hover": { bgcolor: "transparent" },
                              }}
                            >
                              CCDC - Vật tư
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box> */}
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
                    <CustomTableHeadCell width="5%">STT</CustomTableHeadCell>
                    <CustomTableHeadCell width="25%">
                      {formik.values.loaiDoiTuong === Devicetype.ASSET
                        ? "Tài sản"
                        : "CCDC - Vật tư"}
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="15%">
                      Đơn vị tính
                    </CustomTableHeadCell>
                    <CustomTableHeadCell width="15%">
                      Số lượng
                    </CustomTableHeadCell>
                    {/* <CustomTableHeadCell width="20%">
                                Trạng thái
                              </CustomTableHeadCell> */}
                    <CustomTableHeadCell width="20%">
                      Ghi chú
                    </CustomTableHeadCell>
                    {!readOnly && (
                      <CustomTableHeadCell width="5%"></CustomTableHeadCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.chiTietSuaChuas.map((row, index) => (
                    <TableRow key={index}>
                      <CustomTableCell>{index + 1}</CustomTableCell>
                      <CustomTableCell>
                        <FieldAutoCompleted
                          title={
                            formik.values.loaiDoiTuong === Devicetype.ASSET
                              ? "Chọn thiết bị tài sản"
                              : "Chọn thiết bị ccdc"
                          }
                          data={chiTietKeHoach}
                          labelkey="ten"
                          formik={formik}
                          limitOptions={20}
                          field={
                            formik.values.loaiDoiTuong === Devicetype.TOOL
                              ? `chiTietSuaChuas[${index}].idChiTietCCDC`
                              : `chiTietSuaChuas[${index}].idTaiSan`
                          }
                          onChange={(value) => {
                            formik.setFieldValue(
                              `chiTietSuaChuas.${index}.donViTinh`,
                              value?.donViTinh,
                            );
                            formik.setFieldValue(
                              `chiTietSuaChuas.${index}.ten`,
                              value?.ten,
                            );
                            formik.setFieldValue(
                              `chiTietSuaChuas.${index}.soLuong`,
                              value?.soLuong,
                            );
                            formik.setFieldValue(
                              `chiTietSuaChuas.${index}.idCCDC`,
                              value?.idCCDC,
                            );
                            formik.setFieldValue(
                              `chiTietSuaChuas.${index}.moTa`,
                              value?.moTa,
                            );
                            formik.setFieldValue(
                              `chiTietSuaChuas.${index}.ghiChu`,
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
                          field={`chiTietSuaChuas.${index}.donViTinh`}
                          disabled={readOnly}
                        />
                      </CustomTableCell>
                      <CustomTableCell>
                        <FieldInput
                          title=""
                          type="number"
                          formik={formik}
                          field={`chiTietSuaChuas.${index}.soLuong`}
                          disabled={true}
                        />
                      </CustomTableCell>
                      {/* <CustomTableCell>
                                    <FieldInput
                                      title=""
                                      formik={formik}
                                      field={`chiTietSuaChuas.${index}.hienTrang`}
                                      disabled={readOnly}
                                    />
                                  </CustomTableCell> */}
                      <CustomTableCell>
                        <FieldInput
                          title=""
                          formik={formik}
                          field={`chiTietSuaChuas.${index}.ghiChu`}
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
                                ...formik.values.chiTietSuaChuas,
                              ];
                              newAssets.splice(index, 1);
                              formik.setFieldValue(
                                "chiTietSuaChuas",
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
                      formik.setFieldValue("chiTietSuaChuas", [
                        ...formik.values.chiTietSuaChuas,
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
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Chi tiết sửa chữa bảo dưỡng khác:
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                label="Ghi chú"
                value={formik.values.ghiChu}
                onChange={(e) => formik.setFieldValue("ghiChu", e.target.value)}
                disabled={readOnly}
              />
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
