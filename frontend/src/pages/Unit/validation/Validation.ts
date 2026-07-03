import * as yup from "yup";

export const UnitValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  tenDonVi: yup.string().required("Bắt buộc"),
});
