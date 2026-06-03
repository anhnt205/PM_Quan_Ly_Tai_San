package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.mapper.LyLichMapper;
import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.repository.LyLichRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // CREATE BATCH
    @Transactional
    public List<LyLichResponse> createBatch(List<LyLichRequest> requests) {
        List<LyLich> entities = lyLichMapper.toEntityList(requests);
        List<LyLich> savedEntities = lyLichRepository.saveAll(entities);
        return savedEntities.stream()
                .map(lyLichMapper::toResponse)
                .toList();
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


    // UPDATE BATCH
    @Transactional
    public List<LyLichResponse> updateBatch(List<LyLichRequest> requests) throws BadRequestException {
        if (requests == null || requests.isEmpty()) {
            throw new BadRequestException("Danh sách không được để trống");
        }

        List<String> ids = requests.stream()
                .map(LyLichRequest::getId)
                .toList();

        List<LyLich> existingEntities = lyLichRepository.findAllById(ids);

        Map<String, LyLichRequest> requestMap = requests.stream()
                .collect(Collectors.toMap(LyLichRequest::getId, r -> r));

        existingEntities.forEach(entity -> {
            LyLichRequest request = requestMap.get(entity.getId());
            if (request != null) {
                lyLichMapper.updateEntityFromRequest(request, entity);
            }
        });

        return lyLichRepository.saveAll(existingEntities)
                .stream()
                .map(lyLichMapper::toResponse)
                .toList();
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
    public void deleteBatch(List<String> ids) throws BadRequestException {
        if (ids == null || ids.isEmpty()) {
            throw new BadRequestException("Danh sách ID không được để trống");
        }
        lyLichRepository.deleteAllByIdInBatch(ids);
    }
}
