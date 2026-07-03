package com.ecotel.quanlytaisan.repository;

import com.ecotel.quanlytaisan.model.LichTrinh;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LichTrinhRepository extends JpaRepository<LichTrinh, String>, JpaSpecificationExecutor<LichTrinh> {
}
