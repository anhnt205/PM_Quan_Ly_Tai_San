import * as yup from "yup";

export const ToolGroupValidation = yup.object({
  id: yup.string().required("Mã nhóm CCDC là bắt buộc"),
  ten: yup.string().required("Tên nhóm CCDC là bắt buộc"),
});

export const ToolGroupBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã nhóm CCDC là bắt buộc"),
        ten: yup.string().required("Tên nhóm CCDC là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});