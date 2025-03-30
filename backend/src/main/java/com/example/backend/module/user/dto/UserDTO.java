package com.example.backend.module.user.dto;

import com.example.backend.module.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstname;
    private String lastname;
    private String password;
    private Role role;
    private String phone;
    private String city;

}
