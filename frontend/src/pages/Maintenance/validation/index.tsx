import * as yup from "yup";

// kế hoạch
export const PlanMaintenanceValidation = yup.object({
  soKeHoach: yup.string().required("Số kế hoạch là bắt buộc"),
  tenKeHoach: yup.string().required("Tên kế hoạch là bắt buộc"),
  nam: yup.number().required("Năm là bắt buộc"),
  nhomTaiSan: yup.string().required("Nhóm tài sản là bắt buộc"),
  idDonViGiao: yup.string().required("Đơn vị quản lý là bắt buộc"),
  soQuyetDinh: yup.string().required("Số quyết định là bắt buộc"),
});

// sửa chữa
export const MaintenanceValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
});

// sự cố
export const IncidentValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  idDonViBaoCao: yup.string().required("Đơn vị báo cáo là bắt buộc"),
  ngayPhatHien: yup.string().required("Ngày phát hiện là bắt buộc"),
  tenHeThongThietBi: yup.string().required("Tên hệ thống thiết bị là bắt buộc"),
  phanHeViTri: yup.string().required("Phân hệ vị trí là bắt buộc"),
  mucDo: yup.number().required("Mức độ là bắt buộc"),
});
// kiểm tra sự cố
export const IncidentInspectionValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  viTri: yup.string().required("Vị trí là bắt buộc"),
  ngayKiemTra: yup.string().required("Ngày kiểm tra là bắt buộc"),
});
// giám định máy móc
export const MachineInspectionValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  ngayGiamDinh: yup.string().required("Ngày kiểm tra là bắt buộc"),
  viTri: yup.string().required("Vị trí là bắt buộc"),
});
// giám định phương tiện
export const VehicleInspectionValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  ngayGiamDinh: yup.string().required("Ngày kiểm tra là bắt buộc"),
  viTri: yup.string().required("Vị trí là bắt buộc"),
  capBaoDuong: yup.string().required("Cấp bảo dưỡng là bắt buộc"),
  donViSuaChua: yup.string().required("Đơn vị sửa chữa là bắt buộc"),
});

// biện pháp máy móc
export const MachineMeasuresValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  soDeNghi: yup.string().required("Số đề nghị là bắt buộc"),
  donViSuaChua: yup.string().required("Đơn vị sửa chữa là bắt buộc"),
  donViPhoiHop: yup.string().required("Đơn vị phối hợp là bắt buộc"),
  thoiGianBatDau: yup.string().required("Thời gian bắt đầu là bắt buộc"),
  thoiGianKetThuc: yup.string().required("Thời gian kết thúc là bắt buộc"),
});
// biện pháp phương tiện
export const VehicleMeasuresValidation = yup.object({
  soBienBan: yup.string().required("Số biên bản là bắt buộc"),
  tinhTrangHienTai: yup.string().required("Tình trạng hiện tại là bắt buộc"),
  noiDungThucHien: yup.string().required("Nội dung thực hiện là bắt buộc"),
  tienDoTuNgay: yup.string().required("Thời gian bắt đầu là bắt buộc"),
  tienDoDenNgay: yup.string().required("Thời gian kết thúc là bắt buộc"),
  donViQuanLy: yup.string().required("Đơn vị quản lý là bắt buộc"),
});

// nghiệm thu máy móc
export const AcceptanceMachineValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  ngayNghiemThu: yup.string().required("Ngày nghiệm thu là bắt buộc"),
  viTri: yup.string().required("Vị trí là bắt buộc"),
  tenThietBi: yup.string().required("Tên thiết bị là bắt buộc"),
  soDangKi: yup.string().required("Số đăng ký là bắt buộc"),
  capSuaChua: yup.string().required("Cấp sửa chữa là bắt buộc"),
  ketQua: yup.string().required("Kết quả là bắt buộc"),
});
// nghiệm thu phương tiện
export const AcceptanceVehicleValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  noiDung: yup.string().required("Nội dung là bắt buộc"),
  tinhTrang: yup.string().required("Tình trạng là bắt buộc"),
  congViecPhatSinh: yup.string().required("Công việc phát sinh là bắt buộc"),
  chiPhiNhanCong: yup.number().required("Chi phí nhân công là bắt buộc"),
});

// vật tư
export const MaterialValidation = yup.object({
  soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  ngayDanhGia: yup.string().required("Ngày đánh giá là bắt buộc"),
  viTri: yup.string().required("Vị trí là bắt buộc"),
  capSuaChua: yup.string().required("Cấp sửa chữa là bắt buộc"),
  tenThietBi: yup.string().required("Tên thiết bị là bắt buộc"),
  soDangKi: yup.string().required("Số đăng ký là bắt buộc"),
  idDonViQuanLy: yup.string().required("Đơn vị quản lý là bắt buộc"),
});
