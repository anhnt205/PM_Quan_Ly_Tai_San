DROP DATABASE QuanLyTaiSan;
CREATE DATABASE IF NOT EXISTS QuanLyTaiSan CHARACTER
    SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE QuanLyTaiSan;

create table
    TaiKhoan
(
    Id           VARCHAR(50) primary key,
    Username     varchar(50) unique,
    TenDangNhap  varchar(50),
    MatKhau      varchar(50),
    HoTen        varchar(100),
    Email        varchar(100),
    SoDienThoai  varchar(15),
    HinhAnh      text,
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IdCongTy     text,
    Rule         int,
    IsActive     TINYINT(1) default 1
);


CREATE TABLE
    CongTy
(
    Id                   VARCHAR(50) PRIMARY KEY, -- Id
    TenCongTy            varchar(500),            -- CompanyName
    TenVietTat           varchar(50),             -- ShortName
    Email                varchar(100),
    QuocGiaTruSoChinh    varchar(100),            -- HeadquarterCountry
    TinhThanhTruSoChinh  varchar(100),            -- HeadquarterCity
    XaPhuongTruSoChinh   varchar(100),            -- HeadquarterCommune
    DiaChiKhacTruSoChinh varchar(500),            -- HeadquarterOther
    LogoCongTy           varchar(1000),           -- CompanyFavicon
    MaSoThue             varchar(100),            -- TaxNumber
    Website              varchar(200),
    SoDienThoai          varchar(20),             -- PhoneNumber
    NgayTao              text,
    NgayCapNhat          text,
    NguoiTao             text,
    NguoiCapNhat         text,
    IsActive             TINYINT(1) DEFAULT 1
);


create table
    NhomDonVi
(
    Id           VARCHAR(50) primary key,
    TenNhom      varchar(200),
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IdCongTy     text,
    IsActive     TINYINT(1) DEFAULT 1
);


create table
    ChucVu
(
    Id                 VARCHAR(50) primary key,
    TenChucVu          varchar(200),
    QuanLyNhanVien     tinyint(1),
    QuanLyPhongBan     tinyint(1),
    QuanLyDuAn         tinyint(1),
    QuanLyNguonVon     tinyint(1),
    QuanLyMoHinhTaiSan tinyint(1),
    QuanLyNhomTaiSan   tinyint(1),
    QuanLyTaiSan       tinyint(1),
    QuanLyCCDCVatTu    tinyint(1),
    DieuDongTaiSan     tinyint(1),
    DieuDongCCDCVatTu  tinyint(1),
    BanGiaoTaiSan      tinyint(1),
    BanGiaoCCDCVatTu   tinyint(1),
    BaoCao             tinyint(1),
    IdCongTy           text,
    NgayTao            text,
    NgayCapNhat        text,
    NguoiTao           text,
    NguoiCapNhat       text
);



create table
    PhongBan
(
    Id           VARCHAR(50) primary key,
    IdNhomDonvi  text,
    TenPhongBan  varchar(500),
    IdQuanLy     text,
    IdCongTy     text,
    PhongCapTren text,
    MauSac       varchar(20),
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IsActive     TINYINT(1) DEFAULT 1,
    IsKho        TINYINT(1) DEFAULT 0
);
create table
    NhanVien
(
    Id              VARCHAR(50) primary key,
    HoTen           varchar(200),
    DiDong          varchar(20),
    EmailCongViec   varchar(100),
    KyNhay          TINYINT(1),
    KyThuong        TINYINT(1),
    KySo            TINYINT(1),
    AgreementUUId   VARCHAR(100),
    PIN             varchar(50),
    ChuKyNhay       text,
    ChuKyThuong     text,
    BoPhan          text,
    ChucVu          text,
    NguoiQuanLy     text,
    LaQuanLy        TINYINT(1),
    Avatar          text,
    IdCongTy        text,
    DiaChiLamViec   text,
    HinhThucLamViec text,
    GioLamViec      text,
    MuiGio          varchar(100),
    NgayTao         text,
    NgayCapNhat     text,
    NguoiTao        text,
    NguoiCapNhat    text,
    SavePin         tinyint(1),
    IsActive        TINYINT(1) DEFAULT 1
);


create table
    ThuocTinhNhanVien
(
    Id           VARCHAR(50) primary key,
    IdNhanVien   text,
    NoiDung      text,
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IsActive     TINYINT(1) DEFAULT 1
);


create table
    NguonVon
(
    Id              VARCHAR(50) primary key,
    TenNguonKinhPhi text,
    GhiChu          text,
    HieuLuc         TINYINT(1),
    IdCongTy        text,
    NgayTao         text,
    NgayCapNhat     text,
    NguoiTao        text,
    NguoiCapNhat    text,
    IsActive        TINYINT(1) DEFAULT 1
);

create table
    DuAn
(
    Id           VARCHAR(50) primary key,
    TenDuAn      text,
    GhiChu       text,
    HieuLuc      TINYINT(1),
    IdCongTy     text,
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IsActive     TINYINT(1) DEFAULT 1
);


create table
    LoaiTaiSan
(
    Id            VARCHAR(50) primary key,
    TenLoaiTaiSan text,
    IdCongTy      text,
    NgayTao       text,
    NgayCapNhat   text,
    NguoiTao      text,
    NguoiCapNhat  text,
    IsActive      TINYINT(1) DEFAULT 1
);

create table
    TaiSan
(
    Id                  VARCHAR(50) primary key,
    IdLoaiTaiSan        text,
    TenTaiSan           text,
    NguyenGia           float,
    GiaTriKhauHaoBanDau float,
    KyKhauHaoBanDau     int,
    GiaTriThanhLy       float,
    IdMoHinhTaiSan      text,
    PhuongPhapKhauHao   int,
    SoKyKhauHao         int,
    TaiKhoanTaiSan      int,
    TaiKhoanKhauHao     int,
    TaiKhoanChiPhi      int,
    IdNhomTaiSan        text,
    NgayVaoSo           text,
    NgaySuDung          text,
    IdDuDan             text,
    IdNguonVon          text,
    KyHieu              varchar(100),
    SoKyHieu            varchar(100),
    CongSuat            varchar(100),
    NuocSanXuat         text,
    NamSanXuat          int,
    LyDoTang            text,
    HienTrang           int,
    SoLuong             int,
    DonViTinh           varchar(100),
    GhiChu              text,
    IdDonViBanDau       text,
    IdDonViHienThoi     text,
    MoTa                text,
    IdCongTy            text,
    NgayTao             text,
    NgayCapNhat         text,
    NguoiTao            text,
    NguoiCapNhat        text,
    IsActive            TINYINT(1) DEFAULT 1,
    IsTaiSanCon         tinyint(1),
    IdLoaiTaiSanCon     text,
    SoThe               text,
    nvNS                float,
    vonVay              float,
    vonKhac             float,
    IdKho               text
);


create table
    CCDCVatTu
(
    Id            VARCHAR(50) primary key,
    IdDonVi       text,
    Ten           text,
    NgayNhap      text,
    DonVitinh     varchar(100),
    SoLuong       int,
    GiaTri        float,
    SoKyHieu      varchar(100),
    KyHieu        varchar(100),
    CongSuat      varchar(100),
    NuocSanXuat   varchar(100),
    NamSanXuat    int,
    GhiChu        text,
    IdCongTy      text,
    NgayTao       text,
    NgayCapNhat   text,
    NguoiTao      text,
    NguoiCapNhat  text,
    IsActive      TINYINT(1) DEFAULT 1,
    IdNhomCCDC    text,
    IdLoaiCCDCCon text,
    HienTrang     int,
    IdKho         text
);
create table
    MoHinhTaiSan
(
    Id                VARCHAR(50) primary key,
    TenMoHinh         varchar(500),
    PhuongPhapKhauHao int,
    KyKhauHao         int,
    LoaiKyKhauHao     varchar(100),
    TaiKhoanTaiSan    varchar(100),
    TaiKhoanKhauHao   varchar(100),
    TaiKhoanChiPhi    varchar(100),
    IdCongTy          text,
    NgayTao           text,
    NgayCapNhat       text,
    NguoiTao          text,
    NguoiCapNhat      text,
    IsActive          TINYINT(1) DEFAULT 1
);


create table
    NhomTaiSan
(
    Id           VARCHAR(50) primary key,
    TenNhom      varchar(500),
    HieuLuc      TINYINT(1),
    IdCongTy     text,
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IsActive     TINYINT(1) DEFAULT 1
);



create table
    PhuLucTaiSan
(
    Id                       VARCHAR(50) primary key,
    IdTaiSan                 text,
    TenPhuLucTS              varchar(500),
    IdDonViHienThoi          text,
    MoTaThietBiDinhKemTaiSan text,
    MaPhuLucTSTB             text,
    NgayTaoPhuLuc            text,
    HienTrang                text,
    DonViTinh                text,
    DacDiem                  text,
    IdCongTy                 text,
    NgayTao                  text,
    NgayCapNhat              text,
    NguoiTao                 text,
    NguoiCapNhat             text,
    IsActive                 TINYINT(1) DEFAULT 1
);



create table
    DieuDongTaiSan
(
    Id                        VARCHAR(50) primary key,
    SoQuyetDinh               text,
    TenPhieu                  text,
    IdDonViGiao               text,
    IdDonViNhan               text,


    IdNguoiKyNhay             text,
    TrangThaiKyNhay           tinyint(1),
    NguoiLapPhieuKyNhay       TINYINT(1),


    IdDonViDeNghi             text,
    TGGNTuNgay                text,
    TGGNDenNgay               text,


    IdTrinhDuyetCapPhong      text,
    TrinhDuyetCapPhongXacNhan TINYINT(1),


    IdTrinhDuyetGiamDoc       text,
    TrinhDuyetGiamDocXacNhan  TINYINT(1),


    DiaDiemGiaoNhan           text,
    IdPhongBanXemPhieu        text,
    NoiNhan                   text,
    TrangThai                 int,
    IdCongTy                  text,
    NgayTao                   text,
    NgayCapNhat               text,
    NguoiTao                  text,
    NguoiCapNhat              text,
    CoHieuLuc                 TINYINT(1),
    Loai                      int,
    Share                     tinyint(1),
    TrichYeu                  text,
    DuongDanFile              text,
    TenFile                   text,
    NgayKy                    text,
    DaBanGiao                 tinyint(1),
    ByStep                    tinyint(1)
);



create table
    ChiTietDieuDongTaiSan
(
    Id               VARCHAR(50) primary key,
    IdDieuDongTaiSan text,
    IdTaiSan         text,
    SoLuong          float,
    GhiChu           text,
    NgayTao          text,
    NgayCapNhat      text,
    NguoiTao         text,
    NguoiCapNhat     text,
    IsActive         TINYINT(1) DEFAULT 1
);


create table
    DieuDongCCDCVatTu
(
    Id                        VARCHAR(50) primary key,
    SoQuyetDinh               text,
    TenPhieu                  text,
    IdDonViGiao               text,
    IdDonViNhan               text,


    IdNguoiKyNhay             text,
    TrangThaiKyNhay           tinyint(1),
    NguoiLapPhieuKyNhay       TINYINT(1),


    IdDonViDeNghi             text,
    TGGNTuNgay                text,
    TGGNDenNgay               text,


    IdTrinhDuyetCapPhong      text,
    TrinhDuyetCapPhongXacNhan TINYINT(1),


    IdTrinhDuyetGiamDoc       text,
    TrinhDuyetGiamDocXacNhan  TINYINT(1),


    DiaDiemGiaoNhan           text,
    IdPhongBanXemPhieu        text,
    NoiNhan                   text,
    TrangThai                 int,
    IdCongTy                  text,
    NgayTao                   text,
    NgayCapNhat               text,
    NguoiTao                  text,
    NguoiCapNhat              text,
    CoHieuLuc                 TINYINT(1),
    Loai                      int,
    Share                     tinyint(1),
    TrichYeu                  text,
    DuongDanFile              text,
    TenFile                   text,
    NgayKy                    text,
    DaBanGiao                 tinyint(1),
    ByStep                    tinyint(1)
);

create table
    ChiTietDieuDongCCDCVatTu
(
    Id                  VARCHAR(50) primary key,
    IdDieuDongCCDCVatTu text,
    IdCCDCVatTu         text,
    IdChiTietCCDCVatTu  text,
    SoLuong             float,
    SoLuongXuat         float,
    SoLuongDaBanGiao    float,
    GhiChu              text,
    NgayTao             text,
    NgayCapNhat         text,
    NguoiTao            text,
    NguoiCapNhat        text,
    IsActive            TINYINT(1) DEFAULT 1,
    IdChiTietDieuDong   text
);



create table
    DieuDongPhuLucTaiSan
(
    Id                   VARCHAR(50) primary key,
    SoQuyetDinh          text,
    TenPhieu             text,
    IdDonViGiao          text,
    IdDonViNhan          text,
    IdNguoiDeNghi        text,
    NguoiLapPhieuKyNhay  TINYINT(1),
    QuanTrongCanXacNhan  TINYINT(1),
    PhoPhongXacNhan      TINYINT(1),
    IdDonViDeNghi        text,
    IdTrinhDuyetCapPhong text,
    TGGNTuNgay           text,
    TGGNDenNgay          text,
    IdTrinhDuyetGiamDoc  text,
    DiaDiemGiaoNhan      text,
    IdPhongBanXemPhieu   text,
    IdNhanSuXemPhieu     text,
    NoiNhan              text,
    TrangThai            int,
    IdCongTy             text,
    NgayTao              text,
    NgayCapNhat          text,
    NguoiTao             text,
    NguoiCapNhat         text,
    CoHieuLuc            TINYINT(1),
    Loai                 int,
    IsActive             TINYINT(1) DEFAULT 1
);


create table
    ChiTietDieuDongPhucLucTaiSan
(
    Id                     VARCHAR(50) primary key,
    IdDieuDongPhuLucTaiSan text,
    IdPhuLucTaiSan         text,
    SoLuong                float,
    GhiChu                 text,
    NgayTao                text,
    NgayCapNhat            text,
    NguoiTao               text,
    NguoiCapNhat           text,
    IsActive               TINYINT(1) DEFAULT 1
);



CREATE TABLE BanGiaoTaiSan
(
    Id                      VARCHAR(50) PRIMARY KEY,
    IdCongTy                text,
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
    Share                   tinyint,
    DuongDanFile            text,
    TenFile                 text,
    ByStep                  tinyint(1),
    NgayTaoChungTu          text
);


create table
    ChiTietBanGiaoTaiSan
(
    Id              VARCHAR(50) primary key,
    IdBanGiaoTaiSan text,
    IdTaiSan        text,
    SoLuong         float,
    NgayTao         text,
    NgayCapNhat     text,
    NguoiTao        text,
    NguoiCapNhat    text,
    IsActive        TINYINT(1) DEFAULT 1
);


create table
    BanGiaoCCDCVatTu
(
    Id                      VARCHAR(50) primary key,
    IdCongTy                text,
    BanGiaoCCDCVatTu        text,
    QuyetDinhDieuDongSo     text,
    LenhDieuDong            text,
    IdDonViGiao             text,
    IdDonViNhan             text,
    NgayBanGiao             text,
    IdLanhDao               text,
    IdDaiDiendonviBanHanhQD text,
    DaXacNhan               TINYINT(1),
    IdDaiDienBenGiao        text,
    DaiDienBenGiaoXacNhan   TINYINT(1),
    IdDaiDienBenNhan        text,
    DaiDienBenNhanXacNhan   TINYINT(1),

    TrangThai               int,
    Note                    text,
    NgayTao                 text,
    NgayCapNhat             text,
    NguoiTao                text,
    NguoiCapNhat            text,
    IsActive                TINYINT(1) DEFAULT 1,
    Share                   tinyint,
    DuongDanFile            text,
    TenFile                 text,
    ByStep                  tinyint(1),
    NgayTaoChungTu          text
);


create table
    ChiTietBanGiaoCCDCVatTu
(
    Id                 VARCHAR(50) primary key,
    IdBanGiaoCCDCVatTu text,
    IdCCDCVatTu        text,
    IdChiTietCCDCVatTu text,
    SoLuong            float,
    NgayTao            text,
    NgayCapNhat        text,
    NguoiTao           text,
    NguoiCapNhat       text,
    IsActive           TINYINT(1) DEFAULT 1,
    IdChiTietDieuDong  text
);



create table
    BanGiaoPhuLuc
(
    Id                      VARCHAR(50) primary key,
    IdCongty                text,
    BanGiaoPhuLuc           text,
    QuyetDinhDieuDongSo     text,
    LenhDieuDong            text,
    IdDonViGiao             text,
    IdDonViNhan             text,
    NgayBanGiao             text,
    IdLanhDao               text,
    IdDaiDiendonviBanHanhQD text,
    DaXacNhan               TINYINT(1),
    IdDaiDienBenGiao        text,
    DaiDienBenGiaoXacNhan   TINYINT(1),
    IdDaiDienBenNhan        text,
    DaiDienBenNhanXacNhan   TINYINT(1),
    IdDonViDaiDien          text,
    DonViDaiDienXacNhan     TINYINT(1),
    TrangThai               int,
    Note                    text,
    NgayTao                 text,
    NgayCapNhat             text,
    NguoiTao                text,
    NguoiCapNhat            text,
    IsActive                TINYINT(1) DEFAULT 1
);



create table
    ChiTietBanGiaoPhuLuc
(
    Id              VARCHAR(50) primary key,
    IdBanGiaoPhuLuc text,
    IdPhuLuc        text,
    SoLuong         float,
    NgayTao         text,
    NgayCapNhat     text,
    NguoiTao        text,
    NguoiCapNhat    text,
    IsActive        TINYINT(1) DEFAULT 1
);

create table TaiSanCon
(
    Id           varchar(50) primary key,
    IdTaiSanCha  varchar(50),
    IdTaiSanCon  varchar(50),
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IsActive     TINYINT(1) DEFAULT 1
);


create table KyTaiLieu
(
    Id        varchar(50) primary key,
    IdTaiLieu nvarchar(50),
    LoaiKy    int,
    X         float,
    Y         float,
    IdNguoiKy nvarchar(50),
    ChuKySo   text,
    NgayKy    text,
    STT       int
);

CREATE TABLE KhauHao
(
    Id           nvarchar(50) primary key,
    TenKhauHao   text,
    CongThuc     text,
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text
);

create table NguoiKy
(
    Id         varchar(50) primary key,
    IdTaiLieu  text,
    IdNguoiKy  text,
    IdPhongBan text,
    TrangThai  int
);
create table ChiTietTaiSan
(
    Id          varchar(50) primary key,
    IdTaiSan    text,
    NgayVaoSo   text,
    NgaySuDung  text,
    SoKyHieu    varchar(100),
    CongSuat    varchar(100),
    SoLuong     int,
    NuocSanXuat text,
    NamSanXuat  int
);
CREATE TABLE ChiTietDonViSoHuu
(
    Id              VARCHAR(50) PRIMARY KEY,
    IdCCDCVT        VARCHAR(50),
    IdTsCon         varchar(50),
    IdDonViSoHuu    VARCHAR(50),
    SoLuong         INT,
    ThoiGianBanGiao TEXT,
    NgayTao         TEXT,
    NguoiTao        VARCHAR(50)
);
create table LoaiTaiSanCon
(
    Id       varchar(64) primary key,
    IdLoaiTs varchar(64),
    TenLoai  varchar(200)
);
create table LoaiCCDCCon
(
    Id         varchar(64) primary key,
    IdLoaiCCDC varchar(64),
    TenLoai    varchar(200)
);
create table Config
(
    IdAccount      varchar(64) primary key,
    ThoiHanTaiLieu int
);

-- Hệ thống phân quyền
create table Permission
(
    Id             varchar(64) primary key,
    PermissionName varchar(100) not null,
    PermissionCode varchar(50)  not null unique,
    Description    text,
    IsActive       TINYINT(1) default 1
);

create table Role
(
    Id          varchar(64) primary key,
    RoleName    varchar(100) not null,
    RoleCode    varchar(50)  not null unique,
    Description text,
    IsActive    TINYINT(1) default 1
);

create table RolePermission
(
    Id           varchar(64) primary key,
    RoleId       varchar(64) not null,
    PermissionId varchar(64) not null,
    CanCreate    TINYINT(1) default 0,
    CanRead      TINYINT(1) default 0,
    CanUpdate    TINYINT(1) default 0,
    CanDelete    TINYINT(1) default 0
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


-- Insert dữ liệu mẫu cho phân quyền
-- Các quyền cơ bản
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

-- Phân quyền cho Administrator (có tất cả quyền)
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

-- Phân quyền cho Manager (có quyền đọc và cập nhật, không xóa)
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

-- Phân quyền cho User (chỉ đọc và tạo mới)
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

-- Phân quyền cho Viewer (chỉ đọc)
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
-- Thêm bảng UserPermission để lưu quyền trực tiếp của user


-- Thêm index để tối ưu performance
CREATE INDEX idx_userpermission_userid ON UserPermission (UserId);
CREATE INDEX idx_userpermission_permissionid ON UserPermission (PermissionId);
CREATE INDEX idx_userpermission_active ON UserPermission (IsActive);

create table DonViTinh
(
    Id       varchar(65) primary key,
    TenDonVi text,
    Note     text
);

create table NguonKinhPhi
(
    Id   varchar(64) primary key,
    Ten  text,
    Note text
);

create table SetNguonKinhPhi
(
    Id              varchar(64) primary key,
    IdTaiSan        text,
    IdNguonKinhPhi  text,
    TenNguonKinhPhi text
);

create table LyDoTang
(
    Id       varchar(64) primary key,
    Ten      text,
    TangGiam tinyint(1)
);
alter table TaiSan
    add column nvNS float;
alter table TaiSan
    add column vonVay float;
alter table TaiSan
    add column vonKhac float;

-- Tạo bảng Version để quản lý phiên bản
CREATE TABLE Version (
                         Id VARCHAR(50) PRIMARY KEY,
                         VersionName TEXT NOT NULL,
                         VersionCode TEXT NOT NULL,
                         Description TEXT,
                         ReleaseDate DATETIME,
                         IsActive BOOLEAN DEFAULT TRUE,
                         NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
                         NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         NguoiTao VARCHAR(50),
                         NguoiCapNhat VARCHAR(50)
);

-- Insert dữ liệu mẫu
INSERT INTO Version (Id, VersionName, VersionCode, Description, ReleaseDate, IsActive, NguoiTao, NguoiCapNhat) VALUES
                                                                                                                   ('v1.0.0', 'Version 1.0.0', '1.0.0', 'Phiên bản đầu tiên của hệ thống quản lý tài sản', '2024-01-01 00:00:00', TRUE, 'system', 'system'),
                                                                                                                   ('v1.1.0', 'Version 1.1.0', '1.1.0', 'Cập nhật tính năng báo cáo và thống kê', '2024-02-01 00:00:00', TRUE, 'system', 'system'),
                                                                                                                   ('v1.2.0', 'Version 1.2.0', '1.2.0', 'Thêm tính năng phân trang và tối ưu hiệu suất', '2024-03-01 00:00:00', TRUE, 'system', 'system');
alter table BanGiaoTaiSan add column IdGiamDoc text;
alter table BanGiaoTaiSan add column GiamDocKy tinyint;

alter table BanGiaoCCDCVatTu add column IdGiamDoc text;
alter table BanGiaoCCDCVatTu add column GiamDocKy tinyint;

create table
    Kho
(
    Id           VARCHAR(50) primary key,
    TenKho  varchar(500),
    IdQuanLy     text,
    IdCongTy     text,
    NgayTao      text,
    NgayCapNhat  text,
    NguoiTao     text,
    NguoiCapNhat text,
    IsActive     TINYINT(1) DEFAULT 1
);

alter table BanGiaoTaiSan add column SoQuyetDinh text;
alter table BanGiaoTaiSan add column NgayQuyetDinh text;
alter table BanGiaoTaiSan add column DiaDiemQuyetDinh text;

alter table BanGiaoCCDCVatTu add column SoQuyetDinh text;
alter table BanGiaoCCDCVatTu add column NgayQuyetDinh text;
alter table BanGiaoCCDCVatTu add column DiaDiemQuyetDinh text;
alter table PhongBan add column IsLanhDao tinyint(1);

alter table ChiTietBanGiaoTaiSan add HienTrang text;
alter table ChiTietBanGiaoCCDCVatTu add HienTrang text;
alter table ChiTietBanGiaoTaiSan add MoTa text;
alter table ChiTietBanGiaoCCDCVatTu add MoTa text;

alter table ChiTietDieuDongCCDCVatTu add HienTrang text;
alter table ChiTietDieuDongTaiSan add HienTrang text;
alter table ChiTietDieuDongCCDCVatTu add MoTa text;
alter table ChiTietDieuDongTaiSan add MoTa text;

alter table PhongBan add column LoaiKho int;

-- Tạo bảng Sequence để lưu số thứ tự cuối cùng đã dùng cho mỗi loại ID
-- Giải quyết vấn đề: khi xóa record có ID lớn nhất, ID mới sẽ không bị trùng

CREATE TABLE IF NOT EXISTS Sequence (
    SeqName VARCHAR(50) PRIMARY KEY,
    SeqYear INT NOT NULL,
    SeqValue INT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- BanGiaoTaiSan: BGTS-YYYY-XXX
-- =============================================
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'BGTS', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM BanGiaoTaiSan
WHERE Id LIKE CONCAT('BGTS-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

-- =============================================
-- BanGiaoCCDCVatTu: BGDC-YYYY-XXX
-- =============================================
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'BGDC', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM BanGiaoCCDCVatTu
WHERE Id LIKE CONCAT('BGDC-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

-- =============================================
-- DieuDongTaiSan:
-- CPTS (Cấp phát tài sản): CPTS-YYYY-XXX
-- DDTS (Điều động tài sản): DDTS-YYYY-XXX
-- THTS (Thu hồi tài sản): THTS-YYYY-XXX
-- =============================================
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'CPTS', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM DieuDongTaiSan
WHERE Id LIKE CONCAT('CPTS-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'DDTS', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM DieuDongTaiSan
WHERE Id LIKE CONCAT('DDTS-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'THTS', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM DieuDongTaiSan
WHERE Id LIKE CONCAT('THTS-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

-- =============================================
-- DieuDongCCDCVatTu:
-- CPDC (Cấp phát CCDC): CPDC-YYYY-XXX
-- DDDC (Điều động CCDC): DDDC-YYYY-XXX
-- THDC (Thu hồi CCDC): THDC-YYYY-XXX
-- =============================================
INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'CPDC', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM DieuDongCCDCVatTu
WHERE Id LIKE CONCAT('CPDC-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'DDDC', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM DieuDongCCDCVatTu
WHERE Id LIKE CONCAT('DDDC-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));

INSERT INTO Sequence (SeqName, SeqYear, SeqValue)
SELECT 'THDC', YEAR(CURDATE()), COALESCE(MAX(CAST(SUBSTRING(Id, 11) AS UNSIGNED)), 0)
FROM DieuDongCCDCVatTu
WHERE Id LIKE CONCAT('THDC-', YEAR(CURDATE()), '-%')
ON DUPLICATE KEY UPDATE SeqValue = GREATEST(SeqValue, VALUES(SeqValue));



alter table KyTaiLieu add Scale float;
alter table KyTaiLieu add width float;



alter table DieuDongTaiSan add column CoPhieuBanGiao tinyint(1);
alter table DieuDongCCDCVatTu add column CoPhieuBanGiao tinyint(1);

create table HienTrangKyThuat 
(
    Id       int primary key,
    TenHTKT  text,
    MoTa     text,
    NgayTao  text,
    NgayCapNhat text,
    NguoiTao text,
    NguoiCapNhat text,
    IsActive TINYINT(1) DEFAULT 1
);

alter table ChiTietDieuDongCCDCVatTu add SoLuongConLai float;


alter table ChiTietDieuDongCCDCVatTu add GhiChu text;
alter table ChiTietDieuDongTaiSan add GhiChu text;
alter table ChiTietBanGiaoCCDCVatTu add GhiChu text;
alter table ChiTietBanGiaoTaiSan add GhiChu text;