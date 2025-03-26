package com.example.backend.module.user.controller;


import com.example.backend.helper.SuccessResource;
import com.example.backend.module.user.dto.UserDTO;
import com.example.backend.module.user.entity.User;
import com.example.backend.module.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> me(){
        String email = "nguyenvutrung2010@gmail.com";
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not exits"));
        UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getLastname());
        SuccessResource<UserDTO> response = new SuccessResource<>("SUCCESS", userDTO);
        return ResponseEntity.ok(response);
    }
}
