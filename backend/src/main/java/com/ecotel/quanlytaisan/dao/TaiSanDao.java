package com.ecotel.quanlytaisan.dao;

import com.ecotel.quanlytaisan.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class TaiSanDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private SetNguonKinhPhiDao setNguonKinhPhiDao;

    // Updated SELECT with joins to PhongBan (twice) and DonViTinh
    private final String SELECT_TAISAN_DTO = """
            SELECT 
                ts.*, 
                mhts.TenMoHinh, 
                nts.TenNhom, 
                da.TenDuAn, 
                nv.TenNguonKinhPhi,
                pb1.TenPhongBan AS tenDonViBanDau,
                pb2.TenPhongBan AS tenDonViHienThoi,
                dvt.TenDonVi AS tenDonViTinh,
                ts.IdDuDan as idDuAn
            FROM TaiSan AS ts
            LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
            LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
            LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
            LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
            LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
            LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
            LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
            """;

    public List<TaiSanDTO> findAll(String idCongTy) {
        String sql = SELECT_TAISAN_DTO + " WHERE ts.IdCongTy = ?";
        List<TaiSanDTO> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy);
        attachAdditionalData(list);
        return list;
    }

    /**
     * Cập nhật hiện trạng (hienTrang) cho tài sản
     */
    public int updateHienTrang(String idTaiSan, Integer hienTrang) {
        String sql = "UPDATE TaiSan SET HienTrang = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, hienTrang, idTaiSan);
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

    public long countByCongTy(String idCongTy, int soNgayThongBaoKiemDinh, String trangThaiKiemDinh) {
        String whereClause = "WHERE ts.IdCongTy = ?";
         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'DA_DANG_KIEM'";
                    break;
                case "SAP_DEN_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'SAP_DEN_HAN'";
                    break;
                case "QUA_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'QUA_HAN'";
                    break;
            }
        }

        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause;
        Long result = jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        return result != null ? result : 0L;
    }

    public long countByCongTyAndNhom(String idCongTy, String idNhomTaiSan, int soNgayThongBaoKiemDinh, String trangThaiKiemDinh) {
        String whereClause = "WHERE ts.IdCongTy = ? AND ts.IdNhomTaiSan = ?";
         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'DA_DANG_KIEM'";
                    break;
                case "SAP_DEN_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'SAP_DEN_HAN'";
                    break;
                case "QUA_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'QUA_HAN'";
                    break;
            }
        }
        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause;
        Long result = jdbcTemplate.queryForObject(sql, Long.class, idCongTy, idNhomTaiSan);
        return result != null ? result : 0L;
    }

   public long countByDonViBanDau(
        String idCongTy, 
        String idDonViBanDau,
        String search, 
        String idNhomTaiSan,
        int soNgayThongBaoKiemDinh, 
        String trangThaiKiemDinh) {
    
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        whereClause.append("WHERE ts.IdCongTy = ?");
        params.add(idCongTy);
        
        // Xử lý filter theo idDonViBanDau
        if (idDonViBanDau != null && !idDonViBanDau.trim().isEmpty()) {
            whereClause.append(" AND ts.IdDonViBanDau = ?");
            params.add(idDonViBanDau);
        } else {
            whereClause.append(" AND ts.IdDonViBanDau IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND LoaiKho = 1 AND IsKho = 1)");
            params.add(idCongTy);
        }
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }
        
        whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '')");
        
         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'DA_DANG_KIEM'");
                    break;
                case "SAP_DEN_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'SAP_DEN_HAN'");
                    break;
                case "QUA_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'QUA_HAN'");
                    break;
            }
        }
        
        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause.toString();
        Long result = jdbcTemplate.queryForObject(sql, Long.class, params.toArray());
        return result != null ? result : 0L;
    }
    

    public long countByDonViThuHoi(
        String idCongTy, 
        String idDonViThuHoi, 
        String search,
        String idNhomTaiSan,
        int soNgayThongBaoKiemDinh, 
        String trangThaiKiemDinh) {
    
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        whereClause.append("WHERE ts.IdCongTy = ?");
        params.add(idCongTy);
        
        // Xử lý filter theo idDonViThuHoi
        if (idDonViThuHoi != null && !idDonViThuHoi.trim().isEmpty()) {
            whereClause.append(" AND ts.IdDonViHienThoi = ?");
            params.add(idDonViThuHoi);
        } else {
            whereClause.append(" AND ts.IdDonViHienThoi IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND LoaiKho = 2 AND IsKho = 1)");
            params.add(idCongTy);
        }
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }

        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'DA_DANG_KIEM'");
                    break;
                case "SAP_DEN_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'SAP_DEN_HAN'");
                    break;
                case "QUA_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'QUA_HAN'");
                    break;
            }
        }
        
        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause.toString();
        Long result = jdbcTemplate.queryForObject(sql, Long.class, params.toArray());
        return result != null ? result : 0L;
    }

    public long countByDonViHienThoi(
        String idCongTy, 
        String idDonViHienThoi, 
        String idNhomTaiSan, 
        int soNgayThongBaoKiemDinh, 
        String trangThaiKiemDinh) {
    
        StringBuilder whereClause = new StringBuilder("WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ?");
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);
        params.add(idDonViHienThoi);
        
        // Lọc theo nhóm tài sản
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }
        
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        
        // Lọc theo trạng thái kiểm định
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            whereClause.append(" AND ").append(inspectionStatusSql).append(" = ?");
            params.add(trangThaiKiemDinh);
        }
        
        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause.toString();
        Long result = jdbcTemplate.queryForObject(sql, Long.class, params.toArray());
        return result != null ? result : 0L;
    }

    /**
     * Đếm số lượng tài sản thực tế theo từng nhóm
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
            if (id == null || id.isEmpty()) {
                counts.put("UNKNOWN", count);
            } else {
                counts.put(id, count);
            }
        }
        return counts;
    }

    public List<TaiSanDTO> findAllPaged(String idCongTy, int offset, int limit, String sortBy, String sortDir, String idNhomTaiSan, int soNgayThongBaoKiemDinh, String trangThaiKiemDinh) {
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
         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'DA_DANG_KIEM'";
                    break;
                case "SAP_DEN_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'SAP_DEN_HAN'";
                    break;
                case "QUA_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'QUA_HAN'";
                    break;
            }
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
                    ts.vonKhac,
                    ts.tgKiemDinh,
                    ts.chuKyKiemDinh,
                    %s AS trangThaiKiemDinh,
                    pb1.TenPhongBan AS tenDonViBanDau,
                    pb2.TenPhongBan AS tenDonViHienThoi,
                    dvt.TenDonVi AS tenDonViTinh
                FROM 
                    TaiSan AS ts
                LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
                LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
                LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
                LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, inspectionStatusSql, whereClause, orderColumn, direction);
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idNhomTaiSan, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, limit, offset);
        }
    }

    public List<TaiSanDTO> findByDonViBanDauPaged(
        String idCongTy, 
        String idDonViBanDau, // Có thể null
        int offset, 
        int limit, 
        String sortBy, 
        String sortDir, 
        String idNhomTaiSan,
        String search,
        int soNgayThongBaoKiemDinh, 
        String trangThaiKiemDinh) {
        
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
        
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);

        // Xây dựng whereClause linh hoạt
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        whereClause.append("WHERE ts.IdCongTy = ?");
        params.add(idCongTy);
        
        // Xử lý filter theo idDonViBanDau
        if (idDonViBanDau != null && !idDonViBanDau.trim().isEmpty()) {
            // Nếu có idDonViBanDau, filter theo nó
            whereClause.append(" AND ts.IdDonViBanDau = ?");
            params.add(idDonViBanDau);
        } else {
            // Nếu không có, lấy tất cả phòng ban có loaiKho = 1
            whereClause.append(" AND ts.IdDonViBanDau IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND LoaiKho = 1 AND IsKho = 1)");
            params.add(idCongTy);
        }
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }
        
        // Điều kiện: idDonViHienThoi rỗng hoặc null
        whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '')");
        
        // Filter theo trạng thái kiểm định
        // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'DA_DANG_KIEM'");
                    break;
                case "SAP_DEN_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'SAP_DEN_HAN'");
                    break;
                case "QUA_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'QUA_HAN'");
                    break;
            }
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
                    ts.vonKhac,
                    ts.tgKiemDinh,
                    ts.chuKyKiemDinh,
                    %s AS trangThaiKiemDinh,
                    pb1.TenPhongBan AS tenDonViBanDau,
                    pb2.TenPhongBan AS tenDonViHienThoi,
                    dvt.TenDonVi AS tenDonViTinh
                FROM 
                    TaiSan AS ts
                LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
                LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
                LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
                LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, inspectionStatusSql, whereClause.toString(), orderColumn, direction);
        
        // Thêm limit và offset vào params
        params.add(limit);
        params.add(offset);
        
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), params.toArray());
    }

    public List<TaiSanDTO> findByDonViThuHoiPaged(
        String idCongTy, 
        String idDonViThuHoi, // Có thể null
        int offset, 
        int limit, 
        String sortBy, 
        String sortDir, 
        String idNhomTaiSan,
        String search,
        int soNgayThongBaoKiemDinh, 
        String trangThaiKiemDinh) {
    
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
        
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);

        // Xây dựng whereClause
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        whereClause.append("WHERE ts.IdCongTy = ?");
        params.add(idCongTy);
        
        // Xử lý filter theo idDonViThuHoi (đây là đơn vị hiện thời)
        if (idDonViThuHoi != null && !idDonViThuHoi.trim().isEmpty()) {
            // Nếu có idDonViThuHoi, filter theo nó
            whereClause.append(" AND ts.IdDonViHienThoi = ?");
            params.add(idDonViThuHoi);
        } else {
            // Nếu không có, lấy tất cả phòng ban có loaiKho = 2 (kho thu hồi)
            whereClause.append(" AND ts.IdDonViHienThoi IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND LoaiKho = 2 AND IsKho = 1)");
            params.add(idCongTy);
        }
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }
        
        // Filter theo trạng thái kiểm định
        // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'DA_DANG_KIEM'");
                    break;
                case "SAP_DEN_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'SAP_DEN_HAN'");
                    break;
                case "QUA_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'QUA_HAN'");
                    break;
            }
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
                    ts.vonKhac,
                    ts.tgKiemDinh,
                    ts.chuKyKiemDinh,
                    %s AS trangThaiKiemDinh,
                    pb1.TenPhongBan AS tenDonViBanDau,
                    pb2.TenPhongBan AS tenDonViHienThoi,
                    dvt.TenDonVi AS tenDonViTinh
                FROM 
                    TaiSan AS ts
                LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
                LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
                LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
                LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, inspectionStatusSql, whereClause.toString(), orderColumn, direction);
        
        params.add(limit);
        params.add(offset);
        
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), params.toArray());
    }

    public List<TaiSanDTO> findByDonViHienThoiPaged(String idCongTy, String idDonViHienThoi, int offset, int limit, String sortBy, String sortDir, String idNhomTaiSan, int soNgayThongBaoKiemDinh, String trangThaiKiemDinh) {
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
        String direction = "ASC".equalsIgnoreCase(sortDir) ? "ASC" : "DESC";
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);

        String whereClause;
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause = "WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ? AND ts.IdNhomTaiSan = ?";
        } else {
            whereClause = "WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ?";
        }
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'DA_DANG_KIEM'";
                    break;
                case "SAP_DEN_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'SAP_DEN_HAN'";
                    break;
                case "QUA_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'QUA_HAN'";
                    break;
                case "CHUA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'CHUA_DANG_KIEM'";
                    break;
            }
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
                        ts.vonKhac,
                        ts.tgKiemDinh,
                        ts.chuKyKiemDinh,
                        %s AS trangThaiKiemDinh,
                        pb1.TenPhongBan AS tenDonViBanDau,
                        pb2.TenPhongBan AS tenDonViHienThoi,
                        dvt.TenDonVi AS tenDonViTinh
                    FROM TaiSan ts
                    LEFT JOIN MoHinhTaiSan mhts ON ts.IdMoHinhTaiSan = mhts.Id
                    LEFT JOIN NhomTaiSan nts ON ts.IdNhomTaiSan = nts.Id
                    LEFT JOIN DuAn da ON ts.IdDuDan = da.Id
                    LEFT JOIN NguonVon nv ON ts.IdNguonVon = nv.Id
                    LEFT JOIN PhongBan pb1 ON ts.IdDonViBanDau = pb1.Id
                    LEFT JOIN PhongBan pb2 ON ts.IdDonViHienThoi = pb2.Id
                    LEFT JOIN DonViTinh dvt ON ts.DonViTinh = dvt.Id
                    %s
                    ORDER BY %s %s
                    LIMIT ? OFFSET ?
                """, inspectionStatusSql, whereClause, orderColumn, direction);        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idDonViHienThoi, idNhomTaiSan, limit, offset);
        } else {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, idDonViHienThoi, limit, offset);
        }
    }

    public List<TaiSanDTO> findByIdLoaiTS(String idLoaiTS) {
        String sql = SELECT_TAISAN_DTO + " WHERE ts.IdLoaiTaiSan = ?";
        List<TaiSanDTO> taiSanDTOList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idLoaiTS);
        for (TaiSanDTO dto : taiSanDTOList) {
            List<NguonKinhPhi> nguonKinhPhiList = setNguonKinhPhiDao.getNguonKinhPhiByTaiSan(dto.getSoThe());
            dto.setNguonKinhPhiList(nguonKinhPhiList);
        }
        return taiSanDTOList;
    }

    public TaiSanDTO findById(String id) {
        String sql = SELECT_TAISAN_DTO + " WHERE ts.Id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), id);
    }

    public int insert(TaiSan taiSan) {
        System.out.println(taiSan.toString());
        if (taiSan.getId() == null || taiSan.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Id không được null hoặc rỗng");
        }
        String checkSql = "SELECT COUNT(*) FROM TaiSan WHERE Id = ?";
        Long result = jdbcTemplate.queryForObject(checkSql, Long.class, taiSan.getId());
        int count = result != null ? result.intValue() : 0;
        if (count > 0) {
            return update(taiSan);
        } else {
            String sql = "INSERT INTO TaiSan (Id, IdLoaiTaiSan, TenTaiSan, NguyenGia, GiaTriKhauHaoBanDau, KyKhauHaoBanDau, " +
                    "GiaTriThanhLy, IdMoHinhTaiSan, PhuongPhapKhauHao, SoKyKhauHao, TaiKhoanTaiSan, TaiKhoanKhauHao, TaiKhoanChiPhi, " +
                    "IdNhomTaiSan, NgayVaoSo, NgaySuDung, IdDuDan, IdNguonVon, KyHieu, SoKyHieu, CongSuat, NuocSanXuat, NamSanXuat, " +
                    "LyDoTang, HienTrang, SoLuong, DonViTinh, GhiChu, IdDonViBanDau, IdDonViHienThoi, MoTa, IdCongTy, NgayTao, " +
                    "NgayCapNhat, NguoiTao, NguoiCapNhat, IsActive, IsTaiSanCon, IdLoaiTaiSanCon, SoThe, nvNS, vonVay, vonKhac, tgKiemDinh, chuKyKiemDinh) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?, ?, ?,?,?)";
            return jdbcTemplate.update(sql,
                    taiSan.getId(), taiSan.getIdLoaiTaiSan(), taiSan.getTenTaiSan(), taiSan.getNguyenGia(),
                    taiSan.getGiaTriKhauHaoBanDau(), taiSan.getKyKhauHaoBanDau(), taiSan.getGiaTriThanhLy(),
                    taiSan.getIdMoHinhTaiSan(), taiSan.getPhuongPhapKhauHao(), taiSan.getSoKyKhauHao(),
                    taiSan.getTaiKhoanTaiSan(), taiSan.getTaiKhoanKhauHao(), taiSan.getTaiKhoanChiPhi(),
                    taiSan.getIdNhomTaiSan(), taiSan.getNgayVaoSo(), taiSan.getNgaySuDung(), taiSan.getIdDuDan(),
                    taiSan.getIdNguonVon(), taiSan.getKyHieu(), taiSan.getSoKyHieu(), taiSan.getCongSuat(),
                    taiSan.getNuocSanXuat(), taiSan.getNamSanXuat(), taiSan.getLyDoTang(), taiSan.getHienTrang(),
                    taiSan.getSoLuong(), taiSan.getDonViTinh(), taiSan.getGhiChu(), taiSan.getIdDonViBanDau(),
                    taiSan.getIdDonViHienThoi(), taiSan.getMoTa(), taiSan.getIdCongTy(), taiSan.getNgayTao(),
                    taiSan.getNgayCapNhat(), taiSan.getNguoiTao(), taiSan.getNguoiCapNhat(), taiSan.getIsActive(),
                    taiSan.getIsTaiSanCon(), taiSan.getIdLoaiTaiSanCon(), taiSan.getSoThe(), taiSan.getNvNS(),
                    taiSan.getVonVay(), taiSan.getVonKhac(), taiSan.getTgKiemDinh(), taiSan.getChuKyKiemDinh());
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
                        NgayCapNhat=?, NguoiTao=?, NguoiCapNhat=?, IsActive=?, IsTaiSanCon=?, IdLoaiTaiSanCon=?,
                        SoThe=?, nvNS=?, vonVay=?, vonKhac=?, tgKiemDinh=?, chuKyKiemDinh=?
                    WHERE Id=?
                """;
        return jdbcTemplate.update(sql,
                taiSan.getIdLoaiTaiSan(), taiSan.getTenTaiSan(), taiSan.getNguyenGia(),
                taiSan.getGiaTriKhauHaoBanDau(), taiSan.getKyKhauHaoBanDau(), taiSan.getGiaTriThanhLy(),
                taiSan.getIdMoHinhTaiSan(), taiSan.getPhuongPhapKhauHao(), taiSan.getSoKyKhauHao(),
                taiSan.getTaiKhoanTaiSan(), taiSan.getTaiKhoanKhauHao(), taiSan.getTaiKhoanChiPhi(),
                taiSan.getIdNhomTaiSan(), taiSan.getNgayVaoSo(), taiSan.getNgaySuDung(), taiSan.getIdDuDan(),
                taiSan.getIdNguonVon(), taiSan.getKyHieu(), taiSan.getSoKyHieu(), taiSan.getCongSuat(),
                taiSan.getNuocSanXuat(), taiSan.getNamSanXuat(), taiSan.getLyDoTang(), taiSan.getHienTrang(),
                taiSan.getSoLuong(), taiSan.getDonViTinh(), taiSan.getGhiChu(), taiSan.getIdDonViBanDau(),
                taiSan.getIdDonViHienThoi(), taiSan.getMoTa(), taiSan.getIdCongTy(), taiSan.getNgayCapNhat(),
                taiSan.getNguoiTao(), taiSan.getNguoiCapNhat(),
                taiSan.getIsActive() != null ? (taiSan.getIsActive() ? 1 : 0) : 1,
                taiSan.getIsTaiSanCon(), taiSan.getIdLoaiTaiSanCon(), taiSan.getSoThe(), taiSan.getNvNS(),
                taiSan.getVonVay(), taiSan.getVonKhac(), taiSan.getTgKiemDinh(), taiSan.getChuKyKiemDinh(),
                taiSan.getId());
    }

    public int updateTaiSanConTaiSan(Map<String, Object> params) {
        String id = (String) params.get("id");
        boolean isTaiSanCon = (Boolean) params.get("isTaiSanCon");
        String sql = "UPDATE TaiSan SET IsTaiSanCon = ? WHERE Id = ?";
        return jdbcTemplate.update(sql, isTaiSanCon ? 1 : 0, id);
    }

    public int updateDonViSoHuu(String id, String idDonViHienThoi) {
        String sql = "UPDATE TaiSan SET IdDonViHienThoi=? WHERE Id=?";
        return jdbcTemplate.update(sql, idDonViHienThoi, id);
    }

    public int delete(String id) {
        String sql = "DELETE FROM TaiSan WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public int deleteAllTaiSanCon() {
        String sql = "DELETE FROM TaiSanCon WHERE IdTaiSanCha IN (SELECT Id FROM TaiSan)";
        return jdbcTemplate.update(sql);
    }

    public int deleteAll() {
        String sql = "DELETE FROM TaiSan";
        return jdbcTemplate.update(sql);
    }

    public List<TaiSanCon> getTaiSanConByTaiSan(String idTaiSan) {
        String sql = "SELECT * FROM TaiSanCon WHERE IdTaiSanCha = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanCon.class), idTaiSan);
    }

    public List<TaiSanCon> getTaiSanConByTaiSanIds(List<String> taiSanIds) {
        if (taiSanIds == null || taiSanIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        String inSql = String.join(",", java.util.Collections.nCopies(taiSanIds.size(), "?"));
        String sql = String.format("SELECT TaiSanCon.*, ts.TenTaiSan, ts.HienTrang,ts.DonViTinh,ts.SoLuong,ts.GhiChu FROM TaiSanCon LEFT JOIN TaiSan ts ON ts.Id = TaiSanCon.IdTaiSanCon WHERE IdTaiSanCha IN (%s)", inSql);
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanCon.class), taiSanIds.toArray());
    }

    public int deleteTaiSanConByTaiSan(String idTaiSan) {
        String sql = "DELETE FROM TaiSanCon WHERE IdTaiSanCha = ?";
        return jdbcTemplate.update(sql, idTaiSan);
    }

    public List<TaiSanCon> getAll() {
        String sql = "SELECT * FROM TaiSanCon";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanCon.class));
    }

    public int insertTaiSanCon(TaiSanCon tsc) {
        String checkSql = "SELECT COUNT(*) FROM TaiSanCon WHERE Id = ?";
        Long result = jdbcTemplate.queryForObject(checkSql, Long.class, tsc.getId());
        int count = result != null ? result.intValue() : 0;
        if (count > 0) {
            return updateTaiSanCon(tsc);
        } else {
            String sql = "INSERT INTO TaiSanCon(Id, IdTaiSanCha, IdTaiSanCon, NguoiTao, NguoiCapNhat) VALUES (?,?,?,?,?)";
            return jdbcTemplate.update(sql, tsc.getId(), tsc.getIdTaiSanCha(), tsc.getIdTaiSanCon(), tsc.getNguoiTao(), tsc.getNguoiCapNhat());
        }
    }

    public int updateTaiSanCon(TaiSanCon tsc) {
        String sql = "UPDATE TaiSanCon SET IdTaiSanCha=?, IdTaiSanCon=?, NguoiCapNhat=? WHERE Id=?";
        return jdbcTemplate.update(sql, tsc.getIdTaiSanCha(), tsc.getIdTaiSanCon(), tsc.getNguoiCapNhat(), tsc.getId());
    }

    public int deleteTaiSanCon(String id) {
        String sql = "DELETE FROM TaiSanCon WHERE Id=?";
        return jdbcTemplate.update(sql, id);
    }

    public List<KhauHaoTaiSan> getKhauHaoTaiSanByNhom(String idCongTy, int ngay, int thang, int nam, String idNhomTaiSan, String idDonViHienThoi) {
        StringBuilder sql = new StringBuilder("""
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
            CAST(COALESCE(ts.NgayCapNhat, CURRENT_DATE) AS DATE) AS userTime
        FROM TaiSan ts
        JOIN periods p ON p.ky <= ts.SoKyKhauHao
        WHERE STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d') IS NOT NULL
          AND DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL (p.ky - 1) * 30 DAY) <= CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0'))
          AND DATE_ADD(STR_TO_DATE(ts.NgaySuDung, '%Y-%m-%d'), INTERVAL p.ky * 30 DAY) > CONCAT(?, '-', LPAD(?,2,'0'), '-', LPAD(?,2,'0'))
          AND ts.IdCongTy = ?
          AND ts.IdNhomTaiSan = ?
        """);
        List<Object> params = new java.util.ArrayList<>();
        params.add(nam); params.add(thang); params.add(ngay);
        params.add(nam); params.add(thang); params.add(ngay);
        params.add(idCongTy); params.add(idNhomTaiSan);
        if (idDonViHienThoi != null && !idDonViHienThoi.trim().isEmpty()) {
            sql.append("\n          AND ts.IdDonViHienThoi = ?\n");
            params.add(idDonViHienThoi);
        }
        sql.append("ORDER BY ts.KyHieu, p.ky");
        return jdbcTemplate.query(sql.toString(), new BeanPropertyRowMapper<>(KhauHaoTaiSan.class), params.toArray());
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
        String sql = "UPDATE TaiSan SET IsTaiSanCon=? WHERE Id=?";
        return jdbcTemplate.update(sql, isTaiSanCon, idTaiSan);
    }

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

    public List<TaiSanDTO> findByBanGiaoStatusPaged(
        String idCongTy,
        boolean isBanGiao,
        int offset,
        int limit,
        String sortBy,
        String sortDir,
        String search,
        String idNhomTaiSan,
        String idDonViHienThoi,
        int soNgayThongBaoKiemDinh,
        String trangThaiKiemDinh) {
    
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
        
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);

        // Xây dựng whereClause
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        whereClause.append("WHERE ts.IdCongTy = ?");
        params.add(idCongTy);
        
        // Logic bàn giao
        if (isBanGiao) {
            // Đã bàn giao: có IdDonViHienThoi và không phải kho (loaiKho = 1 hoặc 2)
            whereClause.append(" AND ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> ''");
            whereClause.append(" AND ts.IdDonViHienThoi NOT IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho = 1 AND LoaiKho IN (1, 2))");
            params.add(idCongTy);
        } else {
            // Chưa bàn giao: IdDonViHienThoi rỗng/null HOẶC đang ở kho (loaiKho = 1 hoặc 2)
            whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = ''");
            whereClause.append(" OR ts.IdDonViHienThoi IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho = 1 AND LoaiKho IN (1, 2)))");
            params.add(idCongTy);
        }
        
        // Lọc theo nhóm tài sản
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }
        
        // Lọc theo đơn vị hiện thời
        if (idDonViHienThoi != null && !idDonViHienThoi.trim().isEmpty()) {
            whereClause.append(" AND ts.IdDonViHienThoi = ?");
            params.add(idDonViHienThoi);
        }
        
        // Lọc theo search
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?)");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        
        // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'DA_DANG_KIEM'");
                    break;
                case "SAP_DEN_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'SAP_DEN_HAN'");
                    break;
                case "QUA_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'QUA_HAN'");
                    break;
                case "CHUA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'CHUA_DANG_KIEM'");
                    break;
            }
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
                    ts.vonKhac,
                    ts.tgKiemDinh,
                    ts.chuKyKiemDinh,
                    %s AS trangThaiKiemDinh,
                    pb1.TenPhongBan AS tenDonViBanDau,
                    pb2.TenPhongBan AS tenDonViHienThoi,
                    dvt.TenDonVi AS tenDonViTinh
                FROM 
                    TaiSan AS ts
                LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
                LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
                LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
                LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
                %s
                ORDER BY %s %s
                LIMIT ? OFFSET ?
                """, inspectionStatusSql, whereClause.toString(), orderColumn, direction);
        
        params.add(limit);
        params.add(offset);
        
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), params.toArray());
    }

    public long countByBanGiaoStatus(
        String idCongTy,
        boolean isBanGiao,
        String search,
        String idNhomTaiSan,
        String idDonViHienThoi,
        int soNgayThongBaoKiemDinh,
        String trangThaiKiemDinh) {
    
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        
        whereClause.append("WHERE ts.IdCongTy = ?");
        params.add(idCongTy);
        
        // Logic bàn giao
        if (isBanGiao) {
            whereClause.append(" AND ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> ''");
            whereClause.append(" AND ts.IdDonViHienThoi NOT IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho = 1 AND LoaiKho IN (1, 2))");
            params.add(idCongTy);
        } else {
            whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = ''");
            whereClause.append(" OR ts.IdDonViHienThoi IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho = 1 AND LoaiKho IN (1, 2))");
            params.add(idCongTy);
        }
        
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause.append(" AND ts.IdNhomTaiSan = ?");
            params.add(idNhomTaiSan);
        }
        
        if (idDonViHienThoi != null && !idDonViHienThoi.trim().isEmpty()) {
            whereClause.append(" AND ts.IdDonViHienThoi = ?");
            params.add(idDonViHienThoi);
        }
        
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?)");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        
         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'DA_DANG_KIEM'");
                    break;
                case "SAP_DEN_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'SAP_DEN_HAN'");
                    break;
                case "QUA_HAN":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'QUA_HAN'");
                    break;
                case "CHUA_DANG_KIEM":
                    whereClause.append(" AND ").append(inspectionStatusSql).append(" = 'CHUA_DANG_KIEM'");
                    break;
            }
        }
        
        String sql = "SELECT COUNT(*) FROM TaiSan ts " + whereClause.toString();
        Long result = jdbcTemplate.queryForObject(sql, Long.class, params.toArray());
        return result != null ? result : 0L;
    }

    public List<TaiSanDTO> findAllPagedWithBanGiaoStatus(String idCongTy, int offset, int limit, String sortBy, String sortDir, String idNhomTaiSan, boolean daBanGiao, int soNgayThongBaoKiemDinh, String trangThaiKiemDinh) {
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
        if (daBanGiao) {
            whereClause += " AND (ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> '') ";
        } else {
            whereClause += " AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '') ";
        }


         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'DA_DANG_KIEM'";
                    break;
                case "SAP_DEN_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'SAP_DEN_HAN'";
                    break;
                case "QUA_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'QUA_HAN'";
                    break;
                case "CHUA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'CHUA_DANG_KIEM'";
                    break;
            }
        }
        String sql = """
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
                    ts.vonKhac,
                    ts.tgKiemDinh,
                    ts.chuKyKiemDinh,
                    %s AS trangThaiKiemDinh,
                    pb1.TenPhongBan AS tenDonViBanDau,
                    pb2.TenPhongBan AS tenDonViHienThoi,
                    dvt.TenDonVi AS tenDonViTinh
                FROM 
                    TaiSan AS ts
                LEFT JOIN MoHinhTaiSan AS mhts ON ts.IdMoHinhTaiSan = mhts.Id
                LEFT JOIN NhomTaiSan AS nts ON ts.IdNhomTaiSan = nts.Id
                LEFT JOIN DuAn AS da ON ts.IdDuDan = da.Id
                LEFT JOIN NguonVon AS nv ON ts.IdNguonVon = nv.Id
                LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
                LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
                LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
                """ + whereClause + " ORDER BY " + orderColumn + " " + sortDirection + " LIMIT ? OFFSET ? ";
        String sqlFull = String.format(sql, inspectionStatusSql);
        params.add(limit);
        params.add(offset);
        return jdbcTemplate.query(sqlFull, new BeanPropertyRowMapper<>(TaiSanDTO.class), params.toArray());
    }

    public long countByCongTyAndBanGiaoStatus(String idCongTy, String idNhomTaiSan, boolean daBanGiao, int soNgayThongBaoKiemDinh, String trangThaiKiemDinh) {
        String whereClause = " WHERE ts.IdCongTy = ? ";
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);
        if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
            whereClause += " AND ts.IdNhomTaiSan = ? ";
            params.add(idNhomTaiSan);
        }
        if (daBanGiao) {
            whereClause += " AND (ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> '') ";
        } else {
            whereClause += " AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '') ";
        }

         String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // Filter theo trạng thái kiểm định
       // Lọc theo trạng thái kiểm định (thay vì Boolean, dùng String)
        if (trangThaiKiemDinh != null && !trangThaiKiemDinh.trim().isEmpty()) {
            switch (trangThaiKiemDinh) {
                case "DA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'DA_DANG_KIEM'";
                    break;
                case "SAP_DEN_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'SAP_DEN_HAN'";
                    break;
                case "QUA_HAN":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'QUA_HAN'";
                    break;
                case "CHUA_DANG_KIEM":
                    whereClause +=" AND "+ inspectionStatusSql + " = 'CHUA_DANG_KIEM'";
                    break;
            }
        }

        String sql = "SELECT COUNT(*) FROM TaiSan AS ts " + whereClause;
        Long result = jdbcTemplate.queryForObject(sql, Long.class, params.toArray());
        return result != null ? result : 0L;
    }

    public Map<String, Long> getCountByNhomTaiSanWithBanGiaoStatus(String idCongTy, Boolean daBanGiao, String search, String idDonViHienThoi) {
        StringBuilder whereClause = new StringBuilder(" WHERE ts.IdCongTy = ? ");
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);
        if (daBanGiao != null) {
            if (daBanGiao) {
                whereClause.append(" AND (ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> '') ");
            } else {
                whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '') ");
            }
        }
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?) ");
            String searchPattern = "%" + search + "%";
            for (int i = 0; i < 9; i++) {
                params.add(searchPattern);
            }
        }
        if (idDonViHienThoi != null && !idDonViHienThoi.trim().isEmpty()) {
            whereClause.append(" AND (ts.IdDonViHienThoi LIKE ?) ");
            params.add("%" + idDonViHienThoi + "%");
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

    public Map<String, Long> getCountByNhomTaiSanForDonViHienThoi(String idCongTy, String idDonViHienThoi, String search) {
        StringBuilder whereClause = new StringBuilder(" WHERE ts.IdCongTy = ? AND ts.IdDonViHienThoi = ? ");
        List<Object> params = new ArrayList<>();
        params.add(idCongTy);
        params.add(idDonViHienThoi);
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
    public Map<String, Long> getCountByTrangThaiKiemDinh(
            String idCongTy,
            String type, // "CAP_PHAT", "THU_HOI", "DA_BAN_GIAO"
            String idDonVi, // idDonViBanDau hoặc idDonViHienThoi (có thể null)
            String search,
            String idNhomTaiSan,
            String idDonViHienThoi, // chỉ dùng cho type = "DA_BAN_GIAO"
            int soNgayThongBaoKiemDinh) {
        
            StringBuilder whereClause = new StringBuilder();
            List<Object> params = new ArrayList<>();
            
            whereClause.append("WHERE ts.IdCongTy = ?");
            params.add(idCongTy);
            
            // Logic theo từng loại
            switch (type) {
                case "CAP_PHAT":
                    if (idDonVi != null && !idDonVi.trim().isEmpty()) {
                        whereClause.append(" AND ts.IdDonViBanDau = ?");
                        params.add(idDonVi);
                    } else {
                        whereClause.append(" AND ts.IdDonViBanDau IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho=1 AND LoaiKho = 1)");
                        params.add(idCongTy);
                    }
                    whereClause.append(" AND (ts.IdDonViHienThoi IS NULL OR ts.IdDonViHienThoi = '')");
                    break;
                    
                case "THU_HOI":
                    if (idDonVi != null && !idDonVi.trim().isEmpty()) {
                        whereClause.append(" AND ts.IdDonViHienThoi = ?");
                        params.add(idDonVi);
                    } else {
                        whereClause.append(" AND ts.IdDonViHienThoi IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho=1 AND LoaiKho = 2)");
                        params.add(idCongTy);
                    }
                    break;
                case "DA_BAN_GIAO":
                    whereClause.append(" AND ts.IdDonViHienThoi IS NOT NULL AND ts.IdDonViHienThoi <> ''");
                    whereClause.append(" AND ts.IdDonViHienThoi NOT IN (SELECT Id FROM PhongBan WHERE IdCongTy = ? AND IsKho = 1 AND LoaiKho IN (1, 2))");
                    params.add(idCongTy);
                    
                    if (idDonViHienThoi != null && !idDonViHienThoi.trim().isEmpty()) {
                        whereClause.append(" AND ts.IdDonViHienThoi = ?");
                        params.add(idDonViHienThoi);
                    }
                    break;
            }
            
            // Lọc theo nhóm tài sản
            if (idNhomTaiSan != null && !idNhomTaiSan.trim().isEmpty()) {
                whereClause.append(" AND ts.IdNhomTaiSan = ?");
                params.add(idNhomTaiSan);
            }
            
            // Lọc theo search
            if (search != null && !search.trim().isEmpty()) {
                whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.SoThe LIKE ? OR ts.KyHieu LIKE ? OR ts.SoKyHieu LIKE ? OR ts.CongSuat LIKE ? OR ts.NuocSanXuat LIKE ? OR ts.DonViTinh LIKE ? OR ts.MoTa LIKE ?)");
                String searchPattern = "%" + search + "%";
                for (int i = 0; i < 9; i++) {
                    params.add(searchPattern);
                }
            }
            
            String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
            
            String sql = String.format("""
                SELECT 
                    %s AS trang_thai,
                    COUNT(*) AS so_luong
                FROM TaiSan ts
                %s
                GROUP BY trang_thai
                """, inspectionStatusSql, whereClause.toString());
            
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, params.toArray());
            
            Map<String, Long> counts = new HashMap<>();
            counts.put("Tat ca", 0L);
            counts.put("Da dang kiem", 0L);      // Đã đăng kiểm
            counts.put("Sap den han", 0L);        // Sắp đến hạn
            counts.put("Qua han", 0L);            // Quá hạn
            
            for (Map<String, Object> row : results) {
                String trangThai = (String) row.get("trang_thai");
                Long soLuong = ((Number) row.get("so_luong")).longValue();
                
                if (trangThai != null) {
                    switch (trangThai) {
                        case "DA_DANG_KIEM":
                            counts.put("Da dang kiem", soLuong);
                            break;
                        case "SAP_DEN_HAN":
                            counts.put("Sap den han", soLuong);
                            break;
                        case "QUA_HAN":
                            counts.put("Qua han", counts.get("Qua han") + soLuong);
                            break;
                    }
                    counts.put("Tat ca", counts.get("Tat ca") + soLuong);
                }
            }
            
            return counts;
        }
    public PagedResult<KhauHaoTaiSan> getKhauHaoTaiSanPaged(String idCongTy, int ngay, int thang, int nam,
                                                            int offset, int limit, String sortBy, String sortDir, String search) {
        StringBuilder whereClause = new StringBuilder();
        List<Object> params = new ArrayList<>();
        params.add(nam); params.add(thang); params.add(ngay);
        params.add(nam); params.add(thang); params.add(ngay);
        params.add(idCongTy);
        if (search != null && !search.trim().isEmpty()) {
            whereClause.append(" AND (ts.Id LIKE ? OR ts.TenTaiSan LIKE ? OR ts.TaiKhoanTaiSan LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern); params.add(searchPattern); params.add(searchPattern);
        }
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytinhkhao";
        String orderColumn;
        switch (normalizedSortBy) {
            case "sothe": orderColumn = "ts.Id"; break;
            case "tentaisan": orderColumn = "ts.TenTaiSan"; break;
            case "nguyengia": orderColumn = "nguyenGia"; break;
            case "thangkh": orderColumn = "thangKh"; break;
            default: orderColumn = "ngayTinhKhao";
        }
        String direction = (sortDir != null && sortDir.equalsIgnoreCase("asc")) ? "ASC" : "DESC";

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
        List<KhauHaoTaiSan> items = jdbcTemplate.query(dataSql, new BeanPropertyRowMapper<>(KhauHaoTaiSan.class), params.toArray());
        return new PagedResult<>(items, total);
    }

    public long countSapHetHanKiemDinh(String idCongTy, int soNgayThongBaoKiemDinh) {
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        String sql = "SELECT COUNT(*) FROM TaiSan ts WHERE ts.IdCongTy = ? AND " + inspectionStatusSql + " = 'SAP_DEN_HAN'";
        Long result = jdbcTemplate.queryForObject(sql, Long.class, idCongTy);
        return result != null ? result : 0L;
    }

    public List<TaiSanDTO> findSapHetHanKiemDinhPaged(String idCongTy, int offset, int limit, int soNgayThongBaoKiemDinh) {
        String inspectionStatusSql = getInspectionStatusSql(soNgayThongBaoKiemDinh);
        // NgayDangKiemTiepTheo = 01/(tgKiemDinh + chuKy)
        String deadlineSql = "DATE_ADD(STR_TO_DATE(CONCAT('01/', ts.tgKiemDinh), '%d/%m/%Y'), INTERVAL ts.chuKyKiemDinh MONTH)";
        
        String sql = String.format("""
                SELECT 
                    ts.Id,
                    ts.TenTaiSan,
                    ts.SoThe,
                    ts.tgKiemDinh,
                    ts.chuKyKiemDinh,
                    DATE_FORMAT(%s, '%%d/%%m/%%Y') AS ngayDangKiemTiepTheo,
                    DATEDIFF(%s, CURRENT_DATE) AS thoiHanConLai,
                    'SAP_DEN_HAN' AS trangThaiKiemDinh,
                    pb1.TenPhongBan AS tenDonViBanDau,
                    pb2.TenPhongBan AS tenDonViHienThoi,
                    dvt.TenDonVi AS tenDonViTinh
                FROM 
                    TaiSan AS ts
                LEFT JOIN PhongBan AS pb1 ON ts.IdDonViBanDau = pb1.Id
                LEFT JOIN PhongBan AS pb2 ON ts.IdDonViHienThoi = pb2.Id
                LEFT JOIN DonViTinh AS dvt ON ts.DonViTinh = dvt.Id
                WHERE ts.IdCongTy = ? AND %s = 'SAP_DEN_HAN'
                ORDER BY thoiHanConLai ASC
                LIMIT ? OFFSET ?
                """, deadlineSql, deadlineSql, inspectionStatusSql);
        
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TaiSanDTO.class), idCongTy, limit, offset);
    }

    private String getInspectionStatusSql(int soNgayThongBaoKiemDinh) {
        return String.format("""
            (CASE 
                WHEN (ts.tgKiemDinh IS NOT NULL AND ts.tgKiemDinh <> '' AND ts.chuKyKiemDinh IS NOT NULL) THEN 
                    (CASE 
                        -- Ngày hết hạn là ngày cuối cùng của tháng (tgKiemDinh + chuKy - 1)
                        WHEN CURRENT_DATE > LAST_DAY(DATE_ADD(STR_TO_DATE(CONCAT('01/', ts.tgKiemDinh), '%%d/%%m/%%Y'), INTERVAL (ts.chuKyKiemDinh - 1) MONTH)) THEN 'QUA_HAN'
                        -- Trong khoảng cảnh báo (sắp đến hạn): bắt đầu từ n ngày trước khi hết hạn cho đến hết ngày hạn chót
                        WHEN CURRENT_DATE >= DATE_SUB(LAST_DAY(DATE_ADD(STR_TO_DATE(CONCAT('01/', ts.tgKiemDinh), '%%d/%%m/%%Y'), INTERVAL (ts.chuKyKiemDinh - 1) MONTH)), INTERVAL %d DAY) THEN 'SAP_DEN_HAN'
                        ELSE 'DA_DANG_KIEM'
                    END)
                ELSE 'QUA_HAN'
            END)
            """, soNgayThongBaoKiemDinh);
    }
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