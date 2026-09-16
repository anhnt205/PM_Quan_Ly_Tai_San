import * as yup from "yup";

// Kế hoạch SCBD
export const PlanMaintenanceValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người duyệt")
    .required("Vui lòng chọn ít nhất một người duyệt"),
});

// Sửa chữa
export const MaintenanceValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 1. Báo cáo kỹ thuật
export const TechnicalReportValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 2. Biên bản giám định
export const InspectionRecordValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 3. Lệnh sửa chữa
export const RepairRequestValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 4. Phiếu giao việc
export const JobAssignmentValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 5. Phiếu lĩnh vật tư
export const MaterialRequisitionValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 6. Biên bản nghiệm thu
export const AcceptanceTestValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 7. Biên bản đánh giá vật tư
export const MaterialAssessmentValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// 8. Quyết toán
export const QuyetToanValidation = yup.object({
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
});

// ── 2 form sự cố với báo cáo sự cố (giữ nguyên không đổi) ──
export const IncidentValidation = yup.object({
  idDonViBaoCao: yup.string().required("Đơn vị báo cáo là bắt buộc"),
  nguoiKyList: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một người ký")
    .required("Vui lòng chọn ít nhất một người ký"),
  danhSachTaiSan: yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một thiết bị / tài sản")
    .required("Vui lòng chọn ít nhất một thiết bị / tài sản"),
});

export const IncidentInspectionValidation = yup.object({
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

// Aliases tương thích ngược
export const MachineInspectionValidation = InspectionRecordValidation;
export const VehicleInspectionValidation = InspectionRecordValidation;
export const MachineMeasuresValidation = RepairRequestValidation;
export const VehicleMeasuresValidation = RepairRequestValidation;
export const AcceptanceMachineValidation = AcceptanceTestValidation;
export const AcceptanceVehicleValidation = AcceptanceTestValidation;
export const MaterialValidation = MaterialAssessmentValidation;
