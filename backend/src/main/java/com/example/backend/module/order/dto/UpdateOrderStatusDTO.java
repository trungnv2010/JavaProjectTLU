package com.example.backend.module.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusDTO {

    @NotBlank(message = "Status is required")
    private String status;
}