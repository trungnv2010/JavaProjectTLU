package com.example.backend.module.order.dto;

import com.example.backend.module.order.entity.Order.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentStatusRequest {
    private PaymentStatus paymentStatus;
}