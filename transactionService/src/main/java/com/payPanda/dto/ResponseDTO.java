package com.payPanda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDTO {
    private String status;    // "APPROVED" or "DECLINED"
    private String message;   // Human-readable reason
    private String authCode;  // 6-digit code, null if declined
}