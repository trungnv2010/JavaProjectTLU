package com.example.backend.module.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticsDTO {

    private Long totalOrders;
    private Long pendingOrders;
    private Long processingOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long todayOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private List<Map<String, Object>> topSellingProducts;
    private List<MonthlyRevenueDTO> monthlyRevenue;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenueDTO {
        private String month;
        private BigDecimal revenue;
    }
}