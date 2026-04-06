package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.ApiResponse;
import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuu;
import com.ecotel.quanlytaisan.model.ChiTietDonViSoHuuEnrichedDTO;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.model.UpdateChiTietDonViSoHuu;
import com.ecotel.quanlytaisan.service.ChiTietDonViSoHuuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/chitietdonvisohuu")
public class ChiTietDonViSoHuuController {

    @Autowired
    private ChiTietDonViSoHuuService service;

    // --- GET ALL ---
    @GetMapping
    public ResponseEntity<ApiResponse<List<ChiTietDonViSoHuu>>> getAll() {
        try {
            List<ChiTietDonViSoHuu> list = service.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- GET BY ID ---
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChiTietDonViSoHuu>> getById(@PathVariable("id") String id) {
        try {
            ChiTietDonViSoHuu data = service.getById(id);
            if (data == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.failure("Không tìm thấy Id = " + id, null));
            }
            return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết thành công", data, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- GET PAGED ENRICHED ---
    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PageResponse<ChiTietDonViSoHuuEnrichedDTO>>> getPagedEnriched(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String idDonViSoHuu,
            @RequestParam(required = false) String date) {
        try {
            PageResponse<ChiTietDonViSoHuuEnrichedDTO> result = service.getPagedEnriched(page, size, search, idDonViSoHuu, date);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phân trang thành công", result, (int) result.getTotalItems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- SEARCH ---
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ChiTietDonViSoHuu>>> search(@RequestParam("q") String q) {
        try {
            List<ChiTietDonViSoHuu> list = service.search(q);
            return ResponseEntity.ok(ApiResponse.success("Tìm kiếm thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- GET BY IdCCDCVT ---
    @GetMapping("/by-ccdcvt/{id}")
    public ResponseEntity<ApiResponse<List<ChiTietDonViSoHuu>>> getByIdCCDCVT(@PathVariable("id") String id) {
        try {
            List<ChiTietDonViSoHuu> list = service.getByIdCCDCVT(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách theo IdCCDCVT thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- GET BY IdDonViSoHuu ---
    @GetMapping("/by-donvisohuu/{id}")
    public ResponseEntity<ApiResponse<List<ChiTietDonViSoHuu>>> getByIdDonViSoHuu(@PathVariable("id") String id) {
        try {
            List<ChiTietDonViSoHuu> list = service.getByIdDonViSoHuu(id);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách theo IdDonViSoHuu thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- GET BY IdDonViSoHuu (ENRICHED - JOIN CCDCVatTu + ChiTietTaiSan) ---
    @GetMapping("/by-donvisohuu-enriched/{id}")
    public ResponseEntity<ApiResponse<List<ChiTietDonViSoHuuEnrichedDTO>>> getEnrichedByIdDonViSoHuu(
            @PathVariable("id") String id) {
        try {
            List<ChiTietDonViSoHuuEnrichedDTO> list = service.getEnrichedByIdDonViSoHuu(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách enriched theo IdDonViSoHuu thành công", list, list.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChiTietDonViSoHuu entity) {
        try {
            ChiTietDonViSoHuu saved = service.add(entity);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thêm chi tiết đơn vị sở hữu thành công", saved, 1));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- UPDATE ---
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> update(@PathVariable("id") String id,
                                                      @RequestBody ChiTietDonViSoHuu entity) {
        try {
            boolean ok = service.update(id, entity);
            if (ok) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", entity, 1));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Cập nhật thất bại hoặc không tồn tại Id = " + id, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- CREATE LIST ---
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createBatch(@RequestBody List<ChiTietDonViSoHuu> entities) {
        try {
            List<ChiTietDonViSoHuu> savedList = new ArrayList<>();
            for (ChiTietDonViSoHuu entity : entities) {
                ChiTietDonViSoHuu saved = service.add(entity);
                if (saved != null) {
                    savedList.add(saved);
                }
            }
            if (!savedList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Thêm danh sách chi tiết đơn vị sở hữu thành công", savedList, savedList.size()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Thêm danh sách chi tiết đơn vị sở hữu thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // --- UPDATE LIST ---
    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChiTietDonViSoHuu> entities) {
        try {
            int updatedCount = 0;
            for (ChiTietDonViSoHuu entity : entities) {
                if (entity.getId() != null) { // đảm bảo có Id
                    boolean ok = service.update(entity.getId(), entity);
                    if (ok) {
                        updatedCount++;
                    }
                }
            }
            if (updatedCount > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chi tiết đơn vị sở hữu thành công", null, updatedCount));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Không có bản ghi nào được cập nhật", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            boolean ok = service.delete(id);
            if (ok) {
                return ResponseEntity.ok(ApiResponse.success("Xóa thành công", null, 0));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa thất bại hoặc không tồn tại Id = " + id, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @PostMapping("/update-so-luong")
    public ResponseEntity<ApiResponse<Object>> updateSoLuong(
            @RequestBody UpdateChiTietDonViSoHuu request) {
        try {
            int rows = service.updateSoLuong(
                    request.getIdCCDCVT(),
                    request.getIdDonViGui(),
                    request.getIdDonViNhan(),
                    request.getSoLuongBanGiao(),
                    request.getSoQuyetDinh(),
                    request.getSoChungTu(),
                    request.getThoiGianBanGiao(),
                    request.getIdTsCon()

            );

            if (rows > 0) {
                return ResponseEntity.ok(
                        ApiResponse.success("Cập nhật số lượng thành công", null, rows)
                );
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Không có bản ghi nào được cập nhật", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/update-so-luong/batch")
    public ResponseEntity<ApiResponse<Object>> updateSoLuongBatch(
            @RequestBody List<UpdateChiTietDonViSoHuu> chiTietDonViSoHuuList) {
        try {
            int rows = 0;
            for (UpdateChiTietDonViSoHuu request : chiTietDonViSoHuuList) {
                rows += service.updateSoLuong(
                        request.getIdCCDCVT(),
                        request.getIdDonViGui(),
                        request.getIdDonViNhan(),
                        request.getSoLuongBanGiao(),
                        request.getSoQuyetDinh(),
                        request.getSoChungTu(),
                        request.getThoiGianBanGiao(),
                        request.getIdTsCon()

                );
            }


            if (rows > 0) {
                return ResponseEntity.ok(
                        ApiResponse.success("Cập nhật số lượng thành công", null, rows)
                );
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Không có bản ghi nào được cập nhật", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    /**
     * API lấy danh sách nhóm đơn vị sở hữu theo Id Tài sản (IdCCDCVT)
     */
    @GetMapping("/nhom-don-vi-so-huu/{IdCCDCVT}")
    public ResponseEntity<ApiResponse<Object>> getNhomDonViSoHuu(
            @PathVariable("IdCCDCVT") String IdCCDCVT) {
        try {
            List<String> list = service.getNhomDonViSoHuu(IdCCDCVT);
            return ResponseEntity.ok(
                    ApiResponse.success("Lấy danh sách nhóm đơn vị sở hữu thành công", list, list.size())
            );
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
            List<ChiTietDonViSoHuu> listChiTietDonViSoHuu;
            if (filename.endsWith(".csv")) {
                listChiTietDonViSoHuu = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChiTietDonViSoHuu = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (ChiTietDonViSoHuu ts : listChiTietDonViSoHuu) {
                service.add(ts);
                count += 1;
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listChiTietDonViSoHuu, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
