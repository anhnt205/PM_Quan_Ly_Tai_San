import * as yup from "yup";

export const ToolTypeValidation = yup.object({
  id: yup.string().required("Mã loại CCDC là bắt buộc"),
  idLoaiCCDC: yup.string().required("Mã loại CCDC cha là bắt buộc"),
  tenLoai: yup.string().required("Tên loại CCDC là bắt buộc"),
});

export const ToolTypeBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã loại CCDC là bắt buộc"),
        idLoaiCCDC: yup.string().required("Mã loại CCDC cha là bắt buộc"),
        tenLoai: yup.string().required("Tên loại CCDC là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
