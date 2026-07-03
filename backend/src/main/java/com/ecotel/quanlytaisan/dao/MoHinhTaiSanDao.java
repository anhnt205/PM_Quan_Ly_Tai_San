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

    public int batchUpdate(List<MoHinhTaiSan> list) {
        String sql = "UPDATE MoHinhTaiSan SET TenMoHinh=?, PhuongPhapKhauHao=?, KyKhauHao=?, LoaiKyKhauHao=?, TaiKhoanTaiSan=?, TaiKhoanKhauHao=?, TaiKhoanChiPhi=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                MoHinhTaiSan mhts = list.get(i);
                ps.setString(1, mhts.getTenMoHinh());
                
                if (mhts.getPhuongPhapKhauHao() != null) ps.setInt(2, mhts.getPhuongPhapKhauHao());
                else ps.setNull(2, java.sql.Types.INTEGER);
                
                if (mhts.getKyKhauHao() != null) ps.setInt(3, mhts.getKyKhauHao());
                else ps.setNull(3, java.sql.Types.INTEGER);
                
                ps.setString(4, mhts.getLoaiKyKhauHao());
                ps.setString(5, mhts.getTaiKhoanTaiSan());
                ps.setString(6, mhts.getTaiKhoanKhauHao());
                ps.setString(7, mhts.getTaiKhoanChiPhi());
                ps.setString(8, mhts.getIdCongTy());
                ps.setString(9, mhts.getNgayTao());
                ps.setString(10, mhts.getNgayCapNhat());
                ps.setString(11, mhts.getNguoiTao());
                ps.setString(12, mhts.getNguoiCapNhat());
                
                if (mhts.getIsActive() != null) ps.setBoolean(13, mhts.getIsActive());
                else ps.setNull(13, java.sql.Types.BOOLEAN);
                
                ps.setString(14, mhts.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchInsert(List<MoHinhTaiSan> list) {
        String sql = "INSERT INTO MoHinhTaiSan (Id, TenMoHinh, PhuongPhapKhauHao, KyKhauHao, LoaiKyKhauHao, TaiKhoanTaiSan, TaiKhoanKhauHao, TaiKhoanChiPhi, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                MoHinhTaiSan mhts = list.get(i);
                ps.setString(1, mhts.getId());
                ps.setString(2, mhts.getTenMoHinh());
                
                if (mhts.getPhuongPhapKhauHao() != null) ps.setInt(3, mhts.getPhuongPhapKhauHao());
                else ps.setNull(3, java.sql.Types.INTEGER);
                
                if (mhts.getKyKhauHao() != null) ps.setInt(4, mhts.getKyKhauHao());
                else ps.setNull(4, java.sql.Types.INTEGER);
                
                ps.setString(5, mhts.getLoaiKyKhauHao());
                ps.setString(6, mhts.getTaiKhoanTaiSan());
                ps.setString(7, mhts.getTaiKhoanKhauHao());
                ps.setString(8, mhts.getTaiKhoanChiPhi());
                ps.setString(9, mhts.getIdCongTy());
                ps.setString(10, mhts.getNgayTao());
                ps.setString(11, mhts.getNgayCapNhat());
                ps.setString(12, mhts.getNguoiTao());
                ps.setString(13, mhts.getNguoiCapNhat());
                
                if (mhts.getIsActive() != null) ps.setBoolean(14, mhts.getIsActive());
                else ps.setNull(14, java.sql.Types.BOOLEAN);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchCreate(List<MoHinhTaiSan> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (MoHinhTaiSan mhts : list) {
            if (mhts.getId() != null && !mhts.getId().trim().isEmpty()) {
                ids.add(mhts.getId());
            }
        }

        if (ids.isEmpty()) {
            return 0;
        }

        StringBuilder inBuilder = new StringBuilder();
        for (int i = 0; i < ids.size(); i++) {
            inBuilder.append("?");
            if (i < ids.size() - 1) {
                inBuilder.append(",");
            }
        }

        String checkSql = "SELECT Id FROM MoHinhTaiSan WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<MoHinhTaiSan> toInsert = new java.util.ArrayList<>();
        List<MoHinhTaiSan> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (MoHinhTaiSan mhts : list) {
            if (mhts.getId() == null || mhts.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(mhts.getId())) {
                toUpdate.add(mhts);
            } else {
                toInsert.add(mhts);
            }
        }

        int total = 0;
        if (!toInsert.isEmpty()) {
            total += batchInsert(toInsert);
        }
        if (!toUpdate.isEmpty()) {
            total += batchUpdate(toUpdate);
        }

        return total;
    }

    public int delete(String id) {
        String sql = "DELETE FROM MoHinhTaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sql = "DELETE FROM MoHinhTaiSan WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }


    public int deleteAll() {
        String sql = "DELETE FROM MoHinhTaisan";
        return jdbcTemplate.update(sql);
    }


}
