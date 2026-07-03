package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.DieuDongTaiSanService;
import com.ecotel.quanlytaisan.service.DieuDongTaiSanDetailService;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/dieudongtaisan")
public class DieuDongTaiSanController {
    @Autowired
    private DieuDongTaiSanService service;

    @Autowired
    private DieuDongTaiSanDetailService detailService;

    @Autowired
    private NotificationService notificationService;


    @GetMapping
    public List<DieuDongTaiSanDTO> getAll(@RequestParam("idcongty") String idcongty) throws SQLException {
        return service.findAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<DieuDongTaiSanDTO> getAllPaged(
            @RequestParam("idcongty") String idcongty,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDir", required = false) String sortDir,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "loai", required = false) Integer loai,
            @RequestParam(value = "userid", required = false) String userid,
            @RequestParam(value = "trangThai", required = false) Integer trangThai,
            @RequestParam(value = "idDonViGiao", required = false) String idDonViGiao,
            @RequestParam(value = "chuaBanGiaoHet", required = false) Boolean chuaBanGiaoHet,
            @RequestParam(value = "isSign", required = false) Boolean isSign) throws SQLException {
        return service.findAllPaged(idcongty, page, size, sortBy, sortDir, search, loai, userid, trangThai, idDonViGiao, chuaBanGiaoHet, isSign);
    }

    @GetMapping("/getbyuserid/{userid}")
    public List<DieuDongTaiSanDTO> getbyuserid(@PathVariable("userid") String userid) throws SQLException {
        return service.findByUserId(userid);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getById(@PathVariable("id") String id) throws SQLException {
        try {
            DieuDongTaiSanDTO item = service.findByIdDTO(id);
            if (item == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy điều động tài sản", null));
            }
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", item, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody DieuDongTaiSan obj) throws SQLException {
        try {
            DieuDongTaiSan result = service.insert(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyDieuDongTaiSanCreated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo điều động tài sản thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo điều động tài sản thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody DieuDongTaiSan obj) throws SQLException {
        try {
            obj.setId(id); // Đảm bảo set id
            DieuDongTaiSan result = service.update(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyDieuDongTaiSanUpdated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.ok(ApiResponse.success("Cập nhật điều động tài sản thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy điều động tài sản để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<DieuDongTaiSan> list) {
        try {
            int total = 0;
            for (DieuDongTaiSan item : list) {
                DieuDongTaiSan inserted = service.insert(item);
                if (inserted != null) total++;
                // Gửi thông báo WebSocket cho từng item
                if (inserted != null) notificationService.notifyDieuDongTaiSanCreated(inserted.getIdCongTy(), inserted.getId(), inserted.getNguoiTao());
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách điều động tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách điều động tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<DieuDongTaiSan> list) {
        try {
            int total = 0;
            for (DieuDongTaiSan item : list) {
                DieuDongTaiSan updated = service.update(item);
                if (updated != null) {
                    total++;
                    notificationService.notifyDieuDongTaiSanUpdated(updated.getIdCongTy(), updated.getId(), updated.getNguoiTao());
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách điều động tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy điều động tài sản để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) throws SQLException {
        try {
            // Lấy thông tin trước khi xóa để gửi thông báo
            DieuDongTaiSan existingItem = service.findById(id);
            int result = service.delete(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongTaiSanDeleted(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa điều động tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy điều động tài sản để xóa", result));
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
                DieuDongTaiSan existingItem = service.findById(id);
                total += service.delete(id);
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongTaiSanDeleted(existingItem.getIdCongTy(), id, "System");
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách điều động tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách điều động tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> updateTrangThai(@RequestParam("id") String id, @RequestParam("userId") String userId) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            DieuDongTaiSan existingItem = service.findById(id);
            int result = service.updateTrangThai(id, userId);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongTaiSanUpdated(existingItem.getIdCongTy(), id, userId);
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
    public ResponseEntity<ApiResponse<Object>> banHanhQuyetDinh(@RequestBody List<BanHanhRequest> requests) {
        try {
            if (requests == null || requests.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Danh sách trống", null));
            }
            
            int[] results = service.banHanhQuyetDinh(requests);
            int totalUpdated = 0;
            for (int r : results) totalUpdated += (r > 0 ? 1 : 0);

            return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công " + totalUpdated + " bản ghi", totalUpdated, totalUpdated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huy")
    public ResponseEntity<ApiResponse<Object>> huyTrangthai(@RequestParam("id") String id) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            DieuDongTaiSan existingItem = service.findById(id);
            int result = service.huyTrangThai(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongTaiSanUpdated(existingItem.getIdCongTy(), id, "System");
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

    @PostMapping("/update-trang-thai-ban-giao")
    public ResponseEntity<ApiResponse<Object>> updateTrangThaiBanGiao(@RequestParam("id") String id, @RequestParam("trangThaiBanGiao") boolean trangThaiBanGiao) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            DieuDongTaiSan existingItem = service.findById(id);
            int result = service.updateTrangThaiBanGiao(id, trangThaiBanGiao);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyDieuDongTaiSanUpdated(existingItem.getIdCongTy(), id, "System");
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
            List<DieuDongTaiSan> listDieuDongTaiSan;
            if (filename.endsWith(".csv")) {
                listDieuDongTaiSan = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listDieuDongTaiSan = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (DieuDongTaiSan ts : listDieuDongTaiSan) {

                if(service.insert(ts)!=null){
                 count++;
                }
                // Gửi thông báo WebSocket cho từng item
                notificationService.notifyDieuDongTaiSanCreated(ts.getIdCongTy(), ts.getId(), ts.getNguoiTao());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listDieuDongTaiSan, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/details")
    public List<DieuDongTaiSanDetailResponse> getAllDetailByCongTy(@RequestParam("idcongty") String idcongty) {
        return detailService.getDieuDongTaiSanDetailByIdCongTy(idcongty);
    }

    @GetMapping("/details-by_user/{userid}")
    public List<DieuDongTaiSanDetailResponse> getAllDetailByUserId(@PathVariable("userid") String userid) throws SQLException {
        return detailService.getDieuDongTaiSanDetailByUserId(userid);
    }

    @GetMapping("/permission-signing/{id}")
    public ResponseEntity<ApiResponse<Object>> getPermissionSigning(
            @PathVariable("id") String id,
            @RequestParam("tenDangNhap") String tenDangNhap) throws SQLException {
        try {
            DieuDongTaiSanDTO item = service.findByIdDTO(id);
            if (item == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy điều động tài sản với ID: " + id, null));
            }

            int permission = service.getPermissionSigning(item, tenDangNhap);
            
            // Tạo response object với thông tin chi tiết
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("permission", permission);
            response.put("permissionDescription", getPermissionDescription(permission));
            response.put("itemId", id);
            response.put("tenDangNhap", tenDangNhap);
            
            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin quyền ký thành công", response, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/permission-signing/")
    public ResponseEntity<ApiResponse<Object>> getAllPermissionSigning(@RequestParam("tenDangNhap") String tenDangNhap) throws SQLException {
        try {
            if (tenDangNhap == null || tenDangNhap.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Tên đăng nhập không được rỗng", null));
            }

            java.util.List<DieuDongTaiSanDTO> items = service.findByUserId(tenDangNhap);
            if (items == null || items.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Không có điều động tài sản nào cho người dùng này", 
                    java.util.Collections.emptyList(), 0));
            }

            java.util.List<java.util.Map<String, Object>> results = new java.util.ArrayList<>();
            
            for (DieuDongTaiSanDTO item : items) {
                if (item != null) {
                    int permission = service.getPermissionSigning(item, tenDangNhap);

                    // Tạo response object với thông tin chi tiết
                    java.util.Map<String, Object> result = new java.util.HashMap<>();
                    result.put("id", item.getId());
                    result.put("permission", permission);
                    result.put("permissionDescription", getPermissionDescription(permission));
                    result.put("tenDangNhap", tenDangNhap);
                    result.put("itemName", item.getTenPhieu());
                    result.put("soQuyetDinh", item.getSoQuyetDinh());
                    result.put("trangThai", item.getTrangThai());
                    result.put("ngayTao", item.getNgayTao());
                    result.put("ngayCapNhat", item.getNgayCapNhat());
                    result.put("tenDonViGiao", item.getTenDonViGiao());
                    result.put("tenDonViNhan", item.getTenDonViNhan());
                    result.put("diaDiemGiaoNhan", item.getDiaDiemGiaoNhan());
                    result.put("trichYeu", item.getTrichYeu());
                    
                    results.add(result);
                }
            }

            return ResponseEntity.ok(ApiResponse.success("Lấy thông tin quyền ký thành công", results, results.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    private String getPermissionDescription(int permission) {
        switch (permission) {
            case 0: return "Có thể ký";
            case 1: return "Chờ người trước ký";
            case 2: return "Không nằm trong flow ký";
            case 3: return "Đã ký";
            case 4: return "Đã tạo phiếu";
            case 5: return "Có thể tạo phiếu";
            default: return "Trạng thái không xác định";
        }
    }

    /**
     * API đếm số lượng DieuDongTaiSan theo TrangThai và IdDonViGiao
     * Mặc định TrangThai = 3 (hoàn thành)
     */
    @GetMapping("/count-by-don-vi-giao")
    public ResponseEntity<ApiResponse<Object>> countByTrangThaiAndDonViGiao(
            @RequestParam(value = "trangThai", defaultValue = "3") int trangThai,
            @RequestParam("idDonViGiao") String idDonViGiao) {
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
     * API lấy danh sách DieuDongTaiSan (loại Điều động) đã hoàn thành nhưng chưa bàn giao hết tài sản.
     * Điều kiện: TrangThai = 3 (hoàn thành), Loai = 2 (Điều động tài sản)
     * Logic: So sánh số lượng trong ChiTietDieuDongTaiSan với tổng số lượng đã bàn giao trong ChiTietBanGiaoTaiSan
     */
    @GetMapping("/chua-ban-giao-het")
    public ResponseEntity<ApiResponse<Object>> getChuaBanGiaoHet(@RequestParam("idCongTy") String idCongTy) {
        try {
            List<DieuDongTaiSanDTO> list = service.findAllChuaBanGiaoHet(idCongTy);
            return ResponseEntity.ok(ApiResponse.success(
                    "Lấy danh sách điều động tài sản chưa bàn giao hết thành công",
                    list,
                    list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
} 