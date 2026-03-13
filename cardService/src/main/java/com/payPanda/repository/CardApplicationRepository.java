package com.payPanda.repository;

import com.payPanda.entity.CardApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardApplicationRepository extends JpaRepository<CardApplicationEntity, Long> {

    boolean existsByPanNumber(String panNumber);
    boolean existsByEmail(String email);

    // Admin dashboard — get all pending applications
    List<CardApplicationEntity> findByApplicationStatus(String status);
}