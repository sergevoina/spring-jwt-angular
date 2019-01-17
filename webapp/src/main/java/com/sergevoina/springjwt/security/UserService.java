package com.sergevoina.springjwt.security;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
		List<GrantedAuthority> authorities = new ArrayList<>();

		if ("admin".equalsIgnoreCase(username)) {
			authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"));
		} else {
			authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
		}

		User user = new User(username.toLowerCase(), passwordEncoder.encode(username.toLowerCase()), authorities);

		log.debug("<<< loadUserByUsername {}", user);
		return user;
	}
}
