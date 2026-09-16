import * as yup from "yup";

export const MaintenanceRepairTypeValidation = yup.object({
  id: yup.string().required("Mã loại sửa chữa là bắt buộc"),
  ten: yup.string().required("Tên loại sửa chữa là bắt buộc"),
});

export const MaintenanceRepairTypeBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã loại sửa chữa là bắt buộc"),
        ten: yup.string().required("Tên loại sửa chữa là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});

