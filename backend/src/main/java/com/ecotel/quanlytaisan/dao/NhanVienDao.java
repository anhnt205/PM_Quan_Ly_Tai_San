package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NhanVien;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.ecotel.quanlytaisan.model.NhanVienDTO;

@Repository
public class NhanVienDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<NhanVienDTO> findAll(String idCongTy) {
        String sql = """
                SELECT 
                    nv.Id,
                    nv.HoTen,
                    nv.DiDong,
                    nv.EmailCongViec,
                
                    nv.AgreementUUId,
                
                    nv.KyNhay,
                    nv.KyThuong,
                    nv.KySo,
                    nv.ChuKyNhay,
                
                    nv.ChuKyThuong,
                    nv.PIN,
                    pb.Id AS PhongBanId,
                    pb.TenPhongBan,
                
                    cv.Id AS ChucVuId,
                    cv.TenChucVu,
                
                    ql.Id AS QuanLyId,
                    ql.HoTen AS TenQuanLy,
                
                    nv.LaQuanLy,
                    nv.Avatar,
                    nv.IdCongTy,
                    nv.DiaChiLamViec,
                    nv.HinhThucLamViec,
                    nv.GioLamViec,
                    nv.MuiGio,
                
                    nv.NgayTao,
                    nv.NgayCapNhat,
                    nv.NguoiTao,
                    nv.NguoiCapNhat,
                    nv.IsActive,
                    nv.SavePin,
                    (EXISTS (SELECT 1 FROM TaiKhoan tk WHERE tk.TenDangNhap = nv.Id)) AS HasAccount

                FROM 
                    NhanVien AS nv
                LEFT JOIN 
                    PhongBan AS pb ON nv.BoPhan = pb.Id
                LEFT JOIN 
                    ChucVu AS cv ON nv.ChucVu = cv.Id
                LEFT JOIN 
                    NhanVien AS ql ON nv.NguoiQuanLy = ql.Id
                WHERE  nv.IdCongTy = ?;
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NhanVienDTO.class), idCongTy);
    }

    public long countByCongTy(String idCongTy, String search) {
        if (search != null && !search.trim().isEmpty()) {
            String searchPattern = "%" + search.trim() + "%";
            String sql = """
                SELECT COUNT(*) FROM NhanVien nv
                LEFT JOIN PhongBan AS pb ON nv.BoPhan = pb.Id
                LEFT JOIN ChucVu AS cv ON nv.ChucVu = cv.Id
                WHERE nv.IdCongTy = ?
                AND (CONCAT(nv.Id, '') LIKE ? OR nv.HoTen LIKE ? OR nv.DiDong LIKE ? OR nv.EmailCongViec LIKE ? 
                     OR pb.TenPhongBan LIKE ? OR cv.TenChucVu LIKE ?)
                """;
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        } else {
            String sql = "SELECT COUNT(*) FROM NhanVien nv WHERE nv.IdCongTy = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        }
    }

    public List<NhanVienDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String search) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "hoten":
                orderColumn = "nv.HoTen";
                break;
            case "emailcongviec":
                orderColumn = "nv.EmailCongViec";
                break;
            case "ngaytao":
                orderColumn = "nv.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "nv.NgayCapNhat";
                break;
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Xử lý search
        String whereClause = "WHERE nv.IdCongTy = ?";
        String searchPattern = null;
       if (search != null && !search.trim().isEmpty()) {
            // SỬA DÒNG NÀY: Thay CAST bằng CONCAT
            // CONCAT(nv.Id, '') sẽ biến số 1431 thành chuỗi "1431" chính xác tuyệt đối
            whereClause += " AND (CONCAT(nv.Id, '') LIKE ? " 
                        + " OR nv.HoTen LIKE ?" 
                        + " OR nv.DiDong LIKE ?" 
                        + " OR nv.EmailCongViec LIKE ?" 
                        + " OR pb.TenPhongBan LIKE ?" 
                        + " OR cv.TenChucVu LIKE ?)";
            
            // Trim() để xóa khoảng trắng thừa nếu người dùng copy paste
            searchPattern = "%" + search.trim() + "%";
        }

        String sql = """
                SELECT 
                    nv.Id,
                    nv.HoTen,
                    nv.DiDong,
                    nv.EmailCongViec,
                    nv.AgreementUUId,
                    nv.KyNhay,
                    nv.KyThuong,
                    nv.KySo,
                    nv.ChuKyNhay,
                    nv.ChuKyThuong,
                    nv.PIN,
                    pb.Id AS PhongBanId,
                    pb.TenPhongBan,
                    cv.Id AS ChucVuId,
                    cv.TenChucVu,
                    ql.Id AS QuanLyId,
                    ql.HoTen AS TenQuanLy,
                    nv.LaQuanLy,
                    nv.Avatar,
                    nv.IdCongTy,
                    nv.DiaChiLamViec,
                    nv.HinhThucLamViec,
                    nv.GioLamViec,
                    nv.MuiGio,
                    nv.NgayTao,
                    nv.NgayCapNhat,
                    nv.NguoiTao,
                    nv.NguoiCapNhat,
                    nv.IsActive,
                    nv.SavePin,
                    (EXISTS (SELECT 1 FROM TaiKhoan tk WHERE tk.TenDangNhap = nv.Id)) AS HasAccount
                FROM 
                    NhanVien AS nv
                LEFT JOIN 
                    PhongBan AS pb ON nv.BoPhan = pb.Id
                LEFT JOIN 
                    ChucVu AS cv ON nv.ChucVu = cv.Id
                LEFT JOIN 
                    NhanVien AS ql ON nv.NguoiQuanLy = ql.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """;
        String finalSql = String.format(sql, whereClause, orderColumn, direction);
        if (searchPattern != null) {
            return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(NhanVienDTO.class), 
                idCongTy, searchPattern,searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, limit, offset);
        } else {
            return jdbcTemplate.query(finalSql, new BeanPropertyRowMapper<>(NhanVienDTO.class), idCongTy, limit, offset);
        }
    }

    public List<NhanVienDTO> findByPhongBan(String idPhongBan) {
        String sql = """
                SELECT 
                    nv.Id,
                    nv.HoTen,
                    nv.DiDong,
                    nv.EmailCongViec,
                   nv.PIN,
                    nv.AgreementUUId,
                    nv.KyNhay,
                    nv.KyThuong,
                    nv.KySo,
                    nv.ChuKyNhay,
                
                    nv.ChuKyThuong,
                    pb.Id AS PhongBanId,
                    pb.TenPhongBan,
                
                    cv.Id AS ChucVuId,
                    cv.TenChucVu,
                
                    ql.Id AS QuanLyId,
                    ql.HoTen AS TenQuanLy,
                
                    nv.LaQuanLy,
                    nv.Avatar,
                    nv.IdCongTy,
                    nv.DiaChiLamViec,
                    nv.HinhThucLamViec,
                    nv.GioLamViec,
                    nv.MuiGio,
                
                    nv.NgayTao,
                    nv.NgayCapNhat,
                    nv.NguoiTao,
                    nv.NguoiCapNhat,
                    nv.IsActive,
                    nv.SavePin
                FROM 
                    NhanVien AS nv
                LEFT JOIN 
                    PhongBan AS pb ON nv.BoPhan = pb.Id
                LEFT JOIN 
                    ChucVu AS cv ON nv.ChucVu = cv.Id
                LEFT JOIN 
                    NhanVien AS ql ON nv.NguoiQuanLy = ql.Id
                WHERE pb.Id = ?;
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NhanVienDTO.class), idPhongBan);
    }

    public NhanVienDTO findById(String id) {
        String sql = """
                SELECT 
                    nv.Id,
                    nv.HoTen,
                    nv.DiDong,
                    nv.EmailCongViec,
                    nv.AgreementUUId,
                    nv.KyNhay,
                    nv.KyThuong,
                    nv.KySo,
                    nv.ChuKyNhay,
                      nv.PIN,
                    nv.ChuKyThuong,
                    pb.Id AS PhongBanId,
                    pb.TenPhongBan,
                
                    cv.Id AS ChucVuId,
                    cv.TenChucVu,
                
                    ql.Id AS QuanLyId,
                    ql.HoTen AS TenQuanLy,
                
                    nv.LaQuanLy,
                    nv.Avatar,
                    nv.IdCongTy,
                    nv.DiaChiLamViec,
                    nv.HinhThucLamViec,
                    nv.GioLamViec,
                    nv.MuiGio,
                
                    nv.NgayTao,
                    nv.NgayCapNhat,
                    nv.NguoiTao,
                    nv.NguoiCapNhat,
                    nv.IsActive,
                    nv.SavePin
                FROM 
                    NhanVien AS nv
                LEFT JOIN 
                    PhongBan AS pb ON nv.BoPhan = pb.Id
                LEFT JOIN 
                    ChucVu AS cv ON nv.ChucVu = cv.Id
                LEFT JOIN 
                    NhanVien AS ql ON nv.NguoiQuanLy = ql.Id
                WHERE nv.Id = ?;
                """;
        List<NhanVienDTO> result = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(NhanVienDTO.class), id);
        return result.isEmpty() ? null : result.get(0);
    }

    public int insert(NhanVien nv) {
        // Kiểm tra id không null và không empty
        if (nv.getId() == null || nv.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM NhanVien WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, nv.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(nv);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = """
                    INSERT INTO NhanVien
                    (Id, HoTen, DiDong, EmailCongViec, KyNhay, KyThuong, KySo,
                     ChuKyNhay, ChuKyThuong, AgreementUUId, PIN, BoPhan, ChucVu,
                     NguoiQuanLy, LaQuanLy, Avatar, IdCongTy, DiaChiLamViec,
                     HinhThucLamViec, GioLamViec, MuiGio, NguoiTao, NguoiCapNhat,
                     IsActive, NgayTao, NgayCapNhat,SavePin)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                    """;
            return jdbcTemplate.update(sql, nv.getId(), nv.getHoTen(), nv.getDiDong(), nv.getEmailCongViec(), nv.getKyNhay(), nv.getKyThuong(), nv.getKySo(), nv.getChuKyNhay(), nv.getChuKyThuong(), nv.getAgreementUUId(), nv.getPin(), nv.getBoPhan(), nv.getChucVu(), nv.getNguoiQuanLy(), nv.getLaQuanLy(), nv.getAvatar(), nv.getIdCongTy(), nv.getDiaChiLamViec(), nv.getHinhThucLamViec(), nv.getGioLamViec(), nv.getMuiGio(), nv.getNguoiTao(), nv.getNguoiCapNhat(), nv.getIsActive(), nv.getNgayTao(), nv.getNgayCapNhat(), nv.getSavePin());
        }
    }

    public int update(NhanVien nv) {
        String sql = """
                UPDATE NhanVien SET
                    HoTen = ?,
                    DiDong = ?,
                    EmailCongViec = ?,
                    KyNhay = ?,
                    KyThuong = ?,
                    KySo = ?,
                    ChuKyNhay = ?,
                    ChuKyThuong = ?,
                    AgreementUUId = ?,
                    PIN = ?,
                    BoPhan = ?,
                    ChucVu = ?,
                    NguoiQuanLy = ?,
                    LaQuanLy = ?,
                    Avatar = ?,
                    IdCongTy = ?,
                    DiaChiLamViec = ?,
                    HinhThucLamViec = ?,
                    GioLamViec = ?,
                    MuiGio = ?,
                    NguoiTao = ?,
                    NguoiCapNhat = ?,
                    IsActive = ?,
                    NgayTao = ?,
                    NgayCapNhat = ?,
                    SavePin=?
                WHERE Id = ?
                """;

        return jdbcTemplate.update(sql, nv.getHoTen(), nv.getDiDong(), nv.getEmailCongViec(), nv.getKyNhay(), nv.getKyThuong(), nv.getKySo(), nv.getChuKyNhay(), nv.getChuKyThuong(), nv.getAgreementUUId(), nv.getPin(), nv.getBoPhan(), nv.getChucVu(), nv.getNguoiQuanLy(), nv.getLaQuanLy(), nv.getAvatar(), nv.getIdCongTy(), nv.getDiaChiLamViec(), nv.getHinhThucLamViec(), nv.getGioLamViec(), nv.getMuiGio(), nv.getNguoiTao(), nv.getNguoiCapNhat(), nv.getIsActive(), nv.getNgayTao(), nv.getNgayCapNhat(), nv.getSavePin(), nv.getId() // điều kiện WHERE
        );
    }

    public int delete(String id) {
        String sql = "DELETE FROM NhanVien WHERE Id=?";
        int result = 0;
        result += jdbcTemplate.update(sql, id);
        sql = "delete from TaiKhoan where TenDangNhap =?";
        return result + jdbcTemplate.update(sql, id);

    }




    public int deleteAll() {
        String sql = "DELETE FROM NhanVien";
        return jdbcTemplate.update(sql);
    }




}
