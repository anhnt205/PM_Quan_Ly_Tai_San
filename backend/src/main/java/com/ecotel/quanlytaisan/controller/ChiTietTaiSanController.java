package com.ecotel.quanlytaisan.controller;


import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
import com.ecotel.quanlytaisan.model.ChiTietTaiSan;
import com.ecotel.quanlytaisan.service.ChiTietTaiSanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chitiettaisan")
public class ChiTietTaiSanController {
    @Autowired
    private ChiTietTaiSanService service;
    @Autowired
    private ChiTietTaiSanService chiTietTaiSanService;


    @GetMapping
    public ResponseEntity<ApiResponse<List<ChiTietTaiSan>>> getAll(@RequestParam("idTaiSan") String idTaiSan) {
        try {
            List<ChiTietTaiSan> list = service.getAll(idTaiSan);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChiTietTaiSan>> getById(@PathVariable("id") String id) {
        try {
            ChiTietTaiSan ts = service.getById(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết thành công", ts, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy Id = " + id, null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChiTietTaiSan ts) {
        try {
            int rows = service.create(ts);
            if (rows > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm chi tiết tài sản thành công", ts, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<ChiTietTaiSan> list) {
        try {
            List<ChiTietTaiSan> existingList = chiTietTaiSanService.getAll(list.get(0).getIdTaiSan());
            Set<String> existingIds = existingList.stream()
                    .map(ChiTietTaiSan::getId)
                    .collect(Collectors.toSet());

            int rows = 0;
            for (ChiTietTaiSan ts : list) {
                if (existingIds.contains(ts.getId())) {
                    rows += service.update(ts);
                } else {
                    rows += service.create(ts);
                }
            }

            if (rows > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm danh sách chi tiết tài sản thành công", list, rows));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChiTietTaiSan> list) {
        try {
            int rows = 0;
            for (ChiTietTaiSan ts : list) {
                rows += service.update(ts);
            }
            if (rows > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Cập nhật danh sách chi tiết tài sản thành công", list, rows));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật danh sách thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> deleteBatch(@RequestBody List<String> ids) {
        try {
            int rows = 0;
            for (String id : ids) {
                rows += service.delete(id);
            }
            if (rows > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết tài sản thành công", ids, rows));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int rows = service.delete(id);
            if (rows > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, rows));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id, @RequestBody ChiTietTaiSan ts) {
        try {
            ts.setId(id);
            int rows = service.update(ts);
            if (rows > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", ts, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật thất bại", null));
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
            List<ChiTietTaiSan> listChiTietTaiSan;
            if (filename.endsWith(".csv")) {
                listChiTietTaiSan = chiTietTaiSanService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChiTietTaiSan = chiTietTaiSanService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (ChiTietTaiSan ts : listChiTietTaiSan) {
                count += chiTietTaiSanService.create(ts);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listChiTietTaiSan, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

}
