package com.payPanda.service;

import com.payPanda.dto.MerchantRequestDTO;
import com.payPanda.dto.MerchantResponseDTO;
import com.payPanda.dto.MerchantValidateDTO;

import java.util.List;

import org.jspecify.annotations.Nullable;

public interface MerchantService {

    MerchantResponseDTO registerMerchant(MerchantRequestDTO request);

    MerchantResponseDTO getMerchantById(String merchantId);

    List<MerchantResponseDTO> getAllMerchants();

	
	MerchantValidateDTO validateMerchant(String merchantId);
}