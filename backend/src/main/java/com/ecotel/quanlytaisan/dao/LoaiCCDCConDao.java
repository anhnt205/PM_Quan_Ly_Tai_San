package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiCCDCCon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LoaiCCDCConDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper CHO CÁC QUERY CÓ JOIN (có TenLoaiCCDC)
    private final RowMapper<LoaiCCDCCon> rowMapperWithJoin = (rs, rowNum) -> {
        LoaiCCDCCon l = new LoaiCCDCCon();
        l.setId(rs.getString("Id"));
        l.setIdLoaiCCDC(rs.getString("IdLoaiCCDC"));
        l.setTenLoai(rs.getString("TenLoai"));
        l.setTenLoaiCCDC(rs.getString("TenLoaiCCDC"));
        return l;
    };

    // RowMapper CHO CÁC QUERY KHÔNG JOIN (không có TenLoaiCCDC)
    private final RowMapper<LoaiCCDCCon> rowMapperSimple = (rs, rowNum) -> {
        LoaiCCDCCon l = new LoaiCCDCCon();
        l.setId(rs.getString("Id"));
        l.setIdLoaiCCDC(rs.getString("IdLoaiCCDC"));
        l.setTenLoai(rs.getString("TenLoai"));
        // Không set TenLoaiCCDC vì không có trong query
        return l;
    };

    // ==================== PHÂN TRANG ====================

    public List<LoaiCCDCCon> findAllPaged(
            int offset,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {

        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "lccdc.TenLoai";
        }
        if (sortDir == null || sortDir.isBlank()) {
            sortDir = "ASC";
        }

        String sql = """
        SELECT lccdc.Id,
               lccdc.IdLoaiCCDC,
               lccdc.TenLoai,
               nc.Ten AS TenLoaiCCDC
        FROM LoaiCCDCCon lccdc
        LEFT JOIN nhomccdc nc
          ON lccdc.IdLoaiCCDC COLLATE utf8mb4_unicode_ci
           = nc.Id COLLATE utf8mb4_unicode_ci
        WHERE (
            ? IS NULL
            OR lccdc.Id LIKE ?
            OR lccdc.TenLoai LIKE ?
            OR lccdc.IdLoaiCCDC LIKE ?
            OR nc.Ten LIKE ?
        )
        ORDER BY %s %s
        LIMIT ? OFFSET ?
    """.formatted(sortBy, sortDir);

        String keyword = (search == null || search.isBlank())
                ? null
                : "%" + search + "%";

        return jdbcTemplate.query(
                sql,
                new Object[]{
                        keyword,
                        keyword,
                        keyword,
                        keyword,
                        keyword,
                        size,
                        offset
                },
                rowMapperWithJoin  // Dùng rowMapper có TenLoaiCCDC
        );
    }


    public long countAll(String search) {
        String sql = """
            SELECT COUNT(*)
            FROM LoaiCCDCCon lccdc
            LEFT JOIN nhomccdc nc
              ON lccdc.IdLoaiCCDC COLLATE utf8mb4_unicode_ci
               = nc.Id COLLATE utf8mb4_unicode_ci
            WHERE (
                ? IS NULL
                OR lccdc.Id LIKE ?
                OR lccdc.TenLoai LIKE ?
                OR lccdc.IdLoaiCCDC LIKE ?
                OR nc.Ten LIKE ?
            )
        """;

        String kw = search == null ? null : "%" + search + "%";

        return jdbcTemplate.queryForObject(sql, Long.class, kw, kw, kw, kw, kw);
    }

    // ==================== THEO CHA ====================

    public List<LoaiCCDCCon> findPagedByIdLoaiCCDC(
            String idLoaiCCDC,
            int offset, int size,
            String sortBy, String sortDir,
            String search
    ) {
        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "lccdc.TenLoai";
        }
        if (sortDir == null || sortDir.isBlank()) {
            sortDir = "ASC";
        }

        String sql = """
            SELECT lccdc.Id,
                   lccdc.IdLoaiCCDC,
                   lccdc.TenLoai,
                   nc.Ten AS TenLoaiCCDC
            FROM LoaiCCDCCon lccdc
            LEFT JOIN nhomccdc nc
              ON lccdc.IdLoaiCCDC COLLATE utf8mb4_unicode_ci
               = nc.Id COLLATE utf8mb4_unicode_ci
            WHERE lccdc.IdLoaiCCDC = ?
              AND (? IS NULL OR lccdc.TenLoai LIKE ?)
            ORDER BY %s %s
            LIMIT ? OFFSET ?
        """.formatted(sortBy, sortDir);

        String kw = search == null ? null : "%" + search + "%";

        return jdbcTemplate.query(
                sql,
                rowMapperWithJoin,  // Dùng rowMapper có TenLoaiCCDC
                idLoaiCCDC,
                kw, kw,
                size, offset
        );
    }

    public long countByIdLoaiCCDC(String idLoaiCCDC, String search) {
        String sql = """
            SELECT COUNT(*)
            FROM LoaiCCDCCon
            WHERE IdLoaiCCDC = ?
              AND (? IS NULL OR TenLoai LIKE ?)
        """;

        String kw = search == null ? null : "%" + search + "%";

        return jdbcTemplate.queryForObject(
                sql, Long.class,
                idLoaiCCDC,
                kw, kw
        );
    }

    // ==================== CRUD ====================

    public List<LoaiCCDCCon> findAll() {
        // SỬA: Dùng JOIN để lấy cả TenLoaiCCDC
        String sql = """
            SELECT lccdc.Id,
                   lccdc.IdLoaiCCDC,
                   lccdc.TenLoai,
                   nc.Ten AS TenLoaiCCDC
            FROM LoaiCCDCCon lccdc
            LEFT JOIN nhomccdc nc
              ON lccdc.IdLoaiCCDC COLLATE utf8mb4_unicode_ci
               = nc.Id COLLATE utf8mb4_unicode_ci
        """;

        return jdbcTemplate.query(sql, rowMapperWithJoin);
    }

    public LoaiCCDCCon findById(String id) {
        // SỬA: Dùng JOIN để lấy cả TenLoaiCCDC
        String sql = """
            SELECT lccdc.Id,
                   lccdc.IdLoaiCCDC,
                   lccdc.TenLoai,
                   nc.Ten AS TenLoaiCCDC
            FROM LoaiCCDCCon lccdc
            LEFT JOIN nhomccdc nc
              ON lccdc.IdLoaiCCDC COLLATE utf8mb4_unicode_ci
               = nc.Id COLLATE utf8mb4_unicode_ci
            WHERE lccdc.Id = ?
        """;

        return jdbcTemplate.queryForObject(sql, rowMapperWithJoin, id);
    }

    public List<LoaiCCDCCon> findByIdLoaiCCDC(String idLoaiCCDC) {
        // SỬA: Dùng JOIN để lấy cả TenLoaiCCDC
        String sql = """
            SELECT lccdc.Id,
                   lccdc.IdLoaiCCDC,
                   lccdc.TenLoai,
                   nc.Ten AS TenLoaiCCDC
            FROM LoaiCCDCCon lccdc
            LEFT JOIN nhomccdc nc
              ON lccdc.IdLoaiCCDC COLLATE utf8mb4_unicode_ci
               = nc.Id COLLATE utf8mb4_unicode_ci
            WHERE lccdc.IdLoaiCCDC = ?
        """;

        return jdbcTemplate.query(sql, rowMapperWithJoin, idLoaiCCDC);
    }

    public int insert(LoaiCCDCCon l) {
        return jdbcTemplate.update(
                "INSERT INTO LoaiCCDCCon (Id, IdLoaiCCDC, TenLoai) VALUES (?, ?, ?)",
                l.getId(),
                l.getIdLoaiCCDC(),
                l.getTenLoai()
        );
    }

    public int update(LoaiCCDCCon l) {
        return jdbcTemplate.update(
                "UPDATE LoaiCCDCCon SET IdLoaiCCDC = ?, TenLoai = ? WHERE Id = ?",
                l.getIdLoaiCCDC(),
                l.getTenLoai(),
                l.getId()
        );
    }

    public int delete(String id) {
        return jdbcTemplate.update(
                "DELETE FROM LoaiCCDCCon WHERE Id = ?",
                id
        );
    }



    public int deleteAll() {
        String sql = "DELETE FROM LoaiCCDCCon";
        return jdbcTemplate.update(sql);
    }



}