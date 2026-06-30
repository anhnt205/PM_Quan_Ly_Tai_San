package com.ecotel.quanlytaisan.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuu;
import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuuEnrichedDTO;

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

    public int countAll(String search, String idDonViSoHuu, String date) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM ChiTietDonViSoHuu dvsh ");
        sql.append("INNER JOIN CCDCVatTu ccdc ON ccdc.Id = dvsh.IdCCDCVT ");
        sql.append("LEFT JOIN PhongBan pb ON pb.Id = dvsh.IdDonViSoHuu ");
        sql.append("WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        if (search != null && !search.trim().isEmpty()) {
            String like = "%" + search.trim() + "%";
            sql.append("AND (dvsh.SoChungTu LIKE ? OR ccdc.Ten LIKE ? OR pb.TenPhongBan LIKE ?) ");
            params.add(like);
            params.add(like);
            params.add(like);
        }
        if (idDonViSoHuu != null && !idDonViSoHuu.trim().isEmpty()) {
            sql.append("AND dvsh.IdDonViSoHuu = ? ");
            params.add(idDonViSoHuu);
        }
        if (date != null && !date.trim().isEmpty()) {
            sql.append("AND dvsh.NgayTao LIKE ? ");
            params.add(date + "%");
        }

        Integer total = jdbcTemplate.queryForObject(sql.toString(), Integer.class, params.toArray());
        return total != null ? total : 0;
    }

    public List<ChiTietDonViSoHuuEnrichedDTO> findAllPagedEnriched(int offset, int limit, String search, String idDonViSoHuu, String date) {
        StringBuilder sql = new StringBuilder("""
                SELECT
                    dvsh.Id            AS id,
                    dvsh.IdCCDCVT      AS idCCDCVT,
                    dvsh.IdDonViSoHuu  AS idDonViSoHuu,
                    dvsh.SoLuong       AS soLuong,
                    dvsh.IdTsCon       AS idTsCon,
                    dvsh.SoChungTu     AS soChungTu,
                    dvsh.SoLuongDaBanGiao AS soLuongDaBanGiao,
                    dvsh.ThoiGianBanGiao AS thoiGianBanGiao,
                    dvsh.NgayTao         AS ngayTao,
                    ccdc.Ten           AS tenCCDCVatTu,
                    pb.TenPhongBan     AS tenPhongBan
                FROM ChiTietDonViSoHuu dvsh
                INNER JOIN CCDCVatTu ccdc ON ccdc.Id = dvsh.IdCCDCVT
                LEFT JOIN PhongBan pb ON pb.Id = dvsh.IdDonViSoHuu
                WHERE 1=1
                """);

        List<Object> params = new ArrayList<>();
        if (search != null && !search.trim().isEmpty()) {
            String like = "%" + search.trim() + "%";
            sql.append("AND (dvsh.SoChungTu LIKE ? OR ccdc.Ten LIKE ? OR pb.TenPhongBan LIKE ?) ");
            params.add(like);
            params.add(like);
            params.add(like);
        }
        if (idDonViSoHuu != null && !idDonViSoHuu.trim().isEmpty()) {
            sql.append("AND dvsh.IdDonViSoHuu = ? ");
            params.add(idDonViSoHuu);
        }
        if (date != null && !date.trim().isEmpty()) {
            sql.append("AND dvsh.NgayTao LIKE ? ");
            params.add(date + "%");
        }

        sql.append("ORDER BY dvsh.NgayTao DESC, dvsh.SoChungTu DESC LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql.toString(),
                new BeanPropertyRowMapper<>(ChiTietDonViSoHuuEnrichedDTO.class),
                params.toArray());
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
        String sql = "SELECT dvsh.*,ctts.SoKyHieu AS soKyHieu FROM ChiTietDonViSoHuu dvsh LEFT JOIN chitiettaisan ctts ON ctts.id=dvsh.idTsCon WHERE dvsh.IdCCDCVT = ? ORDER BY dvsh.NgayTao DESC";
        return jdbcTemplate.query(sql, rowMapper, idCCDCVT);
    }

    public List<ChiTietDonViSoHuu> findByIdDonViSoHuu(String idDonViSoHuu) {
        String sql = "SELECT * FROM ChiTietDonViSoHuu WHERE IdDonViSoHuu = ?";
        return jdbcTemplate.query(sql, rowMapper, idDonViSoHuu);
    }
    public List<ChiTietDonViSoHuu> findByIdCCDCVTAndIdDonViSoHuu(
        String idCCDCVT, String idDonViSoHuu) {
        String sql = """
                SELECT dvsh.*, ctts.SoKyHieu AS soKyHieu
                FROM ChiTietDonViSoHuu dvsh
                LEFT JOIN chitiettaisan ctts ON ctts.id = dvsh.idTsCon
                WHERE dvsh.IdCCDCVT = ?
                AND dvsh.IdDonViSoHuu = ?
                ORDER BY dvsh.NgayTao DESC
                """;
        return jdbcTemplate.query(sql, rowMapper, idCCDCVT, idDonViSoHuu);
    }

// --- INSERT/UPDATE (Id tự sinh) ---
    public int insert(ChiTietDonViSoHuu entity) {
        // Nếu có SoChungTu: check tồn tại theo SoChungTu + IdCCDCVT (1 phiếu nhập = 1 bản ghi duy nhất)
        // Nếu không có SoChungTu (tạo thủ công): check theo IdCCDCVT + IdDonViSoHuu + IdTsCon như cũ
        boolean hasSoChungTu = entity.getSoChungTu() != null && !entity.getSoChungTu().trim().isEmpty();

        if (hasSoChungTu) {
            String checkSql = "SELECT COUNT(*) FROM ChiTietDonViSoHuu WHERE SoChungTu = ? AND IdCCDCVT = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class,
                    entity.getSoChungTu(), entity.getIdCCDCVT());
            if (count != null && count > 0) {
                // UPDATE bằng WHERE SoChungTu + IdCCDCVT (không dùng Id vì chưa fetch)
                return jdbcTemplate.update(
                    "UPDATE ChiTietDonViSoHuu SET SoLuong = ?, IdDonViSoHuu = ?, NgayTao = ?, " +
                    "NguoiTao = ?, IdTsCon = ?, ThoiGianBanGiao = ? " +
                    "WHERE SoChungTu = ? AND IdCCDCVT = ?",
                    entity.getSoLuong(), entity.getIdDonViSoHuu(), entity.getNgayTao(),
                    entity.getNguoiTao(), entity.getIdTsCon(), entity.getThoiGianBanGiao(),
                    entity.getSoChungTu(), entity.getIdCCDCVT()
                );
            }
        } else {
            String checkSql = "SELECT COUNT(*) FROM ChiTietDonViSoHuu WHERE IdCCDCVT = ? AND IdDonViSoHuu = ? AND IdTsCon = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class,
                    entity.getIdCCDCVT(), entity.getIdDonViSoHuu(), entity.getIdTsCon());
            if (count != null && count > 0) {
                return update(entity);
            }
        }

        // Insert mới
        String newId = UUID.randomUUID().toString();
        String sql = "INSERT INTO ChiTietDonViSoHuu " +
                "(Id, IdCCDCVT, IdDonViSoHuu, SoLuong, ThoiGianBanGiao, NgayTao, NguoiTao, IdTsCon, SoChungTu) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        int rows = jdbcTemplate.update(sql,
                newId,
                entity.getIdCCDCVT(),
                entity.getIdDonViSoHuu(),
                entity.getSoLuong(),
                entity.getThoiGianBanGiao(),
                entity.getNgayTao(),
                entity.getNguoiTao(),
                entity.getIdTsCon(),
                entity.getSoChungTu()
        );
        entity.setId(newId);
        return rows;
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

    public int updateSoLuong(String idCCDCVT, String idDonViGui, String idDonViNhan, int soLuongBanGiao, String soQuyetDinh, String soChungTu, String thoiGianBanGiao, String idTaiSanCon) {
        // Kiểm tra đơn vị nhận đã có chưa
        String sql = "SELECT * FROM ChiTietDonViSoHuu WHERE IdDonViSoHuu = ? AND IdCCDCVT = ? AND IdTsCon=? AND SoChungTu=? ";
        List<ChiTietDonViSoHuu> listNhan = jdbcTemplate.query(sql, rowMapper, idDonViNhan, idCCDCVT, idTaiSanCon, soQuyetDinh);

        int rowsAffected = 0;

        if (listNhan.isEmpty()) {
            // Nếu đơn vị nhận chưa có → Insert mới
            String newId = UUID.randomUUID().toString();
            sql = "INSERT INTO ChiTietDonViSoHuu " + "(Id, IdCCDCVT, IdDonViSoHuu,SoChungTu, SoLuong, ThoiGianBanGiao, NgayTao, NguoiTao, IdTsCon) " + "VALUES (?, ?, ?, ?, ?, ?, ?,?,?)";
            rowsAffected += jdbcTemplate.update(sql, newId, idCCDCVT, idDonViNhan, soQuyetDinh, soLuongBanGiao, thoiGianBanGiao, thoiGianBanGiao, "system", idTaiSanCon);
        } else {
            // Nếu đã tồn tại → Cộng thêm số lượng
            ChiTietDonViSoHuu nhan = listNhan.get(0);
            int soLuongMoi = nhan.getSoLuong() + soLuongBanGiao;

            sql = "UPDATE ChiTietDonViSoHuu SET SoLuong = ? " + "WHERE IdDonViSoHuu = ? AND IdCCDCVT = ? AND IdTsCon=? AND SoChungTu=? ";
            rowsAffected += jdbcTemplate.update(sql, soLuongMoi, idDonViNhan, idCCDCVT, idTaiSanCon, soQuyetDinh);
        }

        // Giảm số lượng bên gửi
        List<ChiTietDonViSoHuu> listGui = jdbcTemplate.query("SELECT * FROM ChiTietDonViSoHuu WHERE IdDonViSoHuu = ? AND IdCCDCVT = ?  AND IdTsCon=? AND SoChungTu=?", rowMapper, idDonViGui, idCCDCVT, idTaiSanCon, soChungTu);

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
            int soLuongDaBanGiao=gui.getSoLuongDaBanGiao()+soLuongBanGiao;
            sql = "UPDATE ChiTietDonViSoHuu SET SoLuong = ?, SoLuongDaBanGiao = ?, ThoiGianBanGiao = ? " + "WHERE IdDonViSoHuu = ? AND IdCCDCVT = ?  AND IdTsCon=? AND SoChungTu=?";
            rowsAffected += jdbcTemplate.update(sql, soLuongMoiGui,soLuongDaBanGiao, thoiGianBanGiao, idDonViGui, idCCDCVT, idTaiSanCon, soChungTu);
        } catch (Exception e) {
            return rowsAffected;
        }


        return rowsAffected;
    }

    public List<String> getNhomDonViSoHuu(String idTaiSan) {
        String sql = "SELECT MIN(IdDonViSoHuu) as IdDonViSoHuu " + "FROM ChiTietDonViSoHuu " + "WHERE IdCCDCVT = ? " + "GROUP BY IdDonViSoHuu";
        return jdbcTemplate.queryForList(sql, String.class, idTaiSan);
    }

    /**
     * Lấy danh sách ChiTietDonViSoHuu theo idDonViSoHuu, JOIN sẵn thông tin
     * từ CCDCVatTu và ChiTietTaiSan (chỉ những bản ghi có cả idCCDCVT và idTsCon hợp lệ).
     * Tránh phải fetch toàn bộ CCDCVatTu rồi join ở tầng ứng dụng.
     */
    public List<ChiTietDonViSoHuuEnrichedDTO> findEnrichedByIdDonViSoHuu(String idDonViSoHuu,String loai) {
        boolean isVatTu = "vattu".equalsIgnoreCase(loai);
        boolean isCCDC  = "ccdc".equalsIgnoreCase(loai);
        String sql = """
                SELECT
                    dvsh.Id            AS id,
                    dvsh.IdCCDCVT      AS idCCDCVT,
                    dvsh.IdDonViSoHuu  AS idDonViSoHuu,
                    dvsh.SoLuong       AS soLuong,
                    dvsh.IdTsCon       AS idTsCon,
                    dvsh.SoChungTu     AS soChungTu,
                    dvsh.SoLuongDaBanGiao AS soLuongDaBanGiao,
                    ccdc.Ten       AS tenCCDCVatTu,
                    ccdc.DonViTinh     AS donViTinh,
                    ccdc.GiaTri        AS giaTri,
                    ctts.NamSanXuat    AS namSanXuat,
                    ctts.NuocSanXuat   AS nuocSanXuat,
                    ccdc.IdNhomCCDC
                FROM ChiTietDonViSoHuu dvsh
                INNER JOIN CCDCVatTu ccdc  ON ccdc.Id  = dvsh.IdCCDCVT
                INNER JOIN ChiTietTaiSan ctts ON ctts.Id = dvsh.IdTsCon
                LEFT JOIN NhomCCDC nccdc ON nccdc.Id = ccdc.IdNhomCCDC
                WHERE dvsh.IdDonViSoHuu = ?
                """;
        if (isCCDC) {
            sql += " AND nccdc.laCCDC = TRUE \n";
        } else if (isVatTu) {
            sql += " AND nccdc.laVatTu = TRUE \n";
        }
        sql += " ORDER BY dvsh.NgayTao DESC \n";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(ChiTietDonViSoHuuEnrichedDTO.class),
                idDonViSoHuu);
    }

}
