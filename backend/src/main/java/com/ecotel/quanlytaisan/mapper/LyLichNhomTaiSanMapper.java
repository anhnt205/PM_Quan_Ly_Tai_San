package com.ecotel.quanlytaisan.mapper;

import com.ecotel.quanlytaisan.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LyLichNhomTaiSanMapper {

    default LyLichNhomTaiSan toEntity(LyLichNhomTaiSanRequest request) {
        LyLichNhomTaiSan.LyLichNhomTaiSanId id = new LyLichNhomTaiSan.LyLichNhomTaiSanId(
                request.getLyLichId(),
                request.getNhomTaiSanId()
        );

        LyLich lyLich = LyLich.builder()
                .id(request.getLyLichId())
                .build();

        NhomTaiSan nhomTaiSan = NhomTaiSan.builder()
                .id(request.getNhomTaiSanId())
                .build();

        LyLichNhomTaiSan entity = new LyLichNhomTaiSan();
        entity.setId(id);
        entity.setLyLich(lyLich);
        entity.setNhomTaiSan(nhomTaiSan);
        return entity;
    }

    List<LyLichNhomTaiSan> toEntityList(List<LyLichNhomTaiSanRequest> requests);

    @Mapping(source = "id.lyLichId", target = "lyLichId")
    @Mapping(source = "id.nhomTaiSanId", target = "nhomTaiSanId")
    @Mapping(source = "lyLich.tenLyLich", target = "tenLyLich")
    @Mapping(source = "nhomTaiSan.tenNhom", target = "tenNhomTaiSan")
    LyLichNhomTaiSanResponse toResponse(LyLichNhomTaiSan entity);

    void updateEntityFromRequest(LyLichNhomTaiSanRequest request, @MappingTarget LyLichNhomTaiSan entity);
}
