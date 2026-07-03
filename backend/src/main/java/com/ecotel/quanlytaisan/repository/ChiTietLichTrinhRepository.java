package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.ChiTietLichTrinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietLichTrinhRepository extends JpaRepository<ChiTietLichTrinh, String> {
}
