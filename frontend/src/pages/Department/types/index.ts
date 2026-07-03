export interface DepartmentType {
  id: string;
  idCongTy?: string;
  tenPhongBan: string;
  idNhomDonvi?: string;
  idQuanLy?: string;
  hoTenQuanLy?: string;
  tenPhongCapTren?: string;
  tenNhom?: string;
  soLuongNhanVien?: number;
  phongCapTren?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  mauSac?: string;
  isKho?: boolean;
  isLanhDao?: boolean;
  loaiKho?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  isActive?: boolean;
}
