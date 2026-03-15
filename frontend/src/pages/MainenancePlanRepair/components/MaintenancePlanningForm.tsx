import { useState, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import {
  ArrowDropDown,
  ArrowDropUp,
  InfoOutlineRounded,
} from "@mui/icons-material";
import { useFormik } from "formik";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import EditButton from "../../../components/Button/EditButton";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import { MaintenancePlanData, MaintenancePlanWorkItem } from "../types";
import { MaintenancePlanValidation } from "../validation/Validation";
import { useDepartmentsPageQuery } from "../../Department/Mutation";
import dayjs from "dayjs";
import ThietBiBaoTriTable from "./tables/ThietBiBaoTriTable/ThietBiBaoTriTable";
import ChiTietCongViecTable from "./tables/ChiTietCongViecTable/ChiTietCongViecTable";
import {
  Action,
  CongTy,
  Devicetype,
  StatusPlan,
  StatusPlanType,
} from "../../../utils/const";
import FieldDate from "../../../components/TextField/FieldDate";
import { useAssetByDonViQuery } from "../../AssetTransfer/Mutation";
import { useToolByDepartmentPageQuery } from "../../ToolTransfer/Mutation";
import DialogLoading from "../../../components/common/DialogLoading";
import { useAllLoaiSCBDQuery } from "../../MaintenanceRepairType/Mutation";
import { useAllPlanTypeQuery } from "../../PlanType/Mutation";

interface MaintenancePlanningFormProps {
  onEdit: () => void;
  onClose: () => void;
  selectedPlan?: MaintenancePlanData | null;
  readOnly?: boolean;
  onSave: (data: MaintenancePlanData) => void;
  onCancel?: () => void;
  staffs?: any[];
}

export default function MaintenancePlanningForm({
  onEdit,
  onClose,
  selectedPlan,
  readOnly = false,
  onSave,
  onCancel,
  staffs = [],
}: MaintenancePlanningFormProps) {
  const [expanded, setExpanded] = useState(true);

  const formik = useFormik({
    initialValues: {
      id: "",
      idCongTy: CongTy.CT001,
      tenKeHoach: "",
      idLoaiKeHoach: "",
      idDonViGiao: "",
      idDonViThucHien: "",
      idNguoiPhuTrach: "",
      ngayBatDau: dayjs(new Date()).format("YYYY-MM-DD"),
      ngayKetThuc: dayjs(new Date()).format("YYYY-MM-DD"),
      ghiChu: "",
      congViecs: [] as MaintenancePlanWorkItem[],

      chiTietsTaiSan: [] as any[],
      chiTietsCCDC: [] as any[],
    },
    validationSchema: MaintenancePlanValidation,
    onSubmit: (values) => {
      const mappedCCDC = values.chiTietsCCDC.map((item) => ({
        ...item,
        tenVatTu: item.tenCCDC || item.ten || item.tenVatTu,
      }));

      const mergedChiTiets = [...values.chiTietsTaiSan, ...mappedCCDC];

      const payloadToSave: any = {
        ...values,
        chiTiets: mergedChiTiets,
      };

      delete payloadToSave.chiTietsTaiSan;
      delete payloadToSave.chiTietsCCDC;

      onSave(payloadToSave as MaintenancePlanData);
    },
  });

  const { data: allDepartments = { items: [] } } = useDepartmentsPageQuery(
    0,
    9999,
  );
  const { data: listLoaiKeHoach = [] } = useAllPlanTypeQuery();

  useEffect(() => {
    if (selectedPlan) {
      const taiSans = selectedPlan.danhSachTaiSan || [];
      const ccdcs = selectedPlan.danhSachVatTu || [];

      formik.setValues({
        ...formik.initialValues,
        ...selectedPlan,
        idLoaiKeHoach:
          selectedPlan.idLoaiKeHoach || (selectedPlan as any).loaiKeHoach || "",
        chiTietsTaiSan: taiSans.map((item: any) => ({
          ...item,
          action: Action.UPDATE,
          tenTaiSan: item.tenTaiSan || "",
        })),
        chiTietsCCDC: ccdcs.map((item: any) => ({
          ...item,
          action: Action.UPDATE,
          tenCCDC: item.tenVatTu || item.tenCCDC,
          idChiTietCCDC: item.idChiTietCCDC || item.idCCDC || item.id,
        })),
        congViecs: (selectedPlan.congViecs || []).map((item: any) => ({
          ...item,
          action: Action.UPDATE,
        })),
      });
    } else {
      formik.resetForm();
    }
  }, [selectedPlan]);

  const { data: toolsByDepartment = [], isLoading: isLoadingTool } =
    useToolByDepartmentPageQuery({
      departmentId: formik.values.idDonViThucHien,
    });

  const isCapPhat =
    allDepartments.items.find((i: any) => i.id === formik.values.idDonViGiao)
      ?.loaiKho === 1;
  const { data: allAssetsByDonVi = { items: [] }, isLoading: isLoadingAsset } =
    useAssetByDonViQuery(isCapPhat ? 1 : 2, formik.values.idDonViGiao);

  const listTaiSan = useMemo(
    () =>
      (allAssetsByDonVi.items || []).map((a: any) => ({
        ...a,
        ten: a.tenTaiSan || a.ten || "",
      })),
    [allAssetsByDonVi],
  );

  const listCCDC = useMemo(
    () =>
      (toolsByDepartment || []).map((t: any) => ({
        ...t,
        ten: t.tenDetailAsset || "",
      })),
    [toolsByDepartment],
  );

  return (
    <>
      <DialogLoading
        loading={isLoadingTool || isLoadingAsset}
        title="Đang tải tài sản/ccdc ..."
      />
      <Accordion sx={{ background: "#f6f8f4ff" }} expanded={expanded}>
        <AccordionSummary
          expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
              transform: "none", // Ngăn không cho xoay
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
            <Typography>
              {selectedPlan?.id
                ? "Chi tiết kế hoạch bảo trì - bảo dưỡng"
                : "Lập kế hoạch bảo trì - bảo dưỡng mới"}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {![StatusPlan.PROGRESS, StatusPlan.COMPLETED].includes(
            selectedPlan?.trangThai as StatusPlanType,
          ) && (
            <Box display="flex" gap={2}>
              {!readOnly && <SaveBtn onSave={formik.submitForm} />}
              {!readOnly && <CancelBtn onClick={onClose} />}
              {readOnly && <EditButton onClick={onEdit} />}
            </Box>
          )}

          {/* Thông tin cơ bản */}
          <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <InfoOutlineRounded color="primary" />
              <Typography>Thông tin kế hoạch</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldInput
                  title="Tên kế hoạch *"
                  formik={formik}
                  field="tenKeHoach"
                  disabled={readOnly}
                />
              </Grid>

              {/* Loại kế hoạch   */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Loại kế hoạch *"
                  data={listLoaiKeHoach}
                  labelkey="tenLoai"
                  formik={formik}
                  field="idLoaiKeHoach"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Đơn vị giao *"
                  data={allDepartments.items}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonViGiao"
                  disabled={readOnly}
                  onChange={(newValue) => {
                    formik.setFieldValue("chiTietsTaiSan", []);
                    formik.setFieldValue("chiTietsCCDC", []);
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Người phụ trách *"
                  data={staffs.filter(
                    (i) => i.phongBanId === formik.values.idDonViThucHien,
                  )}
                  labelkey="hoTen"
                  formik={formik}
                  field="idNguoiPhuTrach"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FieldAutoCompleted
                  title="Đơn vị thực hiện *"
                  data={allDepartments.items}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonViThucHien"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldDate
                  title="Ngày bắt đầu *"
                  formik={formik}
                  field="ngayBatDau"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FieldDate
                  title="Ngày kết thúc *"
                  formik={formik}
                  field="ngayKetThuc"
                  disabled={readOnly}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FieldInput
                  title="Ghi chú"
                  formik={formik}
                  field="ghiChu"
                  disabled={readOnly}
                  slotProps={{
                    input: { multiline: true, rows: 3 },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Danh sách thiết bị / CCDC */}
          <ThietBiBaoTriTable
            formik={formik}
            readOnly={readOnly}
            taiSans={listTaiSan}
            ccdcs={listCCDC}
          />

          {/* Chi tiết công việc */}
          <ChiTietCongViecTable
            formik={formik}
            readOnly={readOnly}
            staffs={staffs}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
