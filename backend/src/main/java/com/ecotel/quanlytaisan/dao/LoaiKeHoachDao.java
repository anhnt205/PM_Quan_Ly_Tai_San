
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
        SELECT * FROM LoaiKeHoach
        WHERE (? IS NULL OR Id LIKE CONCAT('%',?,'%')
        OR Ten LIKE CONCAT('%',?,'%'))
        LIMIT ? OFFSET ?
        """;

        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(LoaiKeHoach.class),
                search, search, search,
                size,
                offset
        );
    }

    public int insert(LoaiKeHoach entity) {

        String sql = """
        INSERT INTO LoaiKeHoach
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
        UPDATE LoaiKeHoach
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

        String sql = "DELETE FROM LoaiKeHoach WHERE Id=?";

        return jdbcTemplate.update(sql,id);
    }

    public int deleteAll() {

        String sql = "DELETE FROM LoaiKeHoach";

        return jdbcTemplate.update(sql);
    }

    public int deleteBatch(List<String> ids){

        String sql = "DELETE FROM LoaiKeHoach WHERE Id=?";

        int total = 0;

        for(String id : ids){
            total += jdbcTemplate.update(sql,id);
        }

        return total;
    }

}