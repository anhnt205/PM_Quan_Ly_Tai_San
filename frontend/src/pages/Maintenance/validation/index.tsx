import * as yup from "yup";

// kế hoạch
export const PlanMaintenanceValidation = yup.object({
  soKeHoach: yup.string().trim().required("Số kế hoạch là bắt buộc"),
  tenKeHoach: yup.string().trim().required("Tên kế hoạch là bắt buộc"),
  soQuyetDinh: yup.string().trim().required("Số quyết định là bắt buộc"),
  nam: yup.number().typeError("Năm không hợp lệ").required("Năm là bắt buộc"),
  nhomTaiSan: yup.string().required("Nhóm tài sản là bắt buộc"),
  idDonViGiao: yup.string().required("Đơn vị quản lý là bắt buộc"),
  danhSachTaiSan: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một tài sản / thiết bị")
    .required("Vui lòng chọn ít nhất một tài sản / thiết bị"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người duyệt")
    .required("Vui lòng chọn ít nhất một người duyệt"),
});

// sửa chữa (giấy đề nghị sửa chữa)
export const MaintenanceValidation = yup.object({
  soPhieu: yup.string().trim().required("Số giấy đề nghị là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// sự cố
export const IncidentValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  idDonViBaoCao: yup.string().required("Đơn vị báo cáo là bắt buộc"),
  // ngayPhatHien: yup.string().required("Ngày phát hiện là bắt buộc"),
  // tenHeThongThietBi: yup.string().required("Tên hệ thống thiết bị là bắt buộc"),
  // phanHeViTri: yup.string().required("Phân hệ vị trí là bắt buộc"),
  // mucDo: yup.number().required("Mức độ là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
  danhSachTaiSan: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một thiết bị / tài sản")
    .required("Vui lòng chọn ít nhất một thiết bị / tài sản"),
});
// kiểm tra sự cố
export const IncidentInspectionValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // viTri: yup.string().required("Vị trí là bắt buộc"),
  // ngayKiemTra: yup.string().required("Ngày kiểm tra là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
  danhSachChiTiet: yup
    .array()
    .of(
      yup.object({
        danhSachVatTu: yup
          .array()
          .of(
            yup
              .object({
                idChiTietVatTu: yup
                  .string()
                  .required("Vui lòng chọn vật tư / linh kiện"),
                soLuong: yup
                  .number()
                  .typeError("Số lượng phải là số")
                  .required("Số lượng là bắt buộc")
                  .min(1, "Số lượng phải lớn hơn 0"),
                soLuongSuaChua: yup
                  .number()
                  .typeError("Số lượng sửa chữa phải là số")
                  .min(0, "Số lượng sửa chữa không được âm")
                  .default(0),
                soLuongThayMoi: yup
                  .number()
                  .typeError("Số lượng thay mới phải là số")
                  .min(0, "Số lượng thay mới không được âm")
                  .default(0),
              })
              .test(
                "soLuongKhop",
                "Tổng số lượng sửa chữa và thay mới phải khớp với số lượng",
                function (vt) {
                  if (!vt) return true;
                  const soLuong = Number(vt.soLuong || 0);
                  const suaChua = Number(vt.soLuongSuaChua || 0);
                  const thayMoi = Number(vt.soLuongThayMoi || 0);
                  return soLuong > 0 && suaChua + thayMoi === soLuong;
                },
              ),
          )
          .min(1, "Mỗi tài sản phải có ít nhất 1 vật tư / linh kiện")
          .required("Mỗi tài sản phải có ít nhất 1 vật tư / linh kiện"),
      }),
    )
    .min(1, "Danh sách tài sản không được để trống")
    .required("Danh sách tài sản không được để trống"),
});
// giám định máy móc
export const MachineInspectionValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // ngayGiamDinh: yup.string().required("Ngày kiểm tra là bắt buộc"),
  // viTri: yup.string().required("Vị trí là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
  danhSachChiTiet: yup
    .array()
    .of(
      yup.object({
        danhSachVatTu: yup
          .array()
          .of(
            yup
              .object({
                idChiTietVatTu: yup
                  .string()
                  .required("Vui lòng chọn vật tư / linh kiện"),
                soLuong: yup
                  .number()
                  .typeError("Số lượng phải là số")
                  .required("Số lượng là bắt buộc")
                  .min(1, "Số lượng phải lớn hơn 0"),
                soLuongSuaChua: yup
                  .number()
                  .typeError("Số lượng sửa chữa phải là số")
                  .min(0, "Số lượng sửa chữa không được âm")
                  .default(0),
                soLuongThayMoi: yup
                  .number()
                  .typeError("Số lượng thay mới phải là số")
                  .min(0, "Số lượng thay mới không được âm")
                  .default(0),
              })
              .test(
                "soLuongKhop",
                "Tổng số lượng sửa chữa và thay mới phải khớp với số lượng",
                function (vt) {
                  if (!vt) return true;
                  const soLuong = Number(vt.soLuong || 0);
                  const suaChua = Number(vt.soLuongSuaChua || 0);
                  const thayMoi = Number(vt.soLuongThayMoi || 0);
                  return soLuong > 0 && suaChua + thayMoi === soLuong;
                },
              ),
          )
          .min(1, "Mỗi tài sản phải có ít nhất 1 vật tư / linh kiện")
          .required("Mỗi tài sản phải có ít nhất 1 vật tư / linh kiện"),
      }),
    )
    .min(1, "Danh sách tài sản không được để trống")
    .required("Danh sách tài sản không được để trống"),
});
// giám định phương tiện
export const VehicleInspectionValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // ngayGiamDinh: yup.string().required("Ngày kiểm tra là bắt buộc"),
  // viTri: yup.string().required("Vị trí là bắt buộc"),
  // capBaoDuong: yup.string().required("Cấp bảo dưỡng là bắt buộc"),
  // donViSuaChua: yup.string().required("Đơn vị sửa chữa là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// biện pháp máy móc
export const MachineMeasuresValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // soDeNghi: yup.string().required("Số đề nghị là bắt buộc"),
  // donViSuaChua: yup.string().required("Đơn vị sửa chữa là bắt buộc"),
  // donViPhoiHop: yup.string().required("Đơn vị phối hợp là bắt buộc"),
  // thoiGianBatDau: yup.string().required("Thời gian bắt đầu là bắt buộc"),
  // thoiGianKetThuc: yup.string().required("Thời gian kết thúc là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});
// biện pháp phương tiện
export const VehicleMeasuresValidation = yup.object({
  // soBienBan: yup.string().required("Số biên bản là bắt buộc"),
  // tinhTrangHienTai: yup.string().required("Tình trạng hiện tại là bắt buộc"),
  // noiDungThucHien: yup.string().required("Nội dung thực hiện là bắt buộc"),
  // tienDoTuNgay: yup.string().required("Thời gian bắt đầu là bắt buộc"),
  // tienDoDenNgay: yup.string().required("Thời gian kết thúc là bắt buộc"),
  // donViQuanLy: yup.string().required("Đơn vị quản lý là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// nghiệm thu máy móc
export const AcceptanceMachineValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // ngayNghiemThu: yup.string().required("Ngày nghiệm thu là bắt buộc"),
  // viTri: yup.string().required("Vị trí là bắt buộc"),
  // tenThietBi: yup.string().required("Tên thiết bị là bắt buộc"),
  // soDangKi: yup.string().required("Số đăng ký là bắt buộc"),
  // capSuaChua: yup.string().required("Cấp sửa chữa là bắt buộc"),
  // ketQua: yup.string().required("Kết quả là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});
// nghiệm thu phương tiện
export const AcceptanceVehicleValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // noiDung: yup.string().required("Nội dung là bắt buộc"),
  // tinhTrang: yup.string().required("Tình trạng là bắt buộc"),
  // congViecPhatSinh: yup.string().required("Công việc phát sinh là bắt buộc"),
  // chiPhiNhanCong: yup.number().required("Chi phí nhân công là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// vật tư
export const MaterialValidation = yup.object({
  // soPhieu: yup.string().required("Số phiếu là bắt buộc"),
  // ngayDanhGia: yup.string().required("Ngày đánh giá là bắt buộc"),
  // viTri: yup.string().required("Vị trí là bắt buộc"),
  // capSuaChua: yup.string().required("Cấp sửa chữa là bắt buộc"),
  // tenThietBi: yup.string().required("Tên thiết bị là bắt buộc"),
  // soDangKi: yup.string().required("Số đăng ký là bắt buộc"),
  // idDonViQuanLy: yup.string().required("Đơn vị quản lý là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});
