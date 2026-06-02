package com.ecotel.quanlytaisan.mapper;

import com.ecotel.quanlytaisan.model.LyLich;
import com.ecotel.quanlytaisan.model.LyLichRequest;
import com.ecotel.quanlytaisan.model.LyLichResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LyLichMapper {
    LyLich toEntity(LyLichRequest request);
    LyLichResponse toResponse(LyLich entity);

    void updateEntityFromRequest(LyLichRequest request, @MappingTarget LyLich entity);

    List<LyLich> toEntityList(List<LyLichRequest> requests);
}
