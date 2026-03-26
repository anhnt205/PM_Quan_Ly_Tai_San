package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.BanGiaoTaiSanService;
import com.ecotel.quanlytaisan.service.BanGiaoTaiSanDetailService;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/bangiaotaisan")
public class BanGiaoTaiSanController {
    @Autowired
    private BanGiaoTaiSanService service;

    @Autowired
    private BanGiaoTaiSanDetailService detailService;

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private BanGiaoTaiSanService banGiaoTaiSanService;


    @GetMapping
    public List<BanGiaoTaiSanDTO> getAll(@RequestParam("idcongty") String idcongty) throws SQLException {
        return service.findAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<BanGiaoTaiSanDTO> getAllPaged(@RequestParam("idcongty") String idcongty, @RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "size", defaultValue = "20") int size, @RequestParam(value = "sortBy", required = false) String sortBy, @RequestParam(value = "sortDir", required = false) String sortDir, @RequestParam(value = "search", required = false) String search, @RequestParam(value = "userid", required = false) String userid, @RequestParam(value = "trangThai", required = false) Integer trangThai, @RequestParam(value = "idDonViGiao", required = false) String idDonViGiao) throws SQLException {
        return service.findAllPaged(idcongty, page, size, sortBy, sortDir, search, userid, trangThai, idDonViGiao);
    }

    @PutMapping("/updatestatus")
    public ResponseEntity<ApiResponse<Object>> updateStatus(@RequestParam("userId") String userId, @RequestParam("docId") String docId) {
        try {
            int result = service.updateTrangThai(userId, docId);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật biên bản bàn giao tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao tài sản để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/getbyuserid/{userid}")
    public List<BanGiaoTaiSanDTO> getbyuserid(@PathVariable("userid") String userid) throws SQLException {
        return service.getByUserId(userid);
    }

    @GetMapping("/getbyuseridstatus")
    public List<BanGiaoTaiSanDTO> getByUserIdStatus(@RequestParam("userid") String userid, @RequestParam("trangthai") int trangthai) throws SQLException {
        return service.getByUserIdStatus(userid, trangthai);
    }

    @GetMapping("/getbystatus")
    public List<BanGiaoTaiSanDTO> getByStatus(@RequestParam("trangthai") int trangthai) throws SQLException {
        return service.getByStatus(trangthai);
    }

    @GetMapping("/{id}")
    public BanGiaoTaiSan getById(@PathVariable("id") String id) throws SQLException {
        return service.findById(id);
    }


    @GetMapping("/details")
    public List<BanGiaoTaiSanDetailResponse> getAllDetailByCongTy(@RequestParam("idcongty") String idcongty) {
        return detailService.getBanGiaoTaiSanDetailByIdCongTy(idcongty);
    }

    @GetMapping("/details-by_user/{userid}")
    public List<BanGiaoTaiSanDetailResponse> getAllDetailByUserId(@PathVariable("userid") String userid) throws SQLException {
        return detailService.getBanGiaoTaiSanDetailByUserId(userid);
    }

    @GetMapping("/permission-signing/{id}")
    public ResponseEntity<ApiResponse<Object>> getPermissionSigning(@PathVariable("id") String id, @RequestParam("tenDangNhap") String tenDangNhap) throws SQLException {
        try {
            BanGiaoTaiSanDTO item = service.findByIdDTO(id);
            if (item == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy bàn giao tài sản với ID: " + id, null));
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/permission-signing/")
    public ResponseEntity<ApiResponse<Object>> getAllPermissionSigning(@RequestParam("tenDangNhap") String tenDangNhap) throws SQLException {
        try {
            if (tenDangNhap == null || tenDangNhap.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Tên đăng nhập không được rỗng", null));
            }

            java.util.List<BanGiaoTaiSanDTO> items = banGiaoTaiSanService.getByUserId(tenDangNhap);
            if (items == null || items.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("Không có bàn giao tài sản nào cho người dùng này", 
                    java.util.Collections.emptyList(), 0));
            }

            java.util.List<java.util.Map<String, Object>> results = new java.util.ArrayList<>();
            
            for (BanGiaoTaiSanDTO item : items) {
                if (item != null) {
                    int permission = service.getPermissionSigning(item, tenDangNhap);

                    // Tạo response object với thông tin chi tiết
                    java.util.Map<String, Object> result = new java.util.HashMap<>();
                    result.put("id", item.getId());
                    result.put("permission", permission);
                    result.put("permissionDescription", getPermissionDescription(permission));
                    result.put("tenDangNhap", tenDangNhap);
                    result.put("itemName", item.getBanGiaoTaiSan());
                    result.put("quyetDinhDieuDongSo", item.getQuyetDinhDieuDongSo());
                    result.put("trangThai", item.getTrangThai());
                    result.put("ngayTao", item.getNgayTao());
                    result.put("ngayCapNhat", item.getNgayCapNhat());
                    result.put("tenDonViGiao", item.getTenDonViGiao());
                    result.put("tenDonViNhan", item.getTenDonViNhan());
                    result.put("ngayBanGiao", item.getNgayBanGiao());
                    
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
            case 0:
                return "Có thể ký";
            case 1:
                return "Chờ người trước ký";
            case 2:
                return "Không nằm trong flow ký";
            case 3:
                return "Đã ký";
            case 4:
                return "Đã ban hành quyết định";
            case 5:
                return "Có thể ban hành quyết định";
            default:
                return "Trạng thái không xác định";
        }
    }


    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody BanGiaoTaiSan obj) throws SQLException {
        try {
            BanGiaoTaiSan result = service.insert(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyBanGiaoTaiSanCreated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo biên bản bàn giao tài sản thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo biên bản bàn giao tài sản thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody BanGiaoTaiSan obj) throws SQLException {
        try {
            obj.setId(id); // Đảm bảo set id
            BanGiaoTaiSan result = service.update(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyBanGiaoTaiSanUpdated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.ok(ApiResponse.success("Cập nhật biên bản bàn giao tài sản thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao tài sản để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<BanGiaoTaiSan> list) throws SQLException {
        try {
            int total = 0;
            java.util.List<String> generatedIds = new java.util.ArrayList<>();
            for (BanGiaoTaiSan item : list) {
                BanGiaoTaiSan inserted = service.insert(item);
                if (inserted != null) {
                    total++;
                    generatedIds.add(inserted.getId());
                    notificationService.notifyBanGiaoTaiSanCreated(inserted.getIdCongTy(), inserted.getId(), inserted.getNguoiTao());
                }
            }
            if (total > 0) {
                java.util.Map<String, Object> responseData = new java.util.HashMap<>();
                responseData.put("ids", generatedIds);
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo danh sách biên bản bàn giao tài sản thành công", responseData, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo danh sách biên bản bàn giao tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<BanGiaoTaiSan> list) throws SQLException {
        try {
            int total = 0;
            for (BanGiaoTaiSan item : list) {
                BanGiaoTaiSan updated = service.update(item);
                if (updated != null) {
                    total++;
                    notificationService.notifyBanGiaoTaiSanUpdated(updated.getIdCongTy(), updated.getId(), updated.getNguoiTao());
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách biên bản bàn giao tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao tài sản để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) throws SQLException {
        try {
            // Lấy thông tin trước khi xóa để gửi thông báo
            BanGiaoTaiSan existingItem = service.findById(id);
            int result = service.delete(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoTaiSanDeleted(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa biên bản bàn giao tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao tài sản để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) throws SQLException {
        try {
            int total = 0;
            for (String id : ids) {
                // Lấy thông tin trước khi xóa để gửi thông báo
                BanGiaoTaiSan existingItem = service.findById(id);
                total += service.delete(id);
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoTaiSanDeleted(existingItem.getIdCongTy(), id, "System");
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách biên bản bàn giao tài sản thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Xóa danh sách biên bản bàn giao tài sản thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> capNhatTrangThai(@RequestParam("id") String id, @RequestParam("userId") String userId) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            BanGiaoTaiSan existingItem = service.findById(id);
            int result = service.updateTrangThai(id, userId);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoTaiSanUpdated(existingItem.getIdCongTy(), id, userId);
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huytrangthai")
    public ResponseEntity<ApiResponse<Object>> huyTrangThai(@RequestParam("id") String id) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            BanGiaoTaiSan existingItem = service.findById(id);
            System.out.println(existingItem.getIdCongTy());
            int result = service.huyTrangThai(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoTaiSanUpdated(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
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
            List<BanGiaoTaiSan> listBanGiaoTaiSan;
            if (filename.endsWith(".csv")) {
                listBanGiaoTaiSan = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listBanGiaoTaiSan = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            java.util.List<String> generatedIds = new java.util.ArrayList<>();
            for (BanGiaoTaiSan ts : listBanGiaoTaiSan) {
                // ID sẽ được tự động sinh nếu null hoặc rỗng
                if(service.insert(ts)!=null){
                    generatedIds.add(ts.getId());
                }

                // Gửi thông báo WebSocket cho từng item
                notificationService.notifyBanGiaoTaiSanCreated(ts.getIdCongTy(), ts.getId(), ts.getNguoiTao());
            }
            java.util.Map<String, Object> responseData = new java.util.HashMap<>();
            responseData.put("ids", generatedIds);
            responseData.put("items", listBanGiaoTaiSan);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", responseData, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
} 