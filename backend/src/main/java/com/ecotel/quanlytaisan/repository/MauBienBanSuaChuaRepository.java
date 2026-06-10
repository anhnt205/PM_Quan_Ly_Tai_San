package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.MauBienBanSuaChua;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MauBienBanSuaChuaRepository extends JpaRepository<MauBienBanSuaChua, String> {
    Page<MauBienBanSuaChua> findByTenContainingIgnoreCase(String ten, Pageable pageable);
    
    @Modifying
    @Query("UPDATE MauBienBanSuaChua m SET m.macDinh = false WHERE m.id != :id")
    void resetMacDinhForAllExcept(String id);
}
