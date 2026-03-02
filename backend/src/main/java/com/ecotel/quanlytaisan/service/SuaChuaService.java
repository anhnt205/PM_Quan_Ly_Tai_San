package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.*;
import com.ecotel.quanlytaisan.model.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuaChuaService {

    @Autowired
    private SuaChuaDao suaChuaDao;

    @Autowired
    private ChiTietSuaChuaDao chiTietSuaChuaDao;

    @Autowired
    private KetQuaSuaChuaDao ketQuaSuaChuaDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    private NhanVienDao nhanVienDao;

    public List<SuaChuaDTO> findAll(String idCongTy) throws SQLException {
        List<SuaChuaDTO> list = suaChuaDao.findAll(idCongTy);
        for (SuaChuaDTO dto : list) {
            List<ChiTietSuaChuaDTO> chiTiet = chiTietSuaChuaDao.findByIdSuaChua(dto.getId());
            dto.setChiTietSuaChuas(chiTiet);
        }
        return list;
    }

    public PageResponse<SuaChuaDTO> findAllPaged(
            String idCongTy,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search,
            String userId,
            Integer loai,
            String idDonViGiao,
            String idDonViNhan
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<SuaChuaDTO> sourceList = findAll(idCongTy);

        // Lọc theo quyền xem (nếu cần) - tạm thời bỏ qua vì chưa có logic phức tạp
        if (userId != null && !userId.trim().isEmpty()) {
            // Có thể lọc theo userId nếu cần
        }

        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> item.getIdDonViGiao() != null && item.getIdDonViGiao().equals(idDonViGiao))
                    .collect(Collectors.toList());
        }

        if (idDonViNhan != null && !idDonViNhan.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> item.getIdDonViNhan() != null && item.getIdDonViNhan().equals(idDonViNhan))
                    .collect(Collectors.toList());
        }

        if (loai != null) {
            sourceList = sourceList.stream()
                    .filter(item -> item.getLoai() != null && item.getLoai().equals(loai))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase().trim();
            sourceList = sourceList.stream()
                    .filter(item ->
                            (item.getMaSuaChua() != null && item.getMaSuaChua().toLowerCase().contains(q)) ||
                                    (item.getTenSuaChua() != null && item.getTenSuaChua().toLowerCase().contains(q)) ||
                                    (item.getTenDonViGiao() != null && item.getTenDonViGiao().toLowerCase().contains(q)) ||
                                    (item.getTenDonViNhan() != null && item.getTenDonViNhan().toLowerCase().contains(q))
                    )
                    .collect(Collectors.toList());
        }

        // Tính toán thống kê theo loại (có thể thay bằng trạng thái khác)
        Map<String, Long> groupCounts = new HashMap<>();
        for (SuaChuaDTO item : sourceList) {
            if (item.getLoai() != null) {
                String key = "Loai_" + item.getLoai();
                groupCounts.put(key, groupCounts.getOrDefault(key, 0L) + 1);
            }
        }

        // Sắp xếp
        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<SuaChuaDTO> items = sourceList.subList(from, to);

        for (SuaChuaDTO item : items) {
            List<ChiTietSuaChuaDTO> chiTiet = chiTietSuaChuaDao.findByIdSuaChua(item.getId());
            item.setChiTietSuaChuas(chiTiet);
        }

        PageResponse<SuaChuaDTO> response = new PageResponse<>(items, total, page, size);
        response.setGroupCounts(groupCounts);
        return response;
    }

    private Comparator<SuaChuaDTO> getComparator(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");

        Comparator<SuaChuaDTO> comparator = null;

        switch (normalizedSortBy) {
            case "masuachua":
                comparator = Comparator.comparing(item -> item.getMaSuaChua() != null ? item.getMaSuaChua() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "tensuachua":
                comparator = Comparator.comparing(item -> item.getTenSuaChua() != null ? item.getTenSuaChua() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "ngayketthuc":
                comparator = Comparator.comparing(item -> item.getNgayKetThucDuKien() != null ? item.getNgayKetThucDuKien() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "ngaytao":
            default:
                comparator = Comparator.comparing(item -> item.getNgayTao() != null ? item.getNgayTao() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
        }

        return ascending ? comparator : comparator.reversed();
    }

    public List<SuaChuaDTO> getByUserId(String userId) throws SQLException {
        // Tạm thời trả về tất cả, vì không có trường liên quan trực tiếp đến user trong phiếu
        return findAll(null);
    }

    public List<SuaChuaDTO> getByLoai(int loai) throws SQLException {
        List<SuaChuaDTO> all = findAll(null);
        return all.stream()
                .filter(item -> item.getLoai() != null && item.getLoai() == loai)
                .peek(item -> {
                    List<ChiTietSuaChuaDTO> chiTiet = chiTietSuaChuaDao.findByIdSuaChua(item.getId());
                    item.setChiTietSuaChuas(chiTiet);
                })
                .collect(Collectors.toList());
    }

    public SuaChua findById(String id) throws SQLException {
        return suaChuaDao.findById(id);
    }

    public SuaChuaDTO findByIdDTO(String id) throws SQLException {
        SuaChuaDTO dto = suaChuaDao.findByIdDTO(id);
        if (dto != null) {
            List<ChiTietSuaChuaDTO> chiTiet = chiTietSuaChuaDao.findByIdSuaChua(id);
            dto.setChiTietSuaChuas(chiTiet);
        }
        return dto;
    }

    public SuaChua insert(SuaChua obj) throws SQLException {
        return suaChuaDao.insert(obj);
    }

    public SuaChua update(SuaChua obj) throws SQLException {
        return suaChuaDao.update(obj);
    }

    public int delete(String id) throws SQLException {
        chiTietSuaChuaDao.deleteByIdSuaChua(id);
        return suaChuaDao.delete(id);
    }

    // Các phương thức xử lý ký duyệt
    public int updateKyNhay(String id, String userId) {
        // Cần kiểm tra userId có trong danh sách IdNguoiKyNhay không? Tạm thời gọi DAO
        return suaChuaDao.updateKyNhay(id, userId);
    }

    public int updateNguoiLapPhieuKyNhay(String id) {
        return suaChuaDao.updateNguoiLapPhieuKyNhay(id);
    }

    public int updateDuyetCapPhong(String id, String userId, boolean xacNhan) {
        return suaChuaDao.updateDuyetCapPhong(id, userId, xacNhan);
    }

    public int updateDuyetGiamDoc(String id, String userId, boolean xacNhan) {
        return suaChuaDao.updateDuyetGiamDoc(id, userId, xacNhan);
    }

    // Lấy quyền ký (đơn giản hóa)
    public int getPermissionSigning(SuaChuaDTO item, String userId) {
        // Tạo luồng ký: người lập phiếu ký nháy -> ký nháy -> duyệt cấp phòng -> duyệt giám đốc
        // Trả về: 0: có thể ký, 1: chưa đến lượt, 2: không trong luồng, 3: đã ký
        // Cần xử lý chi tiết hơn tùy theo logic thực tế
        // Tạm thời return 2
        return 2;
    }

    public boolean isUserTurnToSign(SuaChuaDTO item, String userId) {
        // Tương tự trên
        return false;
    }

    // Import
    public List<SuaChua> readCsv(MultipartFile file) throws IOException {
        List<SuaChua> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1);
                SuaChua entity = SuaChua.mapToSuaChua(fields);
                list.add(entity);
            }
        }
        return list;
    }

    public List<SuaChua> readExcel(MultipartFile file) throws IOException {
        List<SuaChua> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            SuaChua entity = SuaChua.mapToSuaChua(row);
            list.add(entity);
        }
        workbook.close();
        return list;
    }

    /**
     * Xử lý ký từ bảng NguoiKy (người ký phụ)
     * @param id ID của phiếu sửa chữa
     * @param userId ID người dùng ký
     * @return 1 nếu thành công, 0 nếu thất bại
     */
    public int updateTrangThaiKy(String id, String userId) {
        return suaChuaDao.updateTrangThaiKy(id, userId);
    }

    /**
     * Hủy phiếu sửa chữa (chuyển trạng thái sang hủy)
     * @param id ID của phiếu sửa chữa
     * @return 1 nếu thành công, 0 nếu thất bại
     */
    public int huyTrangThai(String id) {
        return suaChuaDao.huyTrangThai(id);
    }
}