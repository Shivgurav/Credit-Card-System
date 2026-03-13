package com.payPanda.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "credit_card")
@Data
public class CreditCardEntity {
    @Id
    @Column(name = "card_number")
    private Long cardNumber;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "customer_name", length = 100, nullable = false)
    private String customerName;

    @Column(name = "pan_number", length = 10, nullable = false)
    private String panNumber;

    @Column(name = "card_type", length = 20, nullable = false)
    private String cardType;

    @Column(name = "credit_limit", nullable = false, precision = 10, scale = 2)
    private BigDecimal creditLimit;

    @Column(name = "available_limit", nullable = false, precision = 10, scale = 2)
    private BigDecimal availableLimit;

    @Column(name = "expiry_date", length = 5, nullable = false)
    private String expiryDate;

    @Column(name = "cvv", length = 3, nullable = false)
    private String cvv;

    @Column(name = "card_status", length = 20, nullable = false)
    private String cardStatus;

    @Column(name = "per_day_limit", precision = 10, scale = 2)
    private BigDecimal perDayLimit;

    // ✅ New fields
    @Column(name = "pin", length = 60)
    private String pin;                  // BCrypt hashed 4-digit PIN, null until set

    @Column(name = "cash_withdrawal_limit", precision = 10, scale = 2)
    private BigDecimal cashWithdrawalLimit;  // 30% of creditLimit

    @Column(name = "outstanding_bill", precision = 10, scale = 2)
    private BigDecimal outstandingBill;  // increases on spend, decreases on payment
}