package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DieuDongPhuLucTaiSan;
import com.ecotel.quanlytaisan.model.DieuDongPhuLucTaiSanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

@Repository
public class DieuDongPhuLucTaiSanDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static List<DieuDongPhuLucTaiSanDTO> cache = new ArrayList<>();

    @PostConstruct
    public void init() {
        CompletableFuture.runAsync(this::refreshCache);
    }

    private void refreshCache() {
        String sql = """
                SELECT dd.Id,
                       dd.SoQuyetDinh,
                       dd.TenPhieu,
                
                       dd.IdDonViGiao,
                       pbGiao.TenPhongBan   AS TenDonViGiao,
                
                       dd.IdDonViNhan,
                       pbNhan.TenPhongBan   AS TenDonViNhan,
                
                       dd.IdDonViDeNghi,
                       pbDeNghi.TenPhongBan AS TenDonViDeNghi,
                
                       dd.IdPhongBanXemPhieu,
                       pbXem.TenPhongBan    AS TenPhongBanXemPhieu,
                
                       dd.IdNguoiDeNghi,
                       nvDeNghi.HoTen       AS TenNguoiDeNghi,
                
                       dd.IdTrinhDuyetCapPhong,
                       nvCapPhong.HoTen     AS TenTrinhDuyetCapPhong,
                
                       dd.IdTrinhDuyetGiamDoc,
                       nvGiamDoc.HoTen      AS TenTrinhDuyetGiamDoc,
                
                       dd.IdNhanSuXemPhieu,
                       nvXem.HoTen          AS TenNhanSuXemPhieu,
                
                       dd.NguoiLapPhieuKyNhay,
                       dd.QuanTrongCanXacNhan,
                       dd.PhoPhongXacNhan,
                       dd.TGGNTuNgay,
                       dd.TGGNDenNgay,
                       dd.DiaDiemGiaoNhan,
                       dd.VeViec,
                       dd.CanCu,
                       dd.Dieu1,
                       dd.Dieu2,
                       dd.Dieu3,
                       dd.NoiNhan,
                       dd.ThemDongTrong,
                       dd.TrangThai,
                       dd.IdCongTy,
                       dd.NgayTao,
                       dd.NgayCapNhat,
                       dd.NguoiTao,
                       dd.NguoiCapNhat,
                       dd.CoHieuLuc,
                       dd.Loai,
                       dd.IsActive
                FROM DieuDongPhuLucTaiSan AS dd
                
                -- Join PhongBan
                         LEFT JOIN PhongBan AS pbGiao ON dd.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON dd.IdDonViNhan = pbNhan.Id
                         LEFT JOIN PhongBan AS pbDeNghi ON dd.IdDonViDeNghi = pbDeNghi.Id
                         LEFT JOIN PhongBan AS pbXem ON dd.IdPhongBanXemPhieu = pbXem.Id
                
                -- Join NhanVien
                         LEFT JOIN NhanVien AS nvDeNghi ON dd.IdNguoiDeNghi = nvDeNghi.Id
                         LEFT JOIN NhanVien AS nvCapPhong ON dd.IdTrinhDuyetCapPhong = nvCapPhong.Id
                         LEFT JOIN NhanVien AS nvGiamDoc ON dd.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                         LEFT JOIN NhanVien AS nvXem ON dd.IdNhanSuXemPhieu = nvXem.Id
                """;
        try {
            List<DieuDongPhuLucTaiSanDTO> data = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DieuDongPhuLucTaiSanDTO.class));
            cache = data;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<DieuDongPhuLucTaiSanDTO> findAll(String idCongTy) {
        if (cache == null || cache.isEmpty()) {
            refreshCache();
        }
        return cache.stream()
                .filter(item -> idCongTy.equals(item.getIdCongTy()))
                .collect(Collectors.toList());
    }

    public DieuDongPhuLucTaiSanDTO findById(String id) {
        String sql = """
                SELECT dd.Id,
                       dd.SoQuyetDinh,
                       dd.TenPhieu,
                
                       dd.IdDonViGiao,
                       pbGiao.TenPhongBan   AS TenDonViGiao,
                
                       dd.IdDonViNhan,
                       pbNhan.TenPhongBan   AS TenDonViNhan,
                
                       dd.IdDonViDeNghi,
                       pbDeNghi.TenPhongBan AS TenDonViDeNghi,
                
                       dd.IdPhongBanXemPhieu,
                       pbXem.TenPhongBan    AS TenPhongBanXemPhieu,
                
                       dd.IdNguoiDeNghi,
                       nvDeNghi.HoTen       AS TenNguoiDeNghi,
                
                       dd.IdTrinhDuyetCapPhong,
                       nvCapPhong.HoTen     AS TenTrinhDuyetCapPhong,
                
                       dd.IdTrinhDuyetGiamDoc,
                       nvGiamDoc.HoTen      AS TenTrinhDuyetGiamDoc,
                
                       dd.IdNhanSuXemPhieu,
                       nvXem.HoTen          AS TenNhanSuXemPhieu,
                
                       dd.NguoiLapPhieuKyNhay,
                       dd.QuanTrongCanXacNhan,
                       dd.PhoPhongXacNhan,
                       dd.TGGNTuNgay,
                       dd.TGGNDenNgay,
                       dd.DiaDiemGiaoNhan,
                       dd.VeViec,
                       dd.CanCu,
                       dd.Dieu1,
                       dd.Dieu2,
                       dd.Dieu3,
                       dd.NoiNhan,
                       dd.ThemDongTrong,
                       dd.TrangThai,
                       dd.IdCongTy,
                       dd.NgayTao,
                       dd.NgayCapNhat,
                       dd.NguoiTao,
                       dd.NguoiCapNhat,
                       dd.CoHieuLuc,
                       dd.Loai,
                       dd.IsActive
                FROM DieuDongPhuLucTaiSan AS dd
                
                -- Join PhongBan
                         LEFT JOIN PhongBan AS pbGiao ON dd.IdDonViGiao = pbGiao.Id
                         LEFT JOIN PhongBan AS pbNhan ON dd.IdDonViNhan = pbNhan.Id
                         LEFT JOIN PhongBan AS pbDeNghi ON dd.IdDonViDeNghi = pbDeNghi.Id
                         LEFT JOIN PhongBan AS pbXem ON dd.IdPhongBanXemPhieu = pbXem.Id
                
                -- Join NhanVien
                         LEFT JOIN NhanVien AS nvDeNghi ON dd.IdNguoiDeNghi = nvDeNghi.Id
                         LEFT JOIN NhanVien AS nvCapPhong ON dd.IdTrinhDuyetCapPhong = nvCapPhong.Id
                         LEFT JOIN NhanVien AS nvGiamDoc ON dd.IdTrinhDuyetGiamDoc = nvGiamDoc.Id
                         LEFT JOIN NhanVien AS nvXem ON dd.IdNhanSuXemPhieu = nvXem.Id
                
                WHERE  dd.Id = ?""";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(DieuDongPhuLucTaiSanDTO.class),id);
    }

    public int insert(DieuDongPhuLucTaiSan obj) {
        // Kiểm tra id không null và không empty
        if (obj.getId() == null || obj.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM DieuDongPhuLucTaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, obj.getId());
        
        if (count > 0) {
            // Nếu tồn tại thì update
            return update(obj);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO DieuDongPhuLucTaiSan (Id, SoQuyetDinh, TenPhieu, IdDonViGiao, IdDonViNhan, IdNguoiDeNghi, NguoiLapPhieuKyNhay, QuanTrongCanXacNhan, PhoPhongXacNhan, IdDonViDeNghi, IdTrinhDuyetCapPhong, TggnTuNgay, TggnDenNgay, IdTrinhDuyetGiamDoc, DiaDiemGiaoNhan, IdPhongBanXemPhieu, IdNhanSuXemPhieu, VeViec, CanCu, Dieu1, Dieu2, Dieu3, NoiNhan, ThemDongTrong, TrangThai, IdCongTy, NgayTao, NgayCapNhat, NguoiTao, NguoiCapNhat, CoHieuLuc, Loai, IsActive) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            int result = jdbcTemplate.update(sql, obj.getId(), obj.getSoQuyetDinh(), obj.getTenPhieu(), obj.getIdDonViGiao(), obj.getIdDonViNhan(), obj.getIdNguoiDeNghi(), obj.getNguoiLapPhieuKyNhay(), obj.getQuanTrongCanXacNhan(), obj.getPhoPhongXacNhan(), obj.getIdDonViDeNghi(), obj.getIdTrinhDuyetCapPhong(), obj.getTggnTuNgay(), obj.getTggnDenNgay(), obj.getIdTrinhDuyetGiamDoc(), obj.getDiaDiemGiaoNhan(), obj.getIdPhongBanXemPhieu(), obj.getIdNhanSuXemPhieu(), obj.getVeViec(), obj.getCanCu(), obj.getDieu1(), obj.getDieu2(), obj.getDieu3(), obj.getNoiNhan(), obj.getThemDongTrong(), obj.getTrangThai(), obj.getIdCongTy(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getCoHieuLuc(), obj.getLoai(), obj.getIsActive());
            if (result > 0) {
                CompletableFuture.runAsync(this::refreshCache);
            }
            return result;
        }
    }

    public int update(DieuDongPhuLucTaiSan obj) {
        String sql = "UPDATE DieuDongPhuLucTaiSan SET SoQuyetDinh=?, TenPhieu=?, IdDonViGiao=?, IdDonViNhan=?, IdNguoiDeNghi=?, NguoiLapPhieuKyNhay=?, QuanTrongCanXacNhan=?, PhoPhongXacNhan=?, IdDonViDeNghi=?, IdTrinhDuyetCapPhong=?, TggnTuNgay=?, TggnDenNgay=?, IdTrinhDuyetGiamDoc=?, DiaDiemGiaoNhan=?, IdPhongBanXemPhieu=?, IdNhanSuXemPhieu=?, VeViec=?, CanCu=?, Dieu1=?, Dieu2=?, Dieu3=?, NoiNhan=?, ThemDongTrong=?, TrangThai=?, IdCongTy=?, NgayTao=?, NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, CoHieuLuc=?, Loai=?, IsActive=? WHERE Id=?";
        int result = jdbcTemplate.update(sql, obj.getSoQuyetDinh(), obj.getTenPhieu(), obj.getIdDonViGiao(), obj.getIdDonViNhan(), obj.getIdNguoiDeNghi(), obj.getNguoiLapPhieuKyNhay(), obj.getQuanTrongCanXacNhan(), obj.getPhoPhongXacNhan(), obj.getIdDonViDeNghi(), obj.getIdTrinhDuyetCapPhong(), obj.getTggnTuNgay(), obj.getTggnDenNgay(), obj.getIdTrinhDuyetGiamDoc(), obj.getDiaDiemGiaoNhan(), obj.getIdPhongBanXemPhieu(), obj.getIdNhanSuXemPhieu(), obj.getVeViec(), obj.getCanCu(), obj.getDieu1(), obj.getDieu2(), obj.getDieu3(), obj.getNoiNhan(), obj.getThemDongTrong(), obj.getTrangThai(), obj.getIdCongTy(), obj.getNgayTao(), obj.getNgayCapNhat(), obj.getNguoiTao(), obj.getNguoiCapNhat(), obj.getCoHieuLuc(), obj.getLoai(), obj.getIsActive(), obj.getId());
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }

    public int delete(String id) {
        String sql = "DELETE FROM DieuDongPhuLucTaiSan WHERE Id = ?";
        int result = jdbcTemplate.update(sql, id);
        if (result > 0) {
            CompletableFuture.runAsync(this::refreshCache);
        }
        return result;
    }
}
