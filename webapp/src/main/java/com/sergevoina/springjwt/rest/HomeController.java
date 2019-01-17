package com.sergevoina.springjwt.rest;

import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/home")
public class HomeController {
	private Map<String, Object> data = new HashMap<>();

	public HomeController() {
		data.put("name", "HomeController");
	}

	@GetMapping
	public Object get(Principal principal) {
		data.put("time", new Date());
		data.put("principal", principal != null ? principal.getName() : "<null>");
		return data;
	}

	@PutMapping
	public Object put(@RequestBody Map<String, Object> data) {
		this.data = new HashMap<>(data);
		return this.data;
	}
}
