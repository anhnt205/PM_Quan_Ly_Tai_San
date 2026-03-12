package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.DieuDongCCDCVatTuService;
import com.ecotel.quanlytaisan.service.DieuDongCCDCVatTuDetailService;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/dieudongccdcvattu")
public class DieuDongCCDCVatTuController {

    @Autowired
    private DieuDongCCDCVatTuService service;

    @Autowired
    private DieuDongCCDCVatTuDetailService detailService;

    @Autowired
    private NotificationService notificationService;


    @GetMapping
    public List<DieuDongCCDCVatTuDTO> getAll(@RequestParam String idcongty) throws SQLException {
        return service.findAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<DieuDongCCDCVatTuDTO> getAllPaged(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer loai,
            @RequestParam(required = false) String userid,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(required = false) String idDonViGiao,
            @RequestParam(required = false) Boolean chuaBanGiaoHet) throws SQLException {
        return service.findAllPaged(idcongty, page, size, sortBy, sortDir, search, loai, userid, trangThai, idDonViGiao, chuaBanGiaoHet);
    }

    @GetMapping("/getbyuserid/{userid}")
    public List<DieuDongCCDCVatTuDTO> getbyuserid(@PathVariable String userid) throws SQLException {
        return service.findByUserId(userid);
    }

    @GetMapping("/{id}")
    public DieuDongCCDCVatTu getById(@PathVariable String id) throws SQLException {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody DieuDongCCDCVatTu obj) throws SQLException {
        try {
            DieuDongCCDCVatTu result = service.insert(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyDieuDongCCDCVatTuCreated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo điều động công cụ dụng cụ vật tư thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo điều động công cụ dụng cụ vật tư thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody DieuDongCCDCVatTu obj) throws SQLException {
        try {
            obj.setId(id); // Đảm bảo set id
            DieuDongCCDCVatTu result = service.update(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyDieuDongCCDCVatTuUpdated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.ok(ApiResponse.success("Cập nhật điều động công cụ dụng cụ vật tư thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy điều động công cụ dụng cụ vật tư để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<DieuDongCCDCVatTu> list) {
        try {
            int total = 0;
            for (DieuDongCCDCVatTu item : list) {
                DieuDongCCDCVatTu inserted = service.insert(item);
                if (inserted != null) {
                    total++;
                    // Gửi thông báo WebSocket cho từng item
                    notificationService.notifyDieuDongCCDCVatTuCreated(inserted.getIdCongTy(), inserted.getId(), inserted.getNguoiTao());
                }
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách điều động CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách điều động CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<DieuDongCCDCVatTu> list) {
        try {
            int total = 0;
            for (DieuDongCCDCVatTu item : list) {
                DieuDongCCDCVatTu updated = service.update(item);
                if (updated != null) {
                    total++;
                    // Gửi thông báo WebSocket cho từng item
                    notificationService.notifyDieuDongCCDCVatTuUpdated(updated.getIdCongTy(), updated.getId(), updated.getNguoiTao());
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách điều động CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy điều động CCDC/Vật tư để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) throws SQLException {
        try {
            // Lấy thông tin trước khi xóa để gửi thông báo
            DieuDongCCDCVatTu existingItem = service.findById(id);
            int result = service.delete(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongCCDCVatTuDeleted(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa điều động công cụ dụng cụ vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy điều động công cụ dụng cụ vật tư để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) throws SQLException {
        try {
            int total = 0;
            for (String id : ids) {
                // Lấy thông tin trước khi xóa để gửi thông báo
                DieuDongCCDCVatTu existingItem = service.findById(id);
                total += service.delete(id);
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongCCDCVatTuDeleted(existingItem.getIdCongTy(), id, "System");
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách điều động CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách điều động CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(@RequestParam String id, @RequestParam String userId) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            DieuDongCCDCVatTu existingItem = service.findById(id);
            int result = service.updateTrangThai(id, userId);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongCCDCVatTuUpdated(existingItem.getIdCongTy(), id, userId);
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

     @PostMapping("/banhanhquyetdinh")
    public ResponseEntity<ApiResponse<Object>> banHanhQuyetDinh(@RequestParam String id,@RequestParam String soQuyetDinh) throws SQLException {
        try {
            int result = service.banHanhQuyetDinh(id,soQuyetDinh);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huyTrangthai(@RequestParam String id) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            DieuDongCCDCVatTu existingItem = service.findById(id);
            int result = service.huyTrangThai(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongCCDCVatTuUpdated(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("File không được rỗng", null));
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Tên file không hợp lệ", null));
        }

        try {
            List<DieuDongCCDCVatTu> listDieuDongCCDCVatTu;
            if (filename.endsWith(".csv")) {
                listDieuDongCCDCVatTu = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listDieuDongCCDCVatTu = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (DieuDongCCDCVatTu ts : listDieuDongCCDCVatTu) {
                if(service.insert(ts)!=null){
                    count++;
                }
                // Gửi thông báo WebSocket cho từng item
                notificationService.notifyDieuDongCCDCVatTuCreated(ts.getIdCongTy(), ts.getId(), ts.getNguoiTao());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listDieuDongCCDCVatTu, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/update-trang-thai-ban-giao")
    public ResponseEntity<ApiResponse<Object>> updateTrangThaiBanGiao(@RequestParam String id, @RequestParam boolean trangThaiBanGiao) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            DieuDongCCDCVatTu existingItem = service.findById(id);
            int result = service.updateTrangThaiBanGiao(id, trangThaiBanGiao);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongCCDCVatTuUpdated(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái bàn giao thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/details")
    public List<DieuDongCCDCVatTuDetailResponse> getAllDetailByCongTy(@RequestParam String idcongty) {
        return detailService.getDieuDongCCDCVatTuDetailByIdCongTy(idcongty);
    }

    @GetMapping("/details-by_user/{userid}")
    public List<DieuDongCCDCVatTuDetailResponse> getAllDetailByUserId(@PathVariable String userid) throws SQLException {
        return detailService.getDieuDongCCDCVatTuDetailByUserId(userid);
    }

    /**
     * API đếm số lượng DieuDongCCDCVatTu theo TrangThai và IdDonViGiao
     * Mặc định TrangThai = 3 (hoàn thành)
     */
    @GetMapping("/count-by-don-vi-giao")
    public ResponseEntity<ApiResponse<Object>> countByTrangThaiAndDonViGiao(
            @RequestParam(defaultValue = "3") int trangThai,
            @RequestParam String idDonViGiao) {
        try {
            long count = service.countByTrangThaiAndDonViGiao(trangThai, idDonViGiao);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("count", count);
            response.put("trangThai", trangThai);
            response.put("idDonViGiao", idDonViGiao);
            return ResponseEntity.ok(ApiResponse.success("Lấy số lượng thành công", response, (int) count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    /**
     * API lấy danh sách DieuDongCCDCVatTu đã hoàn thành nhưng chưa bàn giao hết
     * - TrangThai = 3 (hoàn thành)
     * - Loai = 2 (Điều động)
     * - Có ít nhất 1 CCDC/Vật tư chưa bàn giao đủ số lượng
     */
    @GetMapping("/chua-ban-giao-het")
    public ResponseEntity<ApiResponse<Object>> getChuaBanGiaoHet(@RequestParam String idCongTy) {
        try {
            List<DieuDongCCDCVatTuDTO> list = service.findAllChuaBanGiaoHet(idCongTy);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách điều động CCDC/Vật tư chưa bàn giao hết thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
} 