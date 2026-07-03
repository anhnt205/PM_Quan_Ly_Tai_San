package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.LyLichTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LyLichTemplateRepository extends JpaRepository<LyLichTemplate, String> {
    Optional<LyLichTemplate> findByMaLyLich(String maLyLich);
}