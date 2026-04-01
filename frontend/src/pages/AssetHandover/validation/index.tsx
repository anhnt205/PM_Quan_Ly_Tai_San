import * as yup from "yup";

export const assetHandoverValidationSchema = yup.object({
  banGiaoTaiSan: yup.string().required("Nhập tên phiếu"),
  lenhDieuDong: yup.string().required("Chọn lệnh điều động"),
  idDonViGiao: yup.string().required("Chọn đơn vị giao"),
  idDonViNhan: yup.string().required("Chọn đơn vị nhận"),
  soQuyetDinh: yup.string().required("Nhập số quyết định"),
  diaDiemQuyetDinh: yup.string().required("Nhập địa điểm quyết định"),
  ngayQuyetDinh: yup.string().required("Chọn ngày quyết định"),
  ngayBanGiao: yup.string().required("Chọn ngày bàn giao"),
  ngayTaoChungTu: yup.string().required("Chọn ngày tạo chứng từ"),
  // idDaiDienBenGiao: yup.string().required("Chọn đại diện đơn vị giao"),
  // idDaiDienBenNhan: yup.string().required("Chọn đại diện đơn vị nhận"),
  // idGiamDoc: yup.string().required("Chọn giám đốc xác nhận"),
  tenFile: yup.string().required("Chọn tài liệu quyết định"),
  chiTietBanGiaoTaiSan: yup.array().of(
    yup.object({
      idTaiSan: yup.string().required("Chọn ít nhất 1 tài sản"),
      soLuong: yup
        .number()
        .typeError("Số lượng phải là số")
        .required("Nhập số lượng bàn giao")
        .min(1, "Số lượng tối thiểu là 1"),
    }),
  ),
});
