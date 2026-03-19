package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.dao.ChiTietDieuDongTaiSanDao;
import com.ecotel.quanlytaisan.dao.DieuDongTaiSanDao;
import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
import com.ecotel.quanlytaisan.dao.NhanVienDao;
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

@Service
public class DieuDongTaiSanService {
    @Autowired
    private final DieuDongTaiSanDao dao;
    @Autowired
    private NhanVienDao nhanVienDao;
    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    ChiTietDieuDongTaiSanDao chiTietDieuDongTaiSanDao;

    @Autowired
    private PhongBanService phongBanService;

    @Autowired
    private NhanVienService nhanVienService;

    @Autowired
    private ChucVuService chucVuService;

    public DieuDongTaiSanService() {
        this.dao = new DieuDongTaiSanDao();
    }

    public List<DieuDongTaiSanDTO> findAll(String idCongTy) throws SQLException {
        return dao.findAll(idCongTy);
    }

    public PageResponse<DieuDongTaiSanDTO> findAllPaged(String idCongTy, int page, int size, String sortBy, String sortDir, String search, Integer loai, String userid, Integer trangThai, String idDonViGiao, Boolean chuaBanGiaoHet) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;
        List<DieuDongTaiSanDTO> sourceList;
        sourceList = findAll(idCongTy);

        // Filter theo lượt ký - chỉ lấy những item mà đến lượt user ký
        // Ngoại lệ: admin lấy hết, NguoiTao cũng lấy không phân biệt thứ tự
        if (userid != null && !userid.trim().isEmpty()) {
            boolean skipFilter = false;

            // 1. Admin luôn lấy hết
            if ("admin".equalsIgnoreCase(userid)) {
                skipFilter = true;
            } else {
                // 2. Kiểm tra quyền ban hành quyết định
                try {
                    NhanVien nv = nhanVienService.findEntityById(userid);
                    if (nv != null && nv.getChucVu() != null) {
                        ChucVu cv = chucVuService.findById(nv.getChucVu());
                        if (cv != null && Boolean.TRUE.equals(cv.getBanHanhQuyetDinh())) {
                            skipFilter = true;
                        }
                    }
                } catch (Exception e) {
                    // Log lỗi nếu cần, nhưng không làm gián đoạn – coi như không có quyền đặc biệt
                }
            }

            // Nếu không được bỏ qua, mới áp dụng lọc theo lượt ký
            if (!skipFilter) {
                List<DieuDongTaiSanDTO> turnFiltered = new ArrayList<>();
                for (DieuDongTaiSanDTO item : sourceList) {
                    if (isUserTurnToSign(item, userid)) {
                        turnFiltered.add(item);
                    }
                }
                sourceList = turnFiltered;
            }
        }

        // Filter by chuaBanGiaoHet - chỉ lấy những phiếu chưa bàn giao hết tài sản
        if (Boolean.TRUE.equals(chuaBanGiaoHet)) {
            Set<String> idsChuaBanGiaoHet = dao.getIdsChuaBanGiaoHet(idCongTy);
            List<DieuDongTaiSanDTO> chuaBanGiaoHetFiltered = new ArrayList<>();
            for (DieuDongTaiSanDTO item : sourceList) {
                if (item != null && idsChuaBanGiaoHet.contains(item.getId())) {
                    chuaBanGiaoHetFiltered.add(item);
                }
            }
            sourceList = chuaBanGiaoHetFiltered;
        }

        // Filter by idDonViGiao if provided
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            // 1. Kiểm tra đơn vị truyền vào có phải là Kho Loại 1 hay không
            PhongBanDTO phongBanTarget = phongBanService.getById(idDonViGiao);
            boolean isKhoLoai1Target = phongBanTarget != null
                    && Boolean.TRUE.equals(phongBanTarget.getIsKho())
                    && Integer.valueOf(1).equals(phongBanTarget.getLoaiKho());

            List<DieuDongTaiSanDTO> donViGiaoFiltered = new ArrayList<>();

            if (isKhoLoai1Target) {
                // 2. Nếu là Kho Loại 1: Lấy tất cả các phiếu mà đơn vị giao cũng là Kho Loại 1
                for (DieuDongTaiSanDTO item : sourceList) {
                    PhongBanDTO pbItem = phongBanService.getById(item.getIdDonViGiao());
                    if (pbItem != null
                            && Boolean.TRUE.equals(pbItem.getIsKho())
                            && Integer.valueOf(1).equals(pbItem.getLoaiKho())) {
                        donViGiaoFiltered.add(item);
                    }
                }
            } else {
                // 3. Nếu không phải Kho Loại 1: Lọc chính xác theo ID đơn vị như cũ
                for (DieuDongTaiSanDTO item : sourceList) {
                    if (idDonViGiao.equalsIgnoreCase(item.getIdDonViGiao())) {
                        donViGiaoFiltered.add(item);
                    }
                }
            }
            sourceList = donViGiaoFiltered;
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            List<DieuDongTaiSanDTO> filtered = new ArrayList<>();
            for (DieuDongTaiSanDTO item : sourceList) {
                if (item != null && item.toString() != null && item.toString().toLowerCase().contains(q)) {
                    filtered.add(item);
                }
            }
            sourceList = filtered;
        }

        // Filter by loai
        if (loai != null) {
            List<DieuDongTaiSanDTO> loaiFiltered = new ArrayList<>();
            for (DieuDongTaiSanDTO item : sourceList) {
                if (item != null && item.getLoai() != null && item.getLoai().equals(loai)) {
                    loaiFiltered.add(item);
                }
            }
            sourceList = loaiFiltered;
        }

        // --- TÍNH TOÁN COUNTS (Trước khi lọc trạng thái) ---
        Map<String, Long> loaiCounts = new java.util.HashMap<>();
        Map<String, Long> trangThaiCounts = new java.util.HashMap<>();

        for (DieuDongTaiSanDTO item : sourceList) {
            if (item != null) {
                // Tính loaiCounts (đếm tổng quát)
                if (item.getLoai() != null) {
                    String key = item.getLoai().toString();
                    loaiCounts.put(key, loaiCounts.getOrDefault(key, 0L) + 1);
                }
                // Tính trangThaiCounts
                if (item.getTrangThai() != null) {
                    String key = item.getTrangThai().toString();
                    trangThaiCounts.put(key, trangThaiCounts.getOrDefault(key, 0L) + 1);
                }
            }
        }

        // Filter by trangThaiPhieu if trangThai != 4
        if (trangThai != null && trangThai != 5) {
            List<DieuDongTaiSanDTO> trangThaiFiltered = new ArrayList<>();
            for (DieuDongTaiSanDTO item : sourceList) {
                if (item != null && item.getTrangThai() != null && item.getTrangThai().equals(trangThai)) {
                    trangThaiFiltered.add(item);
                }
            }
            sourceList = trangThaiFiltered;
        }

        // Apply sorting
        sourceList.sort(getComparator(sortBy, sortDir));

        long total = sourceList.size();
        int from = Math.min(page * size, sourceList.size());
        int to = Math.min(from + size, sourceList.size());
        List<DieuDongTaiSanDTO> items = sourceList.subList(from, to);

        for (DieuDongTaiSanDTO item : items) {
            item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
            item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));

            List<ChiTietDieuDongTaiSanDTO> chiTietList;
            if (Boolean.TRUE.equals(chuaBanGiaoHet)) {
                // Lấy chỉ chi tiết chưa được bàn giao (DaBanGiao = false hoặc NULL)
                chiTietList = chiTietDieuDongTaiSanDao.findAllChuaBanGiao(item.getId());
            } else {
                chiTietList = chiTietDieuDongTaiSanDao.findAll(item.getId());
            }
            item.setChiTietDieuDongTaiSanDTOS(chiTietList);
        }

        PageResponse<DieuDongTaiSanDTO> response = new PageResponse<>(items, total, page, size);
        response.setLoaiCounts(loaiCounts);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    /**
     * Comparator for sorting DieuDongTaiSanDTO.
     * - If sortBy is null or empty: default sort by status priority (0,1,3,2) then creation date descending.
     * - Otherwise sort by the specified field and direction.
     */
    private Comparator<DieuDongTaiSanDTO> getComparator(String sortBy, String sortDir) {
        // Nếu không có sortBy, dùng sắp xếp mặc định: theo trạng thái ưu tiên, rồi ngày tạo giảm dần
        if (sortBy == null || sortBy.trim().isEmpty()) {
            Map<Integer, Integer> priorityMap = new HashMap<>();
            priorityMap.put(0, 1); // Nháp
            priorityMap.put(1, 2); // Duyệt
            priorityMap.put(3, 3); // Hoàn thành
            priorityMap.put(2, 4); // Hủy

            Comparator<DieuDongTaiSanDTO> comparator = Comparator.comparingInt(
                    item -> priorityMap.getOrDefault(item.getTrangThai(), 5)
            );

            // Sau đó so sánh theo ngày tạo (mới nhất trước)
            comparator = comparator.thenComparing(
                    item -> item.getNgayTao() != null ? item.getNgayTao() : "",
                    Comparator.nullsLast(Comparator.reverseOrder())
            );
            return comparator;
        }

        // Nếu có sortBy, xử lý như cũ
        String normalizedSortBy = sortBy.trim().toLowerCase();
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");

        Comparator<DieuDongTaiSanDTO> comparator = null;

        switch (normalizedSortBy) {
            case "tenphieu":
                comparator = Comparator.comparing(
                        item -> item.getTenPhieu() != null ? item.getTenPhieu() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
                );
                break;
            case "soquyetdinh":
                comparator = Comparator.comparing(
                        item -> item.getSoQuyetDinh() != null ? item.getSoQuyetDinh() : "",
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
            comparator = Comparator.comparing(
                    item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
            );
        }

        return ascending ? comparator : comparator.reversed();
    }

    public List<DieuDongTaiSanDTO> findByUserId(String userId) throws SQLException {
        return dao.findByUserId(userId);
    }


    public DieuDongTaiSan findById(String id) throws SQLException {
        return dao.findById(id);
    }

    public DieuDongTaiSanDTO findByIdDTO(String id) throws SQLException {
        return dao.findByIdDTO(id);
    }

    public DieuDongTaiSan insert(DieuDongTaiSan obj) throws SQLException {
        return dao.insert(obj);
    }

    public DieuDongTaiSan update(DieuDongTaiSan obj) throws SQLException {
        return dao.update(obj);
    }

    public int delete(String id) throws SQLException {
        return dao.delete(id);
    }

    public int updateTrangThaiBanGiao(String id, boolean daBanGiao) {
        return dao.updateTrangThaiBanGiao(id, daBanGiao);
    }

    public int updateTrangThai(String id, String userId) {
        return dao.updateTrangThai(id, userId);
    }

    public int[] banHanhQuyetDinh(List<BanHanhRequest> requests) {
        return dao.banHanhQuyetDinh(requests);
    }

    public int huyTrangThai(String id) {
        return dao.huyDieuDong(id);
    }

    public List<DieuDongTaiSan> readCsv(MultipartFile file) throws IOException {
        List<DieuDongTaiSan> list = new ArrayList<>();

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
                DieuDongTaiSan ts = DieuDongTaiSan.mapToDieuDongTaiSan(fields); // map từ CSV sang object
                list.add(ts);
            }
        }
        return list;
    }


    public List<DieuDongTaiSan> readExcel(MultipartFile file) throws IOException {
        List<DieuDongTaiSan> list = new ArrayList<>();
        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        boolean firstRow = true;
        for (Row row : sheet) {
            if (firstRow) { // bỏ qua header
                firstRow = false;
                continue;
            }
            DieuDongTaiSan ts = DieuDongTaiSan.mapToDieuDongTaiSan(row); // map từ Row sang object
            list.add(ts);
        }
        workbook.close();
        return list;
    }

    /**
     * Kiểm tra xem có phải lượt ký của user không
     * Thứ tự ký:
     * 1. Người lập phiếu ký nháy (nếu NguoiLapPhieuKyNhay = true, check userId với IdNguoiKyNhay)
     * 2. Người trình duyệt cấp phòng (sau khi TrangThaiKyNhay = true hoặc NguoiLapPhieuKyNhay = false)
     * 3. NguoiKy từ bảng NguoiKy (sau khi TrinhDuyetCapPhongXacNhan = true)
     * 4. Trình duyệt Giám đốc (sau khi tất cả NguoiKy đã ký)
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
    public boolean isUserTurnToSign(DieuDongTaiSanDTO item, String userId) {
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

        // Bước 1: Người lập phiếu ký nháy
        if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())) {
            // Nếu chưa ký nháy
            if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay())) {
                // Chỉ người ký nháy mới thấy
                return userId != null && userId.equals(item.getIdNguoiKyNhay());
            }
            // Người đã ký nháy vẫn được xem
            if (userId != null && userId.equals(item.getIdNguoiKyNhay())) {
                return true;
            }
        }

        // Bước 2: Người trình duyệt cấp phòng (sau khi ký nháy xong hoặc không cần ký nháy)
        boolean kyNhayDone = !Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay()) || Boolean.TRUE.equals(item.getTrangThaiKyNhay());
        if (kyNhayDone && !Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
            // Chỉ người trình duyệt cấp phòng mới thấy
            return userId != null && userId.equals(item.getIdTrinhDuyetCapPhong());
        }
        // Người cấp phòng đã duyệt vẫn được xem
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())
                && userId != null && userId.equals(item.getIdTrinhDuyetCapPhong())) {
            return true;
        }

        // Bước 3: NguoiKy từ bảng NguoiKy (sau khi cấp phòng duyệt) - ký theo thứ tự
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
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

                // Bước 4: Trình duyệt Giám đốc (sau khi tất cả NguoiKy đã ký)
                if (allNguoiKySigned && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
                }
                // Giám đốc đã duyệt vẫn được xem
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                        && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc())) {
                    return true;
                }
            } else {
                // Không có người ký nào trong danh sách, chuyển thẳng sang Giám đốc
                if (!Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                    // Chỉ Giám đốc mới thấy
                    return userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc());
                }
                // Giám đốc đã duyệt vẫn được xem
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
                        && userId != null && userId.equals(item.getIdTrinhDuyetGiamDoc())) {
                    return true;
                }
            }
        }

        return false;
    }

    public int getPermissionSigning(DieuDongTaiSanDTO item, String tenDangNhap) {
        List<Map<String, Object>> signatureFlow = new ArrayList<>();

        // Người lập phiếu
        if (Boolean.TRUE.equals(item.getNguoiLapPhieuKyNhay())) {
            Map<String, Object> step = new HashMap<>();
            step.put("id", item.getIdNguoiKyNhay());
            step.put("signed", Boolean.TRUE.equals(item.getTrangThaiKyNhay()));
            String hoTenNguoiLap = "";
            NhanVienDTO nv = nhanVienDao.findById(item.getIdNguoiKyNhay() != null ? item.getIdNguoiKyNhay() : "");
            if (nv != null) hoTenNguoiLap = nv.getHoTen();
            step.put("label", "Người lập phiếu: " + hoTenNguoiLap);
            signatureFlow.add(step);
        }

        // Người duyệt cấp phòng
        if (item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()) {
            Map<String, Object> step = new HashMap<>();
            step.put("id", item.getIdTrinhDuyetCapPhong());
            step.put("signed", Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan()));
            step.put("label", "Người duyệt: " + item.getTenTrinhDuyetCapPhong());
            signatureFlow.add(step);
        }
        List<NguoiKy> kyTaiLieuList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
        // Danh sách người ký
        if (kyTaiLieuList != null) {
            for (int i = 0; i < kyTaiLieuList.size(); i++) {
                NguoiKy sign = kyTaiLieuList.get(i);
                if (sign.getIdNguoiKy() != null && !sign.getIdNguoiKy().isEmpty()) {
                    Map<String, Object> step = new HashMap<>();
                    step.put("id", sign.getIdNguoiKy());
                    step.put("signed", sign.getTrangThai() == 1);
                    step.put("label", "Người ký " + (i + 1) + ": " + sign.getTenNguoiKy());
                    signatureFlow.add(step);
                }
            }
        }

        // Người phê duyệt (Giám đốc)
        if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
            Map<String, Object> step = new HashMap<>();
            step.put("id", item.getIdTrinhDuyetGiamDoc());
            step.put("signed", Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()));
            step.put("label", "Người phê duyệt: " + item.getTenTrinhDuyetGiamDoc());
            signatureFlow.add(step);
        }

        // Lọc ra những bước có ID hợp lệ
        signatureFlow = signatureFlow.stream().filter(s -> s.get("id") != null && !((String) s.get("id")).isEmpty()).collect(java.util.stream.Collectors.toList());

        // Tìm vị trí người dùng hiện tại
        int currentIndex = -1;
        for (int i = 0; i < signatureFlow.size(); i++) {
            if (Objects.equals(signatureFlow.get(i).get("id"), tenDangNhap)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex == -1) return 2; // Không nằm trong flow ký

        Object signedObj = signatureFlow.get(currentIndex).get("signed");
        boolean signed = signedObj instanceof Boolean && (Boolean) signedObj;

        // Người tạo
        if (Objects.equals(item.getNguoiTao(), tenDangNhap) && signedObj != null) {
            return signed ? 4 : 5;
        }

        // Đã ký
        if (signed) return 3;

        // Kiểm tra nếu có ai trước đó chưa ký
        boolean previousNotSigned = signatureFlow.subList(0, currentIndex).stream().anyMatch(s -> Boolean.FALSE.equals(s.get("signed")));
        if (previousNotSigned) return 1;

        // Có thể ký
        return 0;

    }

    /**
     * Đếm số lượng DieuDongTaiSan theo TrangThai và IdDonViGiao
     */
    public long countByTrangThaiAndDonViGiao(int trangThai, String idDonViGiao) {
        return dao.countByTrangThaiAndDonViGiao(trangThai, idDonViGiao);
    }

    /**
     * Lấy danh sách DieuDongTaiSan (loại Điều động) đã hoàn thành nhưng chưa bàn giao hết tài sản
     */
    public List<DieuDongTaiSanDTO> findAllChuaBanGiaoHet(String idCongTy) {
        return dao.findAllChuaBanGiaoHet(idCongTy);
    }

}