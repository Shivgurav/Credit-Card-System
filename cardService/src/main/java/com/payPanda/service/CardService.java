package com.payPanda.service;

import com.payPanda.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface CardService {

    // ── Application flow ──────────────────────────────────────────
    CardApplicationResponseDTO submitApplication(CardApplicationRequestDTO request);

    List<CardApplicationResponseDTO> getPendingApplications();

    List<CardApplicationResponseDTO> getAllApplications();

    CardApplicationResponseDTO reviewApplication(Long applicationId, AdminReviewRequestDTO review);

    // ── Card operations ───────────────────────────────────────────
    CardDetailsDTO getCardByNumber(Long cardNumber);

    CardDetailsDTO updateCardStatus(CardStatusUpdateDTO request);

    void deductAvailableLimit(Long cardNumber, BigDecimal amount);

	CardDetailsDTO payBill(Long cardNumber, BigDecimal amount);

	String requestPinOtp(Long cardNumber);

	String setPin(Long cardNumber, String otp, String newPin);
	public String verifyPin(Long cardNumber, String pin);
	public CardDetailsDTO cashWithdrawal(Long cardNumber, BigDecimal amount);
}