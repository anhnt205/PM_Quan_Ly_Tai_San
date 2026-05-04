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
  id: s.soPhieu,
  planId: s.idKeHoach,
  idTrinhDuyetGiamDoc: s.idGiamDoc,
  tenTrinhDuyetGiamDoc: s.tenGiamDoc,
  idNguoiLapBieu: s.idNguoiLap,
  tenNguoiLapBieu: s.tenNguoiLap,
  moTa: s.moTa,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});
