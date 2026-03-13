package com.payPanda.controller;

import com.payPanda.dto.MerchantRequestDTO;
import com.payPanda.dto.MerchantResponseDTO;
import com.payPanda.dto.MerchantValidateDTO;
import com.payPanda.service.MerchantService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/merchants")
@RequiredArgsConstructor
public class MerchantController {

    private final MerchantService merchantService;

    /**
     * POST /merchants
     * Register a new merchant.
     * Called by: React Merchant Registration Page → API Gateway → this service
     */
    @PostMapping
    public ResponseEntity<MerchantResponseDTO> registerMerchant(
            @Valid @RequestBody MerchantRequestDTO request) {
        MerchantResponseDTO response = merchantService.registerMerchant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /merchants/{id}
     * Get a single merchant by ID.
     * Also used by transaction-service to validate merchant status.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MerchantResponseDTO> getMerchantById(@PathVariable String id) {
        return ResponseEntity.ok(merchantService.getMerchantById(id));
    }

    /**
     * GET /merchants
     * Get list of all merchants.
     * Used by Admin Dashboard.
     */
    @GetMapping("/allmerchants")
    public ResponseEntity<List<MerchantResponseDTO>> getAllMerchants() {
        return ResponseEntity.ok(merchantService.getAllMerchants());
    }
    @GetMapping("/validate/{merchantId}")
    public ResponseEntity<MerchantValidateDTO> validateMerchant(@RequestParam String merchantId){
    	return ResponseEntity.ok(merchantService.validateMerchant(merchantId));
    	
    }
}