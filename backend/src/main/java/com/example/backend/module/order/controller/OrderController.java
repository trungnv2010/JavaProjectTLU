package com.example.backend.module.order.controller;

import com.example.backend.module.order.dto.*;
import com.example.backend.module.order.service.OrderService;
import com.example.backend.module.order.service.OrderStatisticsService;
import com.example.backend.resource.ResponseResource;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderStatisticsService orderStatisticsService;

    @GetMapping
    public ResponseEntity<ResponseResource<Map<String, Object>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        try {
            Page<OrderDTO> orderPage = orderService.getAllOrders(page, limit, sortBy, direction);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderPage.getContent());
            response.put("currentPage", orderPage.getNumber());
            response.put("totalItems", orderPage.getTotalElements());
            response.put("totalPages", orderPage.getTotalPages());

            return ResponseEntity.ok(ResponseResource.success(response, "Orders retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseResource<Map<String, Object>>> searchOrders(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            Page<OrderDTO> orderPage = orderService.searchOrders(userId, status, startDate, endDate, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderPage.getContent());
            response.put("currentPage", orderPage.getNumber());
            response.put("totalItems", orderPage.getTotalElements());
            response.put("totalPages", orderPage.getTotalPages());

            return ResponseEntity.ok(ResponseResource.success(response, "Orders retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseResource<OrderDTO>> getOrderById(@PathVariable Long id) {
        try {
            OrderDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(ResponseResource.success(order, "Order retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            Page<OrderDTO> orderPage = orderService.getOrdersByUserId(userId, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderPage.getContent());
            response.put("currentPage", orderPage.getNumber());
            response.put("totalItems", orderPage.getTotalElements());
            response.put("totalPages", orderPage.getTotalPages());

            return ResponseEntity.ok(ResponseResource.success(response, "Orders retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @PostMapping
    public ResponseEntity<ResponseResource<OrderDTO>> createOrder(@Valid @RequestBody CreateOrderDTO createOrderDTO) {
        try {
            OrderDTO createdOrder = orderService.createOrder(createOrderDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ResponseResource.success(createdOrder, "Order created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseResource.fail(e.getMessage(), 400));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ResponseResource<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusDTO updateOrderStatusDTO) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, updateOrderStatusDTO);
            return ResponseEntity.ok(ResponseResource.success(updatedOrder, "Order status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseResource.fail(e.getMessage(), 400));
        }
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<ResponseResource<OrderDTO>> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusDTO updatePaymentStatusDTO) {
        try {
            OrderDTO updatedOrder = orderService.updatePaymentStatus(id, updatePaymentStatusDTO);
            return ResponseEntity.ok(ResponseResource.success(updatedOrder, "Payment status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseResource.fail(e.getMessage(), 400));
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ResponseResource<OrderDTO>> cancelOrder(@PathVariable Long id) {
        try {
            OrderDTO cancelledOrder = orderService.cancelOrder(id);
            return ResponseEntity.ok(ResponseResource.success(cancelledOrder, "Order cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseResource.fail(e.getMessage(), 400));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<ResponseResource<OrderStatisticsDTO>> getOrderStatistics() {
        try {
            OrderStatisticsDTO statistics = orderStatisticsService.getOrderStatistics();
            return ResponseEntity.ok(ResponseResource.success(statistics, "Order statistics retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail(e.getMessage(), 500));
        }
    }
}