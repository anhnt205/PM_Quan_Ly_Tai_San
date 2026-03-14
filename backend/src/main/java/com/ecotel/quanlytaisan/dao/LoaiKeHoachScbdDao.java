package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.LoaiKeHoach;
import com.ecotel.quanlytaisan.model.LoaiKeHoachSCBD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;


import java.util.List;

@Repository
public class LoaiKeHoachScbdDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<LoaiKeHoachSCBD> findAll() {
        String sql = "SELECT * FROM loaikehoach WHERE IsActive = 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(LoaiKeHoachSCBD.class));
    }

    public LoaiKeHoachSCBD findById(String id) {
        String sql = "SELECT * FROM loaikehoach WHERE Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(LoaiKeHoachSCBD.class), id);
    }

    public int insert(LoaiKeHoachSCBD loaiKeHoach) {
        String sql = "INSERT INTO loaikehoach (Id, TenLoai, MoTa, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                loaiKeHoach.getId(),
                loaiKeHoach.getTenLoai(),
                loaiKeHoach.getMoTa(),
                loaiKeHoach.getNgayTao(),
                loaiKeHoach.getNgayCapNhat(),
                loaiKeHoach.getNguoiTao(),
                loaiKeHoach.getNguoiCapNhat(),
                loaiKeHoach.getIsActive());
    }

    public int update(LoaiKeHoachSCBD loaiKeHoach) {
        String sql = "UPDATE loaikehoach SET TenLoai=?, MoTa=?, NgayCapNhat=?, NguoiCapNhat=?, IsActive=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                loaiKeHoach.getTenLoai(),
                loaiKeHoach.getMoTa(),
                loaiKeHoach.getNgayCapNhat(),
                loaiKeHoach.getNguoiCapNhat(),
                loaiKeHoach.getIsActive(),
                loaiKeHoach.getId());
    }

    public int delete(String id) {
        String sql = "UPDATE loaikehoach SET IsActive=0 WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

     public int deleteAll() {
        String sql = "DELETE FROM loaikehoach";
        return jdbcTemplate.update(sql);
    }
}
