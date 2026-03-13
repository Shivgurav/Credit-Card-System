package com.payPanda.repository;

import com.payPanda.entity.CreditCardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCardEntity, Long> {
    // findById(cardNumber) inherited — used by transaction-service
}