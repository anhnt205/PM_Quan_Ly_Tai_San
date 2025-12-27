import * as yup from "yup";

export const ToolTypeValidation = yup.object({
  code: yup.string().required("Bắt buộc"),
  toolGroup: yup.string().required("Bắt buộc"),
  name: yup.string().required("Bắt buộc"),
});
