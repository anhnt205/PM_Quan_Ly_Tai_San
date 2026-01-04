import * as yup from 'yup'

export const StaffValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  hoTen: yup.string().required("Bắt buộc"),
  diDong: yup.string().required("Bắt buộc"),
  emailCongViec: yup.string().required("Bắt buộc"),
  boPhan: yup.string().required("Bắt buộc"),
  chucVu: yup.string().required("Bắt buộc"),
});