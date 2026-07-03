import * as yup from "yup";

export const ToolTypeValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  idLoaiCCDC: yup.string().required("Bắt buộc"),
  tenLoai: yup.string().required("Bắt buộc"),
});
