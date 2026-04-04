package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTu;
import com.ecotel.quanlytaisan.model.ChiTietDieuDongCCDCVatTuDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChiTietDieuDongCCDCVatTuDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    public List<ChiTietDieuDongCCDCVatTu>getAll(){
        String sql = """
                select * from ChiTietDieuDongCCDCVatTu""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongCCDCVatTu.class));
    }

    public List<ChiTietDieuDongCCDCVatTuDTO> findAll(String IdDieuDongCCDCVatTu) {
        String sql = """
                SELECT
                  ct.Id,
                  ct.IdDieuDongCCDCVatTu,
                  dd.TenPhieu,
                  dd.SoQuyetDinh,
                
                  ct.IdCCDCVatTu,
                  ccdc.Ten AS TenCCDCVatTu,
                  ct.SoChungTu,
                  ccdc.DonVitinh,
                  ts_info.CongSuat,
                  ts_info.NuocSanXuat,
                  ts_info.SoKyHieu,
                  ccdc.KyHieu,
                  ts_info.NamSanXuat,
                
                  ct.SoLuong,
                  ct.SoLuongXuat,
                  ct.GhiChu,
                
                  ct.NgayTao,
                  ct.NgayCapNhat,
                  ct.NguoiTao,
                  ct.NguoiCapNhat,
                  ct.IsActive,
                ct.IdChiTietCCDCVatTu,
                ct.SoLuongDaBanGiao,
                ct.SoLuongConLai,
                ct.HienTrang,
                ct.MoTa
                    FROM ChiTietDieuDongCCDCVatTu AS ct
                       INNER JOIN
                   DieuDongCCDCVatTu AS dd ON ct.IdDieuDongCCDCVatTu = dd.Id
                       INNER JOIN
                   CCDCVatTu AS ccdc ON ct.IdCCDCVatTu = ccdc.Id
                    LEFT JOIN (
                        SELECT IdTaiSan, 
                       MAX(CongSuat) as CongSuat, 
                       MAX(NuocSanXuat) as NuocSanXuat, 
                       MAX(SoKyHieu) as SoKyHieu, 
                       MAX(NamSanXuat) as NamSanXuat
                        FROM ChiTietTaiSan
                        GROUP BY IdTaiSan 
                    ) AS ts_info ON ct.IdCCDCVatTu = ts_info.IdTaiSan
                where ct.IdDieuDongCCDCVatTu=?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongCCDCVatTuDTO.class), IdDieuDongCCDCVatTu);
    }


    public List<ChiTietDieuDongCCDCVatTu> findAllChiTietDD(String IdDieuDongCCDCVatTu) {
        String sql = """
                select * from ChiTietDieuDongCCDCVatTu where IdDieuDongCCDCVatTu=?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongCCDCVatTu.class), IdDieuDongCCDCVatTu);
    }

    public ChiTietDieuDongCCDCVatTuDTO findById(String id) {
        String sql = """
                SELECT ct.Id,
                       ct.IdDieuDongCCDCVatTu,
                       dd.TenPhieu,
                       dd.SoQuyetDinh,
                
                       ct.IdCCDCVatTu,
                       ccdc.Ten AS TenCCDCVatTu,
                       ct.SoChungTu,
                       ccdc.DonVitinh,
                       ts_info.CongSuat,
                       ts_info.NuocSanXuat,
                       ts_info.SoKyHieu,
                       ccdc.KyHieu,
                       ts_info.NamSanXuat,
                
                       ct.SoLuong,
                       ct.SoLuongXuat,
                       ct.GhiChu,
                
                       ct.NgayTao,
                       ct.NgayCapNhat,
                       ct.NguoiTao,
                       ct.NguoiCapNhat,
                       ct.IsActive,
                       ct.IdChiTietCCDCVatTu,
                       ct.SoLuongDaBanGiao,
                       ct.SoLuongConLai,
                       ct.HienTrang,
                       ct.MoTa
                FROM ChiTietDieuDongCCDCVatTu AS ct
                         INNER JOIN
                     DieuDongCCDCVatTu AS dd ON ct.IdDieuDongCCDCVatTu = dd.Id
                         INNER JOIN
                     CCDCVatTu AS ccdc ON ct.IdCCDCVatTu = ccdc.Id
                      LEFT JOIN (
                        SELECT IdTaiSan, 
                       MAX(CongSuat) as CongSuat, 
                       MAX(NuocSanXuat) as NuocSanXuat, 
                       MAX(SoKyHieu) as SoKyHieu, 
                       MAX(NamSanXuat) as NamSanXuat
                        FROM ChiTietTaiSan
                        GROUP BY IdTaiSan 
                    ) AS ts_info ON ct.IdCCDCVatTu = ts_info.IdTaiSan
                WHERE  ct.Id=?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongCCDCVatTuDTO.class), id);
    }

    public int insert(ChiTietDieuDongCCDCVatTu obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM ChiTietDieuDongCCDCVatTu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Khởi tạo giá trị mặc định: SoLuongDaBanGiao = 0, SoLuongConLai = SoLuongXuat
            Double soLuongXuat = obj.getSoLuongXuat() != null ? obj.getSoLuongXuat() : 0.0;
            Double soLuongDaBanGiao = 0.0;
            Double soLuongConLai = soLuongXuat;

            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO ChiTietDieuDongCCDCVatTu (Id, IdDieuDongCCDCVatTu, IdCCDCVatTu, SoChungTu, SoLuong, SoLuongXuat, GhiChu, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, IdChiTietCCDCVatTu, SoLuongDaBanGiao, SoLuongConLai, HienTrang, MoTa) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql,
                    obj.getId(), obj.getIdDieuDongCCDCVatTu(), obj.getIdCCDCVatTu(), obj.getSoChungTu(), obj.getSoLuong(),
                    soLuongXuat, obj.getGhiChu(), obj.getNgayTao(), obj.getNgayCapNhat(),
                    obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getIsActive(), obj.getIdChiTietCCDCVatTu(),
                    soLuongDaBanGiao, soLuongConLai, obj.getHienTrang(), obj.getMoTa());
        }
    }

    public int update(ChiTietDieuDongCCDCVatTu obj) {
        String sql = "UPDATE ChiTietDieuDongCCDCVatTu SET IdDieuDongCCDCVatTu=?, IdCCDCVatTu=?, SoChungTu=?, SoLuong=?, SoLuongXuat=?, GhiChu=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, IdChiTietCCDCVatTu=?, SoLuongDaBanGiao=?, SoLuongConLai=?, HienTrang=?, MoTa=? WHERE Id=?";
        return jdbcTemplate.update(sql,
                obj.getIdDieuDongCCDCVatTu(), obj.getIdCCDCVatTu(), obj.getSoChungTu(), obj.getSoLuong(), obj.getSoLuongXuat(),
                obj.getGhiChu(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(),
                obj.getIsActive(), obj.getIdChiTietCCDCVatTu(), obj.getSoLuongDaBanGiao(), obj.getSoLuongConLai(), obj.getHienTrang(), obj.getMoTa(), obj.getId());
    }

    public int delete(String id) {
        String sql = "DELETE FROM ChiTietDieuDongCCDCVatTu WHERE Id = ?";
        return jdbcTemplate.update(sql, id);
    }

    /**
     * Lấy danh sách chi tiết điều động CHƯA bàn giao đủ số lượng.
     * Logic: SoLuongConLai > 0
     */
    public List<ChiTietDieuDongCCDCVatTuDTO> findAllChuaBanGiaoDu(String idDieuDongCCDCVatTu) {
        String sql = """
                SELECT
                  ct.Id,
                  ct.IdDieuDongCCDCVatTu,
                  dd.TenPhieu,
                  dd.SoQuyetDinh,

                  ct.IdCCDCVatTu,
                  ccdc.Ten AS TenCCDCVatTu,
                  ct.SoChungTu,
                  ccdc.DonVitinh,
                  ts_info.CongSuat,
                  ts_info.NuocSanXuat,
                  ts_info.SoKyHieu,
                  ccdc.KyHieu,
                  ts_info.NamSanXuat,

                  ct.SoLuong,
                  ct.SoLuongXuat,
                  ct.GhiChu,

                  ct.NgayTao,
                  ct.NgayCapNhat,
                  ct.NguoiTao,
                  ct.NguoiCapNhat,
                  ct.IsActive,
                  ct.IdChiTietCCDCVatTu,
                  ct.SoLuongDaBanGiao,
                  ct.SoLuongConLai,
                  ct.HienTrang,
                  ct.MoTa
                FROM ChiTietDieuDongCCDCVatTu AS ct
                   INNER JOIN DieuDongCCDCVatTu AS dd ON ct.IdDieuDongCCDCVatTu = dd.Id
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
                WHERE ct.IdDieuDongCCDCVatTu = ?
                  AND ct.IsActive = 1
                  AND COALESCE(ct.SoLuongConLai, 0) > 0
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ChiTietDieuDongCCDCVatTuDTO.class), idDieuDongCCDCVatTu);
    }

    /**
     * Cập nhật SoLuongConLai của chi tiết điều động
     */
    public int updateSoLuongConLai(String id, Double soLuongConLai) {
        String sql = "UPDATE ChiTietDieuDongCCDCVatTu SET SoLuongConLai = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, soLuongConLai, id);
    }

    /**
     * Lấy SoLuongConLai hiện tại của chi tiết điều động
     */
    public Double getSoLuongConLai(String id) {
        String sql = "SELECT SoLuongConLai FROM ChiTietDieuDongCCDCVatTu WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Double.class, id);
        } catch (Exception e) {
            return 0.0;
        }
    }
}
