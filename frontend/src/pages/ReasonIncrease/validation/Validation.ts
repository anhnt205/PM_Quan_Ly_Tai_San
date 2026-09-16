import * as yup from "yup";

export const ReasonIncreaseValidation = yup.object({
  id: yup.string().required("Mã lý do tăng là bắt buộc"),
  ten: yup.string().required("Tên lý do tăng là bắt buộc"),
});

export const ReasonIncreaseBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã lý do tăng là bắt buộc"),
        ten: yup.string().required("Tên lý do tăng là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});

