import * as Yup from "yup";

export const RepairReportValidation = Yup.object().shape({
  ma: Yup.string().trim().required("Bắt buộc"),
  ten: Yup.string().trim().required("Bắt buộc"),
});
