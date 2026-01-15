export interface ThongKeNhom {
  ten: string;
  soLuong: number;
  phanTram: number;
}

export interface ThongKeLoai {
  loaiTaiSanId: number;
  tenLoai: string;
  soLuong: number;
}

export interface ThongKeTheoThang {
  thang: number;
  nam: number;
  soLuong: number;
}

export interface DashboardStatistics {
  tongTaiSan: number;
  tongNguyenGia: number;
  tongCCDC: number;
  tongGiaTriCCDC: number;
  tongPhongBan: number;
  tongNhanVien: number;
  tongDuAn: number;
  tongCongTy: number;
}

export interface ThongKeNhomTaiSan {
  nhomId: number;
  tenNhom: string;
  soLuong: number;
  phanTram: number;
}

export interface ThongKeNhomCCDC {
  nhomId: number;
  tenNhom: string;
  soLuong: number;
  phanTram: number;
}
