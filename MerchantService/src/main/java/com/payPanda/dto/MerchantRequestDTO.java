package com.payPanda.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MerchantRequestDTO {

    @NotBlank(message = "Merchant name is mandatory")
    private String merchantName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is mandatory")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number (must be 10 digits starting with 6-9)")
    private String mobileNumber;

    // Optional fields
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String address;
}