import * as Yup from "yup";

export const AssetProfileValidation = Yup.object().shape({
  maLyLich: Yup.string().required("Mã lý lịch không được để trống"),
  tenLyLich: Yup.string().required("Tên lý lịch không được để trống"),
  idLyLichTemplate: Yup.string().required("Template không được để trống"),
});

export const AssetProfileBulkValidation = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        maLyLich: Yup.string().required("Mã lý lịch không được để trống"),
        tenLyLich: Yup.string().required("Tên lý lịch không được để trống"),
        idLyLichTemplate: Yup.string().required("Template không được để trống"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
