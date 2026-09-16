import * as Yup from "yup";

export const RepairReportValidation = Yup.object().shape({
  ma: Yup.string().trim().required("Mã mẫu biên bản là bắt buộc"),
  ten: Yup.string().trim().required("Tiêu đề mẫu biên bản là bắt buộc"),
  loaiBienBan: Yup.string().required("Vui lòng chọn loại biên bản"),
  congTy: Yup.string().trim().required("Công ty là bắt buộc"),
  macDinh: Yup.boolean().optional(),
});
