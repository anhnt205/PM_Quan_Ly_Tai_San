import * as Yup from "yup";

export const ModelAssetValidation = Yup.object().shape({
  id: Yup.string().required("Mã mô hình không được để trống"),
  tenMoHinh: Yup.string().required("Tên mô hình không được để trống"),
});
