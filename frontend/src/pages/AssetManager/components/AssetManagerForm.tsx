import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  Delete,
  InfoOutlineRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import EditButton from "../../../components/Button/EditButton";
import { findById } from "../../../utils/helpers";
import { useAssetByTypeQuery, useCountriesQuery } from "../Mutation";
import { useAllTypeAssetByGroupQuery } from "../../TypeAsset/Mutation";
import { useAllProjectsQuery } from "../../Project/Mutation";
import dayjs from "dayjs";

export default function AssetManagerForm({
  onEdit,
  onCancel,
  selectedAsset,
  readOnly,
  onSave,
  allAssetModel,
  allCurrentStatus,
  assetGroups,
  allDepartments,
  allUnits,
  allReasonIncreases,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedAsset?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  allAssetModel: any[];
  allCurrentStatus: any[];
  assetGroups: any[];
  allDepartments: any[];
  allUnits: any[];
  allReasonIncreases: any[];
}) {
  const [expanded, setExpanded] = useState(true);

  const formik = useFormik({
    initialValues: {
      id: "",
      idLoaiTaiSan: "",
      tenTaiSan: "",
      nguyenGia: 0,
      giaTriKhauHaoBanDau: 0,
      kyKhauHaoBanDau: 0,
      giaTriThanhLy: 0,
      idMoHinhTaiSan: "",
      phuongPhapKhauHao: 0,
      soKyKhauHao: 0,
      taiKhoanTaiSan: 0,
      taiKhoanKhauHao: 0,
      taiKhoanChiPhi: 0,
      idNhomTaiSan: "",
      ngayVaoSo: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      ngaySuDung: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      idDuDan: "",
      idNguonVon: "",
      kyHieu: "",
      soKyHieu: "",
      congSuat: "",
      nuocSanXuat: "",
      namSanXuat: 0,
      lyDoTang: "",
      hienTrang: 0,
      soLuong: 1,
      donViTinh: "",
      ghiChu: "",
      idDonViBanDau: "K30",
      idDonViHienThoi: "",
      moTa: "",
      idCongTy: "ct001",
      ngayTao: "",
      ngayCapNhat: "",
      nguoiTao: "",
      nguoiCapNhat: "",
      isActive: true,
      isTaiSanCon: false,
      idLoaiTaiSanCon: "",
      soThe: "",
      nvNS: 0,
      vonVay: 0,
      vonKhac: 0,
      taiSanConList: [
        {
          id: "",
          idTaiSanCha: "",
          idTaiSanCon: "",
          ngayTao: "",
          ngayCapNhat: "",
          nguoiTao: "",
          nguoiCapNhat: "",
          isActive: true,
          donViTinh: "",
          soLuong: 0,
          hienTrang: "",
          ghiChu: "",
          isDeleted: false,
          isInsert: true,
        },
      ],
    },
    onSubmit(values) {
      onSave({
        ...values,
        idLoaiTaiSan: values.idNhomTaiSan,
        moTa: values?.moTa,
        taiSanConList: values.taiSanConList.map((item: any) => ({
          ...item,
          idTaiSanCha: values.id,
        })),
      });
    },
  });

  const { data: assetsByType = [] } = useAssetByTypeQuery(
    formik.values.idNhomTaiSan,
  );
  const { data: countries = [] } = useCountriesQuery();
  const { data: typeAssetsByAssetGroup = [] } = useAllTypeAssetByGroupQuery(
    formik.values.idNhomTaiSan,
  );
  const { data: allProjects = [] } = useAllProjectsQuery();

  useEffect(() => {
    if (selectedAsset) {
      const enrichedTaiSanConList =
        selectedAsset.taiSanConList?.map((item: any) => ({
          ...item,
          donViTinh: findById(assetsByType, item.idTaiSanCon)?.donViTinh,
          soLuong: findById(assetsByType, item.idTaiSanCon)?.soLuong,
          hienTrang: findById(assetsByType, item.idTaiSanCon)?.hienTrang || -1,
          ghiChu: findById(assetsByType, item.idTaiSanCon)?.ghiChu,
          isDeleted: false,
          isInsert: true,
        })) || [];

      formik.setValues({
        ...selectedAsset,
        idDuDan: selectedAsset.idDuAn,
        taiSanConList: enrichedTaiSanConList,
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, assetsByType.length]);

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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          <Typography>Chi tiết tài sản</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" gap={2}>
          {!readOnly && <SaveBtn onSave={formik.submitForm} />}
          {!readOnly && <CancelBtn onClick={onCancel} />}
          {readOnly && <EditButton onClick={onEdit} />}
        </Box>
        <Paper sx={{ mt: 2, p: 2, borderRadius: "12px" }}>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <InfoOutlineRounded color="primary" />
            <Typography>Thông tin tài sản</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số thẻ tài sản *"
                    formik={formik}
                    field="soThe"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Mã tài sản *"
                    formik={formik}
                    field="id"
                    disabled={Boolean(selectedAsset)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên tài sản *"
                    formik={formik}
                    field="tenTaiSan"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Nguyên giá tài sản"
                    type="number"
                    formik={formik}
                    field="nguyenGia"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Giá trị khấu hao ban đầu"
                    type="number"
                    formik={formik}
                    field="giaTriKhauHaoBanDau"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Kỳ khấu hao ban đầu"
                    type="number"
                    formik={formik}
                    field="kyKhauHaoBanDau"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Giá trị thanh lý"
                    type="number"
                    formik={formik}
                    field="giaTriThanhLy"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Mô hình tài sản"
                    data={allAssetModel}
                    labelkey="tenMoHinh"
                    formik={formik}
                    field="idMoHinhTaiSan"
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "phuongPhapKhauHao",
                        newValue?.phuongPhapKhauHao,
                      );
                      formik.setFieldValue(
                        "soKyKhauHao",
                        newValue?.kyKhauHao ?? 0,
                      );
                      formik.setFieldValue(
                        "taiKhoanTaiSan",
                        newValue?.taiKhoanTaiSan,
                      );
                      formik.setFieldValue(
                        "taiKhoanChiPhi",
                        newValue?.taiKhoanChiPhi,
                      );
                      formik.setFieldValue(
                        "taiKhoanKhauHao",
                        newValue?.taiKhoanKhauHao,
                      );
                    }}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Phương pháp khấu hao"
                    value={
                      formik.values.phuongPhapKhauHao === 1
                        ? "Đường thẳng"
                        : "Khác"
                    }
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số kỳ khấu hao"
                    formik={formik}
                    field="soKyKhauHao"
                    InputLabelProps={{
                      shrink: true, // Giúp label luôn nhảy lên trên
                    }}
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tài khoản tài sản"
                    formik={formik}
                    field="taiKhoanTaiSan"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tài khoản khấu hao"
                    formik={formik}
                    field="taiKhoanKhauHao"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tài khoản chi phí"
                    formik={formik}
                    field="taiKhoanChiPhi"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Nhóm tài sản *"
                    data={assetGroups}
                    labelkey="tenNhom"
                    formik={formik}
                    field="idNhomTaiSan"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Loại tài sản"
                    data={typeAssetsByAssetGroup}
                    labelkey="tenLoai"
                    formik={formik}
                    field="idLoaiTaiSanCon"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="Ngày vào sổ"
                    formik={formik}
                    field="ngayVaoSo"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldDateTime
                    title="Ngày sử dụng"
                    formik={formik}
                    field="ngaySuDung"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Dự án"
                    data={allProjects}
                    labelkey="tenDuAn"
                    formik={formik}
                    field="idDuDan"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn NS"
                    type="number"
                    formik={formik}
                    field="nvNS"
                    disabled={readOnly}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "nguyenGia",
                        Number(formik.values.vonVay ?? 0) +
                          Number(formik.values.vonKhac ?? 0) +
                          Number(newValue ?? 0),
                      );
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn vay"
                    type="number"
                    formik={formik}
                    field="vonVay"
                    disabled={readOnly}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "nguyenGia",
                        Number(newValue ?? 0) +
                          Number(formik.values.vonKhac ?? 0) +
                          Number(formik.values.nvNS ?? 0),
                      );
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn khác"
                    type="number"
                    formik={formik}
                    field="vonKhac"
                    disabled={readOnly}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        "nguyenGia",
                        Number(formik.values.vonVay ?? 0) +
                          Number(newValue ?? 0) +
                          Number(formik.values.nvNS ?? 0),
                      );
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Mã hiệu"
                    formik={formik}
                    field="kyHieu"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số mã hiệu"
                    formik={formik}
                    field="soKyHieu"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Công suất"
                    formik={formik}
                    field="congSuat"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    disabled={readOnly}
                    fullWidth
                    options={countries}
                    getOptionLabel={(option: any) => option.niceName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.niceName === value.niceName
                    }
                    value={
                      countries.find(
                        (i: any) => i.niceName === formik.values.nuocSanXuat,
                      ) || null
                    }
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      formik.setFieldValue("nuocSanXuat", newValue?.niceName);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Nước sản xuất"}
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Năm sản xuất"
                    type="number"
                    formik={formik}
                    field="namSanXuat"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Lý do tăng"
                    data={allReasonIncreases}
                    labelkey="ten"
                    formik={formik}
                    field="lyDoTang"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Hiện trạng"
                    data={allCurrentStatus}
                    labelkey="tenHTKT"
                    formik={formik}
                    field="hienTrang"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số lượng"
                    type="number"
                    formik={formik}
                    field="soLuong"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị tính"
                    data={allUnits}
                    labelkey="tenDonVi"
                    formik={formik}
                    field="donViTinh"
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

                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Kho"
                    data={allDepartments.filter(
                      (i) => i.id?.toLocaleLowerCase() === "k30",
                    )}
                    labelkey="tenPhongBan"
                    formik={formik}
                    field="idDonViBanDau"
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Đơn vị hiện thời"
                    data={allDepartments.filter((i) => !i.isKho)}
                    labelkey="tenPhongBan"
                    formik={formik}
                    field="idDonViHienThoi"
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {formik.values.donViTinh.toLocaleLowerCase() === "ht" && (
            <Box>
              <Typography fontSize={14} py={2}>
                Chi tiết tài sản con:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "25%" }}>Tài sản</TableCell>
                    <TableCell sx={{ width: "15%" }}>Đơn vị tính</TableCell>
                    <TableCell sx={{ width: "20%" }}>Số lượng</TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      Tình trạng kỹ thuật
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>Ghi chú</TableCell>
                    <TableCell width={50}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {formik.values.taiSanConList
                    .map((row, originalIndex) => ({ ...row, originalIndex }))
                    .filter((row) => !row.isDeleted)
                    .map((row) => (
                      <TableRow key={row.id || row.originalIndex}>
                        <TableCell>
                          <FieldAutoCompleted
                            title=""
                            data={assetsByType}
                            labelkey="tenTaiSan"
                            formik={formik}
                            field={`taiSanConList.${row.originalIndex}.idTaiSanCon`}
                            disabled={readOnly}
                            onChange={(val) => {
                              if (val) {
                                // formik.setFieldValue(
                                //   `taiSanConList.${row.originalIndex}.idTaiSanCon`,
                                //   val?.id,
                                // );

                                formik.setFieldValue(
                                  `taiSanConList.${row.originalIndex}.isActive`,
                                  val.isActive,
                                );

                                formik.setFieldValue(
                                  `taiSanConList.${row.originalIndex}.soLuong`,
                                  val.soLuong,
                                );
                                formik.setFieldValue(
                                  `taiSanConList.${row.originalIndex}.donViTinh`,
                                  val.donViTinh,
                                );
                                formik.setFieldValue(
                                  `taiSanConList.${row.originalIndex}.hienTrang`,
                                  val.hienTrang,
                                );
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={findById(allUnits, row.donViTinh)?.tenDonVi}
                            disabled
                          />
                        </TableCell>

                        <TableCell>
                          <FieldInput
                            type="number"
                            formik={formik}
                            field={`taiSanConList.${row.originalIndex}.soLuong`}
                            disabled
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={
                              findById(allCurrentStatus, row.hienTrang)?.tenHTKT
                            }
                            disabled
                          />
                        </TableCell>

                        <TableCell>
                          <FieldInput
                            formik={formik}
                            field={`taiSanConList.${row.originalIndex}.ghiChu`}
                            disabled
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => {
                              formik.setFieldValue(
                                `taiSanConList.${row.originalIndex}.isDeleted`,
                                true,
                              );
                              formik.setFieldValue(
                                `taiSanConList.${row.originalIndex}.isInsert`,
                                false,
                              );
                            }}
                            disabled={readOnly}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!readOnly && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        {" "}
                        {/* colSpan bằng tổng số cột của bạn */}
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => {
                            formik.setFieldValue("taiSanConList", [
                              ...formik.values.taiSanConList,
                              {
                                id: "",
                                idTaiSanCha: "",
                                idTaiSanCon: "",
                                isActive: true,
                                isDeleted: false,
                                isInsert: true,
                              },
                            ]);
                          }}
                          variant="text"
                        >
                          Thêm một dòng
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
