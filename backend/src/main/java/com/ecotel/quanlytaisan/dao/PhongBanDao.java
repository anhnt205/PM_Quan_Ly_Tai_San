package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.PhongBan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import com.ecotel.quanlytaisan.model.PhongBanDTO;

@Repository
public class PhongBanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper retained for potential reuse when needed in the future
    private RowMapper<PhongBan> rowMapper = new RowMapper<PhongBan>() {
        @Override
        public PhongBan mapRow(ResultSet rs, int rowNum) throws SQLException {
            PhongBan pb = new PhongBan();
            pb.setId(rs.getString("Id"));
            pb.setIdNhomDonvi(rs.getString("IdNhomDonvi"));
            pb.setTenPhongBan(rs.getString("TenPhongBan"));
            pb.setIdQuanLy(rs.getString("IdQuanLy"));
            pb.setIdCongTy(rs.getString("IdCongTy"));
            pb.setPhongCapTren(rs.getString("PhongCapTren"));
            pb.setMauSac(rs.getString("MauSac"));
            pb.setNgayTao(rs.getString("NgayTao"));
            pb.setNgayCapNhat(rs.getString("NgayCapNhat"));
            pb.setNguoiTao(rs.getString("NguoiTao"));
            pb.setNguoiCapNhat(rs.getString("NguoiCapNhat"));
            pb.setIsActive(rs.getBoolean("IsActive"));
            Object isKhoObj = rs.getObject("IsKho");
            pb.setIsKho(isKhoObj != null ? rs.getBoolean("IsKho") : null);
            Object isLanhDaoObj = rs.getObject("IsLanhDao");
            pb.setIsLanhDao(isLanhDaoObj != null ? rs.getBoolean("IsLanhDao") : null);
            Object loaiKhoObj = rs.getObject("LoaiKho");
            pb.setLoaiKho(loaiKhoObj != null ? rs.getInt("LoaiKho") : null);
            return pb;
        }
    };

    public List<PhongBanDTO> findAll(String idCongTy) {
        String sql = """
                  SELECT pb.Id,
                                          pb.IdNhomDonVi,
                                          pb.TenPhongBan,
                                          pb.IdQuanLy,
                                          pb.IdCongTy,
                                          pb.PhongCapTren,
                                          pb.MauSac,
                                          ndv.TenNhom,
                                          nv.HoTen AS HoTenQuanLy,
                                          pb.NguoiTao,
                                          pb.NguoiCapNhat,
                                          pb.IsKho,
                                          pb.IsLanhDao,
                                          pb.LoaiKho,
                                          pb2.TenPhongBan AS TenPhongCapTren,
                                          COUNT(nv2.Id) AS SoLuongNhanVien
                                   FROM PhongBan AS pb
                                            LEFT JOIN NhomDonVi AS ndv ON pb.IdNhomDonVi = ndv.Id
                                            LEFT JOIN NhanVien AS nv ON pb.IdQuanLy = nv.Id
                                            LEFT JOIN NhanVien AS nv2 ON nv2.BoPhan = pb.Id
                                            LEFT JOIN PhongBan AS pb2 ON pb.PhongCapTren = pb2.Id
                                   WHERE pb.IdCongTy = ?
                                   GROUP BY pb.Id,
                                            pb.IdNhomDonVi,
                                            pb.TenPhongBan,
                                            pb.IdQuanLy,
                                            pb.IdCongTy,
                                            pb.PhongCapTren,
                                            pb.MauSac,
                                            ndv.TenNhom,
                                            nv.HoTen,
                                            pb.NguoiTao,
                                            pb.NguoiCapNhat,
                                            pb.IsKho,
                                            pb.IsLanhDao,
                                            pb.LoaiKho,
                                            pb2.TenPhongBan;
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PhongBanDTO.class), idCongTy);
    }

    public long countByCongTy(String idCongTy, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            String sql = "SELECT COUNT(*) FROM PhongBan pb WHERE pb.IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        } else {
            String sql = """
                SELECT COUNT(*) 
                FROM PhongBan AS pb
                    LEFT JOIN NhomDonVi AS ndv ON pb.IdNhomDonVi = ndv.Id
                    LEFT JOIN NhanVien AS nv ON pb.IdQuanLy = nv.Id
                WHERE pb.IdCongTy = ?
                    AND (
                        LOWER(pb.Id) LIKE LOWER(?) OR
                        LOWER(pb.TenPhongBan) LIKE LOWER(?) OR
                        LOWER(ndv.TenNhom) LIKE LOWER(?) OR
                        LOWER(nv.HoTen) LIKE LOWER(?) OR
                        LOWER(pb.MauSac) LIKE LOWER(?)
                    )
                """;
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }
    }

    public List<PhongBanDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String keyword) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tenphongban":
                orderColumn = "pb.TenPhongBan";
                break;
            case "ngaytao":
                orderColumn = "pb.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "pb.NgayCapNhat";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = "WHERE pb.IdCongTy = ?";
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        
        if (hasKeyword) {
            whereClause += """
                     AND (
                        LOWER(pb.Id) LIKE LOWER(?) OR
                        LOWER(pb.TenPhongBan) LIKE LOWER(?) OR
                        LOWER(ndv.TenNhom) LIKE LOWER(?) OR
                        LOWER(nv.HoTen) LIKE LOWER(?) OR
                        LOWER(pb.MauSac) LIKE LOWER(?)
                    )
                """;
        }

        String sql = """
                  SELECT pb.Id,
                         pb.IdNhomDonVi,
                         pb.TenPhongBan,
                         pb.IdQuanLy,
                         pb.IdCongTy,
                         pb.PhongCapTren,
                         pb.MauSac,
                         ndv.TenNhom,
                         nv.HoTen AS HoTenQuanLy,
                         pb.NguoiTao,
                         pb.NguoiCapNhat,
                         pb.IsKho,
                         pb.IsLanhDao,
                         pb.LoaiKho,
                         pb2.TenPhongBan AS TenPhongCapTren,
                         COUNT(nv2.Id) AS SoLuongNhanVien
                  FROM PhongBan AS pb
                      LEFT JOIN NhomDonVi AS ndv ON pb.IdNhomDonVi = ndv.Id
                      LEFT JOIN NhanVien AS nv ON pb.IdQuanLy = nv.Id
                      LEFT JOIN NhanVien AS nv2 ON nv2.BoPhan = pb.Id
                      LEFT JOIN PhongBan AS pb2 ON pb.PhongCapTren = pb2.Id
                  %s
                  GROUP BY pb.Id,
                           pb.IdNhomDonVi,
                           pb.TenPhongBan,
                           pb.IdQuanLy,
                           pb.IdCongTy,
                           pb.PhongCapTren,
                           pb.MauSac,
                           ndv.TenNhom,
                           nv.HoTen,
                           pb.NguoiTao,
                           pb.NguoiCapNhat,
                           pb.IsKho,
                           pb.IsLanhDao,
                           pb.LoaiKho,
                           pb2.TenPhongBan
                  ORDER BY %s %s
                  LIMIT ? OFFSET ?
                """;
        String finalSql = String.format(sql, whereClause, orderColumn, direction);
        
        if (hasKeyword) {
            String searchPattern = "%" + keyword + "%";
            return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(PhongBanDTO.class), 
                idCongTy, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(PhongBanDTO.class), idCongTy, limit, offset);
        }
    }

    public PhongBanDTO findById(String id) {
        String sql = """
                SELECT
                    pb.Id,
                    pb.IdNhomDonVi,
                    pb.TenPhongBan,
                    pb.IdQuanLy,
                    pb.IdCongTy,
                    pb.PhongCapTren,
                    pb.MauSac,
                    ndv.TenNhom,
                    nv.HoTen,
                    pb.NguoiTao,
                    pb.NguoiCapNhat,
                    pb.IsKho,
                    pb.IsLanhDao,
                    pb.LoaiKho
                FROM
                    PhongBan AS pb
                        LEFT JOIN
                    NhomDonVi AS ndv ON pb.IdNhomDonVi = ndv.Id
                        LEFT JOIN
                    NhanVien AS nv ON pb.IdQuanLy = nv.Id
                WHERE
                    pb.Id = ?
                """;
        List<PhongBanDTO> result = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PhongBanDTO.class), id);
        return result.isEmpty() ? null : result.get(0);

    }

    public List<PhongBanDTO> findByLoaiKhoAndCongTy(String idCongTy, int loaiKho) {
        String sql = """
                SELECT
                    pb.Id,
                    pb.IdNhomDonVi,
                    pb.TenPhongBan,
                    pb.IdQuanLy,
                    pb.IdCongTy,
                    pb.PhongCapTren,
                    pb.MauSac,
                    ndv.TenNhom,
                    nv.HoTen,
                    pb.NguoiTao,
                    pb.NguoiCapNhat,
                    pb.IsKho,
                    pb.IsLanhDao,
                    pb.LoaiKho
                FROM
                    PhongBan
                WHERE
                    pb.IdCongTy = ? AND pb.LoaiKho = ?
                """;
        List<PhongBanDTO> result = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PhongBanDTO.class), idCongTy, loaiKho);
        return result;

    }

    public int insert(PhongBan pb) {
        System.out.println(pb.toString());
        
        // Kiểm tra id không null và không empty
        if (pb.getId() == null || pb.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }
        
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM PhongBan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, pb.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(pb);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO PhongBan (Id, IdNhomDonvi, TenPhongBan, IdQuanLy, IdCongTy, PhongCapTren, MauSac, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, IsKho, IsLanhDao, LoaiKho) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, pb.getId(), pb.getIdNhomDonvi(), pb.getTenPhongBan(), pb.getIdQuanLy(), pb.getIdCongTy(), pb.getPhongCapTren(), pb.getMauSac(), pb.getNgayTao(), pb.getNgayCapNhat(), pb.getNguoiTao(), pb.getNguoiCapNhat(), pb.getIsActive(), pb.getIsKho(), pb.getIsLanhDao(), pb.getLoaiKho());
        }
    }

    public int update(PhongBan pb) {
        String sql = "UPDATE PhongBan SET IdNhomDonvi=?, TenPhongBan=?, IdQuanLy=?, IdCongTy=?, PhongCapTren=?, MauSac=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, IsKho=?, IsLanhDao=?, LoaiKho=? WHERE Id=?";
        return jdbcTemplate.update(sql, pb.getIdNhomDonvi(), pb.getTenPhongBan(), pb.getIdQuanLy(), pb.getIdCongTy(), pb.getPhongCapTren(), pb.getMauSac(), pb.getNgayTao(), pb.getNgayCapNhat(), pb.getNguoiTao(), pb.getNguoiCapNhat(), pb.getIsActive(), pb.getIsKho(), pb.getIsLanhDao(), pb.getLoaiKho(), pb.getId());
    }

    public int batchUpdate(List<PhongBan> list) {
        String sql = "UPDATE PhongBan SET IdNhomDonvi=?, TenPhongBan=?, IdQuanLy=?, IdCongTy=?, PhongCapTren=?, MauSac=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, IsKho=?, IsLanhDao=?, LoaiKho=? WHERE Id=?";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                PhongBan pb = list.get(i);
                ps.setString(1, pb.getIdNhomDonvi());
                ps.setString(2, pb.getTenPhongBan());
                ps.setString(3, pb.getIdQuanLy());
                ps.setString(4, pb.getIdCongTy());
                ps.setString(5, pb.getPhongCapTren());
                ps.setString(6, pb.getMauSac());
                ps.setString(7, pb.getNgayTao());
                ps.setString(8, pb.getNgayCapNhat());
                ps.setString(9, pb.getNguoiTao());
                ps.setString(10, pb.getNguoiCapNhat());
                ps.setBoolean(11, pb.getIsActive() != null ? pb.getIsActive() : false);
                
                if (pb.getIsKho() != null) {
                    ps.setBoolean(12, pb.getIsKho());
                } else {
                    ps.setNull(12, java.sql.Types.BOOLEAN);
                }
                
                if (pb.getIsLanhDao() != null) {
                    ps.setBoolean(13, pb.getIsLanhDao());
                } else {
                    ps.setNull(13, java.sql.Types.BOOLEAN);
                }
                
                if (pb.getLoaiKho() != null) {
                    ps.setInt(14, pb.getLoaiKho());
                } else {
                    ps.setNull(14, java.sql.Types.INTEGER);
                }
                
                ps.setString(15, pb.getId());
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

    public int batchInsert(List<PhongBan> list) {
        String sql = "INSERT INTO PhongBan (Id, IdNhomDonvi, TenPhongBan, IdQuanLy, IdCongTy, PhongCapTren, MauSac, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, IsKho, IsLanhDao, LoaiKho) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                PhongBan pb = list.get(i);
                ps.setString(1, pb.getId());
                ps.setString(2, pb.getIdNhomDonvi());
                ps.setString(3, pb.getTenPhongBan());
                ps.setString(4, pb.getIdQuanLy());
                ps.setString(5, pb.getIdCongTy());
                ps.setString(6, pb.getPhongCapTren());
                ps.setString(7, pb.getMauSac());
                ps.setString(8, pb.getNgayTao());
                ps.setString(9, pb.getNgayCapNhat());
                ps.setString(10, pb.getNguoiTao());
                ps.setString(11, pb.getNguoiCapNhat());
                ps.setBoolean(12, pb.getIsActive() != null ? pb.getIsActive() : false);
                
                if (pb.getIsKho() != null) {
                    ps.setBoolean(13, pb.getIsKho());
                } else {
                    ps.setNull(13, java.sql.Types.BOOLEAN);
                }
                
                if (pb.getIsLanhDao() != null) {
                    ps.setBoolean(14, pb.getIsLanhDao());
                } else {
                    ps.setNull(14, java.sql.Types.BOOLEAN);
                }
                
                if (pb.getLoaiKho() != null) {
                    ps.setInt(15, pb.getLoaiKho());
                } else {
                    ps.setNull(15, java.sql.Types.INTEGER);
                }
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

    public int batchCreate(List<PhongBan> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }
        
        List<String> ids = new java.util.ArrayList<>();
        for (PhongBan pb : list) {
            if (pb.getId() != null && !pb.getId().trim().isEmpty()) {
                ids.add(pb.getId());
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
        
        String checkSql = "SELECT Id FROM PhongBan WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
            checkSql, 
            (rs, rowNum) -> rs.getString("Id"), 
            ids.toArray()
        );
        
        List<PhongBan> toInsert = new java.util.ArrayList<>();
        List<PhongBan> toUpdate = new java.util.ArrayList<>();
        
        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (PhongBan pb : list) {
            if (pb.getId() == null || pb.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(pb.getId())) {
                toUpdate.add(pb);
            } else {
                toInsert.add(pb);
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
        String sql = "DELETE FROM PhongBan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        String sql = "DELETE FROM PhongBan WHERE Id=?";
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
        String sql = "DELETE FROM PhongBan";
        return jdbcTemplate.update(sql);
    }




}
