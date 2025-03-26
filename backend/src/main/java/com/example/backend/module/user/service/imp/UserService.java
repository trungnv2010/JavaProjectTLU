package com.example.backend.module.user.service.imp;

import com.example.backend.helper.ErrorResource;
import com.example.backend.module.user.dto.*;
import com.example.backend.module.user.entity.Role;
import com.example.backend.module.user.entity.User;
import com.example.backend.module.user.repository.UserRepository;
import com.example.backend.module.user.service.interfaces.UserServiceInterface;
import com.example.backend.service.BaseService;
import com.example.backend.service.JwtService;
import org.apache.coyote.BadRequestException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.util.HashMap;
import java.util.Map;


@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    public AuthenticationResponse authenticate(AuthenticationRequest loginRequest) {

        var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(token)
                .build();

    }

    public AuthenticationResponse register(RegisterRequestDTO request) {
        var user = User.builder()
                .firstname(request.getFirstName())
                .lastname(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }
}
