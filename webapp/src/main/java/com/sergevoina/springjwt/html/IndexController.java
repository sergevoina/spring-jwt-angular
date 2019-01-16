package com.sergevoina.springjwt.html;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

	@GetMapping({ "/app", "/app/**" })
	public String index() {
		return "forward:/index.html";
	}
}
