// package com.ecotel.quanlytaisan.service;

// import com.ecotel.quanlytaisan.dao.KetQuaSuaChuaDao;
// import com.ecotel.quanlytaisan.dao.KyTaiLieuDao;
// import com.ecotel.quanlytaisan.dao.NhanVienDao;
// import com.ecotel.quanlytaisan.model.*;
// import org.apache.poi.ss.usermodel.Row;
// import org.apache.poi.ss.usermodel.Sheet;
// import org.apache.poi.ss.usermodel.Workbook;
// import org.apache.poi.ss.usermodel.WorkbookFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.BufferedReader;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.nio.charset.StandardCharsets;
// import java.text.SimpleDateFormat;
// import java.time.LocalDateTime;
// import java.time.format.DateTimeFormatter;
// import java.util.*;
// import java.util.stream.Collectors;

// @Service
// public class KetQuaSuaChuaService {

//     @Autowired
//     private KetQuaSuaChuaDao ketQuaSuaChuaDao;

//     @Autowired
//     private ChiTietKetQuaSuaChuaDao chiTietKetQuaSuaChuaDao;
//     @Autowired
//     private ChiTietKetQuaSuaChuaDao chiTietKetQuaSuaChuaDao;

//     @Autowired
//     private KyTaiLieuDao kyTaiLieuDao;

//     @Autowired
//     private NhanVienDao nhanVienDao;

//     // ==================== CÁC PHƯƠNG THỨC CRUD CƠ BẢN ====================

//     public KetQuaSuaChuaDTO findByIdSuaChua(String idSuaChua) {
//         KetQuaSuaChuaDTO dto = ketQuaSuaChuaDao.findByIdSuaChua(idSuaChua);
//         if (dto != null) {
//             dto.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(dto.getId()));
//             // Lấy danh sách chữ ký
//             dto.setChuKyList(kyTaiLieuDao.findById(dto.getId()));
//             dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(dto.getId()));
//         }
//         return dto;
//     }

//     public KetQuaSuaChua findById(String id) {
//         return ketQuaSuaChuaDao.findById(id);
//     }

//     public KetQuaSuaChuaDTO findByIdDTO(String id) {
//         // Bạn cần implement thêm phương thức này trong DAO nếu chưa có
//         // Tạm thời dùng cách khác
//         KetQuaSuaChua entity = ketQuaSuaChuaDao.findById(id);
//         if (entity == null) return null;

//         // Convert entity to DTO - cần implement method này
//         KetQuaSuaChuaDTO dto = convertToDTO(entity);
//         if (dto != null) {
//             dto.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(id));
//             dto.setChuKyList(kyTaiLieuDao.findById(id));
//             dto.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(id));
//         }
//         return dto;
//     }

//     // Helper method để convert entity to DTO
//     private KetQuaSuaChuaDTO convertToDTO(KetQuaSuaChua entity) {
//         if (entity == null) return null;
//         KetQuaSuaChuaDTO dto = new KetQuaSuaChuaDTO();
//         // Copy các trường cơ bản
//         dto.setId(entity.getId());
//         dto.setIdCongTy(entity.getIdCongTy());
//         dto.setMaSuaChua(entity.getMaSuaChua());
//         dto.setTenSuaChua(entity.getTenSuaChua());
//         dto.setMucDoSuCo(entity.getMucDoSuCo());
//         dto.setMucDoUuTien(entity.getMucDoUuTien());
//         dto.setIdDonViGiao(entity.getIdDonViGiao());
//         dto.setIdDonViNhan(entity.getIdDonViNhan());
//         dto.setIdNguoiKyNhay(entity.getIdNguoiKyNhay());
//         dto.setTrangThaiKyNhay(entity.getTrangThaiKyNhay());
//         dto.setNguoiLapPhieuKyNhay(entity.getNguoiLapPhieuKyNhay());
//         dto.setNgayKetThucDuKien(entity.getNgayKetThucDuKien());
//         dto.setIdTrinhDuyetCapPhong(entity.getIdTrinhDuyetCapPhong());
//         dto.setTrinhDuyetCapPhongXacNhan(entity.getTrinhDuyetCapPhongXacNhan());
//         dto.setIdTrinhDuyetGiamDoc(entity.getIdTrinhDuyetGiamDoc());
//         dto.setTrinhDuyetGiamDocXacNhan(entity.getTrinhDuyetGiamDocXacNhan());
//         dto.setIdDonViDeNghi(entity.getIdDonViDeNghi());
//         dto.setDuongDanFile(entity.getDuongDanFile());
//         dto.setTenFile(entity.getTenFile());
//         dto.setTaiLieuBanGhi(entity.getTaiLieuBanGhi());
//         dto.setByStep(entity.getByStep());
//         dto.setSoQuyetDinh(entity.getSoQuyetDinh());
//         dto.setNguoiTao(entity.getNguoiTao());
//         dto.setShare(entity.getShare());
//         dto.setNgayTao(entity.getNgayTao());
//         dto.setDaBanGiao(entity.getDaBanGiao());
//         dto.setCoPhieuBanGiao(entity.getCoPhieuBanGiao());
//         dto.setTaiLieuCuoi(entity.getTaiLieuCuoi());
//         dto.setLoai(entity.getLoai());
//         dto.setTrangThai(entity.getTrangThai());
//         dto.setIdKeHoach(entity.getIdKeHoach());
//         dto.setNgayCapNhat(entity.getNgayCapNhat());
//         dto.setIdLoaiSuaChua(entity.getIdLoaiSuaChua());
//         dto.setGhiChu(entity.getGhiChu());
//         dto.setIdSuaChua(entity.getIdSuaChua());
//         dto.setChiPhiPhanCong(entity.getChiPhiPhanCong());
//         dto.setChiPhiThueNgoai(entity.getChiPhiThueNgoai());
//         return dto;
//     }

//     public PageResponse<KetQuaSuaChuaDTO> findWithFilters(
//             String idCongTy,
//             Integer trangThai,
//             LocalDateTime fromDate,
//             LocalDateTime toDate,
//             String search,
//             String userId,
//             String idDonViGiao,  // <-- THÊM
//             int page,
//             int size) {

//         List<KetQuaSuaChuaDTO> allItems = ketQuaSuaChuaDao.findByFilters(
//                 idCongTy, trangThai, fromDate, toDate, idDonViGiao,  // <-- THÊM
//                 0, Integer.MAX_VALUE);

//         // Lọc theo quyền ký nếu có userId
//         if (userId != null && !userId.trim().isEmpty()) {
//             allItems = allItems.stream()
//                     .filter(item -> isUserTurnToSign(item, userId))
//                     .collect(Collectors.toList());
//         }

//         // Lọc theo search text
//         if (search != null && !search.trim().isEmpty()) {
//             String q = search.trim().toLowerCase();
//             allItems = allItems.stream()
//                     .filter(item ->
//                             (item.getMaSuaChua() != null && item.getMaSuaChua().toLowerCase().contains(q)) ||
//                                     (item.getTenSuaChua() != null && item.getTenSuaChua().toLowerCase().contains(q)) ||
//                                     (item.getTenDonViGiao() != null && item.getTenDonViGiao().toLowerCase().contains(q)) ||
//                                     (item.getTenDonViNhan() != null && item.getTenDonViNhan().toLowerCase().contains(q)) ||
//                                     (item.getIdSuaChua() != null && item.getIdSuaChua().toLowerCase().contains(q))
//                     )
//                     .collect(Collectors.toList());
//         }

//         // Tính tổng số items sau khi lọc
//         long totalItems = allItems.size();

//         // Thống kê theo trạng thái TRƯỚC khi phân trang
//         Map<Integer, Long> rawStats = ketQuaSuaChuaDao.countByTrangThai(idCongTy, fromDate, toDate);
//         Map<String, Long> trangThaiCounts = new HashMap<>();

//         long totalAll = 0;
//         for (Map.Entry<Integer, Long> entry : rawStats.entrySet()) {
//             String name = mapTrangThai(entry.getKey());
//             trangThaiCounts.put(name, entry.getValue());
//             totalAll += entry.getValue();
//         }
//         trangThaiCounts.put("Tất cả", totalAll);

//         // Phân trang
//         int fromIndex = Math.min(page * size, allItems.size());
//         int toIndex = Math.min(fromIndex + size, allItems.size());
//         List<KetQuaSuaChuaDTO> items = allItems.subList(fromIndex, toIndex);

//         // Load chi tiết và chữ ký cho từng item
//         for (KetQuaSuaChuaDTO item : items) {
//             item.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(item.getId()));
//             item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
//             item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
//         }

//         return new PageResponse<>(items, totalItems, page, size, null, null, trangThaiCounts);
//     }

//     // Hàm chuyển mã số sang tên hiển thị
//     private String mapTrangThai(Integer code) {
//         switch (code) {
//             case 0: return "Nháp";
//             case 1: return "Duyệt";
//             case 2: return "Hủy";
//             case 3: return "Hoàn thành";
//             default: return "Khác";
//         }
//     }

//     public KetQuaSuaChua insert(KetQuaSuaChua entity) {
//         // Set các giá trị mặc định nếu cần
//         if (entity.getTrangThai() == null) entity.setTrangThai(0); // Mặc định là Nháp
//         if (entity.getTrangThaiKyNhay() == null) entity.setTrangThaiKyNhay(false);
//         if (entity.getNguoiLapPhieuKyNhay() == null) entity.setNguoiLapPhieuKyNhay(false);
//         if (entity.getTrinhDuyetCapPhongXacNhan() == null) entity.setTrinhDuyetCapPhongXacNhan(false);
//         if (entity.getTrinhDuyetGiamDocXacNhan() == null) entity.setTrinhDuyetGiamDocXacNhan(false);
//         if (entity.getByStep() == null) entity.setByStep(false);
//         if (entity.getShare() == null) entity.setShare(false);
//         if (entity.getDaBanGiao() == null) entity.setDaBanGiao(false);
//         if (entity.getCoPhieuBanGiao() == null) entity.setCoPhieuBanGiao(false);
//         if (entity.getLoai() == null) entity.setLoai(0);

//         SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//         String currentTime = sdf.format(new Date());
//         entity.setNgayTao(currentTime);
//         entity.setNgayCapNhat(currentTime);

//         return ketQuaSuaChuaDao.insert(entity);
//     }

//     public KetQuaSuaChua update(KetQuaSuaChua entity) {
//         KetQuaSuaChua existing = ketQuaSuaChuaDao.findById(entity.getId());
//         if (existing == null) {
//             return null;
//         }

//         // Format ngày hiện tại thành String
//         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//         String ngayCapNhatStr = LocalDateTime.now().format(formatter);
//         entity.setNgayCapNhat(ngayCapNhatStr);
//         return ketQuaSuaChuaDao.update(entity);
//     }

//     public int delete(String id) {
//         // Xóa chi tiết trước
//         chiTietKetQuaSuaChuaDao.deleteByIdKetQua(id);
//         return ketQuaSuaChuaDao.delete(id);
//     }

//     // ==================== CÁC PHƯƠNG THỨC XỬ LÝ KÝ DUYỆT ====================

//     /**
//      * Cập nhật trạng thái ký duyệt
//      * Tự động xác định bước dựa trên userId
//      */
//     public int updateTrangThai(String id, String userId) {
//         return ketQuaSuaChuaDao.updateTrangThai(id, userId);
//     }

//     /**
//      * Hủy phiếu kết quả sửa chữa
//      */
//     public int huyTrangThai(String id) {
//         return ketQuaSuaChuaDao.huyTrangThai(id);
//     }

//     /**
//      * Cập nhật ký nháy
//      */
//     public int updateKyNhay(String id, String userId) {
//         return ketQuaSuaChuaDao.updateTrangThai(id, userId); // Dùng chung logic
//     }

//     /**
//      * Cập nhật duyệt cấp phòng
//      */
//     public int updateDuyetCapPhong(String id, String userId, boolean xacNhan) {
//         KetQuaSuaChua kq = ketQuaSuaChuaDao.findById(id);
//         if (kq != null && userId.equals(kq.getIdTrinhDuyetCapPhong())) {
//             kq.setTrinhDuyetCapPhongXacNhan(xacNhan);
//             ketQuaSuaChuaDao.update(kq);
//             return 1;
//         }
//         return 0;
//     }

//     /**
//      * Cập nhật duyệt giám đốc
//      */
//     public int updateDuyetGiamDoc(String id, String userId, boolean xacNhan) {
//         KetQuaSuaChua kq = ketQuaSuaChuaDao.findById(id);
//         if (kq != null && userId.equals(kq.getIdTrinhDuyetGiamDoc())) {
//             kq.setTrinhDuyetGiamDocXacNhan(xacNhan);
//             ketQuaSuaChuaDao.update(kq);
//             return 1;
//         }
//         return 0;
//     }

//     /**
//      * Lấy danh sách phiếu theo userId (các phiếu user có quyền xem/ký)
//      */
//     public List<KetQuaSuaChuaDTO> getByUserId(String userId) {
//         // Lấy tất cả phiếu (có thể giới hạn theo công ty nếu cần)
//         List<KetQuaSuaChuaDTO> all = ketQuaSuaChuaDao.findByFilters(null, null, null, null, null, 0, Integer.MAX_VALUE);

//         return all.stream()
//                 .filter(item -> isUserTurnToSign(item, userId))
//                 .peek(item -> {
//                     item.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(item.getId()));
//                     item.setChuKyList(kyTaiLieuDao.findById(item.getId()));
//                     item.setNguoiKyList(kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId()));
//                 })
//                 .collect(Collectors.toList());
//     }

//     /**
//      * Kiểm tra user có quyền ký trên phiếu không
//      */
//     public boolean isUserTurnToSign(KetQuaSuaChuaDTO item, String userId) {
//         if ("admin".equalsIgnoreCase(userId)) return true;
//         if (userId != null && userId.equals(item.getNguoiTao())) return true;
//         if (!Boolean.TRUE.equals(item.getShare())) return false;

//         // Bước 1: Người ký nháy
//         if (item.getIdNguoiKyNhay() != null && !item.getIdNguoiKyNhay().isEmpty()) {
//             if (!Boolean.TRUE.equals(item.getTrangThaiKyNhay())) {
//                 return userId.equals(item.getIdNguoiKyNhay());
//             }
//             if (userId.equals(item.getIdNguoiKyNhay())) return true;
//         }

//         // Bước 2: Duyệt cấp phòng
//         boolean kyNhayDone = (item.getIdNguoiKyNhay() == null || item.getIdNguoiKyNhay().isEmpty())
//                 || Boolean.TRUE.equals(item.getTrangThaiKyNhay());
//         if (kyNhayDone && item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()
//                 && !Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
//             return userId.equals(item.getIdTrinhDuyetCapPhong());
//         }
//         if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())
//                 && userId.equals(item.getIdTrinhDuyetCapPhong())) return true;

//         // Bước 3: Người ký phụ
//         if (Boolean.TRUE.equals(item.getTrinhDuyetCapPhongXacNhan())) {
//             List<NguoiKy> nguoiKyList = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
//             if (nguoiKyList != null && !nguoiKyList.isEmpty()) {
//                 NguoiKy firstUnsigned = null;
//                 boolean allSigned = true;
//                 for (NguoiKy nk : nguoiKyList) {
//                     if (nk.getTrangThai() != 1) {
//                         allSigned = false;
//                         if (firstUnsigned == null) firstUnsigned = nk;
//                     }
//                 }
//                 for (NguoiKy nk : nguoiKyList) {
//                     if (userId.equals(nk.getIdNguoiKy()) && nk.getTrangThai() == 1) return true;
//                 }
//                 if (!allSigned && firstUnsigned != null) {
//                     return userId.equals(firstUnsigned.getIdNguoiKy());
//                 }
//                 // Bước 4: Giám đốc
//                 if (allSigned && item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()
//                         && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
//                     return userId.equals(item.getIdTrinhDuyetGiamDoc());
//                 }
//                 if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
//                         && userId.equals(item.getIdTrinhDuyetGiamDoc())) return true;
//             } else {
//                 if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()
//                         && !Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())) {
//                     return userId.equals(item.getIdTrinhDuyetGiamDoc());
//                 }
//                 if (Boolean.TRUE.equals(item.getTrinhDuyetGiamDocXacNhan())
//                         && userId.equals(item.getIdTrinhDuyetGiamDoc())) return true;
//             }
//         }
//         return false;
//     }

//     /**
//      * Lấy quyền ký của user trên phiếu
//      * Trả về: 0 - có thể ký, 1 - chưa đến lượt, 2 - không trong luồng, 3 - đã ký
//      */
//     public int getPermissionSigning(KetQuaSuaChuaDTO item, String userId) {
//         List<Map<String, Object>> flow = new ArrayList<>();

//         if (item.getIdNguoiKyNhay() != null && !item.getIdNguoiKyNhay().isEmpty()) {
//             flow.add(Map.of("id", item.getIdNguoiKyNhay(), "signed", item.getTrangThaiKyNhay()));
//         }
//         if (item.getIdTrinhDuyetCapPhong() != null && !item.getIdTrinhDuyetCapPhong().isEmpty()) {
//             flow.add(Map.of("id", item.getIdTrinhDuyetCapPhong(), "signed", item.getTrinhDuyetCapPhongXacNhan()));
//         }

//         List<NguoiKy> extra = kyTaiLieuDao.getAllNguoiKyByIdTaiLieu(item.getId());
//         if (extra != null) {
//             for (NguoiKy nk : extra) {
//                 flow.add(Map.of("id", nk.getIdNguoiKy(), "signed", nk.getTrangThai() == 1));
//             }
//         }

//         if (item.getIdTrinhDuyetGiamDoc() != null && !item.getIdTrinhDuyetGiamDoc().isEmpty()) {
//             flow.add(Map.of("id", item.getIdTrinhDuyetGiamDoc(), "signed", item.getTrinhDuyetGiamDocXacNhan()));
//         }

//         int index = -1;
//         for (int i = 0; i < flow.size(); i++) {
//             if (userId.equals(flow.get(i).get("id"))) {
//                 index = i;
//                 break;
//             }
//         }
//         if (index == -1) return 2; // Không trong luồng

//         boolean signed = (Boolean) flow.get(index).get("signed");
//         if (signed) return 3; // Đã ký

//         // Kiểm tra những người trước đã ký chưa
//         for (int i = 0; i < index; i++) {
//             if (!(Boolean) flow.get(i).get("signed")) return 1; // Chưa đến lượt
//         }
//         return 0; // Có thể ký
//     }

//     /**
//      * Cập nhật trạng thái ký từ bảng NguoiKy
//      */
//     public int updateTrangThaiKy(String id, String userId) {
//         return ketQuaSuaChuaDao.updateTrangThaiKy(id, userId);
//     }

//     // ==================== CÁC PHƯƠNG THỨC KHÁC ====================

//     /**
//      * Lấy danh sách theo loại
//      */
//     public List<KetQuaSuaChuaDTO> getByLoai(int loai) {
//         List<KetQuaSuaChuaDTO> all = ketQuaSuaChuaDao.findByFilters(null, null, null, null, null, 0, Integer.MAX_VALUE);
//         return all.stream()
//                 .filter(item -> item.getLoai() != null && item.getLoai() == loai)
//                 .peek(item -> {
//                     item.setChiTietKetQuaSuaChuas(chiTietKetQuaSuaChuaDao.findByIdKetQua(item.getId()));
//                 })
//                 .collect(Collectors.toList());
//     }

//     // ==================== IMPORT ====================

//     public List<KetQuaSuaChua> readCsv(MultipartFile file) throws IOException {
//         List<KetQuaSuaChua> list = new ArrayList<>();
//         try (BufferedReader br = new BufferedReader(
//                 new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
//             String line;
//             boolean firstLine = true;
//             while ((line = br.readLine()) != null) {
//                 if (firstLine) {
//                     firstLine = false;
//                     continue;
//                 }
//                 String[] fields = line.split(",", -1);
//                 KetQuaSuaChua entity = KetQuaSuaChua.mapToKetQuaSuaChua(fields);
//                 list.add(entity);
//             }
//         }
//         return list;
//     }

//     public List<KetQuaSuaChua> readExcel(MultipartFile file) throws IOException {
//         List<KetQuaSuaChua> list = new ArrayList<>();
//         Workbook workbook = WorkbookFactory.create(file.getInputStream());
//         Sheet sheet = workbook.getSheetAt(0);
//         boolean firstRow = true;
//         for (Row row : sheet) {
//             if (firstRow) {
//                 firstRow = false;
//                 continue;
//             }
//             KetQuaSuaChua entity = KetQuaSuaChua.mapToKetQuaSuaChua(row);
//             list.add(entity);
//         }
//         workbook.close();
//         return list;
//     }

//     // Bulk operations (nếu cần)
//     public void bulkInsert(List<KetQuaSuaChua> list) {
//         for (KetQuaSuaChua entity : list) {
//             insert(entity);
//         }
//     }

//     public void bulkUpdate(List<KetQuaSuaChua> list) {
//         for (KetQuaSuaChua entity : list) {
//             update(entity);
//         }
//     }

//     public void bulkDelete(List<String> ids) {
//         for (String id : ids) {
//             delete(id);
//         }
//     }
// }