package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.QuyTrinhSuaChuaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class QuyTrinhDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<QuyTrinhSuaChuaDTO> getPagedQuyTrinh(int page, int pageSize, String idTaiSan, Integer nam) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                scct.Id AS idSuaChuaChiTiet,
                ts.TenTaiSan AS thietBi,
                ts.Id AS thietBiId,
                sc.SoPhieu AS lenhSuaChua,
                sc.Id AS idSuaChua,
                sc.TrangThai AS trangThaiSuaChua,
                gd.SoPhieu AS bienBanGiamDinh,
                gd.Id AS idGiamDinh,
                gd.TrangThai AS trangThaiGiamDinh,
                nt.SoPhieu AS phieuNghiemThu,
                nt.Id AS idNghiemThu,
                nt.TrangThai AS trangThaiNghiemThu
            FROM suachua_chitiet scct
            LEFT JOIN suachua sc ON scct.IdSuaChua = sc.Id
            LEFT JOIN taisan ts ON scct.IdTaiSan = ts.Id
            LEFT JOIN giamdinh_chitiet gdct ON gdct.IdBienBanChiTiet = scct.Id
            LEFT JOIN giamdinh gd ON gdct.IdGiamDinh = gd.Id
            LEFT JOIN nghiemthu_taisan ntts ON ntts.IdChiTietGiamDinh = gdct.Id
            LEFT JOIN nghiemthu nt ON ntts.IdBienBan = nt.Id
            WHERE 1=1
        """);

        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND scct.IdTaiSan = ?");
            params.add(idTaiSan);
        }

        if (nam != null) {
            sql.append(" AND sc.nam = ?");
            params.add(nam);
        }

        sql.append(" ORDER BY scct.NgayTao DESC");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(pageSize);
        params.add((page - 1) * pageSize);

        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(QuyTrinhSuaChuaDTO.class), params.toArray());
    }

    public int countQuyTrinh(String idTaiSan, Integer nam) {
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(scct.Id)
            FROM suachua_chitiet scct
            LEFT JOIN suachua sc ON scct.IdSuaChua = sc.Id
            WHERE 1=1
        """);

        List<Object> params = new ArrayList<>();

        if (idTaiSan != null && !idTaiSan.isEmpty()) {
            sql.append(" AND scct.IdTaiSan = ?");
            params.add(idTaiSan);
        }

        if (nam != null) {
            sql.append(" AND sc.nam = ?");
            params.add(nam);
        }

        Integer count = jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
        return count != null ? count : 0;
    }
}
