import * as yup from "yup";

export const assetTransferValidationSchema = yup.object({
  tenPhieu: yup.string().required("Nhập tên phiếu"),
  trichYeu: yup.string().required("Nhập trích yêu"),
  idDonViGiao: yup.string().required("Chọn đơn vị giao"),
  idDonViNhan: yup.string().required("Chọn đơn vị nhận"),
  idNguoiKyNhay: yup.string().required("Chọn người lập phiếu"),
  idDonViDeNghi: yup.string().required("Chọn đơn vị đề nghị"),
  tgGnTuNgay: yup.string().required("Nhập thời gian từ ngày"),
  tgGnDenNgay: yup.string().required("Nhập thời gian đến ngày"),
  idTrinhDuyetCapPhong: yup.string().required("Chọn người duyệt"),
  idTrinhDuyetGiamDoc: yup.string().required("Chọn người phê duyệt"),
  tenFile: yup.string().required("Chọn tài liệu quyết định"),
  chiTietDieuDongTaiSanDTOS: yup.array().of(
    yup.object({
      idTaiSan: yup.string().required("Chọn ít nhất 1 tái sản"),
      soLuong: yup
        .number()
        .typeError("Số lượng phải là số")
        .required("Nhập số lượng bàn giao")
        .min(1, "Số lượng tối thiểu là 1"),
    }),
  ),
});
