import * as Yup from "yup";

export const AssetGroupValidation = Yup.object().shape({
  id: Yup.string().required("Bắt buộc"),
  tenNhom: Yup.string().required("Bắt buộc"),
});
