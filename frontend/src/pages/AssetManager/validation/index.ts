import * as yup from "yup";

export const AssetValidation = yup.object({
  id: yup.string().required("Mã tài sản là bắt buộc"),
  soThe: yup.string().required("Số thẻ là bắt buộc"),
  tenTaiSan: yup.string().required("Tên tài sản là bắt buộc"),
});

export const AssetBulkValidation = yup.object({
  assets: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required("Mã tài sản là bắt buộc"),
        soThe: yup.string().required("Số thẻ là bắt buộc"),
        tenTaiSan: yup.string().required("Tên tài sản là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một tài sản"),
});