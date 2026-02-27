package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTuDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChiTietBanGiaoCCDCVatTuDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ChiTietDieuDongCCDCVatTuDao chiTietDieuDongCCDCVatTuDao;

    public List<ChiTietBanGiaoCCDCVatTu> getAll() {
        String sql = """
                SELECT *
                FROM ChiTietBanGiaoCCDCVatTu""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoCCDCVatTu.class));
    }

    public List<ChiTietBanGiaoCCDCVatTuDTO> findAll(String idBanGiaoCCDCVatTu) {
        String sql = """
                SELECT ct.Id,
                       ct.IdBanGiaoCCDCVatTu,
                       bg.BanGiaoCCDCVatTu AS TenPhieuBanGiao,
                       ct.IdCCDCVatTu,
                       ccdc.Ten            AS TenVatTu,
                       ccdc.DonVitinh,
                       ccdc.KyHieu,
                       ts_info.SoKyHieu,
                       ts_info.CongSuat,
                       ts_info.NuocSanXuat,
                       ts_info.NamSanXuat,
                       ct.SoLuong,
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive,
                       ct.IdChiTietCCDCVatTu,
                       ct.IdChiTietDieuDong,
                       ct.HienTrang,
                       ct.MoTa,
                       ct.GhiChu

                FROM ChiTietBanGiaoCCDCVatTu AS ct
                         INNER JOIN BanGiaoCCDCVatTu AS bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
                         INNER JOIN CCDCVatTu AS ccdc ON ct.IdCCDCVatTu = ccdc.Id
                         LEFT JOIN (
                        SELECT IdTaiSan, 
                       MAX(CongSuat) as CongSuat, 
                       MAX(NuocSanXuat) as NuocSanXuat, 
                       MAX(SoKyHieu) as SoKyHieu, 
                       MAX(NamSanXuat) as NamSanXuat
                        FROM ChiTietTaiSan
                        GROUP BY IdTaiSan 
                    ) AS ts_info ON ct.IdCCDCVatTu = ts_info.IdTaiSan

                WHERE  ct.IdBanGiaoCCDCVatTu=?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoCCDCVatTuDTO.class), idBanGiaoCCDCVatTu);
    }

    public ChiTietBanGiaoCCDCVatTuDTO findById(String id) {
        String sql = """
                SELECT ct.Id,
                       ct.IdBanGiaoCCDCVatTu,
                       bg.BanGiaoCCDCVatTu AS TenPhieuBanGiao,
                       ct.IdCCDCVatTu,
                       ccdc.Ten            AS TenVatTu,
                       ccdc.DonVitinh,
                       ccdc.KyHieu,
                       ts_info.SoKyHieu,
                       ts_info.CongSuat,
                       ts_info.NuocSanXuat,
                       ts_info.NamSanXuat,
                       ct.SoLuong,
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive,
                       ct.IdChiTietCCDCVatTu,
                       ct.IdChiTietDieuDong,
                       ct.HienTrang,
                       ct.MoTa,
                       ct.GhiChu

                FROM ChiTietBanGiaoCCDCVatTu AS ct
                         INNER JOIN BanGiaoCCDCVatTu AS bg ON ct.IdBanGiaoCCDCVatTu = bg.Id
                         INNER JOIN CCDCVatTu AS ccdc ON ct.IdCCDCVatTu = ccdc.Id
                         LEFT JOIN (
                        SELECT IdTaiSan, 
                       MAX(CongSuat) as CongSuat, 
                       MAX(NuocSanXuat) as NuocSanXuat, 
                       MAX(SoKyHieu) as SoKyHieu, 
                       MAX(NamSanXuat) as NamSanXuat
                        FROM ChiTietTaiSan
                        GROUP BY IdTaiSan 
                    ) AS ts_info ON ct.IdCCDCVatTu = ts_info.IdTaiSan
                WHERE ct.Id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietBanGiaoCCDCVatTuDTO.class), id);
    }

    public int insert(ChiTietBanGiaoCCDCVatTu obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChiTietBanGiaoCCDCVatTu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO ChiTietBanGiaoCCDCVatTu (Id, IdBanGiaoCCDCVatTu, IdCCDCVatTu, SoLuong, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, IdChiTietCCDCVatTu, IdChiTietDieuDong, HienTrang, MoTa, GhiChu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            int result = jdbcTemplate.update(sql, obj.getId(), obj.getIdBanGiaoCCDCVatTu(), obj.getIdCCDCVatTu(), obj.getSoLuong(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getIdChiTietCCDCVatTu(), obj.getIdChiTietDieuDong(), obj.getHienTrang(), obj.getMoTa(), obj.getGhiChu());

            // Cập nhật SoLuongConLai của ChiTietDieuDongCCDCVatTu
            if (result > 0 && obj.getIdChiTietDieuDong() != null && !obj.getIdChiTietDieuDong().trim().isEmpty()) {
                updateSoLuongConLaiDieuDong(obj.getIdChiTietDieuDong(), -obj.getSoLuong());
            }
            return result;
        }
    }

    public int update(ChiTietBanGiaoCCDCVatTu obj) {
        // Lấy số lượng cũ trước khi update để tính chênh lệch
        Double soLuongCu = 0.0;
        String idChiTietDieuDongCu = null;
        try {
            String getSql = "SELECT SoLuong, IdChiTietDieuDong FROM ChiTietBanGiaoCCDCVatTu WHERE Id = ?";
            var oldData = jdbcTemplate.queryForMap(getSql, obj.getId());
            soLuongCu = oldData.get("SoLuong") != null ? ((Number) oldData.get("SoLuong")).doubleValue() : 0.0;
            idChiTietDieuDongCu = (String) oldData.get("IdChiTietDieuDong");
        } catch (Exception e) {
            // Record không tồn tại
        }

        String sql = "UPDATE ChiTietBanGiaoCCDCVatTu SET " + "IdBanGiaoCCDCVatTu=?, IdCCDCVatTu=?, SoLuong=?, NgayTao=?, NgayCapNhat=?, " + "NguoiTao=?, NguoiCapNhat=?, IsActive=?, IdChiTietCCDCVatTu=?, IdChiTietDieuDong=?, HienTrang=?, MoTa=?, GhiChu=? " + "WHERE Id=?";

        int result = jdbcTemplate.update(sql, obj.getIdBanGiaoCCDCVatTu(), obj.getIdCCDCVatTu(), obj.getSoLuong(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getIdChiTietCCDCVatTu(), obj.getIdChiTietDieuDong(), obj.getHienTrang(), obj.getMoTa(), obj.getGhiChu(), obj.getId());

        // Cập nhật SoLuongConLai của ChiTietDieuDongCCDCVatTu
        if (result > 0) {
            // Nếu IdChiTietDieuDong thay đổi
            if (idChiTietDieuDongCu != null && !idChiTietDieuDongCu.equals(obj.getIdChiTietDieuDong())) {
                // Hoàn lại số lượng cho chi tiết điều động cũ
                updateSoLuongConLaiDieuDong(idChiTietDieuDongCu, soLuongCu);
                // Trừ số lượng cho chi tiết điều động mới
                if (obj.getIdChiTietDieuDong() != null && !obj.getIdChiTietDieuDong().trim().isEmpty()) {
                    updateSoLuongConLaiDieuDong(obj.getIdChiTietDieuDong(), -obj.getSoLuong());
                }
            } else if (obj.getIdChiTietDieuDong() != null && !obj.getIdChiTietDieuDong().trim().isEmpty()) {
                // Cùng IdChiTietDieuDong, chỉ cập nhật chênh lệch
                Double chenhLech = soLuongCu - obj.getSoLuong();
                if (chenhLech != 0) {
                    updateSoLuongConLaiDieuDong(obj.getIdChiTietDieuDong(), chenhLech);
                }
            }
        }
        return result;
    }


    public int delete(String id) {
        // Lấy thông tin trước khi xóa để hoàn lại SoLuongConLai
        Double soLuong = 0.0;
        String idChiTietDieuDong = null;
        try {
            String getSql = "SELECT SoLuong, IdChiTietDieuDong FROM ChiTietBanGiaoCCDCVatTu WHERE Id = ?";
            var oldData = jdbcTemplate.queryForMap(getSql, id);
            soLuong = oldData.get("SoLuong") != null ? ((Number) oldData.get("SoLuong")).doubleValue() : 0.0;
            idChiTietDieuDong = (String) oldData.get("IdChiTietDieuDong");
        } catch (Exception e) {
            // Record không tồn tại
        }

        String sql = "DELETE FROM ChiTietBanGiaoCCDCVatTu WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);

        // Hoàn lại SoLuongConLai của ChiTietDieuDongCCDCVatTu
        if (result > 0 && idChiTietDieuDong != null && !idChiTietDieuDong.trim().isEmpty()) {
            updateSoLuongConLaiDieuDong(idChiTietDieuDong, soLuong);
        }
        return result;
    }

    /**
     * Cập nhật SoLuongConLai của ChiTietDieuDongCCDCVatTu
     * @param idChiTietDieuDong ID của chi tiết điều động
     * @param delta Số lượng thay đổi (dương = tăng, âm = giảm)
     */
    private void updateSoLuongConLaiDieuDong(String idChiTietDieuDong, Double delta) {
        if (idChiTietDieuDong == null || idChiTietDieuDong.trim().isEmpty() || delta == null) {
            return;
        }
        Double currentSoLuongConLai = chiTietDieuDongCCDCVatTuDao.getSoLuongConLai(idChiTietDieuDong);
        if (currentSoLuongConLai == null) {
            currentSoLuongConLai = 0.0;
        }
        Double newSoLuongConLai = currentSoLuongConLai + delta;
        if (newSoLuongConLai < 0) {
            newSoLuongConLai = 0.0;
        }
        chiTietDieuDongCCDCVatTuDao.updateSoLuongConLai(idChiTietDieuDong, newSoLuongConLai);
    }
}
