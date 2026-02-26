package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.BanGiaoCCDCVatTuService;
import com.ecotel.quanlytaisan.service.BanGiaoCCDCVatTuDetailService;
import com.ecotel.quanlytaisan.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("api/bangiaoccdcvattu")
public class BanGiaoCCDCVatTuController {
    @Autowired
    private BanGiaoCCDCVatTuService service;

    @Autowired
    private BanGiaoCCDCVatTuDetailService detailService;

    @Autowired
    private NotificationService notificationService;


    @GetMapping
    public List<BanGiaoCCDCVatTuDTO> getAll(@RequestParam String idcongty) {
        return service.findAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<BanGiaoCCDCVatTuDTO> getAllPaged(
            @RequestParam String idcongty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String userid,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(required = false) String idDonViGiao) throws SQLException {
        return service.findAllPaged(idcongty, page, size, sortBy, sortDir, search, userid, trangThai, idDonViGiao);
    }

    @GetMapping("/getbyuserid/{userid}")
    public List<BanGiaoCCDCVatTuDTO> getbyuserid(@PathVariable String userid) throws SQLException {
        return service.getByUserId(userid);
    }

    @GetMapping("/getbyuseridstatus")
    public List<BanGiaoCCDCVatTuDTO> getByUserIdStatus(@RequestParam String userid, @RequestParam int trangthai) throws SQLException {
        return service.getByUserIdStatus(userid, trangthai);
    }

    @GetMapping("/getbystatus")
    public List<BanGiaoCCDCVatTuDTO> getByStatus(@RequestParam int trangthai) throws SQLException {
        return service.getByStatus(trangthai);
    }

    @GetMapping("/details")
    public List<BanGiaoCCDCVatTuDetailResponse> getAllDetailByCongTy(@RequestParam String idcongty) {
        return detailService.getBanGiaoCCDCVatTuDetailByIdCongTy(idcongty);
    }

    @GetMapping("/details-by_user/{userid}")
    public List<BanGiaoCCDCVatTuDetailResponse> getAllDetailByUserId(@PathVariable String userid) throws SQLException {
        return detailService.getBanGiaoCCDCVatTuDetailByUserId(userid);
    }


    @GetMapping("/{id}")
    public BanGiaoCCDCVatTu getById(@PathVariable String id) {
        return service.findById(id);
    }


    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody BanGiaoCCDCVatTu obj) {
        try {
            BanGiaoCCDCVatTu result = service.insert(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyBanGiaoCCDCVatTuCreated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo biên bản bàn giao CCDC/Vật tư thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo biên bản bàn giao CCDC/Vật tư thất bại", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> update(@RequestBody BanGiaoCCDCVatTu obj) {
        try {
            BanGiaoCCDCVatTu result = service.update(obj);
            if (result != null) {
                // Gửi thông báo WebSocket
                notificationService.notifyBanGiaoCCDCVatTuUpdated(result.getIdCongTy(), result.getId(), result.getNguoiTao());
                return ResponseEntity.ok(ApiResponse.success("Cập nhật biên bản bàn giao CCDC/Vật tư thành công", result, 1));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao CCDC/Vật tư để cập nhật", 0));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<BanGiaoCCDCVatTu> list) {
        try {
            int total = 0;
            java.util.List<String> generatedIds = new java.util.ArrayList<>();
            for (BanGiaoCCDCVatTu item : list) {
                BanGiaoCCDCVatTu inserted = service.insert(item);
                if (inserted != null) {
                    total++;
                    generatedIds.add(inserted.getId());
                    notificationService.notifyBanGiaoCCDCVatTuCreated(inserted.getIdCongTy(), inserted.getId(), inserted.getNguoiTao());
                }
            }
            if (total > 0) {
                java.util.Map<String, Object> responseData = new java.util.HashMap<>();
                responseData.put("ids", generatedIds);
                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo danh sách biên bản bàn giao CCDC/Vật tư thành công", responseData, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Tạo danh sách biên bản bàn giao CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<BanGiaoCCDCVatTu> list) {
        try {
            int total = 0;
            for (BanGiaoCCDCVatTu item : list) {
                BanGiaoCCDCVatTu updated = service.update(item);
                if (updated != null) {
                    total++;
                    notificationService.notifyBanGiaoCCDCVatTuUpdated(updated.getIdCongTy(), updated.getId(), updated.getNguoiTao());
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách biên bản bàn giao CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao CCDC/Vật tư để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            // Lấy thông tin trước khi xóa để gửi thông báo
            BanGiaoCCDCVatTu existingItem = service.findById(id);
            int result = service.delete(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoCCDCVatTuDeleted(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa biên bản bàn giao CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Không tìm thấy biên bản bàn giao CCDC/Vật tư để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = 0;
            for (String id : ids) {
                // Lấy thông tin trước khi xóa để gửi thông báo
                BanGiaoCCDCVatTu existingItem = service.findById(id);
                total += service.delete(id);
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoCCDCVatTuDeleted(existingItem.getIdCongTy(), id, "System");
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách biên bản bàn giao CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure("Xóa danh sách biên bản bàn giao CCDC/Vật tư thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/capnhattrangthai")
    public ResponseEntity<ApiResponse<Object>> capNhatTrangThai(@RequestParam String id, @RequestParam String userId) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            BanGiaoCCDCVatTu existingItem = service.findById(id);
            int result = service.updateTrangThai(id, userId);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoCCDCVatTuUpdated(existingItem.getIdCongTy(), id, userId);
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", result, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/huytrangthai")
    public ResponseEntity<ApiResponse<Object>> huyTrangThai(@RequestParam String id) throws SQLException {
        try {
            // Lấy thông tin trước khi cập nhật để gửi thông báo
            BanGiaoCCDCVatTu existingItem = service.findById(id);
            int result = service.huyTrangThai(id);
            if (result > 0) {
                // Gửi thông báo WebSocket
                if (existingItem != null) {
                    notificationService.notifyBanGiaoCCDCVatTuUpdated(existingItem.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.failure("Lỗi", result));
        } catch (Exception e) {
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
            List<BanGiaoCCDCVatTu> listBanGiaoCCDCVatTu;
            if (filename.endsWith(".csv")) {
                listBanGiaoCCDCVatTu = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listBanGiaoCCDCVatTu = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (BanGiaoCCDCVatTu ts : listBanGiaoCCDCVatTu) {
                if (ts.getId() != null) {
                    BanGiaoCCDCVatTu banGiaoCCDCVatTu = service.insert(ts);
                    if(banGiaoCCDCVatTu!=null){
                        count++;
                    }
                    // Gửi thông báo WebSocket cho từng item
                    notificationService.notifyBanGiaoCCDCVatTuCreated(ts.getIdCongTy(), ts.getId(), ts.getNguoiTao());
                }

            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listBanGiaoCCDCVatTu, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
