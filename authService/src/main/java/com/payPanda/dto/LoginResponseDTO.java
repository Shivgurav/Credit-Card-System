package com.payPanda.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
	 private String token;
	    
	    private String role;
	    private String name;

	    public LoginResponseDTO(String token,String role,String name) {
	        this.token = token;
	        this.role = role;
	        this.name=name;
	    }
}
