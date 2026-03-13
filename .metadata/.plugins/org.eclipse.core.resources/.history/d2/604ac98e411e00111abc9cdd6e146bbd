package com.payPanda.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class AppConfig {

    // Plain RestTemplate — Docker resolves container names on credit-network
    // No @LoadBalanced needed (that's only for Eureka)
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
	 @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http
	            // ✅ This line was missing — wires CORS config into Spring Security
	            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	            .authorizeHttpRequests(authz -> authz
	                .anyRequest().permitAll()
	            )
	            .csrf(csrf -> csrf.disable())
	            .formLogin(form -> form.disable())
	            .httpBasic(httpBasic -> httpBasic.disable());
	        return http.build();
	    }

	    @Bean
	    public CorsConfigurationSource corsConfigurationSource() {
	        CorsConfiguration configuration = new CorsConfiguration();
	        configuration.addAllowedOrigin("http://localhost:3000");
	        configuration.addAllowedMethod("*");
	        configuration.addAllowedHeader("*");
	        configuration.setAllowCredentials(true);

	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", configuration);
	        return source;
	    }

   }
  
