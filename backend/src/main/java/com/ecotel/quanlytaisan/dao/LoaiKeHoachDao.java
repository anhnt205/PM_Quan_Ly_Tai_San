
package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiKeHoach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class LoaiKeHoachDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<LoaiKeHoach> findAll(int page, int size, String search) {

        int offset = page * size;

       String sql = """
       SELECT 
        lkh.Id,
        lkh.Ten
        FROM LoaiKeHoachSucChua lkh 
        WHERE ( 
            ? IS NULL 
            OR lkh.Id LIKE ? 
            OR lkh.Ten LIKE ?
            ) LIMIT ? OFFSET ?
            """;

        String keyword = (search == null || search.isBlank())
                ? null
                : "%" + search + "%";

        return jdbcTemplate.query(
            sql,
            new BeanPropertyRowMapper<>(LoaiKeHoach.class),
            keyword,     
            keyword, 
            keyword, 
            size, 
            offset
        );
    }

    public long countAll( String keyword) {
        String whereClause = "";
        if (keyword != null && !keyword.trim().isEmpty()) {
            whereClause += " WHERE (LOWER(Ten) LIKE LOWER(?) OR LOWER(Id) LIKE LOWER(?))";
        }

        String sql = "SELECT COUNT(*) FROM LoaiKeHoachSucChua " + whereClause;

        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
            return jdbcTemplate.queryForObject(sql, Long.class, searchPattern, searchPattern);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class);
        }
    }

    public int insert(LoaiKeHoach entity) {

        String sql = """
        INSERT INTO LoaiKeHoachSucChua
        (Id,Ten,NgayTao,NgayCapNhat,NguoiTao,NguoiCapNhat,IsActive)
        VALUES (?,?,?,?,?,?,?)
        """;

        Date now = new Date();

        return jdbcTemplate.update(
                sql,
                entity.getId(),
                entity.getTen(),
                now,
                now,
                entity.getNguoiTao(),
                entity.getNguoiCapNhat(),
                true
        );
    }

    public int update(LoaiKeHoach entity) {

        String sql = """
        UPDATE LoaiKeHoachSucChua
        SET Ten=?,NgayCapNhat=?,NguoiCapNhat=?
        WHERE Id=?
        """;

        return jdbcTemplate.update(
                sql,
                entity.getTen(),
                new Date(),
                entity.getNguoiCapNhat(),
                entity.getId()
        );
    }

    public int delete(String id) {

        String sql = "DELETE FROM LoaiKeHoachSucChua WHERE Id=?";

        return jdbcTemplate.update(sql,id);
    }

    public int deleteAll() {

        String sql = "DELETE FROM LoaiKeHoachSucChua";

        return jdbcTemplate.update(sql);
    }

    public int deleteBatch(List<String> ids){

        String sql = "DELETE FROM LoaiKeHoachSucChua WHERE Id=?";

        int total = 0;

        for(String id : ids){
            total += jdbcTemplate.update(sql,id);
        }

        return total;
    }

}