package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChiTietBanGiaoTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ChiTietDieuDongTaiSanDao chiTietDieuDongTaiSanDao;

    public List<ChiTietBanGiaoTaiSanDTO> findAll(String idBanGiaoTaiSan) {
        String sql = """
                SELECT ct.Id,
                       ct.IdBanGiaoTaiSan,
                       bts.BanGiaoTaiSan,
                       bts.QuyetDinhDieuDongSo,
                
                       ct.IdTaiSan,
                       ts.TenTaiSan,
                       ts.DonViTinh,
                       ts.KyHieu,
                       ts.SoKyHieu,
                       ct.HienTrang,
                       ct.MoTa,

                       ct.SoLuong,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive,
                       ct.GhiChu
                FROM ChiTietBanGiaoTaiSan AS ct
                         INNER JOIN
                     BanGiaoTaiSan AS bts ON ct.IdBanGiaoTaiSan = bts.Id
                         INNER JOIN
                     TaiSan AS ts ON ct.IdTaiSan = ts.Id
                WHERE  ct.IdBanGiaoTaiSan=?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoTaiSanDTO.class), idBanGiaoTaiSan);
    }

    public ChiTietBanGiaoTaiSanDTO findById(String id) {
        String sql = """
                SELECT ct.Id,
                       ct.IdBanGiaoTaiSan,
                       bts.BanGiaoTaiSan,
                       bts.QuyetDinhDieuDongSo,
                
                       ct.IdTaiSan,
                       ts.TenTaiSan,
                       ts.DonViTinh,
                       ts.KyHieu,
                       ts.SoKyHieu,
                       ct.HienTrang,
                       ct.MoTa,

                       ct.SoLuong,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive,
                       ct.GhiChu
                FROM ChiTietBanGiaoTaiSan AS ct
                         INNER JOIN
                     BanGiaoTaiSan AS bts ON ct.IdBanGiaoTaiSan = bts.Id
                         INNER JOIN
                     TaiSan AS ts ON ct.IdTaiSan = ts.Id
                WHERE  ct.id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoTaiSanDTO.class), id);
    }

    public int insert(ChiTietBanGiaoTaiSan obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChiTietBanGiaoTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO ChiTietBanGiaoTaiSan (Id, IdBanGiaoTaiSan, IdTaiSan, SoLuong, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, HienTrang, MoTa, GhiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            int result = jdbcTemplate.update(sql,
                    obj.getId(), obj.getIdBanGiaoTaiSan(), obj.getIdTaiSan(), obj.getSoLuong(),
                    obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(),
                    obj.getHienTrang(), obj.getMoTa(), obj.getGhiChu());

            // Cập nhật DaBanGiao = true cho ChiTietDieuDongTaiSan
            if (result > 0 && obj.getIdTaiSan() != null && !obj.getIdTaiSan().trim().isEmpty()) {
                updateDaBanGiaoForDieuDong(obj.getIdBanGiaoTaiSan(), obj.getIdTaiSan(), true);
            }
            return result;
        }
    }

    public int update(ChiTietBanGiaoTaiSan obj) {
        // Lấy thông tin cũ trước khi update để xử lý DaBanGiao
        String idTaiSanCu = null;
        String idBanGiaoTaiSanCu = null;
        try {
            String getSql = "SELECT IdTaiSan, IdBanGiaoTaiSan FROM ChiTietBanGiaoTaiSan WHERE Id = ?";
            var oldData = jdbcTemplate.queryForMap(getSql, obj.getId());
            idTaiSanCu = (String) oldData.get("IdTaiSan");
            idBanGiaoTaiSanCu = (String) oldData.get("IdBanGiaoTaiSan");
        } catch (Exception e) {
            // Record không tồn tại
        }

        String sql = "UPDATE ChiTietBanGiaoTaiSan SET IdBanGiaoTaiSan=?, IdTaiSan=?, SoLuong=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, HienTrang=?, MoTa=?, GhiChu=? WHERE Id=?";
        int result = jdbcTemplate.update(sql,
                obj.getIdBanGiaoTaiSan(), obj.getIdTaiSan(), obj.getSoLuong(),
                obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(),
                obj.getIsActive(), obj.getHienTrang(), obj.getMoTa(), obj.getGhiChu(), obj.getId());

        // Cập nhật DaBanGiao nếu IdTaiSan thay đổi
        if (result > 0) {
            // Nếu IdTaiSan thay đổi
            if (idTaiSanCu != null && !idTaiSanCu.equals(obj.getIdTaiSan())) {
                // Reset DaBanGiao = false cho tài sản cũ
                updateDaBanGiaoForDieuDong(idBanGiaoTaiSanCu, idTaiSanCu, false);
                // Set DaBanGiao = true cho tài sản mới
                if (obj.getIdTaiSan() != null && !obj.getIdTaiSan().trim().isEmpty()) {
                    updateDaBanGiaoForDieuDong(obj.getIdBanGiaoTaiSan(), obj.getIdTaiSan(), true);
                }
            }
        }
        return result;
    }

    public int delete(String id) {
        // Lấy thông tin trước khi xóa để reset DaBanGiao
        String idTaiSan = null;
        String idBanGiaoTaiSan = null;
        try {
            String getSql = "SELECT IdTaiSan, IdBanGiaoTaiSan FROM ChiTietBanGiaoTaiSan WHERE Id = ?";
            var oldData = jdbcTemplate.queryForMap(getSql, id);
            idTaiSan = (String) oldData.get("IdTaiSan");
            idBanGiaoTaiSan = (String) oldData.get("IdBanGiaoTaiSan");
        } catch (Exception e) {
            // Record không tồn tại
        }

        String sql = "DELETE FROM ChiTietBanGiaoTaiSan WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);

        // Reset DaBanGiao = false cho ChiTietDieuDongTaiSan
        if (result > 0 && idTaiSan != null && !idTaiSan.trim().isEmpty()) {
            updateDaBanGiaoForDieuDong(idBanGiaoTaiSan, idTaiSan, false);
        }
        return result;
    }

    /**
     * Cập nhật DaBanGiao cho ChiTietDieuDongTaiSan dựa trên IdTaiSan và IdBanGiaoTaiSan.
     * Tìm IdDieuDongTaiSan từ BanGiaoTaiSan.QuyetDinhDieuDongSo
     */
    private void updateDaBanGiaoForDieuDong(String idBanGiaoTaiSan, String idTaiSan, Boolean daBanGiao) {
        if (idBanGiaoTaiSan == null || idBanGiaoTaiSan.trim().isEmpty() ||
            idTaiSan == null || idTaiSan.trim().isEmpty()) {
            return;
        }

        try {
            // Lấy QuyetDinhDieuDongSo từ BanGiaoTaiSan (chính là IdDieuDongTaiSan)
            String getIdDieuDongSql = "SELECT QuyetDinhDieuDongSo FROM BanGiaoTaiSan WHERE Id = ?";
            String idDieuDongTaiSan = jdbcTemplate.queryForObject(getIdDieuDongSql, String.class, idBanGiaoTaiSan);

            if (idDieuDongTaiSan != null && !idDieuDongTaiSan.trim().isEmpty()) {
                // Cập nhật DaBanGiao cho chi tiết điều động tương ứng
                chiTietDieuDongTaiSanDao.updateDaBanGiaoByTaiSan(idTaiSan, idDieuDongTaiSan, daBanGiao);
            }
        } catch (Exception e) {
            // Không tìm thấy hoặc lỗi - bỏ qua
        }
    }
}
