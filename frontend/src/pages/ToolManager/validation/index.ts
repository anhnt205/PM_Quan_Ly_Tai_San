import * as yup from "yup";

export const ToolValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  ten: yup.string().required("Bắt buộc"),
  // idDonVi: yup.string().required("Bắt buộc"),
  // idNhomCCDC: yup.string().required("Bắt buộc"),
  // idLoaiCCDCCon: yup.string().required("Bắt buộc"),
});
