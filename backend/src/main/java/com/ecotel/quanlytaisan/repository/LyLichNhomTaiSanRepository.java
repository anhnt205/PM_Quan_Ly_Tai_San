package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.LyLichNhomTaiSan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LyLichNhomTaiSanRepository extends JpaRepository<LyLichNhomTaiSan, LyLichNhomTaiSan.LyLichNhomTaiSanId> {
}
