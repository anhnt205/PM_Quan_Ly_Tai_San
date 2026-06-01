package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.NhanVien;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
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

    public NhanVien findEntityById(String id) {
        String sql = "SELECT * FROM NhanVien WHERE Id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(NhanVien.class), id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
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

    public int batchUpdate(List<NhanVien> list) {
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
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                NhanVien nv = list.get(i);
                ps.setString(1, nv.getHoTen());
                ps.setString(2, nv.getDiDong());
                ps.setString(3, nv.getEmailCongViec());
                
                if (nv.getKyNhay() != null) ps.setBoolean(4, nv.getKyNhay());
                else ps.setNull(4, java.sql.Types.BOOLEAN);
                
                if (nv.getKyThuong() != null) ps.setBoolean(5, nv.getKyThuong());
                else ps.setNull(5, java.sql.Types.BOOLEAN);
                
                if (nv.getKySo() != null) ps.setBoolean(6, nv.getKySo());
                else ps.setNull(6, java.sql.Types.BOOLEAN);
                
                ps.setString(7, nv.getChuKyNhay());
                ps.setString(8, nv.getChuKyThuong());
                ps.setString(9, nv.getAgreementUUId());
                ps.setString(10, nv.getPin());
                ps.setString(11, nv.getBoPhan());
                ps.setString(12, nv.getChucVu());
                ps.setString(13, nv.getNguoiQuanLy());
                
                if (nv.getLaQuanLy() != null) ps.setBoolean(14, nv.getLaQuanLy());
                else ps.setNull(14, java.sql.Types.BOOLEAN);
                
                ps.setString(15, nv.getAvatar());
                ps.setString(16, nv.getIdCongTy());
                ps.setString(17, nv.getDiaChiLamViec());
                ps.setString(18, nv.getHinhThucLamViec());
                ps.setString(19, nv.getGioLamViec());
                ps.setString(20, nv.getMuiGio());
                ps.setString(21, nv.getNguoiTao());
                ps.setString(22, nv.getNguoiCapNhat());
                
                if (nv.getIsActive() != null) ps.setBoolean(23, nv.getIsActive());
                else ps.setNull(23, java.sql.Types.BOOLEAN);
                
                ps.setString(24, nv.getNgayTao());
                ps.setString(25, nv.getNgayCapNhat());
                
                if (nv.getSavePin() != null) ps.setBoolean(26, nv.getSavePin());
                else ps.setNull(26, java.sql.Types.BOOLEAN);
                
                ps.setString(27, nv.getId());
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchInsert(List<NhanVien> list) {
        String sql = """
                INSERT INTO NhanVien
                (Id, HoTen, DiDong, EmailCongViec, KyNhay, KyThuong, KySo,
                 ChuKyNhay, ChuKyThuong, AgreementUUId, PIN, BoPhan, ChucVu,
                 NguoiQuanLy, LaQuanLy, Avatar, IdCongTy, DiaChiLamViec,
                 HinhThucLamViec, GioLamViec, MuiGio, NguoiTao, NguoiCapNhat,
                 IsActive, NgayTao, NgayCapNhat,SavePin)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """;
        int[] result = jdbcTemplate.batchUpdate(sql, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                NhanVien nv = list.get(i);
                ps.setString(1, nv.getId());
                ps.setString(2, nv.getHoTen());
                ps.setString(3, nv.getDiDong());
                ps.setString(4, nv.getEmailCongViec());
                
                if (nv.getKyNhay() != null) ps.setBoolean(5, nv.getKyNhay());
                else ps.setNull(5, java.sql.Types.BOOLEAN);
                
                if (nv.getKyThuong() != null) ps.setBoolean(6, nv.getKyThuong());
                else ps.setNull(6, java.sql.Types.BOOLEAN);
                
                if (nv.getKySo() != null) ps.setBoolean(7, nv.getKySo());
                else ps.setNull(7, java.sql.Types.BOOLEAN);
                
                ps.setString(8, nv.getChuKyNhay());
                ps.setString(9, nv.getChuKyThuong());
                ps.setString(10, nv.getAgreementUUId());
                ps.setString(11, nv.getPin());
                ps.setString(12, nv.getBoPhan());
                ps.setString(13, nv.getChucVu());
                ps.setString(14, nv.getNguoiQuanLy());
                
                if (nv.getLaQuanLy() != null) ps.setBoolean(15, nv.getLaQuanLy());
                else ps.setNull(15, java.sql.Types.BOOLEAN);
                
                ps.setString(16, nv.getAvatar());
                ps.setString(17, nv.getIdCongTy());
                ps.setString(18, nv.getDiaChiLamViec());
                ps.setString(19, nv.getHinhThucLamViec());
                ps.setString(20, nv.getGioLamViec());
                ps.setString(21, nv.getMuiGio());
                ps.setString(22, nv.getNguoiTao());
                ps.setString(23, nv.getNguoiCapNhat());
                
                if (nv.getIsActive() != null) ps.setBoolean(24, nv.getIsActive());
                else ps.setNull(24, java.sql.Types.BOOLEAN);
                
                ps.setString(25, nv.getNgayTao());
                ps.setString(26, nv.getNgayCapNhat());
                
                if (nv.getSavePin() != null) ps.setBoolean(27, nv.getSavePin());
                else ps.setNull(27, java.sql.Types.BOOLEAN);
            }

            @Override
            public int getBatchSize() {
                return list.size();
            }
        });

        int total = 0;
        for (int r : result) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;
    }

    public int batchCreate(List<NhanVien> list) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        List<String> ids = new java.util.ArrayList<>();
        for (NhanVien nv : list) {
            if (nv.getId() != null && !nv.getId().trim().isEmpty()) {
                ids.add(nv.getId());
            }
        }

        if (ids.isEmpty()) {
            return 0;
        }

        StringBuilder inBuilder = new StringBuilder();
        for (int i = 0; i < ids.size(); i++) {
            inBuilder.append("?");
            if (i < ids.size() - 1) {
                inBuilder.append(",");
            }
        }

        String checkSql = "SELECT Id FROM NhanVien WHERE Id IN (" + inBuilder.toString() + ")";
        List<String> existingIds = jdbcTemplate.query(
                checkSql,
                (rs, rowNum) -> rs.getString("Id"),
                ids.toArray()
        );

        List<NhanVien> toInsert = new java.util.ArrayList<>();
        List<NhanVien> toUpdate = new java.util.ArrayList<>();

        java.util.Set<String> existingSet = new java.util.HashSet<>(existingIds);
        for (NhanVien nv : list) {
            if (nv.getId() == null || nv.getId().trim().isEmpty()) {
                continue;
            }
            if (existingSet.contains(nv.getId())) {
                toUpdate.add(nv);
            } else {
                toInsert.add(nv);
            }
        }

        int total = 0;
        if (!toInsert.isEmpty()) {
            total += batchInsert(toInsert);
        }
        if (!toUpdate.isEmpty()) {
            total += batchUpdate(toUpdate);
        }

        return total;
    }

    public int delete(String id) {
        String sql = "DELETE FROM NhanVien WHERE Id=?";
        int result = 0;
        result += jdbcTemplate.update(sql, id);
        sql = "delete from TaiKhoan where TenDangNhap =?";
        return result + jdbcTemplate.update(sql, id);
    }

    public int batchDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String sqlNhanVien = "DELETE FROM NhanVien WHERE Id=?";
        int[] resultNhanVien = jdbcTemplate.batchUpdate(sqlNhanVien, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        String sqlTaiKhoan = "DELETE FROM TaiKhoan WHERE TenDangNhap=?";
        int[] resultTaiKhoan = jdbcTemplate.batchUpdate(sqlTaiKhoan, new org.springframework.jdbc.core.BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                ps.setString(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        int total = 0;
        for (int r : resultNhanVien) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        for (int r : resultTaiKhoan) {
            if (r > 0 || r == java.sql.Statement.SUCCESS_NO_INFO) {
                total += (r == java.sql.Statement.SUCCESS_NO_INFO) ? 1 : r;
            }
        }
        return total;

    }




    public int deleteAll() {
        String sql = "DELETE FROM NhanVien";
        return jdbcTemplate.update(sql);
    }




}
