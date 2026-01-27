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
  Checkbox,
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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SaveBtn from "../../../components/Button/SaveBtn";
import CancelBtn from "../../../components/Button/CancelBtn";
import FieldInput from "../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import ViewBtn from "../../../components/Button/ViewBtn";
import FieldAutoCompleted from "../../../components/TextField/FieldAutoCompleted";
import FieldDateTime from "../../../components/TextField/FieldDateTime";
import EditButton from "../../../components/Button/EditButton";
import { findById } from "../../../utils/helpers";

export default function AssetManagerForm({
  onEdit,
  onCancel,
  selectedAsset,
  readOnly,
  onSave,
  allAssetModel,
  allCurrentStatus,
  assetGroups,
  allProjects,
  allDepartments,
  typeAssetsByAssetGroup,
  assetsByType,
  allUnits,
  allReasonIncreases,
  countries,
  setSelectedAssetGroup,
}: {
  onEdit: () => void;
  onCancel: () => void;
  selectedAsset?: any;
  readOnly?: boolean;
  onSave: (values: any) => void;
  allAssetModel: any[];
  allCurrentStatus: any[];
  assetGroups: any[];
  allProjects: any[];
  allDepartments: any[];
  typeAssetsByAssetGroup: [];
  assetsByType: any[];
  allUnits: any[];
  allReasonIncreases: any[];
  countries: any[];
  setSelectedAssetGroup: Dispatch<SetStateAction<string>>;
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
      ngayVaoSo: "",
      ngaySuDung: "",
      idDuDan: "",
      idNguonVon: "",
      kyHieu: "",
      soKyHieu: "",
      congSuat: "",
      nuocSanXuat: "",
      namSanXuat: 0,
      lyDoTang: "",
      hienTrang: 0,
      soLuong: 0,
      donViTinh: "",
      ghiChu: "",
      idDonViBanDau: "",
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
          moTa: "",
          isDeleted: false,
          isInsert: true,
        },
      ],
    },
    onSubmit(values) {
      onSave({
        ...values,
        idLoaiTaiSan: values.idNhomTaiSan,
        taiSanConList: values.taiSanConList.map((item: any) => ({
          ...item,
          idTaiSanCha: values.id,
        })),
      });
    },
  });
  // Set or reset the whole form when the selected asset changes only.
  useEffect(() => {
    if (selectedAsset) {
      // When editing an existing asset, initialize the form values.
      const enrichedTaiSanConList =
        selectedAsset.taiSanConList?.map((item: any) => ({
          ...item,
          isDeleted: false,
        })) || [];

      formik.setValues({
        ...selectedAsset,
        idDuDan: selectedAsset.idDuAn,
        taiSanConList: enrichedTaiSanConList,
      });
    } else {
      // Only reset when selectedAsset specifically becomes null (e.g., opening "New").
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  // When dependent reference data change (units, current status, assetsByType)
  // and we're editing an asset, update only the `taiSanConList` entries
  // to enrich display fields without resetting the entire form.
  useEffect(() => {
    if (!selectedAsset) return;

    const enrichedTaiSanConList =
      formik.values.taiSanConList?.map((item: any) => {
        const assetDetail = assetsByType.find((a) => a.id === item.idTaiSanCon);
        const unit = findById(allUnits, assetDetail?.donViTinh);
        const status = findById(allCurrentStatus, assetDetail?.hienTrang);

        return {
          ...item,
          donViTinh: unit ? unit.tenDonVi : "",
          hienTrang: status ? status.tenHTKT : "",
          soLuong: item.soLuong || assetDetail?.soLuong || 0,
          moTa: item.moTa || assetDetail?.ghiChu || "",
          isDeleted: false,
        };
      }) || [];

    formik.setFieldValue("taiSanConList", enrichedTaiSanConList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsByType, allUnits, allCurrentStatus]);

  useEffect(() => {
    if (formik.values.idNhomTaiSan) {
      setSelectedAssetGroup(formik.values.idNhomTaiSan);
    }
  }, [formik.values.idNhomTaiSan]);
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
                    disabled={readOnly}
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
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Phương pháp khấu hao"
                    formik={formik}
                    field="phuongPhapKhauHao"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Số kỳ khấu hao"
                    type="number"
                    formik={formik}
                    field="soKyKhauHao"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên tài sản"
                    formik={formik}
                    field="tenTaiSan"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tên khoản khấu hao"
                    formik={formik}
                    field="taiKhoanKhauHao"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Tài khoản chi phí"
                    formik={formik}
                    field="taiKhoanChiPhi"
                    disabled={readOnly}
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
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn vay"
                    type="number"
                    formik={formik}
                    field="vonVay"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldInput
                    title="Vốn khác"
                    type="number"
                    formik={formik}
                    field="vonKhac"
                    disabled={readOnly}
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
                    disabled={readOnly}
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
                    field="moTa"
                    disabled={readOnly}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FieldAutoCompleted
                    title="Kho"
                    data={allDepartments.filter((i) => i.id === "K30")}
                    labelkey="tenPhongBan"
                    formik={formik}
                    field="idDonViBanDau"
                    disabled={readOnly}
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
          <Typography fontSize={14} py={2}>
            Chi tiết tài sản con:
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "25%" }}>Tài sản</TableCell>
                <TableCell sx={{ width: "15%" }}>Đơn vị tính</TableCell>
                <TableCell sx={{ width: "20%" }}>Số lượng</TableCell>
                <TableCell sx={{ width: "20%" }}>Tình trạng kỹ thuật</TableCell>
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
                        field={`taiSanConList.${row.originalIndex}.id`}
                        disabled={readOnly}
                        onChange={(val) => {
                          if (val) {
                            formik.setFieldValue(
                              `taiSanConList.${row.originalIndex}.idTaiSanCon`,
                              val?.id,
                            );

                            formik.setFieldValue(
                              `taiSanConList.${row.originalIndex}.isActive`,
                              val.isActive,
                            );

                            formik.setFieldValue(
                              `taiSanConList.${row.originalIndex}.donViTinh`,
                              findById(allUnits, val.donViTinh)?.tenDonVi,
                            );
                            formik.setFieldValue(
                              `taiSanConList.${row.originalIndex}.moTa`,
                              val.ghiChu,
                            );
                            formik.setFieldValue(
                              `taiSanConList.${row.originalIndex}.hienTrang`,
                              findById(allCurrentStatus, val.hienTrang)
                                ?.tenHTKT,
                            );
                            formik.setFieldValue(
                              `taiSanConList.${row.originalIndex}.soLuong`,
                              val.soLuong,
                            );
                          }
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`taiSanConList.${row.originalIndex}.donViTinh`}
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
                      <FieldInput
                        formik={formik}
                        field={`taiSanConList.${row.originalIndex}.hienTrang`}
                        disabled
                      />
                    </TableCell>

                    <TableCell>
                      <FieldInput
                        formik={formik}
                        field={`taiSanConList.${row.originalIndex}.moTa`}
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
                            isInsert: true,
                            isDeleted: false,
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
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
}
