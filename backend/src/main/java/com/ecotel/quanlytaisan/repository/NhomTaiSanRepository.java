package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.NhomTaiSan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhomTaiSanRepository extends JpaRepository<NhomTaiSan, String> {
}
