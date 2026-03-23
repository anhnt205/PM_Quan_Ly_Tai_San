import { Add, Delete, InfoOutlineRounded } from "@mui/icons-material";
import {
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
import { ChangeEvent, useEffect, useState } from "react";
import SaveBtn from "../../../../components/Button/SaveBtn";
import CancelBtn from "../../../../components/Button/CancelBtn";
import FieldInput from "../../../../components/TextField/FieldInput";
import { useFormik } from "formik";
import EditButton from "../../../../components/Button/EditButton";
import { findById, formatDecimal } from "../../../../utils/helpers";
import { useAssetByTypeQuery, useCountriesQuery } from "../../Mutation";
import { useAllTypeAssetByGroupQuery } from "../../../TypeAsset/Mutation";
import { useAllProjectsQuery } from "../../../Project/Mutation";
import dayjs from "dayjs";
import { AssetValidation } from "../../validation";
import TextFieldNumber from "../../../../components/TextField/TextFieldNumber";
import { Action, CongTy } from "../../../../utils/const";
import FieldYearMonth from "../../../../components/TextField/FieldYearMonth";
import FieldDateTime from "../../../../components/TextField/FieldDateTime";
import FieldAutoCompleted from "../../../../components/TextField/FieldAutoCompleted";
import { AssetFileType } from "../../types";
import { showDownloadFile } from "../../config";
import S3Service from "../../../../services/S3Service";

export default function AssetInfo({
  readOnly,
  onEdit,
  onCancel,
  selectedAsset,
  onSave,
  allAssetModel,
  allCurrentStatus,
  assetGroups,
  allDepartments,
  allUnits,
  allReasonIncreases,
}: {
  readOnly?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  selectedAsset?: any;
  onSave: (values: any) => void;
  allAssetModel: any[];
  allCurrentStatus: any[];
  assetGroups: any[];
  allDepartments: any[];
  allUnits: any[];
  allReasonIncreases: any[];
}) {
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
      tgKiemDinh: dayjs(new Date()).format("YYYY-MM"),
      chuKyKiemDinh: 0,
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
      idCongTy: CongTy.CT001,
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
      fileDinhKemList: [
        {
          id: undefined as Number | undefined,
          idTaiSan: "",
          filePath: "",
          tenFile: "",
          loai: 0,
          ngayTao: "",
          ghiChu: "",
          action: Action.CREATE,
        },
      ] as AssetFileType[],
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
    validationSchema: AssetValidation,
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
  }, [selectedAsset, assetsByType]);

  const handleCancel = () => {
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
    onCancel();
  };

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    loai: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Hiển thị loading nếu muốn
    try {
      const keyTailieu = await S3Service.put({
        name: file.name,
        file: file,
        type: "tailieu",
      });
      const newFile: AssetFileType = {
        id: undefined, // id tạm thời
        idTaiSan: formik.values.id,
        filePath: keyTailieu,
        tenFile: file.name,
        loai: loai,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        ghiChu: "",
        action: Action.CREATE,
      };
      formik.setFieldValue("fileDinhKemList", [
        ...formik.values.fileDinhKemList,
        newFile,
      ]);
    } catch (error) {
      console.error("Upload file error", error);
      // Có thể hiển thị toast lỗi
    }
    // Reset input để có thể chọn lại cùng file
    event.target.value = "";
  };

  const handleRemoveFile = (fileId?: number) => {
    if (!fileId) return;
    const currentList = formik.values.fileDinhKemList;
    const fileToRemove = currentList.find((f) => f.id === fileId);

    if (fileToRemove && fileToRemove.id) {
      // File đã tồn tại trên server → xóa mềm: đánh dấu action = "delete"
      const newList = currentList.map((f) =>
        f.id === fileId ? { ...f, action: Action.DELETE } : f,
      );
      formik.setFieldValue("fileDinhKemList", newList);
    } else {
      // File mới upload (chưa có id) → xóa khỏi danh sách
      const newList = currentList.filter((f) => f.id !== fileId);
      formik.setFieldValue("fileDinhKemList", newList);
    }
  };

  return (
    <Paper
      sx={{
        mt: 2,
        p: 2,
        borderRadius: "12px",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderRadius: "12px",
        }}
      >
        <Box display="flex" gap={2}>
          {!readOnly && <SaveBtn onSave={formik.submitForm} />}
          {!readOnly && <CancelBtn onClick={handleCancel} />}
          {readOnly && <EditButton onClick={onEdit} />}
        </Box>
      </Box>
      <Typography textAlign="center" fontSize={18} fontWeight={600}>
        THÔNG TIN TÀI SẢN
      </Typography>
      <Grid container spacing={2}>
        {/* Cột trái */}
        <Grid size={{ xs: 6 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Số thẻ tài sản */}
            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Số thẻ tài sản:
                  </Typography>
                  <Typography>{formik.values.soThe || "N/A"}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Số thẻ tài sản *"
                  formik={formik}
                  field="soThe"
                  disabled={readOnly}
                />
              )}
            </Grid>
            {/* Tên tài sản */}
            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Tên tài sản:
                  </Typography>
                  <Typography>{formik.values.tenTaiSan || "N/A"}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Tên tài sản *"
                  formik={formik}
                  field="tenTaiSan"
                  disabled={readOnly}
                />
              )}
            </Grid>

            {readOnly ? (
              <Box display="flex" gap={2}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ minWidth: "120px" }}
                >
                  Nguyên giá:
                </Typography>
                <Typography>
                  {formatDecimal(formik.values.nguyenGia)} đ
                </Typography>
              </Box>
            ) : (
              <Grid size={{ xs: 12 }}>
                <TextFieldNumber
                  title="Nguyên giá tài sản"
                  formik={formik}
                  field="nguyenGia"
                  disabled={true}
                />
              </Grid>
            )}
            {readOnly ? (
              <Box display="flex" gap={2}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ minWidth: "120px" }}
                >
                  Giá trị khấu hao ban đầu:
                </Typography>
                <Typography>
                  {formatDecimal(formik.values.giaTriKhauHaoBanDau)} đ
                </Typography>
              </Box>
            ) : (
              <Grid size={{ xs: 12 }}>
                <TextFieldNumber
                  title="Giá trị khấu hao ban đầu"
                  formik={formik}
                  field="giaTriKhauHaoBanDau"
                  disabled={true}
                />
              </Grid>
            )}
            {readOnly ? (
              <Box display="flex" gap={2}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ minWidth: "120px" }}
                >
                  Kỳ khấu hao ban đầu:
                </Typography>
                <Typography>
                  {formik.values.kyKhauHaoBanDau || "N/A"}
                </Typography>
              </Box>
            ) : (
              <Grid size={{ xs: 12 }}>
                <TextFieldNumber
                  title="Kỳ khấu hao ban đầu"
                  formik={formik}
                  field="kyKhauHaoBanDau"
                  disabled={true}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Giá trị thanh lý:
                  </Typography>
                  <Typography>
                    {formik.values.giaTriThanhLy || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <TextFieldNumber
                  title="Giá trị thanh lý"
                  formik={formik}
                  field="giaTriThanhLy"
                  disabled={true}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Mô hình tài sản:
                  </Typography>
                  <Typography>
                    {findById(allAssetModel, formik.values.idMoHinhTaiSan)
                      ?.tenMoHinh || "N/A"}
                  </Typography>
                </Box>
              ) : (
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
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Phương pháp khấu hao:
                  </Typography>
                  <Typography>
                    {formik.values.phuongPhapKhauHao === 1
                      ? "Đường thẳng"
                      : "Khác"}
                  </Typography>
                </Box>
              ) : (
                <TextField
                  size="small"
                  fullWidth
                  label="Phương pháp khấu hao"
                  value={
                    formik.values.phuongPhapKhauHao === 1
                      ? "Đường thẳng"
                      : "Khác"
                  }
                  disabled
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Số kỳ khấu hao:
                  </Typography>
                  <Typography>{formik.values.soKyKhauHao}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Số kỳ khấu hao"
                  formik={formik}
                  field="soKyKhauHao"
                  disabled={true}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Tài khoản tài sản:
                  </Typography>
                  <Typography>
                    {formik.values.taiKhoanTaiSan || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Tài khoản tài sản"
                  formik={formik}
                  field="taiKhoanTaiSan"
                  disabled={true}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Tài khoản khấu hao:
                  </Typography>
                  <Typography>
                    {formik.values.taiKhoanKhauHao || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Tài khoản khấu hao"
                  formik={formik}
                  field="taiKhoanKhauHao"
                  disabled={true}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Tài khoản chi phí:
                  </Typography>
                  <Typography>
                    {formik.values.taiKhoanChiPhi || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Tài khoản chi phí"
                  formik={formik}
                  field="taiKhoanChiPhi"
                  disabled={true}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Nhóm tài sản:
                  </Typography>
                  <Typography>
                    {findById(assetGroups, formik.values.idNhomTaiSan)
                      ?.tenNhom || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Nhóm tài sản *"
                  data={assetGroups}
                  labelkey="tenNhom"
                  formik={formik}
                  field="idNhomTaiSan"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Loại tài sản:
                  </Typography>
                  <Typography>
                    {findById(
                      typeAssetsByAssetGroup,
                      formik.values.idLoaiTaiSanCon,
                    )?.tenLoai || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Loại tài sản"
                  data={typeAssetsByAssetGroup}
                  labelkey="tenLoai"
                  formik={formik}
                  field="idLoaiTaiSanCon"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Ngày vào sổ:
                  </Typography>
                  <Typography>
                    {dayjs(formik.values.ngayVaoSo).format(
                      "DD/MM/YYYY HH:mm:ss",
                    )}
                  </Typography>
                </Box>
              ) : (
                <FieldDateTime
                  title="Ngày vào sổ"
                  formik={formik}
                  field="ngayVaoSo"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Ngày sử dụng:
                  </Typography>
                  <Typography>
                    {dayjs(formik.values.ngaySuDung).format(
                      "DD/MM/YYYY HH:mm:ss",
                    )}
                  </Typography>
                </Box>
              ) : (
                <FieldDateTime
                  title="Ngày sử dụng"
                  formik={formik}
                  field="ngaySuDung"
                  disabled={readOnly}
                />
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Cột phải */}
        <Grid size={{ xs: 6 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Dự án:
                  </Typography>
                  <Typography>
                    {findById(allProjects, formik.values.idDuDan)?.tenDuAn ||
                      "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Dự án"
                  data={allProjects}
                  labelkey="tenDuAn"
                  formik={formik}
                  field="idDuDan"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Vốn NS:
                  </Typography>
                  <Typography>{formatDecimal(formik.values.nvNS)} đ</Typography>
                </Box>
              ) : (
                <TextFieldNumber
                  title="Vốn NS"
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
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Vốn vay:
                  </Typography>
                  <Typography>
                    {formatDecimal(formik.values.vonVay)} đ
                  </Typography>
                </Box>
              ) : (
                <TextFieldNumber
                  title="Vốn vay"
                  formik={formik}
                  field="vonVay"
                  disabled={readOnly}
                  onChange={(newValue) => {
                    formik.setFieldValue(
                      "nguyenGia",
                      Number(formik.values.nvNS ?? 0) +
                        Number(formik.values.vonKhac ?? 0) +
                        Number(newValue ?? 0),
                    );
                  }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Vốn khác:
                  </Typography>
                  <Typography>
                    {formatDecimal(formik.values.vonKhac)} đ
                  </Typography>
                </Box>
              ) : (
                <TextFieldNumber
                  title="Vốn khác"
                  formik={formik}
                  field="vonKhac"
                  disabled={readOnly}
                  onChange={(newValue) => {
                    formik.setFieldValue(
                      "nguyenGia",
                      Number(formik.values.nvNS ?? 0) +
                        Number(formik.values.vonVay ?? 0) +
                        Number(newValue ?? 0),
                    );
                  }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Mã hiệu:
                  </Typography>
                  <Typography>{formik.values.kyHieu || "N/A"}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Mã hiệu"
                  formik={formik}
                  field="kyHieu"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Số mã hiệu:
                  </Typography>
                  <Typography>{formik.values.soKyHieu || "N/A"}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Số mã hiệu"
                  formik={formik}
                  field="soKyHieu"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Công suất:
                  </Typography>
                  <Typography>{formik.values.congSuat || "N/A"}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Công suất"
                  formik={formik}
                  field="congSuat"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Nước sản xuất:
                  </Typography>
                  <Typography>{formik.values.nuocSanXuat || "N/A"}</Typography>
                </Box>
              ) : (
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
                    formik.setFieldValue("nuocSanXuat", newValue?.niceName);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Nước sản xuất" size="small" />
                  )}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Năm sản xuất:
                  </Typography>
                  <Typography>{formik.values.namSanXuat}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Năm sản xuất"
                  type="number"
                  formik={formik}
                  field="namSanXuat"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Lý do tăng:
                  </Typography>
                  <Typography>
                    {findById(allReasonIncreases, formik.values.lyDoTang)
                      ?.ten || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Lý do tăng"
                  data={allReasonIncreases}
                  labelkey="ten"
                  formik={formik}
                  field="lyDoTang"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Hiện trạng:
                  </Typography>
                  <Typography>
                    {findById(allCurrentStatus, formik.values.hienTrang)
                      ?.tenHTKT || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Hiện trạng"
                  data={allCurrentStatus}
                  labelkey="tenHTKT"
                  formik={formik}
                  field="hienTrang"
                  disabled={readOnly}
                />
              )}
            </Grid>
            {readOnly ? (
              <Box display="flex" gap={2}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ minWidth: "120px" }}
                >
                  Số lượng:
                </Typography>
                <Typography>{formik.values.soLuong || "N/A"}</Typography>
              </Box>
            ) : (
              <Grid size={{ xs: 12 }}>
                <TextFieldNumber
                  title="Số lượng"
                  formik={formik}
                  field="soLuong"
                  disabled={true}
                />
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Đơn vị tính:
                  </Typography>
                  <Typography>
                    {findById(allUnits, formik.values.donViTinh)?.tenDonVi ||
                      "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Đơn vị tính"
                  data={allUnits}
                  labelkey="tenDonVi"
                  formik={formik}
                  field="donViTinh"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Ghi chú:
                  </Typography>
                  <Typography>{formik.values.ghiChu || "N/A"}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Ghi chú"
                  formik={formik}
                  field="ghiChu"
                  disabled={readOnly}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Kho:
                  </Typography>
                  <Typography>
                    {findById(allDepartments, formik.values.idDonViBanDau)
                      ?.tenPhongBan || "N/A"}
                  </Typography>
                </Box>
              ) : (
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
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {readOnly ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Đơn vị hiện thời:
                  </Typography>
                  <Typography>
                    {findById(allDepartments, formik.values.idDonViHienThoi)
                      ?.tenPhongBan || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldAutoCompleted
                  title="Đơn vị hiện thời"
                  data={allDepartments}
                  labelkey="tenPhongBan"
                  formik={formik}
                  field="idDonViHienThoi"
                  disabled={readOnly}
                />
              )}
            </Grid>

            {/* <Grid size={{ xs: 6 }}>
              {readOnly ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Thời gian kiểm định:
                  </Typography>
                  <Typography>
                    {dayjs(formik.values.tgKiemDinh).isValid()
                      ? dayjs(formik.values.tgKiemDinh).format("MM/YYYY")
                      : "N/A"}
                  </Typography>
                </Box>
              ) : (
                <FieldYearMonth
                  title="Thời gian kiểm định"
                  formik={formik}
                  field="tgKiemDinh"
                  disabled={readOnly}
                />
              )}
            </Grid> */}

            {/* <Grid size={{ xs: 6 }}>
              {readOnly ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ minWidth: "120px" }}
                  >
                    Chu kỳ kiểm định (tháng):
                  </Typography>
                  <Typography>{formik.values.chuKyKiemDinh}</Typography>
                </Box>
              ) : (
                <FieldInput
                  title="Chu kỳ kiểm định (tháng)"
                  formik={formik}
                  type="number"
                  field="chuKyKiemDinh"
                  disabled={readOnly}
                />
              )}
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>

      {formik.values.donViTinh?.toLocaleLowerCase() === "ht" && (
        <Box sx={{ mt: 4 }}>
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
                      {readOnly ? (
                        <Typography>
                          {findById(assetsByType, row.idTaiSanCon)?.tenTaiSan ||
                            "N/A"}
                        </Typography>
                      ) : (
                        <FieldAutoCompleted
                          title=""
                          data={assetsByType}
                          labelkey="tenTaiSan"
                          formik={formik}
                          field={`taiSanConList.${row.originalIndex}.idTaiSanCon`}
                          disabled={readOnly}
                          onChange={(val) => {
                            if (val) {
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
                              formik.setFieldValue(
                                `taiSanConList.${row.originalIndex}.tenTaiSan`,
                                val.tenTaiSan,
                              );
                            }
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={
                          findById(allUnits, row.donViTinh)?.tenDonVi || ""
                        }
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
                          findById(allCurrentStatus, row.hienTrang)?.tenHTKT ||
                          ""
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
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid size={{ xs: 6 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight="bold">
              Biên bản nghiệm thu
            </Typography>
            {!readOnly && (
              <Button
                variant="text"
                size="small"
                component="label"
                startIcon={<Add />}
              >
                Tệp đính kèm
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 0)}
                />
              </Button>
            )}
          </Box>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            {formik.values.fileDinhKemList
              .filter((e) => e.loai === 0 && e.action !== Action.DELETE)
              .map((i, index) => (
                <Box
                  key={i.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                    borderBottom: "1px dashed #e0e0e0",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", minWidth: "20px" }}
                  >
                    {index + 1}.
                  </Typography>
                  {showDownloadFile(i.tenFile, () =>
                    S3Service.download(i.filePath),
                  )}
                  {!readOnly && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(i.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            {formik.values.fileDinhKemList.filter(
              (e) => e.loai === 0 && e.action !== Action.DELETE,
            ).length === 0 && (
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", color: "gray" }}
              >
                Không có tệp đính kèm.
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Tài liệu kỹ thuật */}
        <Grid size={{ xs: 6 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight="bold">
              Tài liệu kỹ thuật
            </Typography>
            {!readOnly && (
              <Button
                variant="text"
                size="small"
                component="label"
                startIcon={<Add />}
              >
                Tệp đính kèm
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 1)}
                />
              </Button>
            )}
          </Box>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            {formik.values.fileDinhKemList
              .filter((e) => e.loai === 1 && e.action !== Action.DELETE)
              .map((i, index) => (
                <Box
                  key={i.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                    borderBottom: "1px dashed #e0e0e0",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", minWidth: "20px" }}
                  >
                    {index + 1}.
                  </Typography>
                  {showDownloadFile(i.tenFile, () =>
                    S3Service.download(i.filePath),
                  )}
                  {!readOnly && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(i.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            {formik.values.fileDinhKemList.filter(
              (e) => e.loai === 1 && e.action !== Action.DELETE,
            ).length === 0 && (
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", color: "gray" }}
              >
                Không có tệp đính kèm.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
