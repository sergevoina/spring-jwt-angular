package com.sergevoina.springjwt.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
	@GetMapping({ "/", "/app/**" })
	public String index() {
		return "index";
	}
}
