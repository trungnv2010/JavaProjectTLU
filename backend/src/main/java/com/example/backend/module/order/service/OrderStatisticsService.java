package com.example.backend.module.order.service;

import com.example.backend.module.order.dto.OrderStatisticsDTO;
import com.example.backend.module.order.entity.Order;
import com.example.backend.module.order.repository.OrderItemRepository;
import com.example.backend.module.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderStatisticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public OrderStatisticsDTO getOrderStatistics() {
        Long totalOrders = orderRepository.count();
        Long pendingOrders = orderRepository.countByStatus("pending");
        Long processingOrders = orderRepository.countByStatus("processing");
        Long shippedOrders = orderRepository.countByStatus("shipped");
        Long deliveredOrders = orderRepository.countByStatus("delivered");
        Long cancelledOrders = orderRepository.countByStatus("cancelled");
        Long todayOrders = orderRepository.countTodayOrders();

        Double totalRevenueDouble = orderRepository.getTotalRevenue();
        Double todayRevenueDouble = orderRepository.getTodayRevenue();

        BigDecimal totalRevenue = totalRevenueDouble != null ? BigDecimal.valueOf(totalRevenueDouble) : BigDecimal.ZERO;
        BigDecimal todayRevenue = todayRevenueDouble != null ? BigDecimal.valueOf(todayRevenueDouble) : BigDecimal.ZERO;

        List<Map<String, Object>> topSellingProducts = orderItemRepository.findTopSellingProducts(5);
        List<OrderStatisticsDTO.MonthlyRevenueDTO> monthlyRevenue = getMonthlyRevenue();

        return OrderStatisticsDTO.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .shippedOrders(shippedOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .todayOrders(todayOrders)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .topSellingProducts(topSellingProducts)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    private List<OrderStatisticsDTO.MonthlyRevenueDTO> getMonthlyRevenue() {
        String sql = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, " +
                "SUM(total_amount) as revenue " +
                "FROM `order` " +
                "WHERE status != 'cancelled' " +
                "AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) " +
                "GROUP BY DATE_FORMAT(created_at, '%Y-%m') " +
                "ORDER BY month ASC";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        List<OrderStatisticsDTO.MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            String month = (String) row.get("month");
            BigDecimal revenue = BigDecimal.valueOf(((Number) row.get("revenue")).doubleValue());

            monthlyRevenue.add(new OrderStatisticsDTO.MonthlyRevenueDTO(month, revenue));
        }

        return monthlyRevenue;
    }
}