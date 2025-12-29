package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.BanGiaoCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.ChiTietBanGiaoCCDCVatTuDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.model.BanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.model.BanGiaoCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTuDTO;
import com.ecotel.quanlytaisan.model.NguoiKy;
import com.ecotel.quanlytaisan.model.PageResponse;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class BanGiaoCCDCVatTuService {
    @Autowired
    private BanGiaoCCDCVatTuDao dao;

    @Autowired
    private ChiTietBanGiaoCCDCVatTuDao chiTietBanGiaoCCDCVatTuDao;

    @Autowired
    KyTaiLieuDao kyTaiLieuDao;


    public BanGiaoCCDCVatTuService() {
        this.dao = new BanGiaoCCDCVatTuDao();
    }

    public List<BanGiaoCCDCVatTuDTO> getByUserId(String userId) throws SQLException {
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = dao.getByUserId(userId);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = banGiaoCCDCVatTuDTOList.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            banGiaoCCDCVatTuDTOList.set(i, banGiaoCCDCVatTuDTO);
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByUserIdStatus(String userId, int trangThai) throws SQLException {
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = dao.getByUserIdStatus(userId, trangThai);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = banGiaoCCDCVatTuDTOList.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            banGiaoCCDCVatTuDTOList.set(i, banGiaoCCDCVatTuDTO);
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> getByStatus(int trangThai) throws SQLException {
        List<BanGiaoCCDCVatTuDTO> banGiaoCCDCVatTuDTOList = dao.getByStatus(trangThai);
        for (int i = 0; i < banGiaoCCDCVatTuDTOList.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = banGiaoCCDCVatTuDTOList.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            banGiaoCCDCVatTuDTOList.set(i, banGiaoCCDCVatTuDTO);
        }
        return banGiaoCCDCVatTuDTOList;
    }

    public List<BanGiaoCCDCVatTuDTO> findAll(String idCongTy) {
        return dao.findAll(idCongTy);
    }

    public PageResponse<BanGiaoCCDCVatTuDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search, String userid, Integer trangThai, String idDonViGiao) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<BanGiaoCCDCVatTuDTO> sourceList;
        sourceList = findAll(idCongTy);

        // Filter theo lượt ký - chỉ lấy những item mà đến lượt user ký
        // Ngoại lệ: admin lấy hết, NguoiTao cũng lấy không phân biệt thứ tự
        if (userid != null && !userid.trim().isEmpty()) {
            List<BanGiaoCCDCVatTuDTO> turnFiltered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (isUserTurnToSign(item, userid)) {
                    turnFiltered.add(item);
                }
            }
            sourceList = turnFiltered;
        }

        // Filter by trangThaiPhieu if trangThai != 4
        if (trangThai != null && trangThai != 4) {
            List<BanGiaoCCDCVatTuDTO> trangThaiFiltered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getTrangThai() != null && item.getTrangThai().equals(trangThai)) {
                    trangThaiFiltered.add(item);
                }
            }
            sourceList = trangThaiFiltered;
        }

        // Filter by idDonViGiao if provided
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            List<BanGiaoCCDCVatTuDTO> donViGiaoFiltered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (item != null && item.getIdDonViGiao() != null && item.getIdDonViGiao().equals(idDonViGiao)) {
                    donViGiaoFiltered.add(item);
                }
            }
            sourceList = donViGiaoFiltered;
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            List<BanGiaoCCDCVatTuDTO> filtered = new ArrayList<>();
            for (BanGiaoCCDCVatTuDTO item : sourceList) {
                if (item != null && item.toString() != null && item.toString().toLowerCase().contains(q)) {
                    filtered.add(item);
                }
            }
            // Apply sorting
            filtered.sort(getComparator(sortBy, sortDir));
            long total = filtered.size();
            int from = Math.min(page * size, filtered.size());
            int to = Math.min(from + size, filtered.size());
            List<BanGiaoCCDCVatTuDTO> items = filtered.subList(from, to);
            for (int i = 0; i < items.size(); i++) {
                BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = items.get(i);
                List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
                banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
                items.set(i, banGiaoCCDCVatTuDTO);
            }
            // Get group counts by TrangThai from filtered list
            Map<String, Long> groupCounts = new java.util.HashMap<>();
            for (BanGiaoCCDCVatTuDTO item : filtered) {
                if (item != null && item.getTrangThai() != null) {
                    String key = item.getTrangThai().toString();
                    groupCounts.put(key, groupCounts.getOrDefault(key, 0L) + 1);
                }
            }
            PageResponse<BanGiaoCCDCVatTuDTO> response = new PageResponse<>(items, total, page, size);
            response.setGroupCounts(groupCounts);
            return response;
        }

        // Apply sorting
        sourceList.sort(getComparator(sortBy, sortDir));
        
        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<BanGiaoCCDCVatTuDTO> items = sourceList.subList(from, to);
        if (kyTaiLieuDao != null) {
            for (BanGiaoCCDCVatTuDTO item : items) {
                item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
                item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
            }
        }
        for (int i = 0; i < items.size(); i++) {
            BanGiaoCCDCVatTuDTO banGiaoCCDCVatTuDTO = items.get(i);
            List<ChiTietBanGiaoCCDCVatTuDTO> chiTietBanGiaoCCDCVatTuDTOS = chiTietBanGiaoCCDCVatTuDao.findAll(banGiaoCCDCVatTuDTO.getId());
            banGiaoCCDCVatTuDTO.setChiTietBanGiaoCCDCVatTu(chiTietBanGiaoCCDCVatTuDTOS);
            items.set(i, banGiaoCCDCVatTuDTO);
        }
        // Get group counts by TrangThai from sourceList
        Map<String, Long> groupCounts = new java.util.HashMap<>();
        for (BanGiaoCCDCVatTuDTO item : sourceList) {
            if (item != null && item.getTrangThai() != null) {
                String key = item.getTrangThai().toString();
                groupCounts.put(key, groupCounts.getOrDefault(key, 0L) + 1);
            }
        }
        PageResponse<BanGiaoCCDCVatTuDTO> response = new PageResponse<>(items, total, page, size);
        response.setGroupCounts(groupCounts);
        return response;
    }

    private Comparator<BanGiaoCCDCVatTuDTO> getComparator(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");
        
        Comparator<BanGiaoCCDCVatTuDTO> comparator = null;
        
        switch (normalizedSortBy) {
            case "bangiaoccdcvatTu":
                comparator = Comparator.comparing(
                    item -> item.getBanGiaoCCDCVatTu() != null ? item.getBanGiaoCCDCVatTu() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "quyetdinhdieudongso":
                comparator = Comparator.comparing(
                    item -> item.getQuyetDinhDieuDongSo() != null ? item.getQuyetDinhDieuDongSo() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaybangiao":
                comparator = Comparator.comparing(
                    item -> item.getNgayBanGiao() != null ? item.getNgayBanGiao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaytao":
                comparator = Comparator.comparing(
                    item -> item.getNgayTao() != null ? item.getNgayTao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "ngaycapnhat":
            default:
                comparator = Comparator.comparing(
                    item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "trangthai":
                comparator = Comparator.comparing(
                    item -> item.getTrangThai() != null ? item.getTrangThai() : 0,
                    Comparator.nullsLast(Integer::compareTo)
                );
                break;
            case "tendonvigiao":
                comparator = Comparator.comparing(
                    item -> item.getTenDonViGiao() != null ? item.getTenDonViGiao() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "tendonvinhan":
                comparator = Comparator.comparing(
                    item -> item.getTenDonViNhan() != null ? item.getTenDonViNhan() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
        }
        
        if (comparator == null) {
            // Default to ngayCapNhat
            comparator = Comparator.comparing(
                item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
            );
        }
        
        return ascending ? comparator : comparator.reversed();
    }

    public BanGiaoCCDCVatTu findById(String id) {
        return dao.findById(id);
    }

    public BanGiaoCCDCVatTu insert(BanGiaoCCDCVatTu obj) {
        return dao.insert(obj);
    }

    public BanGiaoCCDCVatTu update(BanGiaoCCDCVatTu obj) {
        return dao.update(obj);
    }

    public int delete(String id) {
        return dao.delete(id);
    }

    public int updateTrangThai(String id, String userId) {
        return dao.updateTrangThai(id, userId);
    }

    public int huyTrangThai(String id) {
        return dao.huyTrangThai(id);
    }

    /**
     * Kiểm tra xem có phải lượt ký của user không
     * Thứ tự ký:
     * 1. Đại diện bên giao (check userId với IdDaiDienBenGiao)
     * 2. Đại diện bên nhận (sau khi DaiDienBenGiaoXacNhan = true)
     * 3. NguoiKy từ bảng NguoiKy (sau khi DaiDienBenNhanXacNhan = true)
     * 4. Giám đốc ký (sau khi toàn bộ NguoiKy TrangThai = 1)
     *
     * Điều kiện:
     * - Share phải = true để hiển thị phiếu
     * - Admin và NguoiTao luôn được xem
     * - Người đã hoàn thành bước của mình vẫn hiển thị
     *
     * Ngoại lệ:
     * - userId = "admin" → lấy hết
     * - userId = NguoiTao → lấy không phân biệt thứ tự
     */
    public boolean isUserTurnToSign(BanGiaoCCDCVatTuDTO item, String userId) {
        // Admin lấy hết
        if ("admin".equalsIgnoreCase(userId)) {
            return true;
        }

        // Người tạo luôn được xem
        if (userId != null && userId.equals(item.getNguoiTao())) {
            return true;
        }

        // Kiểm tra điều kiện Share = true (trừ admin và người tạo)
        if (!Boolean.TRUE.equals(item.getShare())) {
            return false;
        }

        // Bước 1: Đại diện bên giao
        if (!Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan())) {
            // Chỉ đại diện bên giao mới thấy
            return userId != null && userId.equals(item.getIdDaiDienBenGiao());
        }
        // Đại diện bên giao đã ký vẫn được xem
        if (userId != null && userId.equals(item.getIdDaiDienBenGiao())) {
            return true;
        }

        // Bước 2: Đại diện bên nhận (sau khi bên giao đã ký)
        if (Boolean.TRUE.equals(item.getDaiDienBenGiaoXacNhan()) && !Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())) {
            // Chỉ đại diện bên nhận mới thấy
            return userId != null && userId.equals(item.getIdDaiDienBenNhan());
        }
        // Đại diện bên nhận đã ký vẫn được xem
        if (Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())
            && userId != null && userId.equals(item.getIdDaiDienBenNhan())) {
            return true;
        }

        // Bước 3: NguoiKy từ bảng NguoiKy (sau khi bên nhận đã ký) - ký theo thứ tự
        if (Boolean.TRUE.equals(item.getDaiDienBenNhanXacNhan())) {
            // Lấy danh sách người ký theo IdTaiLieu
            List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());

            if (nguoiKyList != null && !nguoiKyList.isEmpty()) {
                // Tìm người ký đầu tiên chưa ký (theo thứ tự trong danh sách)
                NguoiKy firstUnsignedNguoiKy = null;
                boolean allNguoiKySigned = true;

                for (NguoiKy nguoiKy : nguoiKyList) {
                    if (nguoiKy.getTrangThai() != 1) {
                        allNguoiKySigned = false;
                        if (firstUnsignedNguoiKy == null) {
                            firstUnsignedNguoiKy = nguoiKy;
                        }
                    }
                }

                // Kiểm tra xem user có phải là người ký trong danh sách không
                boolean isUserInNguoiKyList = false;
                boolean userAlreadySigned = false;
                for (NguoiKy nguoiKy : nguoiKyList) {
                    if (userId != null && userId.equals(nguoiKy.getIdNguoiKy())) {
                        isUserInNguoiKyList = true;
                        if (nguoiKy.getTrangThai() == 1) {
                            userAlreadySigned = true;
                        }
                        break;
                    }
                }

                // Nếu user đã ký rồi thì vẫn hiển thị
                if (userAlreadySigned) {
                    return true;
                }

                // Chỉ người ký tiếp theo (đầu tiên chưa ký) mới thấy
                if (firstUnsignedNguoiKy != null && isUserInNguoiKyList) {
                    if (userId != null && userId.equals(firstUnsignedNguoiKy.getIdNguoiKy())) {
                        return true;
                    }
                }

                // Bước 4: Giám đốc ký (sau khi tất cả NguoiKy đã ký)
                if (allNguoiKySigned && !Boolean.TRUE.equals(item.getGiamDocKy())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdGiamDoc());
                }
                // Giám đốc đã ký vẫn được xem
                if (Boolean.TRUE.equals(item.getGiamDocKy())
                    && userId != null && userId.equals(item.getIdGiamDoc())) {
                    return true;
                }
            } else {
                // Không có người ký nào trong danh sách, chuyển thẳng sang Giám đốc
                if (!Boolean.TRUE.equals(item.getGiamDocKy())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdGiamDoc());
                }
                // Giám đốc đã ký vẫn được xem
                if (Boolean.TRUE.equals(item.getGiamDocKy())
                    && userId != null && userId.equals(item.getIdGiamDoc())) {
                    return true;
                }
            }
        }

        return false;
    }

    public List<BanGiaoCCDCVatTu> readCsv(MultipartFile file) throws IOException {
        List<BanGiaoCCDCVatTu> list = new ArrayList<>();

        // Sử dụng InputStreamReader với UTF-8
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true; // bỏ qua header
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] fields = line.split(",", -1); // giữ giá trị rỗng
                BanGiaoCCDCVatTu ts = BanGiaoCCDCVatTu.mapToBanGiaoCCDCVatTu(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<BanGiaoCCDCVatTu> readExcel(MultipartFile file) throws IOException {
        List<BanGiaoCCDCVatTu> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            BanGiaoCCDCVatTu ts = BanGiaoCCDCVatTu.mapToBanGiaoCCDCVatTu(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }
}
