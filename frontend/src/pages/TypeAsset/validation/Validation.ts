import * as yup from "yup";

export const TypeAssetValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  idLoaiTs: yup.string().required("Bắt buộc"),
  tenLoai: yup.string().required("Bắt buộc"),
});
