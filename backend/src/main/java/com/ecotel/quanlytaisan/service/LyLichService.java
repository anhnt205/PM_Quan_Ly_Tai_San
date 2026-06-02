package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.mapper.LyLichMapper;
import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.repository.LyLichRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LyLichService {
    private final LyLichRepository lyLichRepository;
    private final LyLichMapper lyLichMapper;

    // CREATE
    public LyLichResponse create(LyLichRequest request){
        LyLich entity = lyLichMapper.toEntity(request);
        LyLich savedEntity = lyLichRepository.save(entity);
        return lyLichMapper.toResponse(savedEntity);
    }

    // READ
    @Transactional(readOnly = true)
    public PageResponse<LyLichResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LyLich> pageEntity = lyLichRepository.findAll(pageable);

        List<LyLichResponse> items = pageEntity.getContent()
                .stream()
                .map(lyLichMapper::toResponse)
                .toList();

        return new PageResponse<>(items, pageEntity.getTotalElements(), page, size);
    }

    // GET BY ID
    @Transactional(readOnly = true)
    public LyLichResponse getById(String id) {
        LyLich entity = lyLichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ly lich not found with id: " + id));
        return lyLichMapper.toResponse(entity);
    }

    // UPDATE
    @Transactional
    public LyLichResponse update(String id, LyLichRequest request) {
        LyLich existingEntity = lyLichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ly lich not found with id: " + id));
        lyLichMapper.updateEntityFromRequest(request, existingEntity);
        LyLich updatedEntity = lyLichRepository.save(existingEntity);
        return lyLichMapper.toResponse(updatedEntity);
    }


    // UPDATE LIST
    @Transactional
    public void updateList(List<LyLichRequest> requests) {
        lyLichRepository.deleteAllInBatch();
        lyLichRepository.saveAll(lyLichMapper.toEntityList(requests));
    }

    // DELETE
    @Transactional
    public void delete(String id) {
        if (!lyLichRepository.existsById(id)) {
            throw new RuntimeException("Ly lich not found with id: " + id);
        }
        lyLichRepository.deleteById(id);
    }

    // DELETE ALL
    @Transactional
    public void deleteAll() {
        lyLichRepository.deleteAllInBatch();
    }
}
