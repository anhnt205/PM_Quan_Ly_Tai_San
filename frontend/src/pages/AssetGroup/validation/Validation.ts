import * as Yup from "yup";

export const AssetGroupValidation = Yup.object().shape({
  id: Yup.string().required("Mã nhóm tài sản không được để trống"),
  tenNhom: Yup.string().required("Tên nhóm tài sản không được để trống"),
});
