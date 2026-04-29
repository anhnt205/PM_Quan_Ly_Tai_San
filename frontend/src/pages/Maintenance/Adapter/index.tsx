export const PlanAdapter = (s: any) => ({
  ...s,
  id: s.id,
  moTa: s.tenKeHoach,
  ngayTao: s.ngayTao,
  trangThai: s.trangThai,
});
