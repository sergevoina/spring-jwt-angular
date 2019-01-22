package com.sergevoina.springjwt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author serge.voina@gmail.com
 *
 */
@Slf4j
@Service
public class UserService implements UserDetailsService {

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.debug(">>> loadUserByUsername, username={}", username);

		UserDetails user = null;

		switch (username.toLowerCase()) {
		case "admin":
			user = User.withUsername("admin").password(passwordEncoder.encode("Passw0rd")).roles("ADMIN").build();
			break;
		case "user":
			user = User.withUsername("user").password(passwordEncoder.encode("Passw0rd")).roles("USER").build();
			break;
		}

		log.debug("<<< loadUserByUsername {}", user);
		return user;
	}
}
