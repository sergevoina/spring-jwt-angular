package com.sergevoina.springjwt.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 
 * @author serge.voina@gmail.com
 *
 */
@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
		registry.addResourceHandler("/assets/**").addResourceLocations("/resources/assets/");
	}
}
