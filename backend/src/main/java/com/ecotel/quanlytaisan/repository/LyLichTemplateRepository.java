package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.LyLichTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LyLichTemplateRepository extends JpaRepository<LyLichTemplate, String> {
}