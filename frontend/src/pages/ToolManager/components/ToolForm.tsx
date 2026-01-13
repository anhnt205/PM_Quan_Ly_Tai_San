import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  InfoOutlineRounded,
  Visibility,
  VisibilityOff,
  Lock,
  Drafts,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import ToolType from "../../../data/ToolType.json";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import EditButton from "../../../components/Button/EditButton";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function ToolForm({
  onEdit,
  onCancel,
  selectedTool,
  readOnly,
  onSave,
  departments,
  toolTypes,
  allUnits,
  toolGroups,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedTool?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  departments: any[];
  toolTypes: any[];
  allUnits: any[];
  toolGroups: any[];
}) {
  const [expanded, setExpanded] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);
  const formik = useFormik({
    initialValues: {
      id: "",
      idDonVi: "",
      ten: "",
      ngayNhap: "",
      donViTinh: "",
      soLuong: 0,
      idNhomCCDC: "",
      giaTri: 0,
      soKyHieu: "",
      kyHieu: "",
      congSuat: "",
      nuocSanXuat: "",
      namSanXuat: 0,
      ghiChu: "",
      idCongTy: "ct001",
      ngayTao: "",
      ngayCapNhat: "",
      nguoiTao: "",
      nguoiCapNhat: user?.username || "",
      isActive: true,
      idLoaiCCDCCon: "",
      hienTrang: 0,
      chiTietTaiSanList: [],
      chiTietDonViSoHuuList: [],
    },
    onSubmit(values) {
      onSave({
        ...values,
        chiTietTaiSanList: values.chiTietTaiSanList.map(
          (item: any, index: number) => ({
            ...item,
            idDonVi: values.idDonVi,
            idTaiSan: values.id,
          })
        ),
      });
    },
  });
  useEffect(() => {
    if (selectedTool) {
      formik.setValues({
        ...selectedTool,
        chiTietTaiSanList: selectedTool.chiTietTaiSanList.map(
          (item: any, index: number) => ({
            ...item,
            stt: index + 1,
            isInserted: true,
          })
        ),
      });
    } else {
      formik.resetForm();
    }
  }, [selectedTool, readOnly]);

  useEffect(() => {
    const soLuong = formik.values.chiTietTaiSanList
      .filter((item: any) => !item?.isDeleted)
      .reduce((sum: number, item: any) => sum + Number(item.soLuong || 0), 0);
    formik.setFieldValue("soLuong", soLuong);
  }, [formik.values.chiTietTaiSanList]);
  return (
    <Accordion sx={{ background: "#f6f8f4ff" }} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ViewBtn expanded={expanded} setExpanded={setExpanded} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "none", // Ngăn không cho xoay
          },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết CCDC - Vật tư</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Box display="flex" gap={2}>
            {!readOnly && (
              <SaveBtn
                onSave={() => {
                  formik.submitForm();
                }}
              />
            )}
            {!readOnly && (
              <CancelBtn
                onClick={() => {
                  onCancel();
                }}
              />
            )}
            {readOnly && <EditButton onClick={onEdit} />}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 0,
              alignItems: "center",
              borderRadius: "8px",
              overflow: "visible",
              backgroundColor: "#F5F5F5",
              border: "2px solid",
              borderColor: "#B3E5FC",
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 28px",
                backgroundColor: !readOnly ? "#B3E5FC" : "transparent",
                color: !readOnly ? "#00695C" : "#BDBDBD",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "default",
                flex: 1,
                transition: "all 0.3s ease",
                borderRadius: "6px 0 0 6px",
                clipPath: !readOnly
                  ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
                  : "none",
                position: "relative",
                zIndex: !readOnly ? 2 : 1,
              }}
            >
              Nháp
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 28px",
                backgroundColor: readOnly ? "#B3E5FC" : "transparent",
                color: readOnly ? "#00695C" : "#BDBDBD",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "default",
                flex: 1,
                transition: "all 0.3s ease",
                borderRadius: "0 6px 6px 0",
                clipPath: readOnly
                  ? "polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)"
                  : "none",
                position: "relative",
                zIndex: readOnly ? 2 : 1,
              }}
            >
              Khóa
            </Box>
          </Box>
        </Box>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin CCDC - Vật tư</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Mã công cụ dụng cụ *"
                    formik={formik}
                    field="id"
                    disabled={Boolean(selectedTool)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên công cụ dụng cụ *"
                    formik={formik}
                    field="ten"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị tính *"
                    data={allUnits}
                    labelkey="tenDonVi"
                    field="donViTinh"
                    formik={formik}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị nhập"
                    data={departments}
                    labelkey="tenPhongBan"
                    field="idDonVi"
                    formik={formik}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="Ngày nhập"
                    formik={formik}
                    field="ngayTao"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Ghi chú"
                    formik={formik}
                    field="ghiChu"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Nhóm CCDC *"
                    data={toolGroups}
                    labelkey="ten"
                    formik={formik}
                    field="idNhomCCDC"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Loại CCDC *"
                    data={toolTypes}
                    labelkey="tenLoai"
                    formik={formik}
                    field="idLoaiCCDCCon"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số lượng"
                    type="number"
                    formik={formik}
                    field="soLuong"
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Giá trị *"
                    type="number"
                    formik={formik}
                    field="giaTri"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Ký hiệu"
                    formik={formik}
                    field="kyHieu"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Typography fontSize={14} py={2}>
            Chi tiết CCDC Vật tư:
          </Typography>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Số ký hiệu</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Công suất</TableCell>
                <TableCell>Nước sản xuất</TableCell>
                <TableCell>Năm sản xuất</TableCell>
                <TableCell width={50}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formik.values.chiTietTaiSanList
                .map((row: any, originalIndex) => ({ ...row, originalIndex }))
                .filter((row) => !row.isDeleted)
                .map((row) => (
                  <TableRow key={row.originalIndex}>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`chiTietTaiSanList.${row.originalIndex}.stt`}
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`chiTietTaiSanList.${row.originalIndex}.soKyHieu`}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`chiTietTaiSanList.${row.originalIndex}.soLuong`}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`chiTietTaiSanList.${row.originalIndex}.congSuat`}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`chiTietTaiSanList.${row.originalIndex}.nuocSanXuat`}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`chiTietTaiSanList.${row.originalIndex}.namSanXuat`}
                        disabled={readOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => {
                          formik.setFieldValue(
                            `chiTietTaiSanList.${row.originalIndex}.isDeleted`,
                            true
                          );
                          formik.setFieldValue(
                            `chiTietTaiSanList.${row.originalIndex}.isInserted`,
                            false
                          );
                        }}
                        disabled={readOnly}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            {!readOnly && (
              <Button
                startIcon={<Add />}
                onClick={() => {
                  formik.setFieldValue("chiTietTaiSanList", [
                    ...formik.values.chiTietTaiSanList,
                    {
                      stt: formik.values.chiTietTaiSanList.length + 1,
                      id: "",
                      idTaiSan: "",
                      ngayVaoSo: "",
                      ngaySuDung: "",
                      soKyHieu: "",
                      congSuat: "",
                      nuocSanXuat: "",
                      namSanXuat: 0,
                      soLuong: 0,
                      isInserted: true,
                    },
                  ]);
                }}
                variant="text"
              >
                Thêm một dòng
              </Button>
            )}
          </Table>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
