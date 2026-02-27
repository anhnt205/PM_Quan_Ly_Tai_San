package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.concurrent.CompletableFuture;
import javax.annotation.PostConstruct;


@Repository
public class TaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private SetNguonKinhPhiDao setNguonKinhPhiDao;

    private final String SELECT_TAISAN_DTO = """
            SELECT 
                ts.*, 
                mhts.TenMoHinh, 
                nts.TenNhom, 
                da.TenDuAn, 
                nv.TenNguonKinhPhi,
                ts.IdDuDan as idDuAn
            FROM TaiSan AS ts
            LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
            LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
            LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
            LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
            """;


    public List<TaiSanDTO> findAll(String idCongTy) {
        String sql = SELECT_TAISAN_DTO + " WHERE ts.IdCongTy = ?";
        List<TaiSanDTO> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy);
        
        // Load thêm các thông tin phụ nếu cần (Nguồn kinh phí)
        attachAdditionalData(list);
        return list;
    }

    /**
     * Hàm phụ trợ để load thêm dữ liệu quan hệ (Nguồn kinh phí) cho DTO
     */
    private void attachAdditionalData(List<TaiSanDTO> taiSanDTOList) {
        if (taiSanDTOList == null || taiSanDTOList.isEmpty()) return;

        List<String> soTheList = taiSanDTOList.stream()
                .map(TaiSanDTO::getSoThe)
                .filter(s -> s != null && !s.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        if (!soTheList.isEmpty()) {
            // Lấy dữ liệu từ các DAO khác
            List<SetNguonKinhPhi> allSetNguon = setNguonKinhPhiDao.getSetNguonKinhPhiTaiSanIds(soTheList);
            List<Map<String, Object>> allNguonRaw = setNguonKinhPhiDao.getNguonKinhPhiWithTaiSanId(soTheList);

            Map<String, List<SetNguonKinhPhi>> setNguonMap = allSetNguon.stream()
                    .collect(Collectors.groupingBy(SetNguonKinhPhi::getIdTaiSan));

            Map<String, List<NguonKinhPhi>> nguonMap = new java.util.HashMap<>();
            for (Map<String, Object> row : allNguonRaw) {
                String idTaiSan = (String) row.get("IdTaiSan");
                NguonKinhPhi nkp = new NguonKinhPhi();
                nkp.setId((String) row.get("Id"));
                nkp.setTen((String) row.get("Ten"));
                nguonMap.computeIfAbsent(idTaiSan, k -> new ArrayList<>()).add(nkp);
            }

            for (TaiSanDTO dto : taiSanDTOList) {
                if (dto.getSoThe() != null) {
                    dto.setSetNguonKinhPhiList(setNguonMap.getOrDefault(dto.getSoThe(), new ArrayList<>()));
                    dto.setNguonKinhPhiList(nguonMap.getOrDefault(dto.getSoThe(), new ArrayList<>()));
                }
            }
        }
    }

    public long countByCongTy(String idCongTy) {
        String sql = "SELECT COUNT(*) FROM TaiSan ts WHERE ts.IdCongTy = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
    }

    public long countByCongTyAndNhom(String idCongTy, String idNhomTaiSan) {
        String sql = "SELECT COUNT(*) FROM TaiSan ts WHERE ts.IdCongTy = ? AND ts.IdNhomTaiSan = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, idNhomTaiSan);
    }

    public long countByDonViBanDau(String idCongTy, String idDonViBanDau) {
        String sql = "SELECT COUNT(*) FROM TaiSan ts WHERE ts.IdCongTy = ? AND ts.IdDonViBanDau = ? AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '')";
        return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, idDonViBanDau);
    }

    public long countByDonViHienThoi(String idCongTy, String idDonViHienThoi, String idNhomTaiSan) {
        String whereClause = "WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ?";
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause += " AND ts.IdNhomTaiSan = ?";
        }
        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause;

        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, idDonViHienThoi, idNhomTaiSan);
        } else {
            return jdbcTemplate.queryForObject(sql, Long.class, idCongTy, idDonViHienThoi);
        }
    }

    /**
     * Đếm số lượng tài sản thực tế theo từng nhóm
     * KHÔNG lấy từ DB mà đếm thực tế từ bảng TaiSan
     */
    public Map<String, Long> getCountByNhomTaiSan(String idCongTy) {
        String sql = """
        SELECT 
            ts.IdNhomTaiSan AS idNhomTaiSan,
            nts.TenNhom AS tenNhom,
            COUNT(ts.Id) AS soLuong
        FROM TaiSan ts
        LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
        WHERE ts.IdCongTy = ?
        GROUP BY ts.IdNhomTaiSan, nts.TenNhom
        """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, idCongTy);
        Map<String, Long> counts = new java.util.HashMap<>();

        for (Map<String, Object> row : results) {
            String id = (String) row.get("idNhomTaiSan");
            Long count = ((Number) row.get("soLuong")).longValue();

            // Xử lý trường hợp tài sản chưa có nhóm
            if (id == null || id.isEmpty()) {
                counts.put("UNKNOWN", count);
            } else {
                counts.put(id, count);
            }
        }

        return counts;
    }

    public List<TaiSanDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String idNhomTaiSan) {
        // Whitelist sort columns to prevent SQL injection
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tents":
            case "tentaisan":
                orderColumn = "ts.TenTaiSan";
                break;
            case "sothe":
                orderColumn = "ts.SoThe";
                break;
            case "ngaysudung":
                orderColumn = "ts.NgaySuDung";
                break;
            case "nguyengia":
                orderColumn = "ts.NguyenGia";
                break;
            case "ngaytao":
                orderColumn = "ts.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "ts.NgayCapNhat";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";
        String whereClause = "WHERE ts.IdCongTy = ?";
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause += " AND ts.IdNhomTaiSan = ?";
        }

        String sql = String.format("""
                SELECT 
                    ts.Id,
                    ts.TenTaiSan,
                    ts.NguyenGia,
                    ts.GiaTriKhauHaoBanDau,
                    ts.KyKhauHaoBanDau,
                    ts.GiaTriThanhLy,
                    ts.IdMoHinhTaiSan,
                    mhts.TenMoHinh,
                    ts.IdNhomTaiSan,
                    nts.TenNhom,
                    ts.IdDuDan as idDuAn,
                    da.TenDuAn,
                    ts.IdNguonVon,
                    nv.TenNguonKinhPhi,
                    ts.PhuongPhapKhauHao,
                    ts.SoKyKhauHao,
                    ts.TaiKhoanTaiSan,
                    ts.TaiKhoanKhauHao,
                    ts.TaiKhoanChiPhi,
                    ts.NgayVaoSo,
                    ts.NgaySuDung,
                    ts.KyHieu,
                    ts.SoKyHieu,
                    ts.CongSuat,
                    ts.NuocSanXuat,
                    ts.NamSanXuat,
                    ts.LyDoTang,
                    ts.HienTrang,
                    ts.SoLuong,
                    ts.DonViTinh,
                    ts.GhiChu,
                    ts.IdDonViBanDau,
                    ts.IdDonViHienThoi,
                    ts.MoTa,
                    ts.IdCongTy,
                    ts.NgayTao,
                    ts.NgayCapNhat,
                    ts.NguoiTao,
                    ts.NguoiCapNhat,
                    ts.IsActive,
                    ts.IsTaiSanCon,
                    ts.IdLoaiTaiSanCon,
                    ts.SoThe,
                    ts.nvNS,
                    ts.vonVay,
                    ts.vonKhac
                FROM 
                    TaiSan AS ts
                LEFT JOIN 
                    MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN 
                    NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN 
                    DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN 
                    NguonVon AS nv ON ts.IdNguonVon = nv.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, whereClause, orderColumn, direction);

        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idNhomTaiSan, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, limit, offset);
        }
    }

    public List<TaiSanDTO> findByDonViBanDauPaged(String idCongTy, String idDonViBanDau, int offset, int limit, String sortBy, String sortDir) {
        // Whitelist sort columns to prevent SQL injection
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tents":
            case "tentaisan":
                orderColumn = "ts.TenTaiSan";
                break;
            case "sothe":
                orderColumn = "ts.SoThe";
                break;
            case "ngaysudung":
                orderColumn = "ts.NgaySuDung";
                break;
            case "nguyengia":
                orderColumn = "ts.NguyenGia";
                break;
            case "ngaytao":
                orderColumn = "ts.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "ts.NgayCapNhat";
                break;
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";
        String whereClause = "WHERE ts.IdCongTy = ? AND ts.IdDonViBanDau = ? AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '')";

        String sql = String.format("""
                SELECT 
                    ts.Id,
                    ts.TenTaiSan,
                    ts.NguyenGia,
                    ts.GiaTriKhauHaoBanDau,
                    ts.KyKhauHaoBanDau,
                    ts.GiaTriThanhLy,
                    ts.IdMoHinhTaiSan,
                    mhts.TenMoHinh,
                    ts.IdNhomTaiSan,
                    nts.TenNhom,
                    ts.IdDuDan as idDuAn,
                    da.TenDuAn,
                    ts.IdNguonVon,
                    nv.TenNguonKinhPhi,
                    ts.PhuongPhapKhauHao,
                    ts.SoKyKhauHao,
                    ts.TaiKhoanTaiSan,
                    ts.TaiKhoanKhauHao,
                    ts.TaiKhoanChiPhi,
                    ts.NgayVaoSo,
                    ts.NgaySuDung,
                    ts.KyHieu,
                    ts.SoKyHieu,
                    ts.CongSuat,
                    ts.NuocSanXuat,
                    ts.NamSanXuat,
                    ts.LyDoTang,
                    ts.HienTrang,
                    ts.SoLuong,
                    ts.DonViTinh,
                    ts.GhiChu,
                    ts.IdDonViBanDau,
                    ts.IdDonViHienThoi,
                    ts.MoTa,
                    ts.IdCongTy,
                    ts.NgayTao,
                    ts.NgayCapNhat,
                    ts.NguoiTao,
                    ts.NguoiCapNhat,
                    ts.IsActive,
                    ts.IsTaiSanCon,
                    ts.IdLoaiTaiSanCon,
                    ts.SoThe,
                    ts.nvNS,
                    ts.vonVay,
                    ts.vonKhac
                FROM 
                    TaiSan AS ts
                LEFT JOIN 
                    MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN 
                    NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN 
                    DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN 
                    NguonVon AS nv ON ts.IdNguonVon = nv.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, whereClause, orderColumn, direction);

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idDonViBanDau, limit, offset);
    }

    public List<TaiSanDTO> findByDonViHienThoiPaged(String idCongTy, String idDonViHienThoi, int offset, int limit, String sortBy, String sortDir, String idNhomTaiSan) {

        // Whitelist sort columns
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";

        String orderColumn;
        switch (normalizedSortBy) {
            case "tents":
            case "tentaisan":
                orderColumn = "ts.TenTaiSan";
                break;
            case "sothe":
                orderColumn = "ts.SoThe";
                break;
            case "ngaysudung":
                orderColumn = "ts.NgaySuDung";
                break;
            case "nguyengia":
                orderColumn = "ts.NguyenGia";
                break;
            case "ngaytao":
                orderColumn = "ts.NgayTao";
                break;
            case "ngaycapnhat":
            default:
                orderColumn = "ts.NgayCapNhat";
                break;
        }

        // Sort direction
        String direction = "ASC".equalsIgnoreCase(sortDir) ? "ASC" : "DESC";

        // WHERE clause
        String whereClause;
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause = "WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ? AND ts.IdNhomTaiSan = ?";
        } else {
            whereClause = "WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ?";
        }

        // Final SQL
        String sql = String.format("""
                    SELECT
                          ts.Id,
                ts.TenTaiSan,
                ts.NguyenGia,
                ts.GiaTriKhauHaoBanDau,
                ts.KyKhauHaoBanDau,
                ts.GiaTriThanhLy,
                ts.IdMoHinhTaiSan,
                mhts.TenMoHinh,
                ts.IdNhomTaiSan,
                nts.TenNhom,
                ts.IdDuDan as idDuAn,
                da.TenDuAn,
                ts.IdNguonVon,
                nv.TenNguonKinhPhi,
                ts.PhuongPhapKhauHao,
                ts.SoKyKhauHao,
                ts.TaiKhoanTaiSan,
                ts.TaiKhoanKhauHao,
                ts.TaiKhoanChiPhi,
                ts.NgayVaoSo,
                ts.NgaySuDung,
                ts.KyHieu,
                ts.SoKyHieu,
                ts.CongSuat,
                ts.NuocSanXuat,
                ts.NamSanXuat,
                ts.LyDoTang,
                ts.HienTrang,
                ts.SoLuong,
                ts.DonViTinh,
                ts.GhiChu,
                ts.IdDonViBanDau,
                ts.IdDonViHienThoi,
                ts.MoTa,
                ts.IdCongTy,
                ts.NgayTao,
                ts.NgayCapNhat,
                ts.NguoiTao,
                ts.NguoiCapNhat,
                ts.IsActive,
                ts.IsTaiSanCon,
                ts.IdLoaiTaiSanCon,
                ts.SoThe,
                ts.nvNS,
                ts.vonVay,
                ts.vonKhac
                    FROM TaiSan ts
                    LEFT JOIN MoHinhTaiSan mhts ON ts.IdMoHinhTaiSan = mhts.Id
                    LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
                    LEFT JOIN DuAn da ON ts.IdDuDan = da.Id
                    LEFT JOIN NguonVon nv ON ts.IdNguonVon = nv.Id
                    %s
                    ORDER BY %s %s
                    LIMIT ? OFFSET ?
                """, whereClause, orderColumn, direction);

        // Execute query
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idDonViHienThoi, idNhomTaiSan, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idDonViHienThoi, limit, offset);
        }
    }

    public List<TaiSanDTO> findByIdLoaiTS(String idLoaiTS) {
        String sql = """
                                SELECT 
                    ts.Id,
                    ts.TenTaiSan,
                    ts.NguyenGia,
                    ts.GiaTriKhauHaoBanDau,
                    ts.KyKhauHaoBanDau,
                    ts.GiaTriThanhLy,
                
                    -- Thông tin mô hình tài sản
                    ts.IdMoHinhTaiSan,
                    mhts.TenMoHinh,
                
                    -- Thông tin nhóm tài sản
                    ts.IdNhomTaiSan,
                    nts.TenNhom,
                
                    -- Thông tin dự án
                    ts.IdDuDan as idDuAn,
                    da.TenDuAn,
                
                    -- Thông tin nguồn vốn
                    ts.IdNguonVon,
                    nv.TenNguonKinhPhi,
                
                    ts.PhuongPhapKhauHao,
                    ts.SoKyKhauHao,
                    ts.TaiKhoanTaiSan,
                    ts.TaiKhoanKhauHao,
                    ts.TaiKhoanChiPhi,
                    ts.NgayVaoSo,
                    ts.NgaySuDung,
                    ts.KyHieu,
                    ts.SoKyHieu,
                    ts.CongSuat,
                    ts.NuocSanXuat,
                    ts.NamSanXuat,
                    ts.LyDoTang,
                    ts.HienTrang,
                    ts.SoLuong,
                    ts.DonViTinh,
                    ts.GhiChu,
                    ts.IdDonViBanDau,
                    ts.IdDonViHienThoi,
                    ts.MoTa,
                    ts.IdCongTy,
                    ts.NgayTao,
                    ts.NgayCapNhat,
                    ts.NguoiTao,
                    ts.NguoiCapNhat,
                    ts.IsActive,
                  ts.IsTaiSanCon,
                  ts.IdLoaiTaiSanCon, 
                  ts.SoThe,
                  ts.nvNS,
                  ts.vonVay,
                  ts.vonKhac
                FROM 
                    TaiSan AS ts
                LEFT JOIN 
                    MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN 
                    NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN 
                    DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN 
                    NguonVon AS nv ON ts.IdNguonVon = nv.Id
                where  ts.IdLoaiTaiSan = ?;
                """;

        List<TaiSanDTO> taiSanDTOList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idLoaiTS);
        for (int i = 0; i < taiSanDTOList.size(); i++) {
            {
                List<NguonKinhPhi> nguonKinhPhiList = setNguonKinhPhiDao.getNguonKinhPhiByTaiSan(taiSanDTOList.get(i).getSoThe());
                taiSanDTOList.get(i).setNguonKinhPhiList(nguonKinhPhiList);
            }
        }
        return taiSanDTOList;

    }

    public TaiSanDTO findById(String id) {
        String sql = """
                                SELECT 
                    ts.Id,
                    ts.TenTaiSan,
                    ts.NguyenGia,
                    ts.GiaTriKhauHaoBanDau,
                    ts.KyKhauHaoBanDau,
                    ts.GiaTriThanhLy,
                
                    -- Thông tin mô hình tài sản
                    ts.IdMoHinhTaiSan,
                    mhts.TenMoHinh,
                
                    -- Thông tin nhóm tài sản
                    ts.IdNhomTaiSan,
                    nts.TenNhom,
                
                    -- Thông tin dự án
                    ts.IdDuDan as idDuAn,
                    da.TenDuAn,
                
                    -- Thông tin nguồn vốn
                    ts.IdNguonVon,
                    nv.TenNguonKinhPhi,
                
                    ts.PhuongPhapKhauHao,
                    ts.SoKyKhauHao,
                    ts.TaiKhoanTaiSan,
                    ts.TaiKhoanKhauHao,
                    ts.TaiKhoanChiPhi,
                    ts.NgayVaoSo,
                    ts.NgaySuDung,
                    ts.KyHieu,
                    ts.SoKyHieu,
                    ts.CongSuat,
                    ts.NuocSanXuat,
                    ts.NamSanXuat,
                    ts.LyDoTang,
                    ts.HienTrang,
                    ts.SoLuong,
                    ts.DonViTinh,
                    ts.GhiChu,
                    ts.IdDonViBanDau,
                    ts.IdDonViHienThoi,
                    ts.MoTa,
                    ts.IdCongTy,
                    ts.NgayTao,
                    ts.NgayCapNhat,
                    ts.NguoiTao,
                    ts.NguoiCapNhat,
                    ts.IsActive,
                      ts.IsTaiSanCon,
                      ts.IdLoaiTaiSanCon, 
                      ts.SoThe,
                      ts.nvNS,
                      ts.vonVay,
                      ts.vonKhac
                FROM 
                    TaiSan AS ts
                LEFT JOIN 
                    MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN 
                    NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN 
                    DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN 
                    NguonVon AS nv ON ts.IdNguonVon = nv.Id
                where  ts.Id = ?
                """;
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), id);
    }

    public int insert(TaiSan taiSan) {
        System.out.println(taiSan.toString());

        // Kiểm tra id không null và không empty
        if (taiSan.getId() == null || taiSan.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }

        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM TaiSan WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, taiSan.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return update(taiSan);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "INSERT INTO TaiSan (Id, IdLoaiTaiSan, TenTaiSan, NguyenGia, GiaTriKhauHaoBanDau, KyKhauHaoBanDau, " + "GiaTriThanhLy, IdMoHinhTaiSan, PhuongPhapKhauHao, SoKyKhauHao, TaiKhoanTaiSan, TaiKhoanKhauHao, TaiKhoanChiPhi, " + "IdNhomTaiSan, NgayVaoSo, NgaySuDung, IdDuDan, IdNguonVon, KyHieu, SoKyHieu, CongSuat, NuocSanXuat, NamSanXuat, " + "LyDoTang, HienTrang, SoLuong, DonViTinh, GhiChu, IdDonViBanDau, IdDonViHienThoi, MoTa, IdCongTy, NgayTao, " + "NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive,  IsTaiSanCon,IdLoaiTaiSanCon, SoThe, nvNS, vonVay, vonKhac) " + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?, ?, ?)";
            int result = jdbcTemplate.update(sql, taiSan.getId(), taiSan.getIdLoaiTaiSan(), taiSan.getTenTaiSan(), taiSan.getNguyenGia(), taiSan.getGiaTriKhauHaoBanDau(), taiSan.getKyKhauHaoBanDau(), taiSan.getGiaTriThanhLy(), taiSan.getIdMoHinhTaiSan(), taiSan.getPhuongPhapKhauHao(), taiSan.getSoKyKhauHao(), taiSan.getTaiKhoanTaiSan(), taiSan.getTaiKhoanKhauHao(), taiSan.getTaiKhoanChiPhi(), taiSan.getIdNhomTaiSan(), taiSan.getNgayVaoSo(), taiSan.getNgaySuDung(), taiSan.getIdDuDan(), taiSan.getIdNguonVon(), taiSan.getKyHieu(), taiSan.getSoKyHieu(), taiSan.getCongSuat(), taiSan.getNuocSanXuat(), taiSan.getNamSanXuat(), taiSan.getLyDoTang(), taiSan.getHienTrang(), taiSan.getSoLuong(), taiSan.getDonViTinh(), taiSan.getGhiChu(), taiSan.getIdDonViBanDau(), taiSan.getIdDonViHienThoi(), taiSan.getMoTa(), taiSan.getIdCongTy(), taiSan.getNgayTao(), taiSan.getNgayCapNhat(), taiSan.getNguoiTao(), taiSan.getNguoiCapNhat(), taiSan.getIsActive(), taiSan.getIsTaiSanCon(), taiSan.getIdLoaiTaiSanCon(), taiSan.getSoThe(), taiSan.getNvNS(), taiSan.getVonVay(), taiSan.getVonKhac());
            // if (result > 0) {
            //     refreshCache();
            // }
            return result;
        }
    }

    public int update(TaiSan taiSan) {
        String sql = """
                    UPDATE TaiSan SET
                        IdLoaiTaiSan=?, TenTaiSan=?, NguyenGia=?, GiaTriKhauHaoBanDau=?, KyKhauHaoBanDau=?,
                        GiaTriThanhLy=?, IdMoHinhTaiSan=?, PhuongPhapKhauHao=?, SoKyKhauHao=?,
                        TaiKhoanTaiSan=?, TaiKhoanKhauHao=?, TaiKhoanChiPhi=?, IdNhomTaiSan=?,
                        NgayVaoSo=?, NgaySuDung=?, IdDuDan=?, IdNguonVon=?, KyHieu=?, SoKyHieu=?,
                        CongSuat=?, NuocSanXuat=?, NamSanXuat=?, LyDoTang=?, HienTrang=?, SoLuong=?,
                        DonViTinh=?, GhiChu=?, IdDonViBanDau=?, IdDonViHienThoi=?, MoTa=?, IdCongTy=?,
                        NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?,   IsTaiSanCon=?,IdLoaiTaiSanCon=?, SoThe=?, nvNS=?, vonVay=?, vonKhac=?
                    WHERE Id=?
                """;

        int result = jdbcTemplate.update(sql, taiSan.getIdLoaiTaiSan(), taiSan.getTenTaiSan(), taiSan.getNguyenGia(), taiSan.getGiaTriKhauHaoBanDau(), taiSan.getKyKhauHaoBanDau(), taiSan.getGiaTriThanhLy(), taiSan.getIdMoHinhTaiSan(), taiSan.getPhuongPhapKhauHao(), taiSan.getSoKyKhauHao(), taiSan.getTaiKhoanTaiSan(), taiSan.getTaiKhoanKhauHao(), taiSan.getTaiKhoanChiPhi(), taiSan.getIdNhomTaiSan(), taiSan.getNgayVaoSo(),   // fix
                taiSan.getNgaySuDung(), // fix
                taiSan.getIdDuDan(), taiSan.getIdNguonVon(), taiSan.getKyHieu(), taiSan.getSoKyHieu(), taiSan.getCongSuat(), taiSan.getNuocSanXuat(), taiSan.getNamSanXuat(), taiSan.getLyDoTang(), taiSan.getHienTrang(), taiSan.getSoLuong(), taiSan.getDonViTinh(), taiSan.getGhiChu(), taiSan.getIdDonViBanDau(), taiSan.getIdDonViHienThoi(), taiSan.getMoTa(), taiSan.getIdCongTy(), taiSan.getNgayCapNhat(), taiSan.getNguoiTao(), taiSan.getNguoiCapNhat(), taiSan.getIsActive() != null ? (taiSan.getIsActive() ? 1 : 0) : 1, taiSan.getIsTaiSanCon(), taiSan.getIdLoaiTaiSanCon(), taiSan.getSoThe(), taiSan.getNvNS(), taiSan.getVonVay(), taiSan.getVonKhac(), taiSan.getId());
        // if (result > 0) {
        //     CompletableFuture.runAsync(this::refreshCache);
        // }
        return result;
    }

    public int updateTaiSanConTaiSan(Map<String, Object> params) {
        String id = (String) params.get("id");
        boolean isTaiSanCon = (Boolean) params.get("isTaiSanCon");
        String sql = """
                update TaiSan set IsTaiSanCon =? where Id = ?""";
        int result = jdbcTemplate.update(sql, isTaiSanCon ? 1 : 0, isTaiSanCon ? 1 : 0, id);
        // if (result > 0) {
        //     CompletableFuture.runAsync(this::refreshCache);
        // }
        return result;
    }

    public int updateDonViSoHuu(String id, String idDonViHienThoi) {
        String sql = "UPDATE TaiSan SET IdDonViHienThoi=? WHERE Id=?";
        int result = jdbcTemplate.update(sql, idDonViHienThoi, id);
        // if (result > 0) {
        //     CompletableFuture.runAsync(this::refreshCache);
        // }
        return result;
    }

    public int delete(String id) {
        String sql = "DELETE FROM TaiSan WHERE Id=?";
        int result = jdbcTemplate.update(sql, id);
        // if (result > 0) {
        //     CompletableFuture.runAsync(this::refreshCache);
        // }
        return result;
    }


    public List<TaiSanCon> getTaiSanConByTaiSan(String idTaiSan) {
        String sql = """
                select * from TaiSanCon where IdTaiSanCha = ?""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanCon.class), idTaiSan);
    }

    public List<TaiSanCon> getTaiSanConByTaiSanIds(List<String> taiSanIds) {
        if (taiSanIds == null || taiSanIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        String inSql = String.join(",", java.util.Collections.nCopies(taiSanIds.size(), "?"));
        String sql = String.format("SELECT * FROM TaiSanCon WHERE IdTaiSanCha IN (%s)", inSql);
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanCon.class), taiSanIds.toArray());
    }

    public int deleteTaiSanConByTaiSan(String idTaiSan) {
        String sql = """
                delete from  TaiSanCon where IdTaiSanCha = ?
                """;
        return jdbcTemplate.update(sql, idTaiSan);
    }

    public List<TaiSanCon> getAll() {
        String sql = """
                select * from TaiSanCon""";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanCon.class));
    }

    public int insertTaiSanCon(TaiSanCon tsc) {
        // Kiểm tra xem record có tồn tại không
        String checkSql = "SELECT COUNT(*) FROM TaiSanCon WHERE Id = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, tsc.getId());

        if (count > 0) {
            // Nếu tồn tại thì update
            return updateTaiSanCon(tsc);
        } else {
            // Nếu chưa tồn tại thì insert
            String sql = "insert into TaiSanCon(Id,IdTaiSanCha,IdTaiSanCon,NguoiTao,NguoiCapNhat) values (?,?,?,?,?)";
            return jdbcTemplate.update(sql, tsc.getId(), tsc.getIdTaiSanCha(), tsc.getIdTaiSanCon(), tsc.getNguoiTao(), tsc.getNguoiCapNhat());
        }
    }

    public int updateTaiSanCon(TaiSanCon tsc) {
        String sql = "UPDATE TaiSanCon " + "SET IdTaiSanCha = ?, " + "    IdTaiSanCon = ?, " + "    NguoiCapNhat = ? " + "WHERE Id = ?";
        return jdbcTemplate.update(sql, tsc.getIdTaiSanCha(), tsc.getIdTaiSanCon(), tsc.getNguoiCapNhat(), tsc.getId());
    }


    public int deleteTaiSanCon(String id) {
        String sql = "delete from TaiSanCon where Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public List<KhauHaoTaiSan> getKhauHaoTaiSanByNhom(String idCongTy, int ngay, int thang, int nam, String idNhomTaiSan) {
        String sql = """
        WITH RECURSIVE periods AS (
            SELECT 1 AS ky
            UNION ALL
            SELECT ky + 1 FROM periods WHERE ky < 240
        )
        SELECT
            ts.Id AS soThe,
            ts.TenTaiSan AS tenTaiSan,
            ts.TaiKhoanTaiSan AS maTk,
        
            DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL (p.ky - 1) * 30 DAY) AS ngayTinhKhao,
            p.ky AS thangKh,
            ts.NguyenGia AS nguyenGia,
            ts.GiaTriKhauHaoBanDau AS khauHaoBanDau,
        
            -- Khấu hao phát sinh đầu kỳ
            (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * (p.ky - 1)) AS khauHaoPsdk,
        
            -- Giá trị còn lại ban đầu
            GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * (p.ky - 1)), 0) AS gtclBanDau,
        
            -- Khấu hao phát sinh cuối kỳ
            (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * p.ky) AS khauHaoPsck,
        
            -- Giá trị còn lại hiện tại
            GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * p.ky), 0) AS gtclHienTai,
        
            (ts.NguyenGia / ts.SoKyKhauHao) AS khauHaoBinhQuan,
            (ts.NguyenGia / ts.SoKyKhauHao) AS soTien,
            0 AS chenhLech,
        
            -- Khấu hao kỳ trước
            CAST((ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * GREATEST(p.ky - 2, 0)) AS DECIMAL(18,2)) AS khKyTruoc,
            CAST(0 AS DECIMAL(18,2)) AS clKyTruoc,
        
            -- Hạn sử dụng còn lại
            GREATEST(ts.SoKyKhauHao - (ts.KyKhauHaoBanDau + p.ky), 0) AS hsdCkh,
        
            ts.TaiKhoanChiPhi AS tkNo,
            ts.TaiKhoanKhauHao AS tkCo,
            '00' AS dtgt,
            'P01' AS dtth,
            '30' AS kmcp,
            '' AS ghiChuKhao,
            ts.NguoiCapNhat AS userId,
            ts.nvNS,
            ts.vonVay,
            ts.vonKhac,
            CAST(COALESCE(ts.NgayCapNhat, CURRENT_DATE) AS DATE) AS userTime
        FROM TaiSan ts
        JOIN periods p ON p.ky <= ts.SoKyKhauHao
        WHERE STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d') IS NOT NULL
          AND DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL (p.ky - 1) * 30 DAY) <= CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0'))
          AND DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL p.ky * 30 DAY) > CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0'))
          AND ts.IdCongTy = ?
          AND ts.IdNhomTaiSan = ?
        ORDER BY ts.KyHieu, p.ky
        """;

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KhauHaoTaiSan.class), nam, thang, ngay, nam, thang, ngay, idCongTy, idNhomTaiSan);
    }


    public List<KhauHaoTaiSan> getKhauHaoTaiSan(String idCongTy, int ngay, int thang, int nam) {
        String sql = """
        WITH RECURSIVE periods AS (
            SELECT 1 AS ky
            UNION ALL
            SELECT ky + 1 FROM periods WHERE ky < 240
        )
        SELECT
            ts.Id AS soThe,
            ts.TenTaiSan AS tenTaiSan,
            ts.TaiKhoanTaiSan AS maTk,
        
            DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL (p.ky - 1) * 30 DAY) AS ngayTinhKhao,
            p.ky AS thangKh,
            ts.NguyenGia AS nguyenGia,
            ts.GiaTriKhauHaoBanDau AS khauHaoBanDau,
        
            -- Khấu hao phát sinh đầu kỳ
            (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * (p.ky - 1)) AS khauHaoPsdk,
        
            -- Giá trị còn lại ban đầu
            GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * (p.ky - 1)), 0) AS gtclBanDau,
        
            -- Khấu hao phát sinh cuối kỳ
            (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * p.ky) AS khauHaoPsck,
        
            -- Giá trị còn lại hiện tại
            GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * p.ky), 0) AS gtclHienTai,
        
            (ts.NguyenGia / ts.SoKyKhauHao) AS khauHaoBinhQuan,
            (ts.NguyenGia / ts.SoKyKhauHao) AS soTien,
            0 AS chenhLech,
        
            -- Khấu hao kỳ trước
            CAST((ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * GREATEST(p.ky - 2, 0)) AS DECIMAL(18,2)) AS khKyTruoc,
            CAST(0 AS DECIMAL(18,2)) AS clKyTruoc,
        
            -- Hạn sử dụng còn lại
            GREATEST(ts.SoKyKhauHao - (ts.KyKhauHaoBanDau + p.ky), 0) AS hsdCkh,
        
            ts.TaiKhoanChiPhi AS tkNo,
            ts.TaiKhoanKhauHao AS tkCo,
            '00' AS dtgt,
            'P01' AS dtth,
            '30' AS kmcp,
            '' AS ghiChuKhao,
            ts.NguoiCapNhat AS userId,
            ts.nvNS,
            ts.vonVay,
            ts.vonKhac,
            CAST(COALESCE(ts.NgayCapNhat, CURRENT_DATE) AS DATE) AS userTime
        FROM TaiSan ts
        JOIN periods p ON p.ky <= ts.SoKyKhauHao
        WHERE STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d') IS NOT NULL
          AND DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL (p.ky - 1) * 30 DAY) <= CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0'))
          AND DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL p.ky * 30 DAY) > CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0'))
          AND ts.IdCongTy = ?
        ORDER BY ts.KyHieu, p.ky
        """;

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(KhauHaoTaiSan.class), nam, thang, ngay, nam, thang, ngay, idCongTy);
    }

    public int updateTaiSanCon(String idTaiSan, Boolean isTaiSanCon) {
        String sql = """
                update TaiSan set IsTaiSanCon=? where Id=?""";
        return jdbcTemplate.update(sql, isTaiSanCon, idTaiSan);
    }

    /**
     * Lấy tập hợp ID của tất cả tài sản đã bàn giao của một công ty
     *
     * @param idCongTy ID công ty
     * @return Set chứa ID của các tài sản đã bàn giao
     */
    public Set<String> getTaiSanDaBanGiaoIds(String idCongTy) {
        String sql = """
                SELECT DISTINCT ct.IdTaiSan
                FROM ChiTietBanGiaoTaiSan ct
                INNER JOIN BanGiaoTaiSan bg ON ct.IdBanGiaoTaiSan = bg.Id
                WHERE bg.IdCongTy = ? AND ct.IsActive = 1
                """;
        List<String> ids = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("IdTaiSan"), idCongTy);
        return ids.stream().collect(Collectors.toSet());
    }

    /**
     * Lấy danh sách tài sản đã bàn giao với pagination
     */
    public List<TaiSanDTO> findAllPagedWithBanGiaoStatus(String idCongTy, int offset, int limit, String sortBy, String sortDir, String idNhomTaiSan, boolean daBanGiao) {
        // Whitelist sort columns to prevent SQL injection
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaycapnhat";
        String orderColumn;
        switch (normalizedSortBy) {
            case "tents":
            case "tentaisan":
                orderColumn = "ts.TenTaiSan";
                break;
            case "sothe":
                orderColumn = "ts.SoThe";
                break;
            case "ngaysudung":
                orderColumn = "ts.NgaySuDung";
                break;
            case "nguyengia":
                orderColumn = "ts.NguyenGia";
                break;
            default:
                orderColumn = "ts.NgayCapNhat";
        }

        String sortDirection = (sortDir != null && sortDir.trim().equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        String whereClause = " WHERE ts.IdCongTy = ? ";
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);

        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause += " AND ts.IdNhomTaiSan = ? ";
            params.add(idNhomTaiSan);
        }

        // Thêm filter cho trạng thái bàn giao
        if (daBanGiao) {
            whereClause += " AND (ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> '') ";
        } else {
            whereClause += " AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '') ";
        }

        String sql = """
                SELECT 
                    ts.Id,
                    ts.TenTaiSan,
                    ts.NguyenGia,
                    ts.GiaTriKhauHaoBanDau,
                    ts.KyKhauHaoBanDau,
                    ts.GiaTriThanhLy,
                
                    -- Thông tin mô hình tài sản
                    ts.IdMoHinhTaiSan,
                    mhts.TenMoHinh,
                
                    -- Thông tin nhóm tài sản
                    ts.IdNhomTaiSan,
                    nts.TenNhom,
                
                    -- Thông tin dự án
                    ts.IdDuDan as idDuAn,
                    da.TenDuAn,
                
                    -- Thông tin nguồn vốn
                    ts.IdNguonVon,
                    nv.TenNguonKinhPhi,
                
                    ts.PhuongPhapKhauHao,
                    ts.SoKyKhauHao,
                    ts.TaiKhoanTaiSan,
                    ts.TaiKhoanKhauHao,
                    ts.TaiKhoanChiPhi,
                    ts.NgayVaoSo,
                    ts.NgaySuDung,
                    ts.KyHieu,
                    ts.SoKyHieu,
                    ts.CongSuat,
                    ts.NuocSanXuat,
                    ts.NamSanXuat,
                    ts.LyDoTang,
                    ts.HienTrang,
                    ts.SoLuong,
                    ts.DonViTinh,
                    ts.GhiChu,
                    ts.IdDonViBanDau,
                    ts.IdDonViHienThoi,
                    ts.MoTa,
                    ts.IdCongTy,
                    ts.NgayTao,
                    ts.NgayCapNhat,
                    ts.NguoiTao,
                    ts.NguoiCapNhat,
                    ts.IsActive,
                    ts.IsTaiSanCon,
                    ts.IdLoaiTaiSanCon, 
                    ts.SoThe,
                    ts.nvNS,
                    ts.vonVay,
                    ts.vonKhac
                FROM 
                    TaiSan AS ts
                LEFT JOIN 
                    MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN 
                    NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN 
                    DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN 
                    NguonVon AS nv ON ts.IdNguonVon = nv.Id
                """ + whereClause + " ORDER BY " + orderColumn + " " + sortDirection + " LIMIT ? OFFSET ? ";

        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), params.toArray());
    }

    /**
     * Đếm số lượng tài sản đã bàn giao
     */
    public long countByCongTyAndBanGiaoStatus(String idCongTy, String idNhomTaiSan, boolean daBanGiao) {
        String whereClause = " WHERE ts.IdCongTy = ? ";
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);

        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause += " AND ts.IdNhomTaiSan = ? ";
            params.add(idNhomTaiSan);
        }

        // Thêm filter cho trạng thái bàn giao
        if (daBanGiao) {
            whereClause += " AND (ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> '') ";
        } else {
            whereClause += " AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '') ";
        }

        String sql = "SELECT COUNT(*) FROM TaiSan AS ts " + whereClause;
        return jdbcTemplate.queryForObject(sql, Long.class, params.toArray());
    }

    /**
     * Đếm số lượng tài sản theo nhóm với filter trạng thái bàn giao
     */
    public Map<String, Long> getCountByNhomTaiSanWithBanGiaoStatus(
            String idCongTy,
            Boolean daBanGiao,
            String search
    ) {
        StringBuilder whereClause = new StringBuilder(" WHERE ts.IdCongTy = ? ");
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);

        // Filter theo trạng thái bàn giao
        if (daBanGiao != null) {
            if (daBanGiao) {
                whereClause.append(" AND (ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> '') ");
            } else {
                whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '') ");
            }
        }

        // Filter theo search
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }

        String sql = """
        SELECT 
            ts.IdNhomTaiSan AS idNhomTaiSan,
            nts.TenNhom AS tenNhom,
            COUNT(ts.Id) AS soLuong
        FROM TaiSan ts
        LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
        """ + whereClause.toString() + """
        GROUP BY ts.IdNhomTaiSan, nts.TenNhom
        """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, params.toArray());
        Map<String, Long> counts = new java.util.HashMap<>();

        for (Map<String, Object> row : results) {
            String id = (String) row.get("idNhomTaiSan");
            Long count = ((Number) row.get("soLuong")).longValue();

            // Xử lý trường hợp tài sản chưa có nhóm
            if (id == null || id.isEmpty()) {
                counts.put("UNKNOWN", count);
            } else {
                counts.put(id, count);
            }
        }

        return counts;
    }

    /**
     * Đếm số lượng tài sản theo nhóm cho đơn vị hiện thời
     */
    public Map<String, Long> getCountByNhomTaiSanForDonViHienThoi(
            String idCongTy,
            String idDonViHienThoi,
            String search
    ) {
        StringBuilder whereClause = new StringBuilder(" WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ? ");
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);
        params.add(idDonViHienThoi);

        // Filter theo search
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }

        String sql = """
        SELECT 
            ts.IdNhomTaiSan AS idNhomTaiSan,
            nts.TenNhom AS tenNhom,
            COUNT(ts.Id) AS soLuong
        FROM TaiSan ts
        LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
        """ + whereClause.toString() + """
        GROUP BY ts.IdNhomTaiSan, nts.TenNhom
        """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, params.toArray());
        Map<String, Long> counts = new java.util.HashMap<>();

        for (Map<String, Object> row : results) {
            String id = (String) row.get("idNhomTaiSan");
            Long count = ((Number) row.get("soLuong")).longValue();

            if (id == null || id.isEmpty()) {
                counts.put("UNKNOWN", count);
            } else {
                counts.put(id, count);
            }
        }

        return counts;
    }

    public PagedResult<KhauHaoTaiSan> getKhauHaoTaiSanPaged(
            String idCongTy, int ngay, int thang, int nam,
            int offset, int limit, String sortBy, String sortDir, String search) {

        // Xây dựng WHERE clause cho search
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();

        // Các điều kiện cơ bản
        params.add(nam);
        params.add(thang);
        params.add(ngay);
        params.add(nam);
        params.add(thang);
        params.add(ngay);
        params.add(idCongTy);

        // Thêm search nếu có
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.TaiKhoanTaiSan LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        // Xác định cột sort
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytinhkhao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "sothe":
                orderColumn = "ts.Id";
                break;
            case "tentaisan":
                orderColumn = "ts.TenTaiSan";
                break;
            case "nguyengia":
                orderColumn = "nguyenGia";
                break;
            case "thangkh":
                orderColumn = "thangKh";
                break;
            default:
                orderColumn = "ngayTinhKhao";
        }

        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

        // Query đếm tổng số
        String countSql = """
        WITH RECURSIVE periods AS (
            SELECT 1 AS ky
            UNION ALL
            SELECT ky + 1 FROM periods WHERE ky < 240
        )
        SELECT COUNT(*) 
        FROM TaiSan ts
        JOIN periods p ON p.ky <= ts.SoKyKhauHao
        WHERE DATE_ADD(DATE(ts.NgaySuDung), INTERVAL (p.ky - 1) * 30 DAY) <= DATE(CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0')))
          AND DATE_ADD(DATE(ts.NgaySuDung), INTERVAL p.ky * 30 DAY) > DATE(CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0')))
          AND ts.IdCongTy = ?
        """ + whereClause.toString();

        Long total = jdbcTemplate.queryForObject(countSql, Long.class, params.toArray());

        // Query lấy dữ liệu với phân trang
        params.add(limit);
        params.add(offset);

        String dataSql = String.format("""
        WITH RECURSIVE periods AS (
            SELECT 1 AS ky
            UNION ALL
            SELECT ky + 1 FROM periods WHERE ky < 240
        )
        SELECT
            ts.Id AS soThe,
            ts.TenTaiSan AS tenTaiSan,
            ts.TaiKhoanTaiSan AS maTk,
            DATE_ADD(DATE(ts.NgaySuDung), INTERVAL (p.ky - 1) * 30 DAY) AS ngayTinhKhao,
            p.ky AS thangKh,
            ts.NguyenGia AS nguyenGia,
            ts.GiaTriKhauHaoBanDau AS khauHaoBanDau,
            (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * (p.ky - 1)) AS khauHaoPsdk,
            GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * (p.ky - 1)), 0) AS gtclBanDau,
            (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * p.ky) AS khauHaoPsck,
            GREATEST(ts.NguyenGia - (ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * p.ky), 0) AS gtclHienTai,
            (ts.NguyenGia / ts.SoKyKhauHao) AS khauHaoBinhQuan,
            (ts.NguyenGia / ts.SoKyKhauHao) AS soTien,
            0 AS chenhLech,
            CAST((ts.GiaTriKhauHaoBanDau + (ts.NguyenGia / ts.SoKyKhauHao) * GREATEST(p.ky - 2, 0)) AS DECIMAL(18,2)) AS khKyTruoc,
            CAST(0 AS DECIMAL(18,2)) AS clKyTruoc,
            GREATEST(ts.SoKyKhauHao - (ts.KyKhauHaoBanDau + p.ky), 0) AS hsdCkh,
            ts.TaiKhoanChiPhi AS tkNo,
            ts.TaiKhoanKhauHao AS tkCo,
            '00' AS dtgt,
            'P01' AS dtth,
            '30' AS kmcp,
            '' AS ghiChuKhao,
            ts.NguoiCapNhat AS userId,
            ts.nvNS,
            ts.vonVay,
            ts.vonKhac,
            COALESCE(ts.NgayCapNhat, CURRENT_DATE) AS userTime
        FROM TaiSan ts
        JOIN periods p ON p.ky <= ts.SoKyKhauHao
        WHERE DATE_ADD(DATE(ts.NgaySuDung), INTERVAL (p.ky - 1) * 30 DAY) <= DATE(CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0')))
          AND DATE_ADD(DATE(ts.NgaySuDung), INTERVAL p.ky * 30 DAY) > DATE(CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0')))
          AND ts.IdCongTy = ?
        %s
        ORDER BY %s %s
        LIMIT ? OFFSET ?
        """, whereClause.toString(), orderColumn, direction);

        List<KhauHaoTaiSan> items = jdbcTemplate.query(dataSql,
                new BeanPropertyRowMapper<>(KhauHaoTaiSan.class),
                params.toArray());

        return new PagedResult<>(items, total);
    }

    // Class helper
    public static class PagedResult<T> {
        private List<T> items;
        private Long total;

        public PagedResult(List<T> items, Long total) {
            this.items = items;
            this.total = total;
        }

        public List<T> getItems() { return items; }
        public Long getTotal() { return total; }
    }
}