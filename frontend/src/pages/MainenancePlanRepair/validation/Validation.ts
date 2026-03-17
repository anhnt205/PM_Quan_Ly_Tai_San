import * as yup from "yup";

export const MaintenancePlanValidation = yup.object({
  tenKeHoach: yup.string().required("Tên kế hoạch là bắt buộc"),
  idLoaiKeHoach: yup.string().required("Loại kế hoạch là bắt buộc"),
  idLoaiSuaChua: yup.string().required("Loại sửa chữa là bắt buộc"),
  ngayBatDau: yup.string().required("Ngày bắt đầu là bắt buộc"),
  ngayKetThuc: yup.string().required("Ngày kết thúc là bắt buộc"),
  idNguoiPhuTrach: yup.string().required("Người phụ trách là bắt buộc"),
  idDonViThucHien: yup.string().required("Đơn vị thực hiện là bắt buộc"),
  idDonViGiao: yup.string().required("Đơn vị giao là bắt buộc"),
});
