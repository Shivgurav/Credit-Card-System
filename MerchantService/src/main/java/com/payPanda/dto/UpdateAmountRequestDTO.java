package com.payPanda.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateAmountRequestDTO {
    private BigDecimal amount;
}