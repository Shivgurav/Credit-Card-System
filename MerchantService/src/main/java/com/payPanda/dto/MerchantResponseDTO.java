package com.payPanda.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantResponseDTO {

    private String merchantId;
    private String merchantName;
    private String email;
    private String mobileNumber;
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String status;
}