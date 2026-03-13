package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KeHoachCongViecSuaChuaDao;
import com.ecotel.quanlytaisan.dao.SuaChuaChiTietTaiSanDao;      // DAO mới
import com.ecotel.quanlytaisan.dao.SuaChuaVatTuTieuHaoDao;       // DAO mới
import com.ecotel.quanlytaisan.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class KeHoachSuaChuaService {

    @Autowired
    private KeHoachSuaChuaDao keHoachSuaChuaDao;

    @Autowired
    private KeHoachCongViecSuaChuaDao keHoachCongViecSuaChuaDao;

    // Thay thế KeHoachChiTietSuaChuaDao bằng 2 DAO mới
    @Autowired
    private SuaChuaChiTietTaiSanDao suaChuaChiTietTaiSanDao;

    @Autowired
    private SuaChuaVatTuTieuHaoDao suaChuaVatTuTieuHaoDao;

    // Lấy danh sách tất cả kế hoạch (kèm công việc và chi tiết)
    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) throws SQLException {
        List<KeHoachSuaChuaDTO> list = keHoachSuaChuaDao.findAll(idCongTy);
        for (KeHoachSuaChuaDTO dto : list) {
            List<KeHoachCongViecSuaChuaDTO> congViecs = keHoachCongViecSuaChuaDao.findByIdKeHoach(dto.getId());
            // Lấy danh sách tài sản và vật tư từ 2 bảng mới
            List<SuaChuaChiTietTaiSan> danhSachTaiSan = suaChuaChiTietTaiSanDao.findByIdKeHoach(dto.getId());
            List<SuaChuaVatTuTieuHao> danhSachVatTu = suaChuaVatTuTieuHaoDao.findByIdKeHoach(dto.getId());
            dto.setCongViecs(congViecs);
            dto.setDanhSachTaiSan(danhSachTaiSan);
            dto.setDanhSachVatTu(danhSachVatTu);
        }
        return list;
    }

    @Transactional
    public void bulkCreate(List<KeHoachSuaChua> list) {
        if (list == null || list.isEmpty()) return;
        keHoachSuaChuaDao.batchInsert(list);
    }

    @Transactional
    public void bulkUpdate(List<KeHoachSuaChua> list) {
        if (list == null || list.isEmpty()) return;
        keHoachSuaChuaDao.batchUpdate(list);
    }

    @Transactional
    public void bulkDelete(List<String> ids) {
        if (ids == null || ids.isEmpty()) return;

        // Xóa các công việc và chi tiết từ 2 bảng mới trước
        keHoachCongViecSuaChuaDao.deleteByIdKeHoachIn(ids);
        // Xóa chi tiết tài sản và vật tư theo idKeHoach
        for (String id : ids) {
            suaChuaChiTietTaiSanDao.deleteByIdKeHoach(id);
            suaChuaVatTuTieuHaoDao.deleteByIdKeHoach(id);
        }
        keHoachSuaChuaDao.batchDelete(ids);
    }

    // Phân trang có lọc
    public PageResponse<KeHoachSuaChuaDTO> findAllPaged(
            String idCongTy,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search,
            String loaiKeHoach,
            String loaiDoiTuong,
            String idDonViGiao,
            String idDonViThucHien,
            String trangThai,
            Integer ngay, Integer thang, Integer nam
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<KeHoachSuaChuaDTO> sourceList = keHoachSuaChuaDao.findAll(idCongTy);

        // Đếm theo trạng thái
        Map<String, Long> groupCounts = new HashMap<>();
        groupCounts.put("CHUA_THUC_HIEN", 0L);
        groupCounts.put("DANG_THUC_HIEN", 0L);
        groupCounts.put("DA_HOAN_THANH", 0L);
        for (KeHoachSuaChuaDTO item : sourceList) {
            String tt = item.getTrangThai();
            if (tt != null) {
                groupCounts.put(tt, groupCounts.getOrDefault(tt, 0L) + 1);
            }
        }

        // Lọc
        if (loaiKeHoach != null && !loaiKeHoach.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> loaiKeHoach.equals(item.getIdLoaiKeHoach()))
                    .collect(Collectors.toList());
        }
        if (trangThai != null && !trangThai.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> trangThai.equals(item.getTrangThai()))
                    .collect(Collectors.toList());
        }
        if (loaiDoiTuong != null && !loaiDoiTuong.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> loaiDoiTuong.equals(item.getLoaiDoiTuong()))
                    .collect(Collectors.toList());
        }
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> idDonViGiao.equals(item.getIdDonViGiao()))
                    .collect(Collectors.toList());
        }
        if (idDonViThucHien != null && !idDonViThucHien.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> idDonViThucHien.equals(item.getIdDonViThucHien()))
                    .collect(Collectors.toList());
        }

        // Lọc theo ngày bắt đầu
        if (ngay != null || thang != null || nam != null) {
            sourceList = sourceList.stream()
                    .filter(item -> {
                        if (item.getNgayBatDau() == null) return false;
                        java.util.Calendar cal = java.util.Calendar.getInstance();
                        cal.setTime(item.getNgayBatDau());
                        if (nam != null && cal.get(java.util.Calendar.YEAR) != nam) return false;
                        if (thang != null && (cal.get(java.util.Calendar.MONTH) + 1) != thang) return false;
                        if (ngay != null && cal.get(java.util.Calendar.DAY_OF_MONTH) != ngay) return false;
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        // Tìm kiếm theo tên
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(item -> item.getTenKeHoach() != null && item.getTenKeHoach().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<KeHoachSuaChuaDTO> items = sourceList.subList(from, to);

        // Gán công việc và chi tiết từ 2 bảng mới
        for (KeHoachSuaChuaDTO item : items) {
            List<KeHoachCongViecSuaChuaDTO> congViecs = keHoachCongViecSuaChuaDao.findByIdKeHoach(item.getId());
            List<SuaChuaChiTietTaiSan> danhSachTaiSan = suaChuaChiTietTaiSanDao.findByIdKeHoach(item.getId());
            List<SuaChuaVatTuTieuHao> danhSachVatTu = suaChuaVatTuTieuHaoDao.findByIdKeHoach(item.getId());
            item.setCongViecs(congViecs);
            item.setDanhSachTaiSan(danhSachTaiSan);
            item.setDanhSachVatTu(danhSachVatTu);
        }

        PageResponse<KeHoachSuaChuaDTO> response = new PageResponse<>(items, total, page, size);
        response.setGroupCounts(groupCounts);
        return response;
    }

    private Comparator<KeHoachSuaChuaDTO> getComparator(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");

        Comparator<KeHoachSuaChuaDTO> comparator;

        switch (normalizedSortBy) {
            case "tenkehoach":
                comparator = Comparator.comparing(
                        item -> item.getTenKeHoach() != null ? item.getTenKeHoach() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "ngaybatdau":
                comparator = Comparator.comparing(
                        item -> item.getNgayBatDau() != null ? item.getNgayBatDau() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "ngayketthuc":
                comparator = Comparator.comparing(
                        item -> item.getNgayKetThuc() != null ? item.getNgayKetThuc() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "ngaytao":
            default:
                comparator = Comparator.comparing(
                        item -> item.getNgayTao() != null ? item.getNgayTao() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
        }

        return ascending ? comparator : comparator.reversed();
    }

    // CRUD
    public KeHoachSuaChua findById(String id) throws SQLException {
        return keHoachSuaChuaDao.findById(id);
    }

    public KeHoachSuaChuaDTO findByIdDTO(String id) throws SQLException {
        KeHoachSuaChuaDTO dto = keHoachSuaChuaDao.findByIdDTO(id);
        if (dto != null) {
            List<KeHoachCongViecSuaChuaDTO> congViecs = keHoachCongViecSuaChuaDao.findByIdKeHoach(id);
            List<SuaChuaChiTietTaiSan> danhSachTaiSan = suaChuaChiTietTaiSanDao.findByIdKeHoach(id);
            List<SuaChuaVatTuTieuHao> danhSachVatTu = suaChuaVatTuTieuHaoDao.findByIdKeHoach(id);
            dto.setCongViecs(congViecs);
            dto.setDanhSachTaiSan(danhSachTaiSan);
            dto.setDanhSachVatTu(danhSachVatTu);
        }
        return dto;
    }

    public KeHoachSuaChua insert(KeHoachSuaChua entity) throws SQLException {
        return keHoachSuaChuaDao.insert(entity);
    }

    public KeHoachSuaChua update(KeHoachSuaChua entity) throws SQLException {
        return keHoachSuaChuaDao.update(entity);
    }

    public int updateTrangThai(String id, String trangThai) {
        List<String> validValues = List.of("CHUA_THUC_HIEN", "DANG_THUC_HIEN", "DA_HOAN_THANH");
        if (!validValues.contains(trangThai)) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + trangThai);
        }

        KeHoachSuaChua existing = keHoachSuaChuaDao.findById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Không tìm thấy kế hoạch với ID: " + id);
        }
        if ("DA_HOAN_THANH".equals(existing.getTrangThai())) {
            throw new IllegalStateException("Kế hoạch đã hoàn thành, không thể thay đổi trạng thái");
        }
        return keHoachSuaChuaDao.updateTrangThai(id, trangThai);
    }

    @Transactional
    public int delete(String id) throws SQLException {
        // Xóa các công việc và chi tiết từ 2 bảng mới trước
        keHoachCongViecSuaChuaDao.deleteByIdKeHoach(id);
        suaChuaChiTietTaiSanDao.deleteByIdKeHoach(id);
        suaChuaVatTuTieuHaoDao.deleteByIdKeHoach(id);
        return keHoachSuaChuaDao.delete(id);
    }

    // Import (placeholder)
    public List<KeHoachSuaChua> readCsv(MultipartFile file) throws IOException {
        return new ArrayList<>();
    }

    public List<KeHoachSuaChua> readExcel(MultipartFile file) throws IOException {
        return new ArrayList<>();
    }
}