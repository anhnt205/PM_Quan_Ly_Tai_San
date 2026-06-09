import * as Yup from "yup";

export const ModelAssetValidation = Yup.object().shape({
  id: Yup.string().required("Bắt buộc"),
  tenMoHinh: Yup.string().required("Bắt buộc"),
});
