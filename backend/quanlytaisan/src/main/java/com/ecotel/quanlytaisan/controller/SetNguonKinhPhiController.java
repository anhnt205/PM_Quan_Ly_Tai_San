package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.NguonKinhPhi;
import com.ecotel.quanlytaisan.model.SetNguonKinhPhi;
import com.ecotel.quanlytaisan.service.SetNguonKinhPhiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/setnguonkinhphi")
public class SetNguonKinhPhiController {
    @Autowired
    private SetNguonKinhPhiService setNguonKinhPhiService;

    @GetMapping
    public List<SetNguonKinhPhi> getAll() {
        return setNguonKinhPhiService.getAll();
    }

    @GetMapping("/taisan/{idTaiSan}")
    public List<SetNguonKinhPhi> getByTaiSanId(@PathVariable String idTaiSan) {
        return setNguonKinhPhiService.getByTaiSanId(idTaiSan);
    }

    @GetMapping("/nguonkinhphi/{idNguonKinhPhi}")
    public List<SetNguonKinhPhi> getByNguonKinhPhiId(@PathVariable String idNguonKinhPhi) {
        return setNguonKinhPhiService.getByNguonKinhPhiId(idNguonKinhPhi);
    }

    @GetMapping("/nguonkinhphi-detail/{idTaiSan}")
    public List<NguonKinhPhi> getNguonKinhPhiByTaiSan(@PathVariable String idTaiSan) {
        return setNguonKinhPhiService.getNguonKinhPhiByTaiSan(idTaiSan);
    }

    @GetMapping("/{id}")
    public SetNguonKinhPhi getById(@PathVariable String id) {
        return setNguonKinhPhiService.getById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody SetNguonKinhPhi snkp) {
        try {
            int result = setNguonKinhPhiService.create(snkp);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo set nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo set nguồn kinh phí thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<SetNguonKinhPhi> list) {
        try {
            int total = 0;
            for (SetNguonKinhPhi item : list) {
                total += setNguonKinhPhiService.create(item);
            }
            if (total > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo danh sách set nguồn kinh phí thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo danh sách set nguồn kinh phí thất bại", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable String id, @RequestBody SetNguonKinhPhi snkp) {
        try {
            snkp.setId(id);
            int result = setNguonKinhPhiService.update(snkp);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật set nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy set nguồn kinh phí để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        try {
            int result = setNguonKinhPhiService.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa set nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy set nguồn kinh phí để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/taisan/{idTaiSan}")
    public ResponseEntity<ApiResponse<Object>> deleteByTaiSanId(@PathVariable String idTaiSan) {
        try {
            int result = setNguonKinhPhiService.deleteByTaiSanId(idTaiSan);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa set nguồn kinh phí theo tài sản thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy set nguồn kinh phí để xóa", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/nguonkinhphi/{idNguonKinhPhi}")
    public ResponseEntity<ApiResponse<Object>> deleteByNguonKinhPhiId(@PathVariable String idNguonKinhPhi) {
        try {
            int result = setNguonKinhPhiService.deleteByNguonKinhPhiId(idNguonKinhPhi);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa set nguồn kinh phí theo nguồn kinh phí thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy set nguồn kinh phí để xóa", result));
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
                total += setNguonKinhPhiService.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách set nguồn kinh phí thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách set nguồn kinh phí thất bại", total));
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
            List<SetNguonKinhPhi> listSetNguonKinhPhi;
            if (filename.endsWith(".csv")) {
                listSetNguonKinhPhi = setNguonKinhPhiService.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listSetNguonKinhPhi = setNguonKinhPhiService.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            // Tạo 2 danh sách kết quả
            List<SetNguonKinhPhi> successList = new ArrayList<>();
            List<Map<String, Object>> failureList = new ArrayList<>();

            for (SetNguonKinhPhi snkp : listSetNguonKinhPhi) {
                if (snkp.getId() == null) {
                    // Ghi nhận thất bại do thiếu ID
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", snkp);
                    failItem.put("error", "Thiếu ID");
                    failureList.add(failItem);
                    continue;
                }

                try {
                    int inserted = setNguonKinhPhiService.create(snkp);
                    if (inserted > 0) {
                        successList.add(snkp);
                    } else {
                        Map<String, Object> failItem = new HashMap<>();
                        failItem.put("data", snkp);
                        failItem.put("error", "Không thể insert vào DB");
                        failureList.add(failItem);
                    }
                } catch (Exception ex) {
                    Map<String, Object> failItem = new HashMap<>();
                    failItem.put("data", snkp);
                    failItem.put("error", ex.getMessage());
                    failureList.add(failItem);
                }
            }

            // Chuẩn bị dữ liệu trả về
            Map<String, Object> result = new HashMap<>();
            result.put("total", listSetNguonKinhPhi.size());
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
}
