package com.example.backend.module.user.controller;


import com.example.backend.helper.ErrorResource;
import com.example.backend.module.user.dto.*;
import com.example.backend.module.user.service.imp.UserService;
import com.example.backend.module.user.service.interfaces.UserServiceInterface;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@Validated
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(userService.authenticate(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequestDTO request
    ) {
        return ResponseEntity.ok(userService.register(request));
    }

}
