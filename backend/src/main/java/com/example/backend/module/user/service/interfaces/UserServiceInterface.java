package com.example.backend.module.user.service.interfaces;
import com.example.backend.module.user.dto.AuthenticationResponse;
import com.example.backend.module.user.dto.LoginResponse;
import com.example.backend.module.user.dto.LoginRequest;
import com.example.backend.module.user.dto.RegisterRequestDTO;

public interface UserServiceInterface {
    Object authenticate(LoginRequest loginRequest);
    AuthenticationResponse register(RegisterRequestDTO registerRequestDTO);
}
