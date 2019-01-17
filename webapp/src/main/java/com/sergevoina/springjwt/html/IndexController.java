package com.sergevoina.springjwt.html;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class IndexController {
	private final static String indexHtml = "<!doctype html>\n" + "<html lang=\"en\">\n" + "<head>"
			+ "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
			+ "<base href=\"/\"><title>Ngpage</title>"
			+ "<link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\"></head>\n"
			+ "<body><app-root></app-root>\n"
			+ "<script type=\"text/javascript\" src=\"resources/runtime.js\"></script>"
			+ "<script type=\"text/javascript\" src=\"resources/polyfills.js\"></script>"
			+ "<script type=\"text/javascript\" src=\"resources/styles.js\"></script>"
			+ "<script type=\"text/javascript\" src=\"resources/vendor.js\"></script>"
			+ "<script type=\"text/javascript\" src=\"resources/main.js\"></script></body></html>";

	@GetMapping({ "/", "/app/**" })
	public @ResponseBody String index() {
		return indexHtml;
	}
}
