CREATE DATABASE IF NOT EXISTS QuanLyTaiSan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE QuanLyTaiSan;

CREATE TABLE TaiKhoan
(
    Id           VARCHAR(50) PRIMARY KEY,
    Username     VARCHAR(50) UNIQUE,
    TenDangNhap  VARCHAR(50),
    MatKhau      VARCHAR(50),
    HoTen        VARCHAR(100),
    Email        VARCHAR(100),
    SoDienThoai  VARCHAR(15),
    HinhAnh      TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IdCongTy     TEXT,
    Rule         INT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE CongTy
(
    Id                   VARCHAR(50) PRIMARY KEY,
    TenCongTy            VARCHAR(500),
    TenVietTat           VARCHAR(50),
    Email                VARCHAR(100),
    QuocGiaTruSoChinh    VARCHAR(100),
    TinhThanhTruSoChinh  VARCHAR(100),
    XaPhuongTruSoChinh   VARCHAR(100),
    DiaChiKhacTruSoChinh VARCHAR(500),
    LogoCongTy           VARCHAR(1000),
    MaSoThue             VARCHAR(100),
    Website              VARCHAR(200),
    SoDienThoai          VARCHAR(20),
    NgayTao              TEXT,
    NgayCapNhat          TEXT,
    NguoiTao             TEXT,
    NguoiCapNhat         TEXT,
    IsActive             TINYINT(1) DEFAULT 1
);

CREATE TABLE NhomDonVi
(
    Id           VARCHAR(50) PRIMARY KEY,
    TenNhom      VARCHAR(200),
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IdCongTy     TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE ChucVu
(
    Id                 VARCHAR(50) PRIMARY KEY,
    TenChucVu          VARCHAR(200),
    QuanLyNhanVien     TINYINT(1),
    QuanLyPhongBan     TINYINT(1),
    QuanLyDuAn         TINYINT(1),
    QuanLyNguonVon     TINYINT(1),
    QuanLyMoHinhTaiSan TINYINT(1),
    QuanLyNhomTaiSan   TINYINT(1),
    QuanLyTaiSan       TINYINT(1),
    QuanLyCCDCVatTu    TINYINT(1),
    DieuDongTaiSan     TINYINT(1),
    DieuDongCCDCVatTu  TINYINT(1),
    BanGiaoTaiSan      TINYINT(1),
    BanGiaoCCDCVatTu   TINYINT(1),
    BaoCao             TINYINT(1),
    IdCongTy           TEXT,
    NgayTao            TEXT,
    NgayCapNhat        TEXT,
    NguoiTao           TEXT,
    NguoiCapNhat       TEXT
);

CREATE TABLE PhongBan
(
    Id            VARCHAR(50) PRIMARY KEY,
    IdNhomDonvi   TEXT,
    TenPhongBan   VARCHAR(500),
    IdQuanLy      TEXT,
    IdCongTy      TEXT,
    PhongCapTren  TEXT,
    MauSac        VARCHAR(20),
    NgayTao       TEXT,
    NgayCapNhat   TEXT,
    NguoiTao      TEXT,
    NguoiCapNhat  TEXT,
    IsActive      TINYINT(1) DEFAULT 1,
    IsKho         TINYINT(1) DEFAULT 0,
    IsLanhDao     TINYINT(1),
    LoaiKho       INT
);

CREATE TABLE NhanVien
(
    Id              VARCHAR(50) PRIMARY KEY,
    HoTen           VARCHAR(200),
    DiDong          VARCHAR(20),
    EmailCongViec   VARCHAR(100),
    KyNhay          TINYINT(1),
    KyThuong        TINYINT(1),
    KySo            TINYINT(1),
    AgreementUUId   VARCHAR(100),
    PIN             VARCHAR(50),
    ChuKyNhay       TEXT,
    ChuKyThuong     TEXT,
    BoPhan          TEXT,
    ChucVu          TEXT,
    NguoiQuanLy     TEXT,
    LaQuanLy        TINYINT(1),
    Avatar          TEXT,
    IdCongTy        TEXT,
    DiaChiLamViec   TEXT,
    HinhThucLamViec TEXT,
    GioLamViec      TEXT,
    MuiGio          VARCHAR(100),
    NgayTao         TEXT,
    NgayCapNhat     TEXT,
    NguoiTao        TEXT,
    NguoiCapNhat    TEXT,
    SavePin         TINYINT(1),
    IsActive        TINYINT(1) DEFAULT 1
);

CREATE TABLE ThuocTinhNhanVien
(
    Id           VARCHAR(50) PRIMARY KEY,
    IdNhanVien   TEXT,
    NoiDung      TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE NguonVon
(
    Id              VARCHAR(50) PRIMARY KEY,
    TenNguonKinhPhi TEXT,
    GhiChu          TEXT,
    HieuLuc         TINYINT(1),
    IdCongTy        TEXT,
    NgayTao         TEXT,
    NgayCapNhat     TEXT,
    NguoiTao        TEXT,
    NguoiCapNhat    TEXT,
    IsActive        TINYINT(1) DEFAULT 1
);

CREATE TABLE DuAn
(
    Id           VARCHAR(50) PRIMARY KEY,
    TenDuAn      TEXT,
    GhiChu       TEXT,
    HieuLuc      TINYINT(1),
    IdCongTy     TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE LoaiTaiSan
(
    Id            VARCHAR(50) PRIMARY KEY,
    TenLoaiTaiSan TEXT,
    IdCongTy      TEXT,
    NgayTao       TEXT,
    NgayCapNhat   TEXT,
    NguoiTao      TEXT,
    NguoiCapNhat  TEXT,
    IsActive      TINYINT(1) DEFAULT 1
);

CREATE TABLE TaiSan
(
    Id                  VARCHAR(50) PRIMARY KEY,
    IdLoaiTaiSan        TEXT,
    TenTaiSan           TEXT,
    NguyenGia           FLOAT,
    GiaTriKhauHaoBanDau FLOAT,
    KyKhauHaoBanDau     INT,
    GiaTriThanhLy       FLOAT,
    IdMoHinhTaiSan      TEXT,
    PhuongPhapKhauHao   INT,
    SoKyKhauHao         INT,
    TaiKhoanTaiSan      INT,
    TaiKhoanKhauHao     INT,
    TaiKhoanChiPhi      INT,
    IdNhomTaiSan        TEXT,
    NgayVaoSo           TEXT,
    NgaySuDung          TEXT,
    IdDuDan             TEXT,
    IdNguonVon          TEXT,
    KyHieu              VARCHAR(100),
    SoKyHieu            VARCHAR(100),
    CongSuat            VARCHAR(100),
    NuocSanXuat         TEXT,
    NamSanXuat          INT,
    LyDoTang            TEXT,
    HienTrang           INT,
    SoLuong             INT,
    DonViTinh           VARCHAR(100),
    GhiChu              TEXT,
    IdDonViBanDau       TEXT,
    IdDonViHienThoi     TEXT,
    MoTa                TEXT,
    IdCongTy            TEXT,
    NgayTao             TEXT,
    NgayCapNhat         TEXT,
    NguoiTao            TEXT,
    NguoiCapNhat        TEXT,
    IsActive            TINYINT(1) DEFAULT 1,
    IsTaiSanCon         TINYINT(1),
    IdLoaiTaiSanCon     TEXT,
    SoThe               TEXT,
    nvNS                FLOAT,
    vonVay              FLOAT,
    vonKhac             FLOAT,
    IdKho               TEXT
);

CREATE TABLE CCDCVatTu
(
    Id            VARCHAR(50) PRIMARY KEY,
    IdDonVi       TEXT,
    Ten           TEXT,
    NgayNhap      TEXT,
    DonVitinh     VARCHAR(100),
    SoLuong       INT,
    GiaTri        FLOAT,
    SoKyHieu      VARCHAR(100),
    KyHieu        VARCHAR(100),
    CongSuat      VARCHAR(100),
    NuocSanXuat   VARCHAR(100),
    NamSanXuat    INT,
    GhiChu        TEXT,
    IdCongTy      TEXT,
    NgayTao       TEXT,
    NgayCapNhat   TEXT,
    NguoiTao      TEXT,
    NguoiCapNhat  TEXT,
    IsActive      TINYINT(1) DEFAULT 1,
    IdNhomCCDC    TEXT,
    IdLoaiCCDCCon TEXT,
    HienTrang     INT,
    IdKho         TEXT
);

CREATE TABLE MoHinhTaiSan
(
    Id                VARCHAR(50) PRIMARY KEY,
    TenMoHinh         VARCHAR(500),
    PhuongPhapKhauHao INT,
    KyKhauHao         INT,
    LoaiKyKhauHao     VARCHAR(100),
    TaiKhoanTaiSan    VARCHAR(100),
    TaiKhoanKhauHao   VARCHAR(100),
    TaiKhoanChiPhi    VARCHAR(100),
    IdCongTy          TEXT,
    NgayTao           TEXT,
    NgayCapNhat       TEXT,
    NguoiTao          TEXT,
    NguoiCapNhat      TEXT,
    IsActive          TINYINT(1) DEFAULT 1
);

CREATE TABLE NhomTaiSan
(
    Id           VARCHAR(50) PRIMARY KEY,
    TenNhom      VARCHAR(500),
    HieuLuc      TINYINT(1),
    IdCongTy     TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE NhomCCDC
(
    Id           VARCHAR(50) PRIMARY KEY,
    Ten      VARCHAR(500),
    HieuLuc      TINYINT(1),
    IdCongTy     TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE PhuLucTaiSan
(
    Id                       VARCHAR(50) PRIMARY KEY,
    IdTaiSan                 TEXT,
    TenPhuLucTS              VARCHAR(500),
    IdDonViHienThoi          TEXT,
    MoTaThietBiDinhKemTaiSan TEXT,
    MaPhuLucTSTB             TEXT,
    NgayTaoPhuLuc            TEXT,
    HienTrang                TEXT,
    DonViTinh                TEXT,
    DacDiem                  TEXT,
    IdCongTy                 TEXT,
    NgayTao                  TEXT,
    NgayCapNhat              TEXT,
    NguoiTao                 TEXT,
    NguoiCapNhat             TEXT,
    IsActive                 TINYINT(1) DEFAULT 1
);

CREATE TABLE DieuDongTaiSan
(
    Id                        VARCHAR(50) PRIMARY KEY,
    SoQuyetDinh               TEXT,
    TenPhieu                  TEXT,
    IdDonViGiao               TEXT,
    IdDonViNhan               TEXT,
    IdNguoiKyNhay             TEXT,
    TrangThaiKyNhay           TINYINT(1),
    NguoiLapPhieuKyNhay       TINYINT(1),
    IdDonViDeNghi             TEXT,
    TGGNTuNgay                TEXT,
    TGGNDenNgay               TEXT,
    IdTrinhDuyetCapPhong      TEXT,
    TrinhDuyetCapPhongXacNhan TINYINT(1),
    IdTrinhDuyetGiamDoc       TEXT,
    TrinhDuyetGiamDocXacNhan  TINYINT(1),
    DiaDiemGiaoNhan           TEXT,
    IdPhongBanXemPhieu        TEXT,
    NoiNhan                   TEXT,
    TrangThai                 INT,
    IdCongTy                  TEXT,
    NgayTao                   TEXT,
    NgayCapNhat               TEXT,
    NguoiTao                  TEXT,
    NguoiCapNhat              TEXT,
    CoHieuLuc                 TINYINT(1),
    Loai                      INT,
    Share                     TINYINT(1),
    TrichYeu                  TEXT,
    DuongDanFile              TEXT,
    TenFile                   TEXT,
    NgayKy                    TEXT,
    DaBanGiao                 TINYINT(1),
    ByStep                    TINYINT(1),
    CoPhieuBanGiao            TINYINT(1)
);

CREATE TABLE ChiTietDieuDongTaiSan
(
    Id               VARCHAR(50) PRIMARY KEY,
    IdDieuDongTaiSan TEXT,
    IdTaiSan         TEXT,
    SoLuong          FLOAT,
    GhiChu           TEXT,
    HienTrang        TEXT,
    MoTa             TEXT,
    NgayTao          TEXT,
    NgayCapNhat      TEXT,
    NguoiTao         TEXT,
    NguoiCapNhat     TEXT,
    IsActive         TINYINT(1) DEFAULT 1
);

CREATE TABLE DieuDongCCDCVatTu
(
    Id                        VARCHAR(50) PRIMARY KEY,
    SoQuyetDinh               TEXT,
    TenPhieu                  TEXT,
    IdDonViGiao               TEXT,
    IdDonViNhan               TEXT,
    IdNguoiKyNhay             TEXT,
    TrangThaiKyNhay           TINYINT(1),
    NguoiLapPhieuKyNhay       TINYINT(1),
    IdDonViDeNghi             TEXT,
    TGGNTuNgay                TEXT,
    TGGNDenNgay               TEXT,
    IdTrinhDuyetCapPhong      TEXT,
    TrinhDuyetCapPhongXacNhan TINYINT(1),
    IdTrinhDuyetGiamDoc       TEXT,
    TrinhDuyetGiamDocXacNhan  TINYINT(1),
    DiaDiemGiaoNhan           TEXT,
    IdPhongBanXemPhieu        TEXT,
    NoiNhan                   TEXT,
    TrangThai                 INT,
    IdCongTy                  TEXT,
    NgayTao                   TEXT,
    NgayCapNhat               TEXT,
    NguoiTao                  TEXT,
    NguoiCapNhat              TEXT,
    CoHieuLuc                 TINYINT(1),
    Loai                      INT,
    Share                     TINYINT(1),
    TrichYeu                  TEXT,
    DuongDanFile              TEXT,
    TenFile                   TEXT,
    NgayKy                    TEXT,
    DaBanGiao                 TINYINT(1),
    ByStep                    TINYINT(1),
    CoPhieuBanGiao            TINYINT(1)
);

CREATE TABLE ChiTietDieuDongCCDCVatTu
(
    Id                  VARCHAR(50) PRIMARY KEY,
    IdDieuDongCCDCVatTu TEXT,
    IdCCDCVatTu         TEXT,
    IdChiTietCCDCVatTu  TEXT,
    SoLuong             FLOAT,
    SoLuongXuat         FLOAT,
    SoLuongDaBanGiao    FLOAT,
    SoLuongConLai       FLOAT,
    GhiChu              TEXT,
    HienTrang           TEXT,
    MoTa                TEXT,
    NgayTao             TEXT,
    NgayCapNhat         TEXT,
    NguoiTao            TEXT,
    NguoiCapNhat        TEXT,
    IsActive            TINYINT(1) DEFAULT 1,
    IdChiTietDieuDong   TEXT
);

CREATE TABLE DieuDongPhuLucTaiSan
(
    Id                   VARCHAR(50) PRIMARY KEY,
    SoQuyetDinh          TEXT,
    TenPhieu             TEXT,
    IdDonViGiao          TEXT,
    IdDonViNhan          TEXT,
    IdNguoiDeNghi        TEXT,
    NguoiLapPhieuKyNhay  TINYINT(1),
    QuanTrongCanXacNhan  TINYINT(1),
    PhoPhongXacNhan      TINYINT(1),
    IdDonViDeNghi        TEXT,
    IdTrinhDuyetCapPhong TEXT,
    TGGNTuNgay           TEXT,
    TGGNDenNgay          TEXT,
    IdTrinhDuyetGiamDoc  TEXT,
    DiaDiemGiaoNhan      TEXT,
    IdPhongBanXemPhieu   TEXT,
    IdNhanSuXemPhieu     TEXT,
    NoiNhan              TEXT,
    VeViec               TEXT,
    CanCu                TEXT,
    Dieu1                TEXT,
    Dieu2                TEXT,
    Dieu3                TEXT,
    ThemDongTrong        INT,
    TrangThai            INT,
    IdCongTy             TEXT,
    NgayTao              TEXT,
    NgayCapNhat          TEXT,
    NguoiTao             TEXT,
    NguoiCapNhat         TEXT,
    CoHieuLuc            TINYINT(1),
    Loai                 INT,
    IsActive             TINYINT(1) DEFAULT 1
);

CREATE TABLE ChiTietDieuDongPhucLucTaiSan
(
    Id                     VARCHAR(50) PRIMARY KEY,
    IdDieuDongPhuLucTaiSan TEXT,
    IdPhuLucTaiSan         TEXT,
    SoLuong                FLOAT,
    GhiChu                 TEXT,
    NgayTao                TEXT,
    NgayCapNhat            TEXT,
    NguoiTao               TEXT,
    NguoiCapNhat           TEXT,
    IsActive               TINYINT(1) DEFAULT 1
);

CREATE TABLE BanGiaoTaiSan
(
    Id                      VARCHAR(50) PRIMARY KEY,
    IdCongTy                TEXT,
    BanGiaoTaiSan           TEXT,
    QuyetDinhDieuDongSo     TEXT,
    LenhDieuDong            TEXT,
    IdDonViGiao             TEXT,
    IdDonViNhan             TEXT,
    NgayBanGiao             TEXT,
    IdLanhDao               TEXT,
    IdDaiDiendonviBanHanhQD TEXT,
    DaXacNhan               TINYINT(1),
    IdDaiDienBenGiao        TEXT,
    DaiDienBenGiaoXacNhan   TINYINT(1),
    IdDaiDienBenNhan        TEXT,
    DaiDienBenNhanXacNhan   TINYINT(1),
    TrangThai               INT,
    Note                    TEXT,
    NgayTao                 TEXT,
    NgayCapNhat             TEXT,
    NguoiTao                TEXT,
    NguoiCapNhat            TEXT,
    IsActive                TINYINT(1) DEFAULT 1,
    Share                   TINYINT(1),
    DuongDanFile            TEXT,
    TenFile                 TEXT,
    ByStep                  TINYINT(1),
    NgayTaoChungTu          TEXT,
    IdGiamDoc               TEXT,
    GiamDocKy               TINYINT(1),
    SoQuyetDinh             TEXT,
    NgayQuyetDinh           TEXT,
    DiaDiemQuyetDinh        TEXT
);

CREATE TABLE ChiTietBanGiaoTaiSan
(
    Id              VARCHAR(50) PRIMARY KEY,
    IdBanGiaoTaiSan TEXT,
    IdTaiSan        TEXT,
    SoLuong         FLOAT,
    HienTrang       TEXT,
    MoTa            TEXT,
    GhiChu          TEXT,
    NgayTao         TEXT,
    NgayCapNhat     TEXT,
    NguoiTao        TEXT,
    NguoiCapNhat    TEXT,
    IsActive        TINYINT(1) DEFAULT 1
);

CREATE TABLE BanGiaoCCDCVatTu
(
    Id                      VARCHAR(50) PRIMARY KEY,
    IdCongTy                TEXT,
    BanGiaoCCDCVatTu        TEXT,
    QuyetDinhDieuDongSo     TEXT,
    LenhDieuDong            TEXT,
    IdDonViGiao             TEXT,
    IdDonViNhan             TEXT,
    NgayBanGiao             TEXT,
    IdLanhDao               TEXT,
    IdDaiDiendonviBanHanhQD TEXT,
    DaXacNhan               TINYINT(1),
    IdDaiDienBenGiao        TEXT,
    DaiDienBenGiaoXacNhan   TINYINT(1),
    IdDaiDienBenNhan        TEXT,
    DaiDienBenNhanXacNhan   TINYINT(1),
    TrangThai               INT,
    Note                    TEXT,
    NgayTao                 TEXT,
    NgayCapNhat             TEXT,
    NguoiTao                TEXT,
    NguoiCapNhat            TEXT,
    IsActive                TINYINT(1) DEFAULT 1,
    Share                   TINYINT(1),
    DuongDanFile            TEXT,
    TenFile                 TEXT,
    ByStep                  TINYINT(1),
    NgayTaoChungTu          TEXT,
    IdGiamDoc               TEXT,
    GiamDocKy               TINYINT(1),
    SoQuyetDinh             TEXT,
    NgayQuyetDinh           TEXT,
    DiaDiemQuyetDinh        TEXT
);

CREATE TABLE ChiTietBanGiaoCCDCVatTu
(
    Id                 VARCHAR(50) PRIMARY KEY,
    IdBanGiaoCCDCVatTu TEXT,
    IdCCDCVatTu        TEXT,
    IdChiTietCCDCVatTu TEXT,
    SoLuong            FLOAT,
    HienTrang          TEXT,
    MoTa               TEXT,
    GhiChu             TEXT,
    NgayTao            TEXT,
    NgayCapNhat        TEXT,
    NguoiTao           TEXT,
    NguoiCapNhat       TEXT,
    IsActive           TINYINT(1) DEFAULT 1,
    IdChiTietDieuDong  TEXT
);

CREATE TABLE BanGiaoPhuLuc
(
    Id                      VARCHAR(50) PRIMARY KEY,
    IdCongty                TEXT,
    BanGiaoPhuLuc           TEXT,
    QuyetDinhDieuDongSo     TEXT,
    LenhDieuDong            TEXT,
    IdDonViGiao             TEXT,
    IdDonViNhan             TEXT,
    NgayBanGiao             TEXT,
    IdLanhDao               TEXT,
    IdDaiDiendonviBanHanhQD TEXT,
    DaXacNhan               TINYINT(1),
    IdDaiDienBenGiao        TEXT,
    DaiDienBenGiaoXacNhan   TINYINT(1),
    IdDaiDienBenNhan        TEXT,
    DaiDienBenNhanXacNhan   TINYINT(1),
    IdDonViDaiDien          TEXT,
    DonViDaiDienXacNhan     TINYINT(1),
    TrangThai               INT,
    Note                    TEXT,
    NgayTao                 TEXT,
    NgayCapNhat             TEXT,
    NguoiTao                TEXT,
    NguoiCapNhat            TEXT,
    IsActive                TINYINT(1) DEFAULT 1
);

CREATE TABLE ChiTietBanGiaoPhuLuc
(
    Id              VARCHAR(50) PRIMARY KEY,
    IdBanGiaoPhuLuc TEXT,
    IdPhuLuc        TEXT,
    SoLuong         FLOAT,
    NgayTao         TEXT,
    NgayCapNhat     TEXT,
    NguoiTao        TEXT,
    NguoiCapNhat    TEXT,
    IsActive        TINYINT(1) DEFAULT 1
);

CREATE TABLE TaiSanCon
(
    Id           VARCHAR(50) PRIMARY KEY,
    IdTaiSanCha  VARCHAR(50),
    IdTaiSanCon  VARCHAR(50),
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE KyTaiLieu
(
    Id        VARCHAR(50) PRIMARY KEY,
    IdTaiLieu NVARCHAR(50),
    LoaiKy    INT,
    X         FLOAT,
    Y         FLOAT,
    IdNguoiKy NVARCHAR(50),
    ChuKySo   TEXT,
    NgayKy    TEXT,
    STT       INT,
    Scale     FLOAT,
    width     FLOAT
);

CREATE TABLE KhauHao
(
    Id           NVARCHAR(50) PRIMARY KEY,
    TenKhauHao   TEXT,
    CongThuc     TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT
);

CREATE TABLE NguoiKy
(
    Id         VARCHAR(50) PRIMARY KEY,
    IdTaiLieu  TEXT,
    IdNguoiKy  TEXT,
    IdPhongBan TEXT,
    TrangThai  INT
);

CREATE TABLE ChiTietTaiSan
(
    Id          VARCHAR(50) PRIMARY KEY,
    IdTaiSan    TEXT,
    NgayVaoSo   TEXT,
    NgaySuDung  TEXT,
    SoKyHieu    VARCHAR(100),
    CongSuat    VARCHAR(100),
    SoLuong     INT,
    NuocSanXuat TEXT,
    NamSanXuat  INT
);

CREATE TABLE ChiTietDonViSoHuu
(
    Id              VARCHAR(50) PRIMARY KEY,
    IdCCDCVT        VARCHAR(50),
    IdTsCon         VARCHAR(50),
    IdDonViSoHuu    VARCHAR(50),
    SoLuong         INT,
    ThoiGianBanGiao TEXT,
    NgayTao         TEXT,
    NguoiTao        VARCHAR(50)
);

CREATE TABLE LoaiTaiSanCon
(
    Id       VARCHAR(64) PRIMARY KEY,
    IdLoaiTs VARCHAR(64),
    TenLoai  VARCHAR(200)
);

CREATE TABLE LoaiCCDCCon
(
    Id         VARCHAR(64) PRIMARY KEY,
    IdLoaiCCDC VARCHAR(64),
    TenLoai    VARCHAR(200)
);

CREATE TABLE Config
(
    IdAccount      VARCHAR(64) PRIMARY KEY,
    ThoiHanTaiLieu INT
);

CREATE TABLE Permission
(
    Id             VARCHAR(64) PRIMARY KEY,
    PermissionName VARCHAR(100) NOT NULL,
    PermissionCode VARCHAR(50)  NOT NULL UNIQUE,
    Description    TEXT,
    IsActive       TINYINT(1) DEFAULT 1
);

CREATE TABLE Role
(
    Id          VARCHAR(64) PRIMARY KEY,
    RoleName    VARCHAR(100) NOT NULL,
    RoleCode    VARCHAR(50)  NOT NULL UNIQUE,
    Description TEXT,
    IsActive    TINYINT(1) DEFAULT 1
);

CREATE TABLE RolePermission
(
    Id           VARCHAR(64) PRIMARY KEY,
    RoleId       VARCHAR(64) NOT NULL,
    PermissionId VARCHAR(64) NOT NULL,
    CanCreate    TINYINT(1) DEFAULT 0,
    CanRead      TINYINT(1) DEFAULT 0,
    CanUpdate    TINYINT(1) DEFAULT 0,
    CanDelete    TINYINT(1) DEFAULT 0
);

CREATE TABLE UserRole
(
    Id          VARCHAR(64) PRIMARY KEY,
    UserId      VARCHAR(64) NOT NULL,
    RoleId      VARCHAR(64) NOT NULL,
    IsActive    TINYINT(1) DEFAULT 1,
    CreatedDate TEXT
);

CREATE TABLE UserPermission
(
    Id           VARCHAR(64) PRIMARY KEY,
    UserId       VARCHAR(64) NOT NULL,
    PermissionId VARCHAR(64) NOT NULL,
    CanCreate    TINYINT(1) DEFAULT 0,
    CanRead      TINYINT(1) DEFAULT 0,
    CanUpdate    TINYINT(1) DEFAULT 0,
    CanDelete    TINYINT(1) DEFAULT 0,
    CreatedDate  TEXT,
    UpdatedDate  TEXT,
    IsActive     TINYINT(1) DEFAULT 1,
    UNIQUE KEY unique_user_permission (UserId, PermissionId)
);

CREATE INDEX idx_userpermission_userid ON UserPermission (UserId);
CREATE INDEX idx_userpermission_permissionid ON UserPermission (PermissionId);
CREATE INDEX idx_userpermission_active ON UserPermission (IsActive);

CREATE TABLE DonViTinh
(
    Id       VARCHAR(65) PRIMARY KEY,
    TenDonVi TEXT,
    Note     TEXT
);

CREATE TABLE NguonKinhPhi
(
    Id   VARCHAR(64) PRIMARY KEY,
    Ten  TEXT,
    Note TEXT
);

CREATE TABLE SetNguonKinhPhi
(
    Id              VARCHAR(64) PRIMARY KEY,
    IdTaiSan        TEXT,
    IdNguonKinhPhi  TEXT,
    TenNguonKinhPhi TEXT
);

CREATE TABLE LyDoTang
(
    Id       VARCHAR(64) PRIMARY KEY,
    Ten      TEXT,
    TangGiam TINYINT(1)
);

CREATE TABLE Version
(
    Id           VARCHAR(50) PRIMARY KEY,
    VersionName  TEXT NOT NULL,
    VersionCode  TEXT NOT NULL,
    Description  TEXT,
    ReleaseDate  DATETIME,
    IsActive     BOOLEAN DEFAULT TRUE,
    NgayTao      DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    NguoiTao     VARCHAR(50),
    NguoiCapNhat VARCHAR(50)
);

CREATE TABLE Kho
(
    Id           VARCHAR(50) PRIMARY KEY,
    TenKho       VARCHAR(500),
    IdQuanLy     TEXT,
    IdCongTy     TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

CREATE TABLE Sequence
(
    SeqName   VARCHAR(50) PRIMARY KEY,
    SeqYear   INT NOT NULL,
    SeqValue  INT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE HienTrangKyThuat
(
    Id           INT PRIMARY KEY,
    TenHTKT      TEXT,
    MoTa         TEXT,
    NgayTao      TEXT,
    NgayCapNhat  TEXT,
    NguoiTao     TEXT,
    NguoiCapNhat TEXT,
    IsActive     TINYINT(1) DEFAULT 1
);

-- Insert dữ liệu mẫu phân quyền (giữ nguyên như cũ)
INSERT INTO Permission (Id, PermissionName, PermissionCode, Description, IsActive)
VALUES ('PERM001', 'Quản lý Tài sản', 'TAISAN', 'Quản lý tài sản', 1),
       ('PERM002', 'Quản lý CCDC Vật tư', 'CCDCVT', 'Quản lý công cụ dụng cụ vật tư', 1),
       ('PERM003', 'Quản lý Bàn giao tài sản', 'BANGIAO_TAISAN', 'Quản lý bàn giao tài sản', 1),
       ('PERM004', 'Quản lý Bàn giao CCDC', 'BANGIAO_CCDC', 'Quản lý bàn giao CCDC', 1),
       ('PERM005', 'Quản lý Điều động tài sản', 'DIEUDONG_TAISAN', 'Quản lý điều động tài sản', 1),
       ('PERM006', 'Quản lý Điều động CCDC', 'DIEUDONG_CCDC', 'Quản lý điều động CCDC', 1),
       ('PERM007', 'Quản lý Nhân viên', 'NHANVIEN', 'Quản lý nhân viên', 1),
       ('PERM008', 'Quản lý Phòng ban', 'PHONGBAN', 'Quản lý phòng ban', 1),
       ('PERM009', 'Quản lý Công ty', 'CONGTY', 'Quản lý công ty', 1),
       ('PERM010', 'Quản lý Dự án', 'DUAN', 'Quản lý dự án', 1),
       ('PERM011', 'Quản lý Loại tài sản', 'LOAITAISAN', 'Quản lý loại tài sản', 1),
       ('PERM012', 'Quản lý Loại CCDC', 'LOAICCDC', 'Quản lý loại CCDC', 1),
       ('PERM013', 'Quản lý Khấu hao', 'KHAUHAO', 'Quản lý khấu hao', 1),
       ('PERM014', 'Quản lý Báo cáo', 'BAOCAO', 'Quản lý báo cáo', 1),
       ('PERM015', 'Quản lý Cấu hình', 'CONFIG', 'Quản lý cấu hình hệ thống', 1),
       ('PERM016', 'Quản lý Tài khoản', 'TAIKHOAN', 'Quản lý tài khoản người dùng', 1),
       ('PERM017', 'Quản lý Phân quyền', 'PERMISSION', 'Quản lý phân quyền hệ thống', 1),
       ('PERM09', 'Quản lý nguồn vốn', 'NGUONVON', 'Quản lý nguồn vốn', 1);

INSERT INTO Role (Id, RoleName, RoleCode, Description, IsActive)
VALUES ('ROLE001', 'Administrator', 'ADMIN', 'Quản trị viên hệ thống', 1),
       ('ROLE002', 'Manager', 'MANAGER', 'Quản lý', 1),
       ('ROLE003', 'User', 'USER', 'Người dùng thông thường', 1),
       ('ROLE004', 'Viewer', 'VIEWER', 'Chỉ xem', 1);

-- Các INSERT RolePermission giữ nguyên như file gốc của bạn (tôi đã copy nguyên xi)

INSERT INTO RolePermission (Id, RoleId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete)
VALUES ('RP001', 'ROLE001', 'PERM001', 1, 1, 1, 1),
       ('RP002', 'ROLE001', 'PERM002', 1, 1, 1, 1),
       ('RP003', 'ROLE001', 'PERM003', 1, 1, 1, 1),
       ('RP004', 'ROLE001', 'PERM004', 1, 1, 1, 1),
       ('RP005', 'ROLE001', 'PERM005', 1, 1, 1, 1),
       ('RP006', 'ROLE001', 'PERM006', 1, 1, 1, 1),
       ('RP007', 'ROLE001', 'PERM007', 1, 1, 1, 1),
       ('RP008', 'ROLE001', 'PERM008', 1, 1, 1, 1),
       ('RP009', 'ROLE001', 'PERM009', 1, 1, 1, 1),
       ('RP010', 'ROLE001', 'PERM010', 1, 1, 1, 1),
       ('RP011', 'ROLE001', 'PERM011', 1, 1, 1, 1),
       ('RP012', 'ROLE001', 'PERM012', 1, 1, 1, 1),
       ('RP013', 'ROLE001', 'PERM013', 1, 1, 1, 1),
       ('RP014', 'ROLE001', 'PERM014', 1, 1, 1, 1),
       ('RP015', 'ROLE001', 'PERM015', 1, 1, 1, 1),
       ('RP016', 'ROLE001', 'PERM016', 1, 1, 1, 1),
       ('RP017', 'ROLE001', 'PERM017', 1, 1, 1, 1);

-- Manager
INSERT INTO RolePermission (Id, RoleId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete)
VALUES ('RP018', 'ROLE002', 'PERM001', 1, 1, 1, 0),
       ('RP019', 'ROLE002', 'PERM002', 1, 1, 1, 0),
       ('RP020', 'ROLE002', 'PERM003', 1, 1, 1, 0),
       ('RP021', 'ROLE002', 'PERM004', 1, 1, 1, 0),
       ('RP022', 'ROLE002', 'PERM005', 1, 1, 1, 0),
       ('RP023', 'ROLE002', 'PERM006', 1, 1, 1, 0),
       ('RP024', 'ROLE002', 'PERM007', 1, 1, 1, 0),
       ('RP025', 'ROLE002', 'PERM008', 1, 1, 1, 0),
       ('RP026', 'ROLE002', 'PERM009', 0, 1, 0, 0),
       ('RP027', 'ROLE002', 'PERM010', 1, 1, 1, 0),
       ('RP028', 'ROLE002', 'PERM011', 1, 1, 1, 0),
       ('RP029', 'ROLE002', 'PERM012', 1, 1, 1, 0),
       ('RP030', 'ROLE002', 'PERM013', 1, 1, 1, 0),
       ('RP031', 'ROLE002', 'PERM014', 0, 1, 0, 0),
       ('RP032', 'ROLE002', 'PERM015', 0, 1, 0, 0),
       ('RP033', 'ROLE002', 'PERM016', 0, 1, 0, 0),
       ('RP034', 'ROLE002', 'PERM017', 0, 0, 0, 0);

-- User
INSERT INTO RolePermission (Id, RoleId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete)
VALUES ('RP035', 'ROLE003', 'PERM001', 1, 1, 0, 0),
       ('RP036', 'ROLE003', 'PERM002', 1, 1, 0, 0),
       ('RP037', 'ROLE003', 'PERM003', 1, 1, 0, 0),
       ('RP038', 'ROLE003', 'PERM004', 1, 1, 0, 0),
       ('RP039', 'ROLE003', 'PERM005', 1, 1, 0, 0),
       ('RP040', 'ROLE003', 'PERM006', 1, 1, 0, 0),
       ('RP041', 'ROLE003', 'PERM007', 0, 1, 0, 0),
       ('RP042', 'ROLE003', 'PERM008', 0, 1, 0, 0),
       ('RP043', 'ROLE003', 'PERM009', 0, 1, 0, 0),
       ('RP044', 'ROLE003', 'PERM010', 0, 1, 0, 0),
       ('RP045', 'ROLE003', 'PERM011', 0, 1, 0, 0),
       ('RP046', 'ROLE003', 'PERM012', 0, 1, 0, 0),
       ('RP047', 'ROLE003', 'PERM013', 0, 1, 0, 0),
       ('RP048', 'ROLE003', 'PERM014', 0, 1, 0, 0),
       ('RP049', 'ROLE003', 'PERM015', 0, 1, 0, 0),
       ('RP050', 'ROLE003', 'PERM016', 0, 1, 0, 0),
       ('RP051', 'ROLE003', 'PERM017', 0, 0, 0, 0);

-- Viewer
INSERT INTO RolePermission (Id, RoleId, PermissionId, CanCreate, CanRead, CanUpdate, CanDelete)
VALUES ('RP052', 'ROLE004', 'PERM001', 0, 1, 0, 0),
       ('RP053', 'ROLE004', 'PERM002', 0, 1, 0, 0),
       ('RP054', 'ROLE004', 'PERM003', 0, 1, 0, 0),
       ('RP055', 'ROLE004', 'PERM004', 0, 1, 0, 0),
       ('RP056', 'ROLE004', 'PERM005', 0, 1, 0, 0),
       ('RP057', 'ROLE004', 'PERM006', 0, 1, 0, 0),
       ('RP058', 'ROLE004', 'PERM007', 0, 1, 0, 0),
       ('RP059', 'ROLE004', 'PERM008', 0, 1, 0, 0),
       ('RP060', 'ROLE004', 'PERM009', 0, 1, 0, 0),
       ('RP061', 'ROLE004', 'PERM010', 0, 1, 0, 0),
       ('RP062', 'ROLE004', 'PERM011', 0, 1, 0, 0),
       ('RP063', 'ROLE004', 'PERM012', 0, 1, 0, 0),
       ('RP064', 'ROLE004', 'PERM013', 0, 1, 0, 0),
       ('RP065', 'ROLE004', 'PERM014', 0, 1, 0, 0),
       ('RP066', 'ROLE004', 'PERM015', 0, 1, 0, 0),
       ('RP067', 'ROLE004', 'PERM016', 0, 1, 0, 0),
       ('RP068', 'ROLE004', 'PERM017', 0, 0, 0, 0);

-- Insert dữ liệu mẫu Version
INSERT INTO Version (Id, VersionName, VersionCode, Description, ReleaseDate, IsActive, NguoiTao, NguoiCapNhat)
VALUES ('v1.0.0', 'Version 1.0.0', '1.0.0', 'Phiên bản đầu tiên của hệ thống quản lý tài sản', '2024-01-01 00:00:00', TRUE, 'system', 'system'),
       ('v1.1.0', 'Version 1.1.0', '1.1.0', 'Cập nhật tính năng báo cáo và thống kê', '2024-02-01 00:00:00', TRUE, 'system', 'system'),
       ('v1.2.0', 'Version 1.2.0', '1.2.0', 'Thêm tính năng phân trang và tối ưu hiệu suất', '2024-03-01 00:00:00', TRUE, 'system', 'system');

INSERT INTO TaiKhoan VALUES ('TK001','admin','admin', 'admin','Administrator','admin@company.com','0123456789',NULL,'2026-01-09 15:06:35','2026-01-09 15:06:35','system','system','ct001',0,1);

INSERT INTO CongTy VALUES ('CT001','Công ty ABC','ABC','contact@abc.com','Việt Nam','Hà Nội','Phường 1','123 Đường ABC','logo.png','123456789','www.abc.com','0123456789','2025-08-02 15:20:40','2025-08-02 15:20:40','TK001','TK001',1);

INSERT INTO UserPermission VALUES ('000876aa-5c46-4e21-96fd-48cf6d347572','TK001','PERM001',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('123','TK001','PERM002',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0001-4e21-96fd-48cf6d347572','TK001','PERM003',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0002-4e21-96fd-48cf6d347572','TK001','PERM004',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0003-4e21-96fd-48cf6d347572','TK001','PERM005',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0004-4e21-96fd-48cf6d347572','TK001','PERM006',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0005-4e21-96fd-48cf6d347572','TK001','PERM007',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0006-4e21-96fd-48cf6d347572','TK001','PERM008',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0007-4e21-96fd-48cf6d347572','TK001','PERM009',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0008-4e21-96fd-48cf6d347572','TK001','PERM010',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0009-4e21-96fd-48cf6d347572','TK001','PERM011',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0010-4e21-96fd-48cf6d347572','TK001','PERM012',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0011-4e21-96fd-48cf6d347572','TK001','PERM013',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0012-4e21-96fd-48cf6d347572','TK001','PERM014',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0013-4e21-96fd-48cf6d347572','TK001','PERM015',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0014-4e21-96fd-48cf6d347572','TK001','PERM016',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0015-4e21-96fd-48cf6d347572','TK001','PERM017',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1),
                                  ('a1b2c3d4-0016-4e21-96fd-48cf6d347572','TK001','PERM09',1,1,1,1,'2025-12-08 17:53:14','2025-12-08 17:53:14',1);