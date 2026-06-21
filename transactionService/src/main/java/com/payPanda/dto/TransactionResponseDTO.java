package com.payPanda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponseDTO {

    private Long transactionId;
    private String status;           // "APPROVED" or "DECLINED"
    private String message;          // Human-readable reason (shown on React UI)
    private String authCode;         // 6-digit code, null if declined
    private BigDecimal amount;
    private LocalDateTime transactionDate;
}