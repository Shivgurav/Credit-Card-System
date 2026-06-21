package com.payPanda.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
@Data
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // SERIAL in Neon PostgreSQL
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "card_number", nullable = false)
    private Long cardNumber;

    @Column(name = "merchant_id", length = 7, nullable = false)
    private String merchantId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "auth_code", length = 6, unique = true)
    private String authCode;   // null if DECLINED

    @Column(name = "status", length = 20, nullable = false)
    private String status;     // "APPROVED" or "DECLINED"
}