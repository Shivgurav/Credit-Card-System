package com.payPanda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardApplicationResponseDTO {

    private Long applicationId;
    private String name;
    private String panNumber;
    private String email;
    private String mobileNumber;
    private String occupation;
    private BigDecimal annualSalary;
    private Boolean itReturnFiled;
    private String cardType;
    private String applicationStatus;  // PENDING / APPROVED / REJECTED
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String rejectionReason;

    // Populated only when APPROVED
    private Long cardNumber;
}