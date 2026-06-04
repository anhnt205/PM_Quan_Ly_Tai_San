package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.mapper.LyLichMapper;
import com.ecotel.quanlytaisan.model.*;
import com.ecotel.quanlytaisan.repository.LyLichRepository;
import com.ecotel.quanlytaisan.repository.LyLichTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LyLichService {
    private final LyLichRepository lyLichRepository;
    private final LyLichTemplateRepository lyLichTemplateRepository;
    private final LyLichMapper lyLichMapper;

    // CREATE
    public LyLichResponse create(LyLichRequest request){
        LyLichTemplate template = getLyLichTemplateById(request.getIdLyLichTemplate());

        LyLich entity = lyLichMapper.toEntity(request);
        entity.setLyLichTemplate(template);

        LyLich savedEntity = lyLichRepository.save(entity);
        return lyLichMapper.toResponse(savedEntity);
    }

    // CREATE BATCH
    @Transactional
    public List<LyLichResponse> createBatch(List<LyLichRequest> requests) {
        // Lấy danh sách id template duy nhất
        Set<String> templateIds = requests.stream()
                .map(LyLichRequest::getIdLyLichTemplate)
                .collect(Collectors.toSet());

        // Load tất cả template một lần
        List<LyLichTemplate> templates = lyLichTemplateRepository.findAllById(templateIds);
        // Map template theo id để dễ truy cập
        Map<String, LyLichTemplate> templateMap = templates.stream()
                .collect(Collectors.toMap(LyLichTemplate::getId, r -> r));

        List<LyLich> entities = requests.stream()
                .map(request -> {
                    LyLich entity = lyLichMapper.toEntity(request);

                    LyLichTemplate template = templateMap.get(request.getIdLyLichTemplate());
                    if (template == null) {
                        throw new RuntimeException(
                                "Không tìm thấy LyLichTemplate với id: "
                                        + request.getIdLyLichTemplate()
                        );
                    }

                    entity.setLyLichTemplate(template);
                    return entity;
                })
                .toList();

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
        LyLichTemplate template = getLyLichTemplateById(request.getIdLyLichTemplate());
        lyLichMapper.updateEntityFromRequest(request, existingEntity);
        existingEntity.setLyLichTemplate(template);
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

        // Map Template
        List<String> templateIds = requests.stream()
                .map(LyLichRequest::getIdLyLichTemplate)
                .toList();
        List<LyLichTemplate> templates = lyLichTemplateRepository.findAllById(templateIds);
        Map<String, LyLichTemplate> templateMap = templates.stream()
                .collect(Collectors.toMap(LyLichTemplate::getId, t -> t));

        existingEntities.forEach(entity -> {
            LyLichRequest request = requestMap.get(entity.getId());
            if (request != null) {
                lyLichMapper.updateEntityFromRequest(request, entity);
                entity.setLyLichTemplate(templateMap.get(request.getIdLyLichTemplate()));
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

    private LyLichTemplate getLyLichTemplateById(String id) {
        return lyLichTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ly lich template not found with id: " + id));
    }
}
