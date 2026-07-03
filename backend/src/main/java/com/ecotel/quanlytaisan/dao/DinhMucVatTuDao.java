package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DinhMucVatTu;
import com.ecotel.quanlytaisan.model.DinhMucVatTuDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class DinhMucVatTuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DinhMucVatTuDTO> findByDinhMucId(String idDinhMuc) {
        String sql = """
                SELECT 
                    dmvt.*, 
                    ccdc.Ten AS tenCCDCVT, 
                    dvt.TenDonVi AS donViTinh,
                    ccdc.KyHieu AS kyHieu,
                    nhom.Ten AS tenNhom
                FROM DinhMucVatTu dmvt
                LEFT JOIN CCDCVatTu ccdc ON dmvt.IdCCDCVT = ccdc.Id
                LEFT JOIN DonViTinh dvt ON ccdc.DonViTinh = dvt.Id
                LEFT JOIN NhomCCDC nhom ON ccdc.IdNhomCCDC = nhom.Id
                WHERE dmvt.IdDinhMuc = ?
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DinhMucVatTuDTO.class), idDinhMuc);
    }

    public int insert(DinhMucVatTu dmvt) {
        if (dmvt.getId() == null || dmvt.getId().isEmpty()) {
            dmvt.setId(UUID.randomUUID().toString());
        }
        String sql = "INSERT INTO DinhMucVatTu (Id, IdDinhMuc, IdCCDCVT, IdChiTietVatTu, SoLuong, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, dmvt.getId(), dmvt.getIdDinhMuc(), dmvt.getIdCCDCVT(), dmvt.getIdChiTietVatTu(), dmvt.getSoLuong(), dmvt.getGhiChu(), dmvt.getNgayTao(), dmvt.getNgayCapNhat(), dmvt.getNguoiTao(), dmvt.getNguoiCapNhat(), dmvt.getIsActive());
    }

    public int update(DinhMucVatTu dmvt) {
        String sql = "UPDATE DinhMucVatTu SET IdCCDCVT = ?, IdChiTietVatTu = ?, SoLuong = ?, GhiChu = ?, NgayCapNhat = ?, NguoiCapNhat = ?, IsActive = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, dmvt.getIdCCDCVT(), dmvt.getIdChiTietVatTu(), dmvt.getSoLuong(), dmvt.getGhiChu(), dmvt.getNgayCapNhat(), dmvt.getNguoiCapNhat(), dmvt.getIsActive(), dmvt.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM DinhMucVatTu WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteByDinhMucId(String idDinhMuc) {
        String sql = "DELETE FROM DinhMucVatTu WHERE IdDinhMuc = ?";
        return jdbcTemplate.update(sql, idDinhMuc);
    }
}
