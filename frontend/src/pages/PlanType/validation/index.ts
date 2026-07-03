import * as yup from "yup";

export const PlanTypeValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  tenLoai: yup.string().required("Bắt buộc"),
});
