export const PlanAdapter = (s: any) => ({
  ...s,
  id: s.id,
  moTa: s.tenKeHoach,
  idTrinhDuyetGiamDoc: s.idTrinhDuyetGiamDoc,
  idNguoiLapBieu: s.idNguoiLapBieu,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});

export const IncidentAdapter = (s: any) => ({
  ...s,
  id: s.id,
  planId: s.idKeHoach,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  trinhDuyetGiamDocXacNhan: s.giamDocXacNhan,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  nguoiLapBieuXacNhan: s.nguoiLapXacNhan,
  moTa: s.moTa,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});

export const RepairAdapter = (s: any) => ({
  ...s,
  id: s.id,
  planId: s.idKeHoach,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  trinhDuyetGiamDocXacNhan: s.giamDocXacNhan,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  nguoiLapBieuXacNhan: s.nguoiLapXacNhan,
  moTa: s.ghiChu,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});

export const InspectionAdapter = (s: any) => ({
  ...s,
  id: s.id,
  planId: s.idKeHoach,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  trinhDuyetGiamDocXacNhan: s.giamDocXacNhan,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  nguoiLapBieuXacNhan: s.nguoiLapXacNhan,
  moTa: s.ghiChu,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
  daCoNghiemThu: s.daCoNghiemThu,
});

export const AcceptanceTestAdapter = (s: any) => ({
  ...s,
  id: s.id,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  trinhDuyetGiamDocXacNhan: s.giamDocXacNhan,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  nguoiLapBieuXacNhan: s.nguoiLapXacNhan,
  moTa: s.noiDung,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});

export const MaterialAssessmentAdapter = (s: any) => ({
  ...s,
  id: s.id,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  trinhDuyetGiamDocXacNhan: s.giamDocXacNhan,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  nguoiLapBieuXacNhan: s.nguoiLapXacNhan,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});

export const IncidentInspectionAdapter = (s: any) => ({
  ...s,
  id: s.id,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  trinhDuyetGiamDocXacNhan: s.giamDocXacNhan,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  nguoiLapBieuXacNhan: s.nguoiLapXacNhan,
  moTa: s.nhanXetKetLuan,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});