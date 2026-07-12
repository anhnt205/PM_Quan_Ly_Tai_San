import { ActionType, TypeBienBanType } from "../../../utils/const";

// sự cố
export interface IncidenData {
  id: string;
  idCongTy: string;
  idKeHoach: string;
  nhomTaiSan?: string;
  soPhieu: string;
  idDonViBaoCao: string;
  tenDonViBaoCao?: string;
  ngayPhatHien: string;
  tenHeThongThietBi: string;
  phanHeViTri: string;
  mucDo: number;
  moTa: string;
  idNguoiLap: string;
  nguoiLapXacNhan: boolean;
  idGiamDoc: string;
  giamDocXacNhan: boolean;
  share: boolean;
  trangThai: number;
  ngayTao: string;
  ngayCapNhat: string;
  nguoiTao: string;
  nguoiCapNhat?: string;
  daCoGiamDinh?: number;
  congTy?: string;
  tenMauBienBan?: string;
  danhSachTaiSan?: IncidenDetailData[];
  nguoiKyList?: any[];
}

export interface IncidenDetailData {
  id?: string;
  idSuCo?: string;
  idTaiSan: string;
  thuocHeThong: string;
  tinhTrang: string;
  idDonViQuanLyKyThuat: string;
  viTri?: string;
  soLuong?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  tenTaiSan?: string;
  donViTinh?: string;
  tenNhomTaiSan?: string;
  tenDonViQuanLyKyThuat?: string;
  daKiemTraSuCo?: number;
  action?: ActionType;
}

// sửa chữa

export interface MaintenanceRepairData {
  id?: string;
  idCongTy?: string;
  soPhieu?: string;
  idKeHoach?: string;
  thang?: number;
  nam?: number;
  ghiChu?: string;
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;
  daCoGiamDinh?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  tenMauBienBan?: string;
  congTy?: string;
  danhSachTaiSan?: MaintenanceRepairDetailData[];
  nguoiKyList?: any[];
}

export interface MaintenanceRepairDetailData {
  id?: string;
  idSuaChua?: string;
  idTaiSan?: string;
  tenTaiSan?: string;
  nhomTaiSan?: string;
  donViTinh?: string;
  capSuaChua?: string;
  soLuong?: number;
  donViQuanLy?: string;
  donViBaoTri?: string;
  idKeHoachChiTiet: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  action?: ActionType;
}

// Đánh giá vật tư thu hồi
export interface DanhGiaVatTuData {
  id?: string;
  idCongTy?: string;
  soPhieu?: string;
  ngayDanhGia?: string;
  viTri?: string;
  capSuaChua?: string;
  tenThietBi?: string;
  kieu?: string;
  soDangKi?: string;
  idDonViQuanLy?: string;
  tenDonViQuanLy?: string;
  idNghiemThu?: string;

  soLuongPhucHoi?: number;
  soLuongPheLieu?: number;
  soLuongHuy?: number;

  // Ký duyệt
  idNguoiLap?: string;
  tenNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  tenGiamDoc?: string;
  giamDocXacNhan?: boolean;

  share?: boolean;
  trangThai?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  tenMauBienBan?: string;
  congTy?: string;

  danhSachChiTiet?: ChiTietVatTuThuHoiData[];
  nguoiKyList?: any[];
}

export interface ChiTietVatTuThuHoiData {
  id?: string;
  idDanhGiaVatTu?: string;
  idChiTietVatTu?: string;
  idVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  bienPhapXuLy?: string;
  ghiChu?: string;

  // Join fields
  // Join fields
  tenVatTu?: string;
  donViTinh?: string;
}

// Kiểm tra sự cố
export interface IncidentInspectionData {
  id?: string;
  idCongTy?: string;
  idSuCo?: string;
  soPhieu?: string;
  ngayKiemTra?: string;
  viTri?: string;
  nhanXetKetLuan?: string;
  bienPhapXuLy?: string;

  idNguoiLap?: string;
  tenNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  tenGiamDoc?: string;
  giamDocXacNhan?: boolean;

  share?: boolean;
  trangThai?: number;
  daCoGiamDinh?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  tenMauBienBan?: string;
  congTy?: string;

  danhSachChiTiet?: IncidentInspectionDetailData[];
  nguoiKyList?: any[];
}

export interface IncidentInspectionVatTuData {
  id?: string;
  idChiTietKiemTraSuCo?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  soLuongSuaChua?: number;
  soLuongThayMoi?: number;
  ghiChu?: string;

  // View fields
  tenVatTu?: string;
  donViTinh?: string;

  action?: any;
}

export interface IncidentInspectionDetailData {
  id?: string;
  idKiemTraSuCo?: string;
  idTaiSan?: string;
  idSuCoChiTiet?: string;

  // Enrich
  maTaiSan?: string;
  tenTaiSan?: string;
  donViTinh?: string;

  danhSachVatTu?: IncidentInspectionVatTuData[];
  action?: any;
}

// quy trình sửa chữa
export interface QuyTrinhSuaChuaData {
  idSuaChuaChiTiet: string;
  thietBi: string;
  thietBiId: string;
  lenhSuaChua: string;
  idSuaChua: string;
  trangThaiSuaChua: number;
  bienBanGiamDinh: string;
  idGiamDinhMayMoc: string;
  trangThaiGiamDinh: number;
  phieuNghiemThu: string;
  idNghiemThu: string;
  trangThaiNghiemThu: number;
  trangThai: number;
}

// Biện pháp sửa chữa máy móc
export interface BienPhapMayMocData {
  id?: string;
  idCongTy?: string;
  idGiamDinhMayMoc?: string; // FK -> giamdinh_maymoc

  soPhieu?: string; // Số phiếu
  soDeNghi?: string; // Số đề nghị
  donViSuaChua?: string; // Đơn vị sửa chữa
  donViPhoiHop?: string; // Đơn vị phối hợp
  hinhThuc?: string; // Hình thức sửa chữa
  thoiGianBatDau?: string; // Thời gian bắt đầu
  thoiGianKetThuc?: string; // Thời gian kết thúc
  thoiGianNgay?: number; // Số ngày
  ghiChu?: string; // Ghi chú

  // File đính kèm
  tenFile?: string;
  duongDanFile?: string;

  // Luồng ký
  idNguoiLap?: string;
  tenNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  tenGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number; // 0:nháp 1:đang duyệt 2:hủy 3:hoàn thành

  // Audit
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  tenMauBienBan?: string;
  congTy?: string;

  // Join
  soPhieuGiamDinhMayMoc?: string;
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface BienPhapPhuongTienData {
  id?: string;
  idCongTy?: string;
  soBienBan?: string;
  idTaiSan?: string;
  mucDich?: string;
  yeuCau?: string;
  tinhTrangHienTai?: string;
  noiDungThucHien?: string;
  tienDoTuNgay?: string;
  tienDoDenNgay?: string;
  bienPhapAnToan?: string;
  idGiamDinhPhuongTien?: string;
  donViQuanLy?: string;

  // Luồng ký / Trạng thái
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;

  // Audit
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  tenMauBienBan?: string;
  congTy?: string;

  // Join fields
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  tenTaiSan?: string;
  soPhieuSuCo?: string;
  daCoNghiemThu?: number;

  danhSachChiTiet?: BienPhapPhuongTienChiTietData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface BienPhapPhuongTienChiTietData {
  id?: string;
  idBienPhap?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuongCap?: number;
  soLuongThuHoi?: number;
  ghiChu?: string;

  // Join fields từ CCDCVatTu
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

// nghiệm thu phương tiện
export interface NghiemThuPhuongTienData {
  id?: string;
  idCongTy?: string;
  idBienPhapPhuongTien?: string;
  idGiamDinhPhuongTien?: string;
  idTaiSan?: string;

  // Thông tin chính
  soPhieu?: string;
  noiDung?: string;
  tinhTrang?: string;
  congViecPhatSinh?: string;
  chiPhiNhanCong?: number;
  ketLuan?: string;

  // Luồng ký / Trạng thái
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;

  // Audit
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  // Join fields
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  tenTaiSan?: string;
  soPhieuBienPhapPhuongTien?: string;

  tenMauBienBan?: string;
  congTy?: string;

  danhSachChiTiet?: NghiemThuPhuongTienChiTietData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface NghiemThuPhuongTienChiTietData {
  id?: string;
  idNghiemThuPhuongTien?: string;
  idChiTietVatTu?: string;
  idVatTu?: string;

  soLuongThayThe?: number;
  soLuongThuHoi?: number;
  phanTramConLai?: number;
  bienPhapXuLy?: string;
  ghiChu?: string;

  // View fields
  tenVatTu?: string;
  donViTinh?: string;
}

export interface PlanSigner {
  id: string;
  idTaiLieu: string;
  idNguoiKy: string;
  tenNguoiKy: string;
  idPhongBan: string;
  trangThai: number;
}

// kế hoạch
export interface MaintenancePlanData {
  id: string;
  idCongTy: string;
  soKeHoach: string;
  tenKeHoach: string;
  soQuyetDinh?: string;
  idLoaiKeHoach: string;
  idLoaiSuaChua: string;
  nam: number;
  nhomTaiSan?: string;
  idDonViGiao: string;
  idDonViNhan: string;
  tenDonViGiao?: string;
  tenDonViNhan?: string;
  idNguoiLapBieu: string;
  tenNguoiLapBieu?: string;
  nguoiLapBieuXacNhan: boolean;
  idTrinhDuyetGiamDoc: string;
  tenTrinhDuyetGiamDoc?: string;
  trinhDuyetGiamDocXacNhan: boolean;
  trangThai: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  ghiChu?: string;
  duongDanFile?: string;
  tenFile?: string;
  ngayKy?: string;
  duongDanTaiLieuBangKe?: string;
  share: boolean;
  byStep: boolean;
  danhSachTaiSan?: MaintenancePlanAssetItem[];
  nguoiKyList?: any[];
  soLuongSuCo?: number;
  tenMauBienBanSuaChua?: string;
  coQuanDong1?: string;
  coQuanDong2?: string;
  coQuanDong3?: string;
  tieuDe1?: string;
  tieuDe2?: string;
}

export interface MaintenancePlanAssetItem {
  id?: string;
  idKeHoachSuaChua: string;
  idTaiSan: string;
  idNhomTaiSan?: string;
  idLoaiTaiSan?: string;
  idDonViBaoTri?: string;
  soLuong?: number;
  tenTaiSan?: string;
  tenNhom?: string;
  donViTinh?: string;
  ghiChu?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  isActive?: boolean;
  capSuaChuaThang1?: string;
  capSuaChuaThang2?: string;
  capSuaChuaThang3?: string;
  capSuaChuaThang4?: string;
  capSuaChuaThang5?: string;
  capSuaChuaThang6?: string;
  capSuaChuaThang7?: string;
  capSuaChuaThang8?: string;
  capSuaChuaThang9?: string;
  capSuaChuaThang10?: string;
  capSuaChuaThang11?: string;
  capSuaChuaThang12?: string;

  capSuaChua?: string;
  daCoLenhSuaChua?: number;

  action?: ActionType;
}

//giám định
export interface InspectionRecordData {
  id?: string;
  idCongTy?: string;
  idBienBan?: string;
  loaiBienBan?: TypeBienBanType;
  soPhieu?: string;
  ngayGiamDinh?: string;
  viTri?: string;
  soDeLaiPhucHoi?: number;
  soDeLamPheLieu?: number;
  soLuongHuy?: number;
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  // Join fields
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  soPhieuSuaChua?: string;
  daCoBienPhap?: number;
  daCoNghiemThu?: number;

  tenMauBienBan?: string;
  congTy?: string;

  danhSachChiTiet?: InspectionRecordDetailData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface InspectionRecordDetailData {
  id?: string;
  idGiamDinhMayMoc?: string;
  idTaiSan?: string;
  idBienBanChiTiet?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  // View fields
  tenTaiSan?: string;
  donViTinh?: string;
  soLuong?: string | number;

  // Nested materials
  danhSachVatTu?: InspectionRecordVatTuData[];
  action?: ActionType;
}

export interface InspectionRecordVatTuData {
  id?: string;
  idChiTietGiamDinhMayMoc?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  soLuongSuaChua?: number;
  soLuongThayMoi?: number;
  ghiChu?: string;

  // View fields
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

// nghiệm thu

export interface AcceptanceTestRecordData {
  id?: string;
  idCongTy?: string;
  idBienPhapMayMoc?: string;
  idGiamDinhMayMoc?: string;
  soPhieu?: string;
  ngayNghiemThu?: string;
  viTri?: string;
  tenThietBi?: string;
  soDangKi?: string;
  capSuaChua?: string;
  ketQua?: string;
  noiDung?: string;
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  soPhieuBienPhapMayMoc?: string;
  tenMauBienBan?: string;
  congTy?: string;
  daCoDanhGiaVatTu?: number;
  danhSachTaiSan?: AcceptanceTestRecordAssetData[];
  chuKyList?: any[];
  nguoiKyList?: any[];
}

export interface AcceptanceTestRecordAssetData {
  id?: string;
  idBienBan?: string;
  idTaiSan?: string;
  idChiTietGiamDinhMayMoc?: string;
  tenTaiSan?: string;
  donViTinh?: string;
  danhSachVatTu?: AcceptanceTestRecordToolData[];
  action?: ActionType;
}
export interface AcceptanceTestRecordToolData {
  id?: string;
  idBienBanTaiSan?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  ghiChu?: string;
  idVatTu?: string;
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

// giám định phương tiện
export interface VehicleInspectionRecordData {
  id?: string;
  idCongTy?: string;
  idBienBan?: string;
  loaiBienBan?: TypeBienBanType;
  soPhieu?: string;
  ngayGiamDinh?: string;
  viTri?: string;
  tinhTrang?: string;
  noiDungKhac?: string;
  idTaiSan?: string;
  capBaoDuong?: string;
  donViSuaChua?: string;
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  // Join fields
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  soPhieuBienBan?: string;
  tenTaiSan?: string;
  daCoNghiemThu?: number;

  tenMauBienBan?: string;
  congTy?: string;

  danhSachChiTiet?: VehicleInspectionRecordDetailData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface VehicleInspectionRecordDetailData {
  id?: string;
  idGiamDinhPhuongTien?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuong?: number;
  tinhTrang?: string;
  soLuongSuaChua?: number;
  soLuongThayMoi?: number;
  ghiChu?: string;

  // View fields
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}

// biện pháp phương tiện
export interface BienPhapPhuongTienData {
  id?: string;
  idCongTy?: string;
  soBienBan?: string;
  idTaiSan?: string;
  mucDich?: string;
  yeuCau?: string;
  tinhTrangHienTai?: string;
  noiDungThucHien?: string;
  tienDoTuNgay?: string;
  tienDoDenNgay?: string;
  bienPhapAnToan?: string;
  idGiamDinhPhuongTien?: string;

  // Luồng ký / Trạng thái
  idNguoiLap?: string;
  nguoiLapXacNhan?: boolean;
  idGiamDoc?: string;
  giamDocXacNhan?: boolean;
  share?: boolean;
  trangThai?: number;

  // Audit
  ngayTao?: string;
  ngayCapNhat?: string;
  nguoiTao?: string;
  nguoiCapNhat?: string;

  // Join fields
  tenNguoiLap?: string;
  tenGiamDoc?: string;
  tenTaiSan?: string;
  soPhieuSuCo?: string;
  daCoNghiemThu?: number;

  danhSachChiTiet?: BienPhapPhuongTienChiTietData[];
  nguoiKyList?: any[];
  chuKyList?: any[];
}

export interface BienPhapPhuongTienChiTietData {
  id?: string;
  idBienPhap?: string;
  idVatTu?: string;
  idChiTietVatTu?: string;
  soLuongCap?: number;
  soLuongThuHoi?: number;
  ghiChu?: string;

  // Join fields từ CCDCVatTu
  tenVatTu?: string;
  donViTinh?: string;
  action?: ActionType;
}
