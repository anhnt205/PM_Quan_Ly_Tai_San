package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.LyLich;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LyLichRepository extends JpaRepository<LyLich, String> {
    boolean existsByMaLyLich(String maLyLich);
}
