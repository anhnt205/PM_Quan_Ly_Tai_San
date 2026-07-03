import * as yup from "yup";

export const MaintenanceRepairTypeValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  ten: yup.string().required("Bắt buộc"),
});
