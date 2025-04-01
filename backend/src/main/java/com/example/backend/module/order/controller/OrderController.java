package com.example.backend.module.order.controller;

import com.example.backend.module.order.dto.*;
import com.example.backend.module.order.service.OrderService;
import com.example.backend.resource.ResponseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<ResponseResource<Map<String, Object>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        logger.info("Fetching all orders with page: {}, limit: {}, sortBy: {}, direction: {}",
                page, limit, sortBy, direction);

        try {
            Page<OrderDTO> orderPage = orderService.getAllOrders(page, limit, sortBy, direction);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderPage.getContent());
            response.put("currentPage", orderPage.getNumber());
            response.put("totalItems", orderPage.getTotalElements());
            response.put("totalPages", orderPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Orders retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving orders: ", e);
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

        logger.info("Searching orders with userId: {}, status: {}, startDate: {}, endDate: {}, page: {}, limit: {}",
                userId, status, startDate, endDate, page, limit);

        try {
            Page<OrderDTO> orderPage = orderService.searchOrders(userId, status, startDate, endDate, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderPage.getContent());
            response.put("currentPage", orderPage.getNumber());
            response.put("totalItems", orderPage.getTotalElements());
            response.put("totalPages", orderPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Orders retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error searching orders: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseResource<OrderDTO>> getOrderById(@PathVariable Long id) {
        logger.info("Fetching order with id: {}", id);

        try {
            OrderDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(ResponseResource.success(order, "Order retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving order: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        logger.info("Fetching orders for user id: {} with page: {}, limit: {}", userId, page, limit);

        Page<OrderDTO> orderPage = orderService.getOrdersByUserId(userId, page, limit);

        Map<String, Object> response = new HashMap<>();
        response.put("orders", orderPage.getContent());
        response.put("currentPage", orderPage.getNumber());
        response.put("totalItems", orderPage.getTotalElements());
        response.put("totalPages", orderPage.getTotalPages());

        ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                response,
                "Orders retrieved successfully"
        );
        responseResource.setStatus(200);

        return ResponseEntity.ok(responseResource);
    }
}