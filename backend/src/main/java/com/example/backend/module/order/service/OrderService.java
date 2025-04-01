package com.example.backend.module.order.service;

import com.example.backend.module.order.dto.*;
import com.example.backend.module.order.entity.Order;
import com.example.backend.module.order.entity.Order.OrderStatus;
import com.example.backend.module.order.entity.Order.PaymentStatus;
import com.example.backend.module.order.entity.OrderItem;
import com.example.backend.module.order.repository.OrderItemRepository;
import com.example.backend.module.order.repository.OrderRepository;
import com.example.backend.module.product.entity.Product;
import com.example.backend.module.product.repository.ProductRepository;
import com.example.backend.module.user.entity.User;
import com.example.backend.module.user.repository.UserRepository;
import com.example.backend.resource.ResourceNotFoundException;
import com.example.backend.resource.ResponseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<OrderDTO> getAllOrders(int page, int limit, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, limit, sort);

        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(this::convertToDTO);
    }

    public Page<OrderDTO> searchOrders(Long userId, String status, String startDate, String endDate, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);

        OrderStatus orderStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toLowerCase());
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid order status: {}", status);
            }
        }

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        if (startDate != null && !startDate.isEmpty()) {
            try {
                startDateTime = LocalDateTime.parse(startDate, formatter);
            } catch (Exception e) {
                logger.warn("Invalid start date format: {}", startDate);
            }
        }

        if (endDate != null && !endDate.isEmpty()) {
            try {
                endDateTime = LocalDateTime.parse(endDate, formatter);
            } catch (Exception e) {
                logger.warn("Invalid end date format: {}", endDate);
            }
        }

        Page<Order> orders = orderRepository.searchOrders(userId, orderStatus, startDateTime, endDateTime, pageable);
        return orders.map(this::convertToDTO);
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        return convertToDTO(order);
    }

    public Page<OrderDTO> getOrdersByUserId(Long userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return orders.map(this::convertToDTO);
    }

    public Page<OrderDTO> getOrdersByStatus(String status, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);

        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status.toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }

        Page<Order> orders = orderRepository.findByStatus(orderStatus, pageable);
        return orders.map(this::convertToDTO);
    }

    @Transactional
    public ResponseResource<OrderDTO> createOrder(CreateOrderRequest createOrderRequest) {
        try {
            User user = userRepository.findById(createOrderRequest.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + createOrderRequest.getUserId()));

            // Create new order
            Order order = new Order();
            order.setUser(user);
            order.setShippingAddress(createOrderRequest.getShippingAddress());
            order.setPaymentMethod(createOrderRequest.getPaymentMethod());
            order.setStatus(OrderStatus.pending);
            order.setPaymentStatus(PaymentStatus.unpaid);

            // Create order items and calculate total
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (CreateOrderItemRequest itemRequest : createOrderRequest.getOrderItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId()));

                // Check stock
                if (product.getStockQuantity() < itemRequest.getQuantity()) {
                    return ResponseResource.fail("Not enough stock for product: " + product.getName(), 400);
                }

                // Create order item
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemRequest.getQuantity());

                // Use discounted price if available, otherwise use regular price
                BigDecimal priceToUse = (product.getDiscountPrice() != null && product.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                        ? product.getDiscountPrice()
                        : product.getPrice();

                orderItem.setPrice(priceToUse);

                // Update total amount
                BigDecimal itemTotal = priceToUse.multiply(new BigDecimal(itemRequest.getQuantity()));
                totalAmount = totalAmount.add(itemTotal);

                // Add to list
                orderItems.add(orderItem);

                // Update product stock
                product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
                productRepository.save(product);
            }

            order.setTotalAmount(totalAmount);
            order.setOrderItems(orderItems);

            // Save order
            Order savedOrder = orderRepository.save(order);

            return ResponseResource.success(convertToDTO(savedOrder), "Order created successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error creating order: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    @Transactional
    public ResponseResource<OrderDTO> updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

            order.setStatus(request.getStatus());
            order.setUpdatedAt(LocalDateTime.now());

            Order updatedOrder = orderRepository.save(order);

            return ResponseResource.success(convertToDTO(updatedOrder), "Order status updated successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error updating order status: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    @Transactional
    public ResponseResource<OrderDTO> updatePaymentStatus(Long id, UpdatePaymentStatusRequest request) {
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

            order.setPaymentStatus(request.getPaymentStatus());
            order.setUpdatedAt(LocalDateTime.now());

            Order updatedOrder = orderRepository.save(order);

            return ResponseResource.success(convertToDTO(updatedOrder), "Payment status updated successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error updating payment status: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    @Transactional
    public ResponseResource<String> cancelOrder(Long id) {
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

            // Check if order can be cancelled
            if (order.getStatus() == OrderStatus.delivered) {
                return ResponseResource.fail("Cannot cancel an order that has been delivered", 400);
            }

            // Restore product stock
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }

            // Update order status
            order.setStatus(OrderStatus.cancelled);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            return ResponseResource.success("Order cancelled successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error cancelling order: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public Map<String, Object> getOrderStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        // Count orders by status
        for (OrderStatus status : OrderStatus.values()) {
            long count = orderRepository.countByStatus(status);
            statistics.put(status.toString(), count);
        }

        // Count today's orders
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        long todayOrderCount = orderRepository.countOrdersInDateRange(startOfDay, endOfDay);
        statistics.put("todayOrders", todayOrderCount);

        // Count this month's orders
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusNanos(1);
        long monthOrderCount = orderRepository.countOrdersInDateRange(startOfMonth, endOfMonth);
        statistics.put("monthOrders", monthOrderCount);

        return statistics;
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        BeanUtils.copyProperties(order, orderDTO);

        if (order.getUser() != null) {
            orderDTO.setUserId(order.getUser().getId());
            orderDTO.setUserName(order.getUser().getUsername());
        }

        if (order.getOrderItems() != null) {
            List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            orderDTO.setOrderItems(orderItemDTOs);
        }

        return orderDTO;
    }

    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        BeanUtils.copyProperties(orderItem, orderItemDTO);

        if (orderItem.getProduct() != null) {
            orderItemDTO.setProductId(orderItem.getProduct().getId());
            orderItemDTO.setProductName(orderItem.getProduct().getName());
            orderItemDTO.setProductImageUrl(orderItem.getProduct().getImageUrl());
        }

        return orderItemDTO;
    }
}