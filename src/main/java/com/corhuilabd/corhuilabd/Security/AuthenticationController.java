package com.corhuilabd.corhuilabd.Security;


import com.corhuilabd.corhuilabd.Security.DTO.LoginUserDto;
import com.corhuilabd.corhuilabd.Security.DTO.RegisterUserDto;
import com.corhuilabd.corhuilabd.Security.DTO.VerifyUserDto;
import com.corhuilabd.corhuilabd.Security.Service.AuthenticationService;
import com.corhuilabd.corhuilabd.Security.reponses.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController( AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping(value = "/signup", consumes = {"application/json", "application/x-www-form-urlencoded"})
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping(value = "/login", consumes = {"application/json", "application/x-www-form-urlencoded"})
    public ResponseEntity<LoginResponse> authenticate(
            @RequestBody(required = false) LoginUserDto loginUserDto,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String password,
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        if (loginUserDto == null && username != null && password != null) {
            loginUserDto = new LoginUserDto(username, password);
        }

        if (loginUserDto == null) {
            return ResponseEntity.badRequest().body(null); // Manejar el caso en el que los parámetros no fueron proporcionados
        }

        User authenticatedUser = authenticationService.authenticate(loginUserDto, request, response);

        LoginResponse loginResponse = new LoginResponse(authenticatedUser); // Adjust constructor as needed
        return ResponseEntity.ok(loginResponse);
    }



    @PostMapping(value = "/verify", consumes = {"application/json", "application/x-www-form-urlencoded"})
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Spring Security maneja automáticamente el logout
        return ResponseEntity.ok("Logout successful");
    }
}