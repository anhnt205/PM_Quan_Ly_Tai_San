package com.ecotel.quanlytaisan.controller;

import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.model.ChiTietBanGiaoCCDCVatTu;
import com.ecotel.quanlytaisan.service.ChiTietBanGiaoCCDCVatTuService;
import com.ecotel.quanlytaisan.service.ChiTietDieuDongCCDCVatTuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chitietbangiaoccdcvattu")
public class ChiTietBanGiaoCCDCVatTuController {
    @Autowired
    private ChiTietBanGiaoCCDCVatTuService service;
    @Autowired
    private ChiTietDieuDongCCDCVatTuService chiTietDieuDongCCDCVatTuService;


    @GetMapping
    public List<ChiTietBanGiaoCCDCVatTuDTO> getAll(
            @RequestParam("idbangiaoccdcvattu") String idbangiaoccdcvattu,
            @RequestParam("iddieudongccdcvattu") String iddieudongccdcvattu) {

        List<ChiTietBanGiaoCCDCVatTuDTO> banGiaoList = service.findAll(idbangiaoccdcvattu);
        List<ChiTietDieuDongCCDCVatTuDTO> dieuDongList = chiTietDieuDongCCDCVatTuService.findAll(iddieudongccdcvattu);
        System.out.println(banGiaoList);
        System.out.println(dieuDongList);
        if (banGiaoList == null) return Collections.emptyList();
        if (dieuDongList == null) dieuDongList = Collections.emptyList();


        // Tạo Map để tra cứu nhanh
        Map<String, ChiTietDieuDongCCDCVatTuDTO> dieuDongMap = dieuDongList.stream()
                .collect(Collectors.toMap(ChiTietDieuDongCCDCVatTuDTO::getId, d -> d));

        // Gán thông tin điều động
        for (ChiTietBanGiaoCCDCVatTuDTO banGiao : banGiaoList) {
            ChiTietDieuDongCCDCVatTuDTO dieuDong = dieuDongMap.get(banGiao.getIdChiTietDieuDong());
            if (dieuDong != null) {
                banGiao.setChiTietDieuDongCCDCVatTuDTO(dieuDong);
            }
        }

        return banGiaoList;
    }

    @GetMapping("/get-all")
    public List<ChiTietBanGiaoCCDCVatTu> getAllDieuDong() {
        return service.getdAll();
    }

    @GetMapping("/by-dieu-dong/{id}")
    public List<ChiTietBanGiaoCCDCVatTuDTO> getAllByDieuDong(@PathVariable("id") String id) {
        return service.findByIdDieuDong(id);
    }


    @GetMapping("/{id}")
    public ChiTietBanGiaoCCDCVatTuDTO getById(@PathVariable("id") String id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> create(@RequestBody ChiTietBanGiaoCCDCVatTu obj) {
        try {
            int result = service.insert(obj);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Tạo chi tiết bàn giao CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Tạo chi tiết bàn giao CCDC/Vật tư thất bại", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Object>> update(@RequestBody ChiTietBanGiaoCCDCVatTu obj) {
        try {
            int result = service.update(obj);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật chi tiết bàn giao CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết bàn giao CCDC/Vật tư để cập nhật", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> createOrUpdateBatch(@RequestBody List<ChiTietBanGiaoCCDCVatTu> list) {
        try {
            if (list == null || list.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("Danh sách rỗng", null));
            }

            // Lấy danh sách Id đã có trong DB
            List<ChiTietBanGiaoCCDCVatTuDTO> existingList = service.findAll(list.get(0).getIdBanGiaoCCDCVatTu());
            Set<String> existingIds = existingList.stream()
                    .map(ChiTietBanGiaoCCDCVatTuDTO::getId)
                    .collect(Collectors.toSet());

            int rows = 0;
            for (ChiTietBanGiaoCCDCVatTu item : list) {
                if (existingIds.contains(item.getId())) {
                    rows += service.update(item);
                } else {
                    rows += service.insert(item);
                }
            }

            if (rows > 0) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(ApiResponse.success("Batch insert/update thành công", list, rows));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Batch insert/update thất bại", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @PutMapping("/batch")
    public ResponseEntity<ApiResponse<Object>> updateBatch(@RequestBody List<ChiTietBanGiaoCCDCVatTu> list) {
        try {
            int total = 0;
            for (ChiTietBanGiaoCCDCVatTu item : list) {
                total += service.update(item); // dùng lại update có sẵn
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Cập nhật danh sách chi tiết bàn giao CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết bàn giao CCDC/Vật tư để cập nhật", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable("id") String id) {
        try {
            int result = service.delete(id);
            if (result > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa chi tiết bàn giao CCDC/Vật tư thành công", null, result));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.failure("Không tìm thấy chi tiết bàn giao CCDC/Vật tư để xóa", result));
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
                total += service.delete(id);
            }
            if (total > 0) {
                return ResponseEntity.ok(ApiResponse.success("Xóa danh sách chi tiết bàn giao CCDC/Vật tư thành công", null, total));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Xóa danh sách chi tiết bàn giao CCDC/Vật tư thất bại", total));
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
            List<ChiTietBanGiaoCCDCVatTu> listChiTietBanGiaoCCDCVatTu;
            if (filename.endsWith(".csv")) {
                listChiTietBanGiaoCCDCVatTu = service.readCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                listChiTietBanGiaoCCDCVatTu = service.readExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Chỉ hỗ trợ file CSV hoặc Excel");
            }

            int count = 0;
            for (ChiTietBanGiaoCCDCVatTu ts : listChiTietBanGiaoCCDCVatTu) {
                count += service.insert(ts);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Upload thành công, đã insert " + count + " bản ghi", listChiTietBanGiaoCCDCVatTu, count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.failure("Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
