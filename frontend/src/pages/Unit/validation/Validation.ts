import * as yup from "yup";

export const UnitValidation = yup.object({
  id: yup.string().required("Mã đơn vị tính là bắt buộc"),
  tenDonVi: yup.string().required("Tên đơn vị tính là bắt buộc"),
  note: yup.string().optional(),
});

export const UnitBulkValidation = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã đơn vị tính là bắt buộc"),
        tenDonVi: yup.string().required("Tên đơn vị tính là bắt buộc"),
        note: yup.string().optional(),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
