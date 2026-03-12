package com.payPanda.dto;

import lombok.Data;

@Data
public class MerchantDetailsDTO {

    private String merchantId;
    private String merchantName;
    private String status;   // "Active" or "Closed"
}