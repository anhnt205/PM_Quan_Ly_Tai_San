package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.MoHinhTaiSan;
import com.ecotel.quanlytaisan.model.MoHinhTaiSanEnrichedDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MoHinhTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<MoHinhTaiSanEnrichedDTO> enrichedRowMapper = (rs, rowNum) -> {
        MoHinhTaiSanEnrichedDTO dto = new MoHinhTaiSanEnrichedDTO();
        dto.setId(rs.getString("Id"));
        dto.setTenMoHinh(rs.getString("TenMoHinh"));
        dto.setPhuongPhapKhauHao(rs.getInt("PhuongPhapKhauHao"));
        dto.setKyKhauHao(rs.getInt("KyKhauHao"));
        dto.setLoaiKyKhauHao(rs.getString("LoaiKyKhauHao"));
        dto.setTaiKhoanTaiSan(rs.getString("TaiKhoanTaiSan"));
        dto.setTaiKhoanKhauHao(rs.getString("TaiKhoanKhauHao"));
        dto.setTaiKhoanChiPhi(rs.getString("TaiKhoanChiPhi"));
        dto.setIdCongTy(rs.getString("IdCongTy"));
        dto.setNgayTao(rs.getString("NgayTao"));
        dto.setNgayCapNhat(rs.getString("NgayCapNhat"));
        dto.setNguoiTao(rs.getString("NguoiTao"));
        dto.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
        dto.setIsActive(rs.getBoolean("IsActive"));

        // Trường enrich
        dto.setTenCongTy(rs.getString("tenCongTy"));

        return dto;
    };

    public List<MoHinhTaiSanEnrichedDTO> findAll(String idCongTy) {
        String sql = """
        SELECT mhts.*, ct.TenCongTy AS tenCongTy 
        FROM MoHinhTaiSan mhts 
        LEFT JOIN CongTy ct ON mhts.IdCongTy = ct.Id 
        WHERE mhts.IdCongTy = ?
        """;
        return jdbcTemplate.query(sql, enrichedRowMapper, idCongTy);
    }
    public List<MoHinhTaiSanEnrichedDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search) {
        int offset = page * size;

        StringBuilder sql = new StringBuilder("SELECT mhts.*, ct.TenCongTy AS tenCongTy FROM MoHinhTaiSan mhts LEFT JOIN CongTy ct ON mhts.IdCongTy = ct.Id WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND mhts.IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (mhts.Id LIKE ? OR mhts.TenMoHinh LIKE ? OR mhts.TaiKhoanTaiSan LIKE ? OR mhts.TaiKhoanKhauHao LIKE ? OR mhts.TaiKhoanChiPhi LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        // Sort
        String orderBy = "mhts.Id";
        String[] allowed = {"Id", "TenMoHinh", "PhuongPhapKhauHao", "KyKhauHao", "LoaiKyKhauHao", "NgayTao", "NgayCapNhat"};
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            for (String col : allowed) {
                if (col.equalsIgnoreCase(sortBy.trim())) {
                    orderBy = "mhts." + col;
                    break;
                }
            }
        }
        String direction = (sortDir != null && sortDir.trim().equalsIgnoreCase("desc")) ? "DESC" : "ASC";

        sql.append(" ORDER BY ").append(orderBy).append(" ").append(direction)
                .append(" LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(), enrichedRowMapper, params.toArray());
    }

    public long countAll(String idCongTy, String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM MoHinhTaiSan WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (idCongTy != null && !idCongTy.trim().isEmpty()) {
            sql.append(" AND IdCongTy = ?");
            params.add(idCongTy);
        }

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim() + "%";
            sql.append(" AND (Id LIKE ? OR TenMoHinh LIKE ? OR TaiKhoanTaiSan LIKE ? OR TaiKhoanKhauHao LIKE ? OR TaiKhoanChiPhi LIKE ?)");
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
            params.add(keyword);
        }

        return jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
    }

    public MoHinhTaiSanEnrichedDTO findById(String id) {
        String sql = """
        SELECT 
            mhts.*,
            ct.TenCongTy AS tenCongTy
        FROM MoHinhTaiSan mhts
        LEFT JOIN CongTy ct ON mhts.IdCongTy = ct.Id
        WHERE mhts.Id = ?
        """;

        List<MoHinhTaiSanEnrichedDTO> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
            MoHinhTaiSanEnrichedDTO dto = new MoHinhTaiSanEnrichedDTO();
            dto.setId(rs.getString("Id"));
            dto.setTenMoHinh(rs.getString("TenMoHinh"));
            dto.setPhuongPhapKhauHao(rs.getInt("PhuongPhapKhauHao"));
            dto.setKyKhauHao(rs.getInt("KyKhauHao"));
            dto.setLoaiKyKhauHao(rs.getString("LoaiKyKhauHao"));
            dto.setTaiKhoanTaiSan(rs.getString("TaiKhoanTaiSan"));
            dto.setTaiKhoanKhauHao(rs.getString("TaiKhoanKhauHao"));
            dto.setTaiKhoanChiPhi(rs.getString("TaiKhoanChiPhi"));
            dto.setIdCongTy(rs.getString("IdCongTy"));
            dto.setNgayTao(rs.getString("NgayTao"));
            dto.setNgayCapNhat(rs.getString("NgayCapNhat"));
            dto.setNguoiTao(rs.getString("NguoiTao"));
            dto.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            dto.setIsActive(rs.getBoolean("IsActive"));

            // Trường enrich
            dto.setTenCongTy(rs.getString("tenCongTy"));

            return dto;
        }, id);

        if (results.isEmpty()) {
            return null;  // Không tìm thấy → trả null, xử lý ở service/controller
        }

        if (results.size() > 1) {
            throw new IllegalStateException("Tìm thấy nhiều hơn 1 mô hình với ID: " + id);
        }

        return results.get(0);
    }

    public int insert(MoHinhTaiSan mhts) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM MoHinhTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, mhts.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(mhts);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO MoHinhTaiSan (Id, TenMoHinh, PhuongPhapKhauHao, KyKhauHao, LoaiKyKhauHao, TaiKhoanTaiSan, TaiKhoanKhauHao, TaiKhoanChiPhi, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, mhts.getId(), mhts.getTenMoHinh(), mhts.getPhuongPhapKhauHao(), mhts.getKyKhauHao(), mhts.getLoaiKyKhauHao(), mhts.getTaiKhoanTaiSan(), mhts.getTaiKhoanKhauHao(), mhts.getTaiKhoanChiPhi(), mhts.getIdCongTy(), mhts.getNgayTao(), mhts.getNgayCapNhat(), mhts.getNguoiTao(), mhts.getNguoiCapNhat(), mhts.getIsActive());
        }
    }

    public int update(MoHinhTaiSan mhts) {
        String sql = "UPDATE MoHinhTaiSan SET TenMoHinh=?, PhuongPhapKhauHao=?, KyKhauHao=?, LoaiKyKhauHao=?, TaiKhoanTaiSan=?, TaiKhoanKhauHao=?, TaiKhoanChiPhi=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql, mhts.getTenMoHinh(), mhts.getPhuongPhapKhauHao(), mhts.getKyKhauHao(), mhts.getLoaiKyKhauHao(), mhts.getTaiKhoanTaiSan(), mhts.getTaiKhoanKhauHao(), mhts.getTaiKhoanChiPhi(), mhts.getIdCongTy(), mhts.getNgayTao(), mhts.getNgayCapNhat(), mhts.getNguoiTao(), mhts.getNguoiCapNhat(), mhts.getIsActive(), mhts.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM MoHinhTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }


    public int deleteAll() {
        String sql = "DELETE FROM MoHinhTaisan";
        return jdbcTemplate.update(sql);
    }


}
