package com.payPanda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLimitRequestDTO {
    private BigDecimal amount;  // Amount to deduct from available_limit
}