import * as yup from "yup";

export const CurrentStatusValidation = yup.object({
  id: yup.string().required("Mã hiện trạng là bắt buộc"),
  tenHTKT: yup.string().required("Tên hiện trạng là bắt buộc"),
});

export const CurrentStatusBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã hiện trạng là bắt buộc"),
        tenHTKT: yup.string().required("Tên hiện trạng là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
