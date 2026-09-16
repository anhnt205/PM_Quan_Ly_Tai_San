import * as yup from "yup";

export const CapitalSourceValidation = yup.object({
  id: yup.string().required("Mã nguồn kinh phí là bắt buộc"),
  tenNguonKinhPhi: yup.string().required("Tên nguồn kinh phí là bắt buộc"),
});

export const CapitalSourceBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã nguồn kinh phí là bắt buộc"),
        tenNguonKinhPhi: yup.string().required("Tên nguồn kinh phí là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});