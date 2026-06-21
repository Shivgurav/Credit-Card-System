package com.payPanda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class UpdateLimitRequestDTO {
    private BigDecimal amount;   // Amount to deduct from available_limit
}