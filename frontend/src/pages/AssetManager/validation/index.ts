import * as yup from 'yup'

export const AssetValidation = yup.object({
  id: yup.string().required("Bắt buộc"),
  soThe: yup.string().required("Bắt buộc"),
  tenTaiSan: yup.string().required("Bắt buộc"),
  idNhomTaiSan: yup.string().required("Bắt buộc"),
});