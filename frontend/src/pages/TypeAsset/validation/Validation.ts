import * as yup from "yup";

export const TypeAssetValidation = yup.object({
  id: yup.string().required("Mã loại tài sản là bắt buộc"),
  idLoaiTs: yup.string().required("Mã loại tài sản cha là bắt buộc"),
  tenLoai: yup.string().required("Tên loại tài sản là bắt buộc"),
});

export const TypeAssetBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã loại tài sản là bắt buộc"),
        idLoaiTs: yup.string().required("Mã loại tài sản cha là bắt buộc"),
        tenLoai: yup.string().required("Tên loại tài sản là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
