import * as yup from "yup";

export const CurrentStatusValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  tenHTKT: yup.string().required("Bắt buộc"),
});
