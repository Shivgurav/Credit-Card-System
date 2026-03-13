package com.payPanda.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CardApplicationRequestDTO {

    // ── Personal details ────────────────────────────────────────────────────
    @NotBlank(message = "Name is mandatory")
    @Pattern(regexp = "^[a-zA-Z ]{1,100}$", message = "Name must contain letters only, max 100 chars")
    private String name;

    @NotNull(message = "Date of birth is mandatory")
    @Past(message = "Date of birth must be a past date")
    private LocalDate dateOfBirth;

    @NotBlank(message = "PAN number is mandatory")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN format. Expected: ABCDE1234F")
    private String panNumber;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is mandatory")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number (10 digits, starts with 6-9)")
    private String mobileNumber;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;             // optional

    // ── Financial eligibility ────────────────────────────────────────────────
    @NotBlank(message = "Occupation is mandatory")
    private String occupation;          // Salaried / Self-Employed / Business

    @NotNull(message = "Annual salary is mandatory")
    @DecimalMin(value = "0.01", message = "Annual salary must be greater than zero")
    private BigDecimal annualSalary;

    @NotNull(message = "IT return status is mandatory")
    private Boolean itReturnFiled;

    // ── Card preference ──────────────────────────────────────────────────────
    @NotBlank(message = "Card type is mandatory")
    @Pattern(regexp = "^(VISA|MASTERCARD)$", message = "Card type must be VISA or MASTERCARD")
    private String cardType;
}