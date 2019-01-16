package com.sergevoina.springjwt.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/profile")
public class ProfileController {
	private Map<String, Object> data = new HashMap<>();

	public ProfileController() {
		data.put("firstName", "James");
		data.put("lastName", "Bond");
		data.put("company", "MI6");
		data.put("website", "https://mi6.co.uk");
		data.put("username", "anent007");
		data.put("timezone", "");
		data.put("email", "james.bond@mi6.co.uk");
	}

	@GetMapping
	public Object get() {
		return data;
	}
	
	@PutMapping
	public Object put(@RequestBody Map<String, Object> data) {
		this.data = new HashMap<>(data);
		return this.data;
	}

}
