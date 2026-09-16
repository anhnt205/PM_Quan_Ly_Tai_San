import * as Yup from "yup";

export const ModelAssetValidation = Yup.object().shape({
  id: Yup.string().required("Mã mô hình là bắt buộc"),
  tenMoHinh: Yup.string().required("Tên mô hình là bắt buộc"),
});

export const ModelAssetBulkValidation = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required("Mã mô hình là bắt buộc"),
        tenMoHinh: Yup.string().required("Tên mô hình là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
