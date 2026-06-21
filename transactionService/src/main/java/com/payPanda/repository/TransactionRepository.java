package com.payPanda.repository;

import com.payPanda.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    // Get all transactions for a card (used by GET /transactions/{cardNumber})
    List<TransactionEntity> findByCardNumber(Long cardNumber);

    // Sum of APPROVED transactions for a card on a specific day
    // Used to enforce per-day transaction limit from product master
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM TransactionEntity t " +
           "WHERE t.cardNumber = :cardNumber " +
           "AND t.status = 'APPROVED' " +
           "AND t.transactionDate >= :startOfDay " +
           "AND t.transactionDate < :endOfDay")
    BigDecimal sumApprovedAmountForCardToday(
            @Param("cardNumber") Long cardNumber,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}