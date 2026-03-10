import * as yup from "yup";

export const MaintenanceValidation = yup.object({
  idKeHoach: yup.string().required("Kế hoạch là bắt buộc"),
  tenSuaChua: yup.string().required("Tên phiếu là bắt buộc"),
  idLoaiSuaChua: yup.string().required("Loại sửa chữa là bắt buộc"),
  idDonViGiao: yup.string().required("Đơn vị giao là bắt buộc"),
  idDonViNhan: yup.string().required("Đơn vị nhận là bắt buộc"),
  ngayKetThucDuKien: yup.string().required("Ngày dự kiến là bắt buộc"),
  idDonViDeNghi: yup.string().required("Đơn vị đề nghị là bắt buộc"),
  idTrinhDuyetGiamDoc: yup.string().required("Người phê duyệt là bắt buộc"),
  idNguoiKyNhay: yup.string().required("Người lập biểu là bắt buộc"),
  idTrinhDuyetCapPhong: yup.string().required("Người duyệt là bắt buộc"),
});
