package com.payPanda.service;

import com.payPanda.dto.TransactionRequestDTO;
import com.payPanda.dto.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {

    TransactionResponseDTO processTransaction(TransactionRequestDTO request);

    List<TransactionResponseDTO> getTransactionsByCard(Long cardNumber);
}