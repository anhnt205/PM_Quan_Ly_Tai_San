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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MauBienBanSuaChuaService {

    private final MauBienBanSuaChuaRepository repository;

    @Transactional
    public MauBienBanSuaChua create(MauBienBanSuaChua entity) {
        if (Boolean.TRUE.equals(entity.getMacDinh())) {
            MauBienBanSuaChua saved = repository.save(entity);
            repository.resetMacDinhForAllExcept(saved.getId());
            return saved;
        }
        return repository.save(entity);
    }

    @Transactional
    public List<MauBienBanSuaChua> createBatch(List<MauBienBanSuaChua> entities) {
        List<MauBienBanSuaChua> saved = repository.saveAll(entities);
        // Nếu trong danh sách thêm có phần tử đặt mặc định, lấy phần tử cuối cùng làm mặc định
        Optional<MauBienBanSuaChua> macDinhOpt = saved.stream()
                .filter(e -> Boolean.TRUE.equals(e.getMacDinh()))
                .reduce((first, second) -> second);
                
        if (macDinhOpt.isPresent()) {
            repository.resetMacDinhForAllExcept(macDinhOpt.get().getId());
        }
        return saved;
    }

    @Transactional
    public MauBienBanSuaChua update(String id, MauBienBanSuaChua entity) {
        Optional<MauBienBanSuaChua> existingOpt = repository.findById(id);
        if (existingOpt.isPresent()) {
            MauBienBanSuaChua existing = existingOpt.get();
            if (entity.getMa() != null) {
                existing.setMa(entity.getMa());
            }
            if (entity.getTen() != null) {
                existing.setTen(entity.getTen());
            }
            if (entity.getMacDinh() != null) {
                existing.setMacDinh(entity.getMacDinh());
            }

            MauBienBanSuaChua updated = repository.save(existing);
            if (Boolean.TRUE.equals(updated.getMacDinh())) {
                repository.resetMacDinhForAllExcept(updated.getId());
            }
            return updated;
        }
        throw new ResourceNotFoundException("Không tìm thấy mẫu biên bản với ID: " + id);
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
            
            if (entity.getMa() != null) {
                existing.setMa(entity.getMa());
            }
            if (entity.getTen() != null) {
                existing.setTen(entity.getTen());
            }
            if (entity.getMacDinh() != null) {
                existing.setMacDinh(entity.getMacDinh());
            }
            mergedList.add(existing);
        }

        List<MauBienBanSuaChua> updated = repository.saveAll(mergedList);
        Optional<MauBienBanSuaChua> macDinhOpt = updated.stream()
                .filter(e -> Boolean.TRUE.equals(e.getMacDinh()))
                .reduce((first, second) -> second);
                
        if (macDinhOpt.isPresent()) {
            repository.resetMacDinhForAllExcept(macDinhOpt.get().getId());
        }
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

    public PageResponse<MauBienBanSuaChua> getPaged(int page, int size, String ten) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MauBienBanSuaChua> pageResult;
        
        if (ten != null && !ten.trim().isEmpty()) {
            pageResult = repository.findByTenContainingIgnoreCase(ten.trim(), pageable);
        } else {
            pageResult = repository.findAll(pageable);
        }

        return new PageResponse<>(
                pageResult.getContent(),
                pageResult.getTotalElements(),
                page,
                size
        );
    }

    @Transactional
    public MauBienBanSuaChua setMacDinh(String id) {
        MauBienBanSuaChua entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu biên bản với ID: " + id));
        entity.setMacDinh(true);
        MauBienBanSuaChua saved = repository.save(entity);
        repository.resetMacDinhForAllExcept(id);
        return saved;
    }
}
