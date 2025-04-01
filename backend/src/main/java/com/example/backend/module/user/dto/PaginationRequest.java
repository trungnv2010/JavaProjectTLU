package com.example.backend.module.user.dto;

import lombok.Data;

@Data
public class PaginationRequest {
    private int page;
    private int limit;
    private String search;
}
