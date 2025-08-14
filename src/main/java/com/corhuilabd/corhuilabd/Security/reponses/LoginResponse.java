package com.corhuilabd.corhuilabd.Security.reponses;

import com.corhuilabd.corhuilabd.Security.User;

public class LoginResponse {
    private long expiresIn;

    public LoginResponse(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public LoginResponse(User authenticatedUser) {
        //TODO Auto-generated constructor stub
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}