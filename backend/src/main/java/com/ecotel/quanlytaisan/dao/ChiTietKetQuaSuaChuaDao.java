package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietKetQuaSuaChua;
import com.ecotel.quanlytaisan.model.ChiTietKetQuaSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class ChiTietKetQuaSuaChuaDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ChiTietKetQuaSuaChuaDTO> findByIdKetQua(String idKetQuaSuaChua) {
        String sql = """
            SELECT 
                ct.Id,
                ct.IdKetQuaSuaChua,
                ct.IdTaiSan,
                ts.TenTaiSan,
                ct.IdCCDC,
                ct.IdChiTietCCDC,
                ts.KyHieu,
                ts.SoKyHieu,
                ts.DonViTinh,
                ct.SoLuong,
                ct.HienTrang,
                ct.MoTa,
                ct.DanhGia,
                ct.VatTuSuDung,
                ct.GhiChu,
                ct.NgayTao,
                ct.NgayCapNhat,
                ct.NguoiTao,
                ct.NguoiCapNhat,
                ct.IsActive
            FROM ChiTietKetQuaSuaChua ct
                INNER JOIN TaiSan ts ON ct.IdTaiSan = ts.Id
            WHERE ct.IdKetQuaSuaChua = ?
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietKetQuaSuaChuaDTO.class), idKetQuaSuaChua);
    }

    public ChiTietKetQuaSuaChuaDTO findById(String id) {
        String sql = "SELECT ... WHERE ct.Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietKetQuaSuaChuaDTO.class), id);
    }

    public int insert(ChiTietKetQuaSuaChua entity) {
        entity.setNgayTao(new Date());
        entity.setNgayCapNhat(entity.getNgayTao());
        entity.setIsActive(true);
        String sql = """
            INSERT INTO ChiTietKetQuaSuaChua (
                        Id,
                        IdKetQuaSuaChua,
                        IdTaiSan,
                        IdCCDC,
                        IdChiTietCCDC,
                        SoLuong,
                        HienTrang,
                        MoTa,
                        DanhGia,
                        VatTuSuDung,
                        GhiChu,
                        NgayTao,
                        NgayCapNhat,
                        NguoiTao,
                        NguoiCapNhat,
                        IsActive
            )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                entity.getId(),
                entity.getIdKetQuaSuaChua(),
                entity.getIdTaiSan(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getSoLuong(),
                entity.getHienTrang(),
                entity.getMoTa(),
                entity.getDanhGia(),
                entity.getVatTuSuDung(),
                entity.getGhiChu(),
                entity.getNgayTao(),
                entity.getNgayCapNhat(),
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                entity.getIsActive());
    }

    public int update(ChiTietKetQuaSuaChua entity) {
        entity.setNgayCapNhat(new Date());
        String sql = """
            UPDATE ChiTietKetQuaSuaChua SET
                                    IdKetQuaSuaChua = ?,
                                    IdTaiSan = ?,
                                    IdCCDC = ?,
                                    IdChiTietCCDC = ?,
                                    SoLuong = ?,
                                    HienTrang = ?,
                                    MoTa = ?,
                                    DanhGia = ?,
                                    VatTuSuDung = ?,
                                    GhiChu = ?,
                                    NgayCapNhat = ?,
                                    NguoiCapNhat = ?,
                                    IsActive = ?
                                WHERE Id = ?
        """;
        return jdbcTemplate.update(sql,
                entity.getIdKetQuaSuaChua(),
                entity.getIdTaiSan(),
                entity.getIdCCDC(),
                entity.getIdChiTietCCDC(),
                entity.getSoLuong(),
                entity.getHienTrang(),
                entity.getMoTa(),
                entity.getDanhGia(),
                entity.getVatTuSuDung(),
                entity.getGhiChu(),
                entity.getNgayCapNhat(),
                entity.getNguoiCapNhat(),
                entity.getIsActive(),
                entity.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChiTietKetQuaSuaChua WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByIdKetQua(String idKetQuaSuaChua) {
        String sql = "DELETE FROM ChiTietKetQuaSuaChua WHERE IdKetQuaSuaChua = ?";
        return jdbcTemplate.update(sql, idKetQuaSuaChua);
    }
}