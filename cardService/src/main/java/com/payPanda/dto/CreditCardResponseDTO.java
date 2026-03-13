package com.payPanda.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreditCardResponseDTO {

    private Long cardNumber;            // 16-digit
    private String cardType;            // VISA / MASTERCARD
    private String nameOnCard;
    private String expiryDate;          // YYMM format e.g. "2812"
    private String cvv;                 // Shown only once at issuance
    private BigDecimal creditLimit;
    private BigDecimal availableLimit;
    private BigDecimal perDayLimit;
    private String cardStatus;          // Open / Blocked / Closed
}