import * as Yup from "yup";

export const RepairReportValidation = Yup.object().shape({
  ma: Yup.string().required("Bắt buộc"),
  ten: Yup.string().required("Bắt buộc"),
});
