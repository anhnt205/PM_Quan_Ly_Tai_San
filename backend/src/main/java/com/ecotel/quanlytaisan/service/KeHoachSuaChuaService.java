package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.KeHoachChiTietSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KeHoachCongViecSuaChuaDao;
import com.ecotel.quanlytaisan.dao.KeHoachSuaChuaDao;
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

    @Autowired
    private KeHoachChiTietSuaChuaDao keHoachChiTietSuaChuaDao;

    // Lấy danh sách tất cả kế hoạch (kèm công việc và chi tiết)
    public List<KeHoachSuaChuaDTO> findAll(String idCongTy) throws SQLException {
        List<KeHoachSuaChuaDTO> list = keHoachSuaChuaDao.findAll(idCongTy);
        for (KeHoachSuaChuaDTO dto : list) {
            List<KeHoachCongViecSuaChuaDTO> congViecs = keHoachCongViecSuaChuaDao.findByIdKeHoach(dto.getId());
            List<KeHoachChiTietSuaChuaDTO> chiTiets = keHoachChiTietSuaChuaDao.findByIdKeHoach(dto.getId());
            dto.setCongViecs(congViecs);
            dto.setChiTiets(chiTiets);
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

        keHoachCongViecSuaChuaDao.deleteByIdKeHoachIn(ids);
        keHoachChiTietSuaChuaDao.deleteByIdKeHoachIn(ids);
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
            String idDonViThucHien
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<KeHoachSuaChuaDTO> sourceList = keHoachSuaChuaDao.findAll(idCongTy);

        // Lọc theo loại kế hoạch
        if (loaiKeHoach != null && !loaiKeHoach.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> loaiKeHoach.equals(item.getLoaiKeHoach()))
                    .collect(Collectors.toList());
        }

        // Lọc theo loại đối tượng
        if (loaiDoiTuong != null && !loaiDoiTuong.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> loaiDoiTuong.equals(item.getLoaiDoiTuong()))
                    .collect(Collectors.toList());
        }

        // Lọc theo đơn vị thực hiện
        if (idDonViThucHien != null && !idDonViThucHien.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> idDonViThucHien.equals(item.getIdDonViThucHien()))
                    .collect(Collectors.toList());
        }

        // Tìm kiếm theo tên kế hoạch
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            sourceList = sourceList.stream()
                    .filter(item -> item.getTenKeHoach() != null && item.getTenKeHoach().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        // Tính toán thống kê (nếu cần)
        Map<String, Long> groupCounts = new HashMap<>();
        for (KeHoachSuaChuaDTO item : sourceList) {
            if (item.getLoaiKeHoach() != null) {
                groupCounts.put(item.getLoaiKeHoach(), groupCounts.getOrDefault(item.getLoaiKeHoach(), 0L) + 1);
            }
        }

        // Sắp xếp
        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<KeHoachSuaChuaDTO> items = sourceList.subList(from, to);

        // Gán thêm công việc và chi tiết cho từng item
        for (KeHoachSuaChuaDTO item : items) {
            List<KeHoachCongViecSuaChuaDTO> congViecs = keHoachCongViecSuaChuaDao.findByIdKeHoach(item.getId());
            List<KeHoachChiTietSuaChuaDTO> chiTiets = keHoachChiTietSuaChuaDao.findByIdKeHoach(item.getId());
            item.setCongViecs(congViecs);
            item.setChiTiets(chiTiets);
        }

        PageResponse<KeHoachSuaChuaDTO> response = new PageResponse<>(items, total, page, size);
        response.setGroupCounts(groupCounts);
        return response;
    }

    private Comparator<KeHoachSuaChuaDTO> getComparator(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");

        Comparator<KeHoachSuaChuaDTO> comparator = null;

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
                comparator = Comparator.comparing(
                        item -> item.getNgayTao() != null ? item.getNgayTao() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
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
            List<KeHoachChiTietSuaChuaDTO> chiTiets = keHoachChiTietSuaChuaDao.findByIdKeHoach(id);
            dto.setCongViecs(congViecs);
            dto.setChiTiets(chiTiets);
        }
        return dto;
    }

    public KeHoachSuaChua insert(KeHoachSuaChua entity) throws SQLException {
        return keHoachSuaChuaDao.insert(entity);
    }

    public KeHoachSuaChua update(KeHoachSuaChua entity) throws SQLException {
        return keHoachSuaChuaDao.update(entity);
    }

    public int delete(String id) throws SQLException {
        // Xóa các công việc và chi tiết trước (cascade có thể tự động nếu DB có ON DELETE CASCADE)
        keHoachCongViecSuaChuaDao.deleteByIdKeHoach(id);
        keHoachChiTietSuaChuaDao.deleteByIdKeHoach(id);
        return keHoachSuaChuaDao.delete(id);
    }

    // Import (placeholder, có thể copy từ module khác)
    public List<KeHoachSuaChua> readCsv(MultipartFile file) throws IOException {
        // ... cài đặt tương tự
        return new ArrayList<>();
    }

    public List<KeHoachSuaChua> readExcel(MultipartFile file) throws IOException {
        // ... cài đặt tương tự
        return new ArrayList<>();
    }
}