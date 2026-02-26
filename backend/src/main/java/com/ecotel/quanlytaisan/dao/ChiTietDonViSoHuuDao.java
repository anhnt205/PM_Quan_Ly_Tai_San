package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuu;
import com.ecotel.quanlytaisan.model.NhomDonVi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class ChiTietDonViSoHuuDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final BeanPropertyRowMapper<ChiTietDonViSoHuu> rowMapper = new BeanPropertyRowMapper<>(ChiTietDonViSoHuu.class);

    // --- GET ALL ---
    public List<ChiTietDonViSoHuu> findAll() {
        String sql = "SELECT * FROM ChiTietDonViSoHuu";
        return jdbcTemplate.query(sql, rowMapper);
    }

    // --- GET BY ID (optional, hữu ích cho update kiểm tra tồn tại) ---
    public ChiTietDonViSoHuu findById(String id) {
        String sql = "SELECT * FROM ChiTietDonViSoHuu WHERE Id = ?";
        List<ChiTietDonViSoHuu> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    // --- SEARCH (từ khóa trên Id/IdCCDCVT/IdDonViSoHuu/NguoiTao) ---
    public List<ChiTietDonViSoHuu> search(String keyword) {
        String like = "%" + keyword + "%";
        String sql = "SELECT * FROM ChiTietDonViSoHuu " + "WHERE Id LIKE ? OR IdCCDCVT LIKE ? OR IdDonViSoHuu LIKE ? OR NguoiTao LIKE ?";
        return jdbcTemplate.query(sql, rowMapper, like, like, like, like);
    }

    // --- EXISTING FILTERS ---
    public List<ChiTietDonViSoHuu> findByIdCCDCVT(String idCCDCVT) {
        String sql = "SELECT * FROM ChiTietDonViSoHuu WHERE IdCCDCVT = ?";
        return jdbcTemplate.query(sql, rowMapper, idCCDCVT);
    }

    public List<ChiTietDonViSoHuu> findByIdDonViSoHuu(String idDonViSoHuu) {
        String sql = "SELECT * FROM ChiTietDonViSoHuu WHERE IdDonViSoHuu = ?";
        return jdbcTemplate.query(sql, rowMapper, idDonViSoHuu);
    }

// --- INSERT/UPDATE (Id tự sinh) ---
    public int insert(ChiTietDonViSoHuu entity) {
        // Kiểm tra tồn tại theo IdCCDCVT, IdDonViSoHuu, IdTsCon
        String checkSql = "SELECT COUNT(*) FROM ChiTietDonViSoHuu WHERE IdCCDCVT = ? AND IdDonViSoHuu = ? AND IdTsCon = ?";
        int count = jdbcTemplate.queryForObject(
                checkSql,
                Integer.class,
                entity.getIdCCDCVT(),
                entity.getIdDonViSoHuu(),
                entity.getIdTsCon()
        );

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(entity);
        } else {
            // Nếu chưa tồn tại thì insert
            String newId = UUID.randomUUID().toString();
            String sql = "INSERT INTO ChiTietDonViSoHuu " +
                    "(Id, IdCCDCVT, IdDonViSoHuu, SoLuong, ThoiGianBanGiao, NgayTao, NguoiTao, IdTsCon) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(
                    sql,
                    newId,
                    entity.getIdCCDCVT(),
                    entity.getIdDonViSoHuu(),
                    entity.getSoLuong(),
                    entity.getThoiGianBanGiao(),
                    entity.getNgayTao(),
                    entity.getNguoiTao(),
                    entity.getIdTsCon()
            );
            entity.setId(newId);
            return rows;
        }
    }


    // --- UPDATE ---
    public int update(ChiTietDonViSoHuu entity) {
        String sql = "UPDATE ChiTietDonViSoHuu SET " + "IdCCDCVT = ?, " + "IdDonViSoHuu = ?, " + "SoLuong = ?, " + "ThoiGianBanGiao = ?, " + "NgayTao = ?, " + "NguoiTao = ? , IdTsCon = ? " + "WHERE Id = ?";
        return jdbcTemplate.update(sql, entity.getIdCCDCVT(), entity.getIdDonViSoHuu(), entity.getSoLuong(), entity.getThoiGianBanGiao(), entity.getNgayTao(), entity.getNguoiTao(), entity.getIdTsCon(), entity.getId());
    }

    // --- DELETE ---
    public int deleteById(String id) {
        String sql = "DELETE FROM ChiTietDonViSoHuu WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int updateSoLuong(String idCCDCVT, String idDonViGui, String idDonViNhan, int soLuongBanGiao, String thoiGianBanGiao, String idTaiSanCon) {
        // Kiểm tra đơn vị nhận đã có chưa
        String sql = "SELECT * FROM ChiTietDonViSoHuu WHERE IdDonViSoHuu = ? AND IdCCDCVT = ? AND IdTsCon=?";
        List<ChiTietDonViSoHuu> listNhan = jdbcTemplate.query(sql, rowMapper, idDonViNhan, idCCDCVT, idTaiSanCon);

        int rowsAffected = 0;

        if (listNhan.isEmpty()) {
            // Nếu đơn vị nhận chưa có → Insert mới
            String newId = UUID.randomUUID().toString();
            sql = "INSERT INTO ChiTietDonViSoHuu " + "(Id, IdCCDCVT, IdDonViSoHuu, SoLuong, ThoiGianBanGiao, NgayTao, NguoiTao, IdTsCon) " + "VALUES (?, ?, ?, ?, ?, ?, ?,?)";
            rowsAffected += jdbcTemplate.update(sql, newId, idCCDCVT, idDonViNhan, soLuongBanGiao, thoiGianBanGiao, new java.sql.Date(System.currentTimeMillis()), "system", idTaiSanCon);
        } else {
            // Nếu đã tồn tại → Cộng thêm số lượng
            ChiTietDonViSoHuu nhan = listNhan.get(0);
            int soLuongMoi = nhan.getSoLuong() + soLuongBanGiao;

            sql = "UPDATE ChiTietDonViSoHuu SET SoLuong = ?, ThoiGianBanGiao = ? " + "WHERE IdDonViSoHuu = ? AND IdCCDCVT = ? AND IdTsCon=?";
            rowsAffected += jdbcTemplate.update(sql, soLuongMoi, thoiGianBanGiao, idDonViNhan, idCCDCVT, idTaiSanCon);
        }

        // Giảm số lượng bên gửi
        List<ChiTietDonViSoHuu> listGui = jdbcTemplate.query("SELECT * FROM ChiTietDonViSoHuu WHERE IdDonViSoHuu = ? AND IdCCDCVT = ?  AND IdTsCon=?", rowMapper, idDonViGui, idCCDCVT, idTaiSanCon);

        if (listGui.isEmpty()) {
            return rowsAffected;
        }

        ChiTietDonViSoHuu gui = listGui.get(0);

        if (gui == null) {
            return rowsAffected;
        }

        if (gui.getSoLuong() < soLuongBanGiao) {
            throw new RuntimeException("Số lượng đơn vị gửi không đủ để bàn giao!");
        }
        try {
            int soLuongMoiGui = gui.getSoLuong() - soLuongBanGiao;
            sql = "UPDATE ChiTietDonViSoHuu SET SoLuong = ?, ThoiGianBanGiao = ? " + "WHERE IdDonViSoHuu = ? AND IdCCDCVT = ?  AND IdTsCon=?";
            rowsAffected += jdbcTemplate.update(sql, soLuongMoiGui, thoiGianBanGiao, idDonViGui, idCCDCVT, idTaiSanCon);
        } catch (Exception e) {
            return rowsAffected;
        }


        return rowsAffected;
    }

    public List<String> getNhomDonViSoHuu(String idTaiSan) {
        String sql = "SELECT MIN(IdDonViSoHuu) as IdDonViSoHuu " + "FROM ChiTietDonViSoHuu " + "WHERE IdCCDCVT = ? " + "GROUP BY IdDonViSoHuu";
        return jdbcTemplate.queryForList(sql, String.class, idTaiSan);
    }

}
