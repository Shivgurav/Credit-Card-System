package com.payPanda.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardDetailsDTO {
    private Long cardNumber;
    private String customerName;
    private String cardType;
    private BigDecimal creditLimit;
    private BigDecimal availableLimit;
    private String expiryDate;
    private String cardStatus;
    private BigDecimal perDayLimit;

    // ✅ New fields
    private BigDecimal cashWithdrawalLimit;
    private BigDecimal outstandingBill;
    private boolean pinSet;              // true if PIN has been generated, false if null
    // NOTE: CVV and actual PIN never returned
}