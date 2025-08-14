package com.corhuilabd.corhuilabd.Security.DTO;


public class LoginUserDto {
    private String email;
    private String password;

    // Permitir también username para compatibilidad
    public void setUsername(String username) {
        this.email = username;
    }
    public String getUsername() {
        return email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LoginUserDto(String email, String password) {
        this.email = email;
        this.password = password;
    }
}