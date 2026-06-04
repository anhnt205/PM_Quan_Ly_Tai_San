import * as Yup from "yup";

export const AssetProfileValidation = Yup.object().shape({
  maLyLich: Yup.string().required("Mã lý lịch không được để trống"),
  tenLyLich: Yup.string().required("Tên lý lịch không được để trống"),
});
