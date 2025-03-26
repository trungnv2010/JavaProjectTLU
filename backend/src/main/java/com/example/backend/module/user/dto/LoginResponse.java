package com.example.backend.module.user.dto;

public class LoginResponse {
    private final String token;
    private final UserDTO user;
    public LoginResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public UserDTO getUser() {
        return user;
    }
}
