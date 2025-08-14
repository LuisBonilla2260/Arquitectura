package com.corhuilabd.corhuilabd.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }

    @GetMapping("/register")
    public String register() {
        return "redirect:/register.html";
    }

    @GetMapping("/verify")
    public String verify() {
        return "redirect:/verify.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/dashboard.html";
    }

    @GetMapping("/estudiantes")
    public String estudiantes() {
        return "redirect:/estudiantes.html";
    }

    @GetMapping("/programas")
    public String programas() {
        return "redirect:/programas.html";
    }

    @GetMapping("/test-auth")
    public String testAuth() {
        return "redirect:/test-auth.html";
    }

    @GetMapping("/debug-auth")
    public String debugAuth() {
        return "redirect:/debug-auth.html";
    }

    @GetMapping("/test-api")
    public String testApi() {
        return "redirect:/test-api.html";
    }
}
