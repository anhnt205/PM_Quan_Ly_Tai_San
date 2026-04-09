export interface DinhMucVatTu {
    id: string;
    idDinhMuc: string;
    idCCDCVT: string;
    tenCCDCVT?: string;
    donViTinh?: string;
    kyHieu?: string;
    soLuong: number;
    ghiChu: string;
    isNew?: boolean;
    isDeleted?: boolean;
    isUpdated?: boolean;
}

export interface DinhMucSuaChua {
    id: string;
    tenLoaiTaiSan?: string;
    idCapSuaChua: string;
    tenCapSuaChua?: string;
    ghiChu: string;
    ngayTao?: string;
    ngayCapNhat?: string;
    nguoiTao?: string;
    nguoiCapNhat?: string;
    isActive: boolean;
    dinhMucVatTuList: DinhMucVatTu[];
}
