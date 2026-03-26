package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.service.NhanVienService;
import com.ecotel.quanlytaisan.service.NotificationService;
import com.ecotel.quanlytaisan.service.S3Service;
import com.ecotel.quanlytaisan.utils.HashUtil;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


import java.util.ArrayList;
import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/api/nhanvien")
public class NhanVienController {
    @Autowired
    private NhanVienService nhanVienService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private S3Service s3Service;
    @GetMapping
    public List<NhanVienDTO> getAll(@RequestParam("idcongty") String idcongty) {
        return nhanVienService.getAll(idcongty);
    }

    @GetMapping("/paged")
    public PageResponse<NhanVienDTO> getAllPaged(
            @RequestParam("idcongty") String idcongty,
            @RequestParam(value="page",defaultValue = "0") int page,
            @RequestParam(value="size",defaultValue = "20") int size,
            @RequestParam(value="sortBy",required = false) String sortBy,
            @RequestParam(value="sortDir",required = false) String sortDir,
            @RequestParam(value="search",required = false) String search) {
        return nhanVienService.getAllPaged(idcongty, page, size, sortBy, sortDir, search);
    }

    @GetMapping("/bynhanVien")
    public List<NhanVienDTO> getByNhanVien(@RequestParam("idnhanvien") String idnhanVien) {
        return nhanVienService.getAll(idnhanVien);
    }

    @GetMapping("/{id}")
    public NhanVienDTO getById(@PathVariable("id") String id) {
        return nhanVienService.getById(id);
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<Object>> create(
            @RequestBody  NhanVien nv
    ) {
        try {
            System.out.println("Thoong tin nhan vien");
            System.out.println(nv.toString());
            int result = nhanVienService.create(nv);
            if (result > 0) {
                // Gửi thông báo socket
                notificationService.notifyNhanVienCreated(nv.getIdCongTy(), nv.getId(), "System");
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo nhân viên thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo nhân viên thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ApiResponse<Object>> update(
            @PathVariable("id") String id,
            @RequestBody  NhanVien nv
    ) {
        try {
            nv.setId(id);
            int result = nhanVienService.update(nv);
            if (result > 0) {
                // Gửi thông báo socket
                notificationService.notifyNhanVienUpdated(nv.getIdCongTy(), nv.getId(), "System");
                return ResponseEntity.ok(ApiResponse.success("Cập nhật nhân viên thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy nhân viên để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<NhanVien> list) {
        try {
            int total = 0;
            for (NhanVien item : list) {
                int result = nhanVienService.create(item);
                if (result > 0) {
                    total += result;
                    // Gửi thông báo socket cho từng nhân viên được tạo
                    notificationService.notifyNhanVienCreated(item.getIdCongTy(), item.getId(), "System");
                }
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách nhân viên thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách nhân viên thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            // Lấy thông tin nhân viên trước khi xóa để có thông tin công ty
            NhanVienDTO nhanVien = nhanVienService.getById(id);
            int result = nhanVienService.delete(id);
            if (result > 0) {
                // Gửi thông báo socket
                if (nhanVien != null) {
                    notificationService.notifyNhanVienDeleted(nhanVien.getIdCongTy(), id, "System");
                }
                return ResponseEntity.ok(ApiResponse.success("Xóa nhân viên thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy nhân viên để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int total = 0;
            for (String id : ids) {
                // Lấy thông tin nhân viên trước khi xóa để có thông tin công ty
                NhanVienDTO nhanVien = nhanVienService.getById(id);
                int result = nhanVienService.delete(id);
                if (result > 0) {
                    total += result;
                    // Gửi thông báo socket cho từng nhân viên bị xóa
                    if (nhanVien != null) {
                        notificationService.notifyNhanVienDeleted(nhanVien.getIdCongTy(), id, "System");
                    }
                }
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách nhân viên thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách nhân viên thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @GetMapping("/get-ky-so")
    public String getKySo(@RequestParam("idnhanvien") String idnhanvien, @RequestParam("pin") String pin) {
        String value = idnhanvien+pin;
        return HashUtil.sha256(value);
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
            // Đọc danh sách nhân viên
            List<NhanVien> listNhanVien;
            if (filename.endsWith(".csv")) {
                listNhanVien = nhanVienService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listNhanVien = nhanVienService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.failure("Chỉ hỗ trợ file CSV hoặc Excel", null));
            }

            // Tạo 2 danh sách kết quả
            List<NhanVien> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (NhanVien nv : listNhanVien) {
                if (nv.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", nv);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = nhanVienService.create(nv);
                    if (inserted > 0) {
                        successList.add(nv);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", nv);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", nv);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listNhanVien.size());
            result.put("successCount", successList.size());
            result.put("failureCount", failureList.size());
            result.put("successItems", successList);
            result.put("failureItems", failureList);

            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload hoàn tất", result, successList.size()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
    @PostMapping("/upload-from-excel")
    public ResponseEntity<?> uploadNhanVienExcel(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File Excel bị trống!");
            }

            int count = nhanVienService.insertNhanVienFromExcel(file);
            return ResponseEntity.ok("Đã import thành công " + count + " nhân viên.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Lỗi khi import Excel: " + e.getMessage());
        }
    }


    @PostMapping("/upload-signatures")
    public ResponseEntity<ApiResponse<Object>> uploadSignatures(@RequestParam("files") List<MultipartFile> files) {
        try {
            List<String> successList = new ArrayList<>();
            List<Map<String, String>> failureList = new ArrayList<>();

            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null || originalFilename.isEmpty()) {
                    continue;
                }

                String staffId = "";
                String extension = "png";
                int dotIndex = originalFilename.lastIndexOf(".");
                if (dotIndex > 0) {
                    staffId = originalFilename.substring(0, dotIndex);
                    extension = originalFilename.substring(dotIndex + 1);
                } else {
                    staffId = originalFilename;
                }

                NhanVien nv = nhanVienService.findEntityById(staffId);
                if (nv == null) {
                    Map<String, String> fail = new HashMap<>();
                    fail.put("fileName", originalFilename);
                    fail.put("reason", "Không tìm thấy nhân viên với mã: " + staffId);
                    failureList.add(fail);
                    continue;
                }

                try {
                    // 1. Tải ảnh lên S3
                    byte[] data = file.getBytes();
                    String s3Key = s3Service.uploadFile(data, extension);

                    // 2. Cập nhật thông tin nhân viên
                    nv.setChuKyNhay(s3Key);
                    nv.setChuKyThuong(s3Key);
                    nv.setKyNhay(true);
                    nv.setKyThuong(true);

                    nhanVienService.update(nv);
                    successList.add(staffId);
                } catch (Exception ex) {
                    Map<String, String> fail = new HashMap<>();
                    fail.put("fileName", originalFilename);
                    fail.put("reason", "Lỗi tải ảnh lên S3 hoặc cập nhật DB: " + ex.getMessage());
                    failureList.add(fail);
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("successCount", successList.size());
            result.put("failureCount", failureList.size());
            result.put("successItems", successList);
            result.put("failureItems", failureList);

            return ResponseEntity.ok(ApiResponse.success("Upload chữ ký hoàn tất", result, successList.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/delete-all")
    @Operation(summary = "Xoá toàn bộ nhân viên")
    public ResponseEntity<?> deleteAll() {
        nhanVienService.deleteAll();
        return ResponseEntity.ok("Đã xoá toàn bộ nhân viên");
    }




}