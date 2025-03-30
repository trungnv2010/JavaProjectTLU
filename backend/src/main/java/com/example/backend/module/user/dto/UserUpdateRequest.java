package com.example.backend.module.user.dto;


import lombok.Data;

@Data
public class UserUpdateRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String city;
}
