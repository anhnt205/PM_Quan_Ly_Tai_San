package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.KetQuaSuaChua;
import com.ecotel.quanlytaisan.model.KetQuaSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.Date;

@Repository
public class KetQuaSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
        String sql = """
            SELECT 
                kq.Id,
                kq.IdSuaChua,
                kq.MaKetQua,
                kq.TenKetQua,
                kq.NgayBatDauThucTe,
                kq.NgayKetThucThucTe,
                kq.ThoiGianThucHienGio,
                kq.NoiDungCongViec,
                kq.KetQuaDatDuoc,
                kq.IdDonViThucHien,
                pb.TenPhongBan AS tenDonViThucHien,
                kq.NhanSuThucHien,
                kq.IdTruongNhom,
                nvTruongNhom.HoTen AS tenTruongNhom,
                kq.DanhGiaTinhTrang,
                kq.TrangThaiHoatDong,
                kq.TongChiPhi,
                kq.VatTuTieuHao,
                kq.DaXacNhan,
                kq.IdDaiDienBenGiao,
                nvGiao.HoTen AS tenDaiDienBenGiao,
                kq.DaiDienBenGiaoXacNhan,
                kq.IdDaiDienBenNhan,
                nvNhan.HoTen AS tenDaiDienBenNhan,
                kq.DaiDienBenNhanXacNhan,
                kq.TrangThai,
                kq.IdNguoiDuyet,
                nvDuyet.HoTen AS tenNguoiDuyet,
                kq.NgayDuyet,
                kq.LyDoTuChoi,
                kq.Note,
                kq.GhiChu,
                kq.DuongDanFile,
                kq.TenFile,
                kq.TaiLieuBanGhi,
                kq.ByStep,
                kq.IdGiamDoc,
                nvGiamDoc.HoTen AS tenGiamDoc,
                kq.GiamDocKy,
                kq.SoQuyetDinh,
                kq.NgayQuyetDinh,
                kq.DiaDiemQuyetDinh,
                kq.Share,
                kq.NgayTaoChungTu,
                kq.NgayTao,
                kq.NgayCapNhat,
                kq.NguoiTao,
                kq.NguoiCapNhat,
                kq.IsActive
            FROM KetQuaSuaChua kq
                LEFT JOIN PhongBan pb ON kq.IdDonViThucHien = pb.Id
                LEFT JOIN NhanVien nvTruongNhom ON kq.IdTruongNhom = nvTruongNhom.Id
                LEFT JOIN NhanVien nvGiao ON kq.IdDaiDienBenGiao = nvGiao.Id
                LEFT JOIN NhanVien nvNhan ON kq.IdDaiDienBenNhan = nvNhan.Id
                LEFT JOIN NhanVien nvDuyet ON kq.IdNguoiDuyet = nvDuyet.Id
                LEFT JOIN NhanVien nvGiamDoc ON kq.IdGiamDoc = nvGiamDoc.Id
            WHERE kq.IdSuaChua = ?
        """;
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChuaDTO.class), idSuaChua);
        } catch (Exception e) {
            return null;
        }
    }

    public KetQuaSuaChua findById(String id) {
        String sql = "SELECT * FROM KetQuaSuaChua WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(KetQuaSuaChua.class), id);
    }

    public String generateNextId() {
        int currentYear = Year.now().getValue();
        String seqName = "KETQUASUACHUA";
        String prefix = "KQSC-" + currentYear + "-";
        // Logic sinh ID giống SuaChuaDao
        return prefix + "0001"; // placeholder
    }

    public KetQuaSuaChua insert(KetQuaSuaChua entity) {
        entity.setId(generateNextId());
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        entity.setIsActive(true);
        // Insert statement (cần viết đầy đủ)
        return entity;
    }

    public KetQuaSuaChua update(KetQuaSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        // Update statement
        return entity;
    }

    public int delete(String id) {
        String sql = "DELETE FROM KetQuaSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }
}