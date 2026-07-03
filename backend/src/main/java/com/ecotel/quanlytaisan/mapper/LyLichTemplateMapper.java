package com.ecotel.quanlytaisan.mapper;

import com.ecotel.quanlytaisan.model.LyLichTemplate;

import com.ecotel.quanlytaisan.model.LyLichTemplateResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LyLichTemplateMapper {
    LyLichTemplateResponse toResponse(LyLichTemplate entity);

     List<LyLichTemplateResponse> toResponseList(List<LyLichTemplate> entities);
}
