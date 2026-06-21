package com.payPanda.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.payPanda.dto.AuthDTO;
import com.payPanda.dto.LoginDTO;
import com.payPanda.dto.LoginResponseDTO;
import com.payPanda.dto.SignUpDTO;
import com.payPanda.entity.AuthEntity;
import com.payPanda.repository.UserRepository;
import com.payPanda.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImple implements AuthService {
	
	private final UserRepository repo;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final EmailService emailService;
	
	@Override
	public Optional<AuthDTO> getUserByEmail(String email) {
		Optional<AuthEntity> optional=repo.findByEmail( email);
		if(optional.isPresent()) {
			AuthEntity authEntity=optional.get();
			AuthDTO authDTO=modelMapper.map(authEntity, AuthDTO.class);
			return Optional.of(authDTO);
			
		}
		return Optional.empty();
		
		
	}

	@Override
	public LoginResponseDTO login(LoginDTO loginDTO) {
		// TODO Auto-generated method stub
		 AuthEntity user = repo.findByEmail(loginDTO.getEmail())
	                .orElseThrow(() -> new RuntimeException("User not found"));	

	        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())){
	            throw new RuntimeException("Invalid password");
	        }

	        String token = jwtService.generateToken(user.getEmail());

	        return new LoginResponseDTO(token, user.getRole(),user.getName());
	}

	@Override
	public String signUp(SignUpDTO signUpDTO) {

	    String msg = "";

	    String pancard = signUpDTO.getPancard().trim().toUpperCase();

	    String regex = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";

	    if (!pancard.matches(regex)) {
	        msg = "Invalid pancard credentials";
	    } 
	    else {

	        signUpDTO.setPancard(pancard);

	        // 🔐 Encode password
	        String encodedPassword = passwordEncoder.encode(signUpDTO.getPassword());
	        signUpDTO.setPassword(encodedPassword);

	        AuthEntity authEntity = modelMapper.map(signUpDTO, AuthEntity.class);

	        authEntity.setRole("user");

	        repo.save(authEntity);

	        msg = "saved successfully";
	    }

	    return msg;
	}
	@Override
	public String delete(String email) {
		// TODO Auto-generated method stub
		Optional<AuthEntity> optional=repo.findByEmail(email);
		if(optional.isPresent()){
			AuthEntity authEntity=optional.get();
			repo.delete(authEntity);
			return "deleted successfully";
		}
		else {
			return "Invalid email";
		}
	}
	@Override
	public String sendOtp(String email) {
	    AuthEntity user = repo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    String otp = String.valueOf((int)(Math.random()*900000) + 100000);

	    user.setOtp(otp);
	    user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
	    repo.save(user);

	    try {
	        emailService.sendEmail(email, "PayPanda - Password Reset OTP", 
	            "Your OTP for password reset is: " + otp + "\n\nValid for 5 minutes.\nDo not share this OTP.");
	    } catch (Exception e) {
	        // ✅ Log the real error so we can see it in console
	        System.err.println("Email send failed: " + e.getMessage());
	        e.printStackTrace();
	        return "OTP generated but email failed: " + e.getMessage();
	    }

	    return "OTP sent to email";
	}
	@Override
	public String verifyOtp(String email, String otp){

	    AuthEntity user = repo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if(!user.getOtp().equals(otp)){
	        return "Invalid OTP";
	    }

	    if(user.getOtpExpiry().isBefore(LocalDateTime.now())){
	        return "OTP expired";
	    }

	    return "OTP verified";
	}
	@Override
	public String resetPassword(String email, String newPassword){

	    AuthEntity user = repo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    String encodedPassword = passwordEncoder.encode(newPassword);

	    user.setPassword(encodedPassword);
	    user.setOtp(null);

	    repo.save(user);

	    return "Password updated successfully";
	}
	@Override
	public String updateAddress(String email, String address) {
	    AuthEntity user = repo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	    user.setAddress(address);
	    repo.save(user);
	    return "Address updated successfully";
	}

}
