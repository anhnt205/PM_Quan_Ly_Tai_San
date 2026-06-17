package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.MauBienBanSuaChua;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MauBienBanSuaChuaRepository extends JpaRepository<MauBienBanSuaChua, String> {
    @Query("SELECT m FROM MauBienBanSuaChua m WHERE (:ten IS NULL OR LOWER(m.ten) LIKE LOWER(CONCAT('%', :ten, '%'))) AND (:loaiBienBan IS NULL OR m.loaiBienBan = :loaiBienBan) AND (:macDinh IS NULL OR m.macDinh = :macDinh)")
    Page<MauBienBanSuaChua> findByTenAndLoaiBienBanAndMacDinh(@Param("ten") String ten, @Param("loaiBienBan") String loaiBienBan, @Param("macDinh") Boolean macDinh, Pageable pageable);

    /** Reset tất cả macDinh về false (cũ - toàn bảng) */
    @Modifying
    @Query("UPDATE MauBienBanSuaChua m SET m.macDinh = false WHERE m.id != :id")
    void resetMacDinhForAllExcept(String id);

    /**
     * Reset macDinh = false cho tất cả bản ghi cùng loaiBienBan,
     * trừ bản ghi vừa được đặt mặc định.
     */
    @Modifying
    @Query("UPDATE MauBienBanSuaChua m SET m.macDinh = false " +
           "WHERE m.id != :id AND m.loaiBienBan = :loaiBienBan")
    void resetMacDinhForLoaiBienBanExcept(@Param("id") String id,
                                          @Param("loaiBienBan") String loaiBienBan);
}
