import * as yup from "yup";

export const ProjectValidation = yup.object({
  id: yup.string().required("Mã dự án là bắt buộc"),
  tenDuAn: yup.string().required("Tên dự án là bắt buộc"),
});

export const ProjectBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã dự án là bắt buộc"),
        tenDuAn: yup.string().required("Tên dự án là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});