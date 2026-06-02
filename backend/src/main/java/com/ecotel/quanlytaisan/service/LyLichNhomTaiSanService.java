package com.ecotel.quanlytaisan.service;

import com.ecotel.quanlytaisan.mapper.LyLichNhomTaiSanMapper;
import com.ecotel.quanlytaisan.model.LyLichNhomTaiSan;
import com.ecotel.quanlytaisan.model.LyLichNhomTaiSanRequest;
import com.ecotel.quanlytaisan.model.LyLichNhomTaiSanResponse;
import com.ecotel.quanlytaisan.model.PageResponse;
import com.ecotel.quanlytaisan.repository.LyLichNhomTaiSanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LyLichNhomTaiSanService {
    private final LyLichNhomTaiSanRepository lyLichNhomTaiSanRepository;
    private final LyLichNhomTaiSanMapper lyLichNhomTaiSanMapper;
    private final NhomTaiSanService nhomTaiSanService;

    // CREATE
    public LyLichNhomTaiSanResponse create(LyLichNhomTaiSanRequest request){
        LyLichNhomTaiSan entity = lyLichNhomTaiSanMapper.toEntity(request);
        LyLichNhomTaiSan savedEntity = lyLichNhomTaiSanRepository.save(entity);
        return lyLichNhomTaiSanMapper.toResponse(savedEntity);
    }

    // READ
    @Transactional(readOnly = true)
    public PageResponse<LyLichNhomTaiSanResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LyLichNhomTaiSan> pageEntity = lyLichNhomTaiSanRepository.findAll(pageable);

        List<LyLichNhomTaiSanResponse> items = pageEntity.getContent()
                .stream()
                .map(lyLichNhomTaiSanMapper::toResponse)
                .toList();

        return new PageResponse<>(items, pageEntity.getTotalElements(), page, size);
    }

    // UPDATE LIST
    @Transactional
    public void updateList(List<LyLichNhomTaiSanRequest> requests) {
        lyLichNhomTaiSanRepository.deleteAllInBatch();
        lyLichNhomTaiSanRepository.saveAll(lyLichNhomTaiSanMapper.toEntityList(requests));
    }
}
