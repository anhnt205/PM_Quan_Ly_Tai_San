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
    private SuaChuaChiTietTaiSanDao taiSanSuaChuaDao;

    @Autowired
    private SuaChuaVatTuTieuHaoDao vattuSuaChuaDao;

    @Autowired
    private KetQuaSuaChuaDao ketQuaSuaChuaDao;

    @Autowired
    private KyTaiLieuDao kyTaiLieuDao;

    @Autowired
    private NhanVienDao nhanVienDao;

    @Autowired
    private KeHoachSuaChuaDao keHoachSuaChuaDao; // Thêm DAO cho kế hoạch

    public List<SuaChuaDTO> findAll(String idCongTy) throws SQLException {
        List<SuaChuaDTO> list = suaChuaDao.findAll(idCongTy);
        for (SuaChuaDTO dto : list) {
            List<SuaChuaChiTietTaiSan> taisan = taiSanSuaChuaDao.findByIdSuaChua(dto.getId());
            dto.setDanhSachTaiSan(taisan);
            List<SuaChuaVatTuTieuHao> vattu = vattuSuaChuaDao.findByIdSuaChua(dto.getId());
            dto.setDanhSachTaiSan(taisan);
            // Lấy danh sách chữ ký nếu cần
            dto.setChuKyList(kyTaiLieuDao.findById(dto.getId()));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(dto.getId()));
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
            String idDonViNhan,
            String idKeHoach,
            Integer trangThai
    ) throws SQLException {
        if (page < 0) page = 0;
        if (size <= 0) size = 20;

        List<SuaChuaDTO> sourceList = findAll(idCongTy);

        // Lọc theo quyền ký
        if (userId != null && !userId.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> isUserTurnToSign(item, userId))
                    .collect(Collectors.toList());
        }

        // Lọc theo idDonViGiao - không phân biệt hoa/thường
        if (idDonViGiao != null && !idDonViGiao.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> equalsIgnoreCase(item.getIdDonViGiao(), idDonViGiao))
                    .collect(Collectors.toList());
        }

        // Lọc theo idDonViNhan - không phân biệt hoa/thường
        if (idDonViNhan != null && !idDonViNhan.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> equalsIgnoreCase(item.getIdDonViNhan(), idDonViNhan))
                    .collect(Collectors.toList());
        }

        // Lọc theo loai
        if (loai != null) {
            sourceList = sourceList.stream()
                    .filter(item -> loai.equals(item.getLoai()))
                    .collect(Collectors.toList());
        }

        // Lọc theo idKeHoach - không phân biệt hoa/thường
        if (idKeHoach != null && !idKeHoach.trim().isEmpty()) {
            sourceList = sourceList.stream()
                    .filter(item -> equalsIgnoreCase(item.getIdKeHoach(), idKeHoach))
                    .collect(Collectors.toList());
        }

        // Lọc theo search text - không phân biệt hoa/thường
        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            sourceList = sourceList.stream()
                    .filter(item ->
                            (item.getMaSuaChua() != null && item.getMaSuaChua().toLowerCase().contains(q)) ||
                                    (item.getTenSuaChua() != null && item.getTenSuaChua().toLowerCase().contains(q)) ||
                                    (item.getTenDonViGiao() != null && item.getTenDonViGiao().toLowerCase().contains(q)) ||
                                    (item.getTenDonViNhan() != null && item.getTenDonViNhan().toLowerCase().contains(q))
                    )
                    .collect(Collectors.toList());
        }

        // Tính số lượng theo từng trạng thái TRƯỚC khi lọc trangThai
        Map<String, Long> trangThaiCounts = new HashMap<>();
        trangThaiCounts.put("nhap",      sourceList.stream().filter(i -> Integer.valueOf(0).equals(i.getTrangThai())).count());
        trangThaiCounts.put("choDuyet",  sourceList.stream().filter(i -> Integer.valueOf(1).equals(i.getTrangThai())).count());
        trangThaiCounts.put("huy",       sourceList.stream().filter(i -> Integer.valueOf(2).equals(i.getTrangThai())).count());
        trangThaiCounts.put("hoanThanh", sourceList.stream().filter(i -> Integer.valueOf(3).equals(i.getTrangThai())).count());
        trangThaiCounts.put("tatCa",     (long) sourceList.size());

        // Lọc theo trạng thái SAU khi đã đếm
        if (trangThai != null) {
            sourceList = sourceList.stream()
                    .filter(item -> trangThai.equals(item.getTrangThai()))
                    .collect(Collectors.toList());
        }

        // Tính số lượng theo loại
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
        int to   = Math.min(from + size, sourceList.size());
        List<SuaChuaDTO> items = sourceList.subList(from, to);

        for (SuaChuaDTO item : items) {
            item.setDanhSachTaiSan(taiSanSuaChuaDao.findByIdSuaChua(item.getId()));
            item.setDanhSachVatTu(vattuSuaChuaDao.findByIdSuaChua(item.getId()));
            item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
            item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
        }

        PageResponse<SuaChuaDTO> response = new PageResponse<>(items, total, page, size);
        response.setGroupCounts(groupCounts);
        response.setTrangThaiCounts(trangThaiCounts);
        return response;
    }

    public boolean isAllTaiSanDaSua(String idSuaChua) throws SQLException {
        // Kiểm tra phiếu tồn tại và trạng thái = 3
        SuaChuaDTO dto = findByIdDTO(idSuaChua);
        if (dto == null || dto.getTrangThai() == null || dto.getTrangThai() != 3) {
            return false;
        }
        int chuaSua = taiSanSuaChuaDao.countChuaSuaByIdSuaChua(idSuaChua);
        return chuaSua == 0;
    }

    // Helper method dùng chung
    private boolean equalsIgnoreCase(String a, String b) {
        if (a == null || b == null) return false;
        return a.trim().equalsIgnoreCase(b.trim());
    }

    private Comparator<SuaChuaDTO> getComparator(String sortBy, String sortDir) {
        String normalizedSortBy = sortBy != null ? sortBy.trim().toLowerCase() : "ngaytao";
        boolean ascending = sortDir != null && sortDir.equalsIgnoreCase("asc");

        Comparator<SuaChuaDTO> comparator;

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
                comparator = Comparator.comparing(item -> item.getNgayTao() != null ? item.getNgayTao() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "ngaycapnhat":
                comparator = Comparator.comparing(item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
            case "trangthai":
                comparator = Comparator.comparing(item -> item.getTrangThai() != null ? item.getTrangThai() : 0,
                        Comparator.nullsLast(Integer::compareTo));
                break;
            case "tendonvigiao":
                comparator = Comparator.comparing(item -> item.getTenDonViGiao() != null ? item.getTenDonViGiao() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            case "tendonvinhan":
                comparator = Comparator.comparing(item -> item.getTenDonViNhan() != null ? item.getTenDonViNhan() : "",
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
                break;
            default:
                comparator = Comparator.comparing(item -> item.getNgayCapNhat() != null ? item.getNgayCapNhat() : new Date(0),
                        Comparator.nullsLast(Date::compareTo));
                break;
        }

        return ascending ? comparator : comparator.reversed();
    }

    public List<SuaChuaDTO> getByUserId(String userId) throws SQLException {
        List<SuaChuaDTO> all = suaChuaDao.findAll(null);
        return all.stream()
                .filter(item -> isUserTurnToSign(item, userId))
                .peek(item -> {
                     item.setDanhSachTaiSan(taiSanSuaChuaDao.findByIdSuaChua(item.getId()));
                    item.setDanhSachVatTu(vattuSuaChuaDao.findByIdSuaChua(item.getId()));
                })
                .collect(Collectors.toList());
    }

    public List<SuaChuaDTO> getByLoai(int loai) throws SQLException {
        List<SuaChuaDTO> all = findAll(null);
        return all.stream()
                .filter(item -> item.getLoai() != null && item.getLoai() == loai)
                .peek(item -> {
                     item.setDanhSachTaiSan(taiSanSuaChuaDao.findByIdSuaChua(item.getId()));
                    item.setDanhSachVatTu(vattuSuaChuaDao.findByIdSuaChua(item.getId()));
                })
                .collect(Collectors.toList());
    }

    public SuaChua findById(String id) throws SQLException {
        return suaChuaDao.findById(id);
    }

    public SuaChuaDTO findByIdDTO(String id) throws SQLException {
        SuaChuaDTO dto = suaChuaDao.findByIdDTO(id);
        if (dto != null) {
             dto.setDanhSachTaiSan(taiSanSuaChuaDao.findByIdSuaChua(id));
            dto.setDanhSachVatTu(vattuSuaChuaDao.findByIdSuaChua(id));
            dto.setChuKyList(kyTaiLieuDao.findById(id));
            dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id));
        }
        return dto;
    }

    public SuaChua insert(SuaChua obj) throws SQLException {
        // Kiểm tra kế hoạch tồn tại nếu có
        if (obj.getIdKeHoach() != null && !obj.getIdKeHoach().isEmpty()) {
            KeHoachSuaChua keHoach = keHoachSuaChuaDao.findById(obj.getIdKeHoach());
            if (keHoach == null) {
                throw new IllegalArgumentException("Kế hoạch sửa chữa với ID " + obj.getIdKeHoach() + " không tồn tại");
            }
        }
        return suaChuaDao.insert(obj);
    }

    public SuaChua update(SuaChua obj) throws SQLException {
        // Kiểm tra kế hoạch tồn tại nếu có
        if (obj.getIdKeHoach() != null && !obj.getIdKeHoach().isEmpty()) {
            KeHoachSuaChua keHoach = keHoachSuaChuaDao.findById(obj.getIdKeHoach());
            if (keHoach == null) {
                throw new IllegalArgumentException("Kế hoạch sửa chữa với ID " + obj.getIdKeHoach() + " không tồn tại");
            }
        }
        return suaChuaDao.update(obj);
    }

    public int delete(String id) throws SQLException {
        vattuSuaChuaDao.deleteByIdSuaChua(id);
        taiSanSuaChuaDao.deleteByIdSuaChua(id);
        return suaChuaDao.delete(id);
    }

    // bulk operations
    public void bulkInsert(List<SuaChua> list) {
        suaChuaDao.batchInsert(list);
    }

    public void bulkUpdate(List<SuaChua> list) {
        suaChuaDao.batchUpdate(list);
    }

    public void bulkDelete(List<String> ids) {
        suaChuaDao.batchDelete(ids);
    }

    // ==================== CÁC PHƯƠNG THỨC XỬ LÝ KÝ DUYỆT ====================

    public int updateTrangThaiKy(String id, String userId) {
        return suaChuaDao.updateTrangThaiKy(id, userId);
    }

    public int huyTrangThai(String id) {
        return suaChuaDao.huyTrangThai(id);
    }

    public int updateKyNhay(String id, String userId) {
        return suaChuaDao.updateTrangThai(id, userId); // Dùng chung logic
    }

    public int updateNguoiLapPhieuKyNhay(String id) {
        // Có thể cần method riêng, tạm để 0
        return 0;
    }

    public int updateDuyetCapPhong(String id, String userId, boolean xacNhan) {
        SuaChua sc = suaChuaDao.findById(id);
        if (sc != null && userId.equals(sc.getIdTrinhDuyetCapPhong())) {
            sc.setTrinhDuyetCapPhongXacNhan(xacNhan);
            suaChuaDao.update(sc);
            return 1;
        }
        return 0;
    }

    public int updateDuyetGiamDoc(String id, String userId, boolean xacNhan) {
        SuaChua sc = suaChuaDao.findById(id);
        if (sc != null && userId.equals(sc.getIdTrinhDuyetGiamDoc())) {
            sc.setTrinhDuyetGiamDocXacNhan(xacNhan);
            suaChuaDao.update(sc);
            return 1;
        }
        return 0;
    }

    public boolean isUserTurnToSign(SuaChuaDTO item, String userId) {
        if ("admin".equalsIgnoreCase(userId)) return true;
        if (userId != null && userId.equals(item.getNguoiTao())) return true;
        if (!Boolean.TRUE.equals(item.getShare())) return false;

        // Bước 1: Người ký nháy
        if (item.getIdNguoiKyNhay() != null && !item.getIdNguoiKyNhay().isEmpty()) {
            if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay())) {
                return userId.equals(item.getIdNguoiKyNhay());
            }
            if (userId.equals(item.getIdNguoiKyNhay())) return true;
        }

        // Bước 2: Duyệt cấp phòng
        boolean kyNhayDone = (item.getIdNguoiKyNhay() == null || item.getIdNguoiKyNhay().isEmpty()) || Boolean.TRUE.equals(item.getTrangThaiKyNhay());
        if (kyNhayDone && item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()
                && !Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
            return userId.equals(item.getIdTrinhDuyetCapPhong());
        }
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan()) && userId.equals(item.getIdTrinhDuyetCapPhong())) return true;

        // Bước 3: Người ký phụ
        if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
            List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
            if (nguoiKyList != null && !nguoiKyList.isEmpty()) {
                NguoiKy firstUnsigned = null;
                boolean allSigned = true;
                for (NguoiKy nk : nguoiKyList) {
                    if (nk.getTrangThai() != 1) {
                        allSigned = false;
                        if (firstUnsigned == null) firstUnsigned = nk;
                    }
                }
                for (NguoiKy nk : nguoiKyList) {
                    if (userId.equals(nk.getIdNguoiKy()) && nk.getTrangThai() == 1) return true;
                }
                if (!allSigned && firstUnsigned != null) {
                    return userId.equals(firstUnsigned.getIdNguoiKy());
                }
                // Bước 4: Giám đốc
                if (allSigned && item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()
                        && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                    return userId.equals(item.getIdTrinhDuyetGiamDoc());
                }
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()) && userId.equals(item.getIdTrinhDuyetGiamDoc())) return true;
            } else {
                if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()
                        && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
                    return userId.equals(item.getIdTrinhDuyetGiamDoc());
                }
                if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan()) && userId.equals(item.getIdTrinhDuyetGiamDoc())) return true;
            }
        }
        return false;
    }

    public int getPermissionSigning(SuaChuaDTO item, String userId) {
        List<Map<String, Object>> flow = new ArrayList<>();

        if (item.getIdNguoiKyNhay() != null && !item.getIdNguoiKyNhay().isEmpty()) {
            flow.add(Map.of("id", item.getIdNguoiKyNhay(), "signed", item.getTrangThaiKyNhay()));
        }
        if (item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()) {
            flow.add(Map.of("id", item.getIdTrinhDuyetCapPhong(), "signed", item.getTrinhDuyetCapPhongXacNhan()));
        }
        List<NguoiKy> extra = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
        if (extra != null) {
            for (NguoiKy nk : extra) {
                flow.add(Map.of("id", nk.getIdNguoiKy(), "signed", nk.getTrangThai() == 1));
            }
        }
        if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
            flow.add(Map.of("id", item.getIdTrinhDuyetGiamDoc(), "signed", item.getTrinhDuyetGiamDocXacNhan()));
        }

        int index = -1;
        for (int i = 0; i < flow.size(); i++) {
            if (userId.equals(flow.get(i).get("id"))) {
                index = i;
                break;
            }
        }
        if (index == -1) return 2;
        boolean signed = (Boolean) flow.get(index).get("signed");
        if (signed) return 3;
        for (int i = 0; i < index; i++) {
            if (!(Boolean) flow.get(i).get("signed")) return 1;
        }
        return 0;
    }

    public int updateTrangThai(String id, String userId) {
        return suaChuaDao.updateTrangThai(id, userId);
    }

    // ==================== IMPORT ====================

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
}