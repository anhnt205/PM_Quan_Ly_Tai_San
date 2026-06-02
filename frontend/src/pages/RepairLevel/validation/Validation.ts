import * as yup from "yup";

export const RepairLevelValidation = yup.object({
  kyHieu: yup.string().required("Bắt buộc nhập ký hiệu"),
  ten: yup.string().required("Bắt buộc nhập tên cấp sửa chữa"),
  chuKyThucHien: yup.string().required("Bắt buộc nhập chu kỳ"),
  mocGioDau: yup.number().nullable(),
  mocGioCuoi: yup.number().nullable(),
  soLanTrongChuKy: yup
    .number()
    .typeError("Phải là số")
    .required("Bắt buộc nhập số lần"),
  thoiGianSuaChua: yup.string().required("Bắt buộc nhập thời gian"),
  ghiChu: yup.string().nullable(),
});
