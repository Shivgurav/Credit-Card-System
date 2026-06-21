package com.payPanda.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "card_application")
@Data
public class CardApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    // ── Personal details ─────────────────────────────────────────
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "pan_number", length = 10, nullable = false, unique = true)
    private String panNumber;           // Format: ABCDE1234F

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "mobile_number", length = 15, nullable = false)
    private String mobileNumber;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    // ── Financial eligibility fields ──────────────────────────────
    @Column(name = "occupation", length = 50, nullable = false)
    private String occupation;          // Salaried / Self-Employed / Business

    @Column(name = "annual_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal annualSalary;

    @Column(name = "it_return_filed", nullable = false)
    private Boolean itReturnFiled;      // true = filed ITR

    // ── Card preference ───────────────────────────────────────────
    @Column(name = "card_type", length = 20, nullable = false)
    private String cardType;            // "VISA" or "MASTERCARD"

    // ── Application lifecycle ─────────────────────────────────────
    @Column(name = "application_status", length = 20, nullable = false)
    private String applicationStatus;  // PENDING / APPROVED / REJECTED

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;  // set when admin acts

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;    // filled only if REJECTED

    // ── Link to issued card (null until approved) ─────────────────
    @Column(name = "card_number")
    private Long cardNumber;
}