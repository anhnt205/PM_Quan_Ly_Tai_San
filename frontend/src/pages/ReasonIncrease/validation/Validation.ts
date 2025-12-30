import * as yup from "yup";

export const ReasonIncreaseValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  ten: yup.string().required("Bắt buộc"),
});
