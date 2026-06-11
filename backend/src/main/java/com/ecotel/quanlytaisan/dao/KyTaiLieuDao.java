package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.DuAn;
import com.ecotel.quanlytaisan.model.KyTaiLieu;
import com.ecotel.quanlytaisan.model.NguoiKy;
import com.ecotel.quanlytaisan.model.NhanVienDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class KyTaiLieuDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<KyTaiLieu> findById(String idTaiLieu) {
        String sql = "SELECT KyTaiLieu.Id, IdTaiLieu, LoaiKy, X, Y, IdNguoiKy, ChuKySo, NgayKy, STT, Scale, Width, Page, NhanVien.ChuKyNhay, NhanVien.ChuKyThuong FROM KyTaiLieu, NhanVien where IdTaiLieu = ? and NhanVien.Id = KyTaiLieu.IdNguoiKy";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KyTaiLieu.class), idTaiLieu);
    }

    public KyTaiLieu findById(Integer idTaiLieu) {
        String sql = "SELECT KyTaiLieu.Id, IdTaiLieu, LoaiKy, X, Y, IdNguoiKy, ChuKySo, NgayKy, STT, Scale, Width, Page, NhanVien.ChuKyNhay, NhanVien.ChuKyThuong FROM KyTaiLieu, NhanVien where KyTaiLieu.Id = ? and NhanVien.Id = KyTaiLieu.IdNguoiKy";
        List<KyTaiLieu> results = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KyTaiLieu.class), idTaiLieu);
        return results.isEmpty() ? null : results.get(0);
    }

    public int insert(KyTaiLieu da) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM KyTaiLieu WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, da.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return 0;
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO KyTaiLieu (Id, IdTaiLieu, LoaiKy, X, Y, IdNguoiKy, ChuKySo, NgayKy, STT, Scale, Width, Page) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, da.getId(), da.getIdTaiLieu(), da.getLoaiKy(), da.getX(), da.getY(), da.getIdNguoiKy(), da.getChuKySo(), da.getNgayKy(), da.getStt(), da.getScale(), da.getWidth(), da.getPage() != null ? da.getPage() : 1);
        }
    }

    public int delete(String id) {
        String sql = "DELETE FROM KyTaiLieu where IdTaiLieu = ?";
        return jdbcTemplate.update(sql, id);
    }

    public int addNguoiKy(NguoiKy nguoiKy) {
        String sql = "INSERT INTO NguoiKy(Id,IdTaiLieu,IdNguoiKy,TrangThai,IdPhongBan) VALUES (?, ?,?,?,?)";
        return jdbcTemplate.update(sql, nguoiKy.getId(), nguoiKy.getIdTaiLieu(), nguoiKy.getIdNguoiKy(), nguoiKy.getTrangThai(), nguoiKy.getIdPhongBan());
    }

    public int updateTrangThai(String id, String trangThai) {
        String sql = "UPDATE NguoiKy SET TrangThai = ? WHERE Id = ?";
        return jdbcTemplate.update(
                sql,
                trangThai,
                id
        );
    }

    public List<NguoiKy> getAllNguoiKyByIdTaiLieu(String idTaiLieu) {
        String sql = """
                SELECT
                    nk.Id,
                    nk.IdTaiLieu,
                    nk.IdNguoiKy,
                    nk.TrangThai,
                    nv.HoTen AS TenNguoiKy,
                    nk.IdPhongBan
                FROM NguoiKy AS nk
                LEFT JOIN NhanVien AS nv
                    ON nk.IdNguoiKy = nv.Id where nk.IdTaiLieu = ?;
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NguoiKy.class), idTaiLieu);
    }

    public NguoiKy getNguoiKy(String idNguoiKy, String idTaiLieu) {
        String sql = """
                SELECT
                    nk.Id,
                    nk.IdTaiLieu,
                    nk.IdNguoiKy,
                    nk.TrangThai,
                    nv.HoTen AS tenNguoiKy,
                    nk.IdPhongBan
                FROM NguoiKy AS nk
                LEFT JOIN NhanVien AS nv
                    ON nk.IdNguoiKy = nv.Id
                WHERE nk.IdTaiLieu = ? AND nk.IdNguoiKy = ?;
                """;

        List<NguoiKy> results = jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(NguoiKy.class),
                idTaiLieu, idNguoiKy
        );

        return results.isEmpty() ? null : results.get(0);
    }

    public int updateNguoiKy(String idTaiLieu, List<NguoiKy> nguoiKyList) {
        int count = 0;
        String sql = """
                delete from NguoiKy where IdTaiLieu = ?;""";
        jdbcTemplate.update(sql, idTaiLieu);
        for (NguoiKy nguoiKy : nguoiKyList) {
            addNguoiKy(nguoiKy);
            count++;
        }
        return count;
    }

    public int deleteAllNguoiKy(String idTaiLieu) {
        String sql = "DELETE FROM NguoiKy WHERE IdTaiLieu = ?";
        return jdbcTemplate.update(sql, idTaiLieu);
    }
}
