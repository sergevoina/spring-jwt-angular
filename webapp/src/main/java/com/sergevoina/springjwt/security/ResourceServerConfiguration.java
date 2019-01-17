package com.sergevoina.springjwt.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.error.OAuth2AccessDeniedHandler;

/**
 * A Resource Server serves resources that are protected by the OAuth2 token.
 * Spring OAuth provides a Spring Security authentication filter that implements
 * this protection.
 * 
 * @author serge.voina@gmail.com
 *
 */
@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
	private static final String RESOURCE_ID = "resource_id";

	@Override
	public void configure(ResourceServerSecurityConfigurer resources) {
		resources.resourceId(RESOURCE_ID).stateless(true);
	}

	@Override
	public void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
			.anonymous()
				.disable()
			.authorizeRequests()
				.antMatchers("/rest/**")
				.access("hasRole('ADMIN')")
				.and()
			.exceptionHandling()
				.accessDeniedHandler(new OAuth2AccessDeniedHandler()); 
		// @formatter:on
	}
}
