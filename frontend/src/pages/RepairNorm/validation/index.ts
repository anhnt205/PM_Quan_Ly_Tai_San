import * as Yup from "yup";

export const RepairNormValidation = Yup.object().shape({
  idCapSuaChua: Yup.string().required("Cấp sửa chữa không được để trống"),
  dinhMucVatTuList: Yup.array().of(
    Yup.object().shape({
      idCCDCVT: Yup.string().required("Vật tư không được để trống"),
      soLuong: Yup.number()
        .required("Số lượng không được để trống")
        .min(1, "Số lượng phải lớn hơn 0"),
    }),
  ),
});
