export interface LyLichType {
  id: string;
  maLyLich: string;
  tenLyLich: string;
  moTa?: string;
  hieuLuc: boolean;
  idCongTy?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
}

export interface AssetGroupType {
  id: string;
  idCongTy: string;
  tenNhom: string;
  idLyLich?: string;
  hieuLuc: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  lyLich?: LyLichType;
}
