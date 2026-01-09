export interface AccountData {
  id: string;
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  hinhAnh: string | null;
  nguoiTao: string;
  nguoiCapNhat: string;
  idCongTy: string;
  rule: number;
  isActive: boolean;
  ngayTao: string;
  ngayCapNhat: string;
  chuKy: string | null;
  username: string;
  tenPhongBan?: string; // Trường map từ nhân viên
}
