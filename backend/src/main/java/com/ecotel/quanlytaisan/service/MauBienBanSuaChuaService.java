package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.model.MauBienBanSuaChua;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.exception.ResourceNotFoundException;
import com.ecotel.quanlytaisan.repository.MauBienBanSuaChuaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MauBienBanSuaChuaService {

    private final MauBienBanSuaChuaRepository repository;

    /**
     * Nếu entity được đặt là macDinh=true và có loaiBienBan,
     * chỉ reset các bản ghi cùng loaiBienBan.
     * Nếu không có loaiBienBan, fallback reset toàn bảng (hành vi cũ).
     */
    private void applyMacDinhReset(MauBienBanSuaChua saved) {
        if (!Boolean.TRUE.equals(saved.getMacDinh())) return;

        if (saved.getLoaiBienBan() != null && !saved.getLoaiBienBan().isBlank()) {
            repository.resetMacDinhForLoaiBienBanExcept(saved.getId(), saved.getLoaiBienBan());
        } else {
            repository.resetMacDinhForAllExcept(saved.getId());
        }
    }

    @Transactional
    public MauBienBanSuaChua create(MauBienBanSuaChua entity) {
        entity.setId(null); // đảm bảo INSERT, tránh Hibernate merge khi frontend gửi id=""
        MauBienBanSuaChua saved = repository.save(entity);
        applyMacDinhReset(saved);
        return saved;
    }

    @Transactional
    public List<MauBienBanSuaChua> createBatch(List<MauBienBanSuaChua> entities) {
        List<MauBienBanSuaChua> saved = repository.saveAll(entities);
        // Nếu trong danh sách thêm có phần tử đặt mặc định, lấy phần tử cuối cùng làm mặc định
        saved.stream()
                .filter(e -> Boolean.TRUE.equals(e.getMacDinh()))
                .reduce((first, second) -> second)
                .ifPresent(this::applyMacDinhReset);
        return saved;
    }

    @Transactional
    public MauBienBanSuaChua update(String id, MauBienBanSuaChua entity) {
        MauBienBanSuaChua existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu biên bản với ID: " + id));

        if (entity.getMa() != null) existing.setMa(entity.getMa());
        if (entity.getTen() != null) existing.setTen(entity.getTen());
        if (entity.getMacDinh() != null) existing.setMacDinh(entity.getMacDinh());
        if (entity.getLoaiBienBan() != null) existing.setLoaiBienBan(entity.getLoaiBienBan());
        if (entity.getCongTy() != null) existing.setCongTy(entity.getCongTy());

        MauBienBanSuaChua updated = repository.save(existing);
        applyMacDinhReset(updated);
        return updated;
    }

    @Transactional
    public List<MauBienBanSuaChua> updateBatch(List<MauBienBanSuaChua> entities) {
        List<MauBienBanSuaChua> mergedList = new java.util.ArrayList<>();
        for (MauBienBanSuaChua entity : entities) {
            if (entity.getId() == null) {
                throw new IllegalArgumentException("ID không được để trống khi cập nhật");
            }
            MauBienBanSuaChua existing = repository.findById(entity.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu biên bản với ID: " + entity.getId()));

            if (entity.getMa() != null) existing.setMa(entity.getMa());
            if (entity.getTen() != null) existing.setTen(entity.getTen());
            if (entity.getMacDinh() != null) existing.setMacDinh(entity.getMacDinh());
            if (entity.getLoaiBienBan() != null) existing.setLoaiBienBan(entity.getLoaiBienBan());
            if (entity.getCongTy() != null) existing.setCongTy(entity.getCongTy());
            mergedList.add(existing);
        }

        List<MauBienBanSuaChua> updated = repository.saveAll(mergedList);
        updated.stream()
                .filter(e -> Boolean.TRUE.equals(e.getMacDinh()))
                .reduce((first, second) -> second)
                .ifPresent(this::applyMacDinhReset);
        return updated;
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Transactional
    public void deleteBatch(List<String> ids) {
        repository.deleteAllById(ids);
    }

    @Transactional
    public void deleteAll() {
        repository.deleteAll();
    }

    public PageResponse<MauBienBanSuaChua> getPaged(int page, int size, String ten, String loaiBienBan, Boolean macDinh) {
        Pageable pageable = PageRequest.of(page, size);

        String t = (ten != null && !ten.trim().isEmpty()) ? ten.trim() : null;
        String l = (loaiBienBan != null && !loaiBienBan.trim().isEmpty()) ? loaiBienBan.trim() : null;

        Page<MauBienBanSuaChua> pageResult = repository.findByTenAndLoaiBienBanAndMacDinh(t, l, macDinh, pageable);

        return new PageResponse<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                page,
                size
        );
    }

    /**
     * Đặt mặc định theo loaiBienBan: chỉ 1 mẫu được là mặc định trong mỗi loại.
     */
    @Transactional
    public MauBienBanSuaChua setMacDinh(String id) {
        MauBienBanSuaChua entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu biên bản với ID: " + id));
        entity.setMacDinh(true);
        MauBienBanSuaChua saved = repository.save(entity);
        applyMacDinhReset(saved);
        return saved;
    }
}
