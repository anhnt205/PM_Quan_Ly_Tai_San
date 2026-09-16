import * as Yup from "yup";

export const AssetGroupValidation = Yup.object().shape({
  id: Yup.string().required("Mã nhóm tài sản là bắt buộc"),
  tenNhom: Yup.string().required("Tên nhóm tài sản là bắt buộc"),
});

export const AssetGroupBulkValidation = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required("Mã nhóm tài sản là bắt buộc"),
        tenNhom: Yup.string().required("Tên nhóm tài sản là bắt buộc"),
      }),
    )
    .min(1, "Yêu cầu ít nhất một dòng"),
});
