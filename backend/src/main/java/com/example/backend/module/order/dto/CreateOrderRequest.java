package com.example.backend.module.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Long userId;

    private String shippingAddress;

    private String paymentMethod;

    private List<CreateOrderItemRequest> orderItems;
}