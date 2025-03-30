package com.example.backend.module.user.controller;


import com.example.backend.helper.ErrorResource;
import com.example.backend.helper.SuccessResource;
import com.example.backend.module.user.dto.PaginationRequest;
import com.example.backend.module.user.dto.UserDTO;
import com.example.backend.module.user.dto.UserUpdateRequest;
import com.example.backend.module.user.entity.User;
import com.example.backend.module.user.repository.UserRepository;
import com.example.backend.module.user.service.imp.UserService;
import com.example.backend.resource.ResponseResource;
import com.example.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("api/v1")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/me")
    public ResponseEntity<Object> getCurrentUser(
            @RequestHeader("Authorization") String authorization) {
        try {
            String token = authorization.substring(7);

            ResponseResource<UserDTO> response = userService.getUserFromToken(token);

            if (response.isSuccess()) {
                return ResponseEntity.ok(new SuccessResource<>(response.getMessage(), response.getData()));
            } else {
                return ResponseEntity
                        .status(response.getStatus())
                        .body(response);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResource("Internal Server Error"));
        }
    }

    @PutMapping("/user/me")
    public ResponseEntity<?> updateUserProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            ResponseResource<UserDTO> response = userService.updateUserFromToken(token, updateRequest);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(response.getStatus()).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ResponseResource.fail("Failed to update user profile: " + e.getMessage(), 400)
            );
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("user/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        UserDTO userDTO = userService.getUserByEmail(email);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/user/all")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestBody PaginationRequest request) {
        logger.info("page: " + request);
        List<UserDTO> users = userService.getAllUsers(request.getPage(), request.getLimit());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/user/create")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        logger.info("Creating user: " + userDTO);
        UserDTO createdUser = userService.createUser(userDTO);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/user/update/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(createdUser);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Delete Success"));
    }
}