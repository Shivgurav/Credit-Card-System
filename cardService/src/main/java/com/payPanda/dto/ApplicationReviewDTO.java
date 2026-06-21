package com.payPanda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ApplicationReviewDTO {

    @NotBlank(message = "Decision is mandatory")
    @Pattern(regexp = "^(APPROVED|REJECTED)$", message = "Decision must be APPROVED or REJECTED")
    private String decision;            // "APPROVED" or "REJECTED"

    private String rejectionReason;     // Required if decision is REJECTED
}