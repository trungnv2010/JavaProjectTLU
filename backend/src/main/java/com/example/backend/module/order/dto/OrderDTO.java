package com.example.backend.module.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private String userName;
    private List<OrderItemDTO> orderItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long id;
        private Integer quantity;
        private BigDecimal price;
        private Long productId;
        private String productName;
        private String productImageUrl;
    }
}