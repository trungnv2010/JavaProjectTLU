package com.example.backend.module.order.service;

import com.example.backend.module.order.dto.CreateOrderDTO;
import com.example.backend.module.order.dto.OrderDTO;
import com.example.backend.module.order.dto.UpdateOrderStatusDTO;
import com.example.backend.module.order.dto.UpdatePaymentStatusDTO;
import com.example.backend.module.order.entity.Order;
import com.example.backend.module.order.entity.OrderItem;
import com.example.backend.module.order.repository.OrderItemRepository;
import com.example.backend.module.order.repository.OrderRepository;
import com.example.backend.module.product.entity.Product;
import com.example.backend.module.product.repository.ProductRepository;
import com.example.backend.module.user.entity.User;
import com.example.backend.module.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Page<OrderDTO> getAllOrders(int page, int limit, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, limit, sort);
        Page<Order> orders = orderRepository.findAll(pageable);

        return orders.map(this::convertToDTO);
    }

    public Page<OrderDTO> searchOrders(Long userId, String status, String startDate, String endDate, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);

        LocalDateTime start = null;
        LocalDateTime end = null;

        if (startDate != null && !startDate.isEmpty()) {
            start = LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atStartOfDay();
        }

        if (endDate != null && !endDate.isEmpty()) {
            end = LocalDate.parse(endDate, DateTimeFormatter.ofPattern("yyyy-MM-dd")).atTime(23, 59, 59);
        }

        Order.OrderStatus orderStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = Order.OrderStatus.valueOf(status.toLowerCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid order status: " + status);
            }
        }

        Page<Order> orders = orderRepository.searchOrders(userId, orderStatus, start, end, pageable);
        return orders.map(this::convertToDTO);
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return convertToDTO(order);
    }

    public Page<OrderDTO> getOrdersByUserId(Long userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return orders.map(this::convertToDTO);
    }

    @Transactional
    public OrderDTO createOrder(CreateOrderDTO createOrderDTO) {
        User user = userRepository.findById(createOrderDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + createOrderDTO.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(createOrderDTO.getShippingAddress());
        order.setPaymentMethod(createOrderDTO.getPaymentMethod());
        order.setStatus(Order.OrderStatus.pending);
        order.setPaymentStatus(Order.PaymentStatus.unpaid);

        order = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CreateOrderDTO.OrderItemDTO itemDTO : createOrderDTO.getOrderItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDTO.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItems.add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        orderItemRepository.saveAll(orderItems);

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);
        order = orderRepository.save(order);

        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, UpdateOrderStatusDTO updateOrderStatusDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(updateOrderStatusDTO.getStatus().toLowerCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + updateOrderStatusDTO.getStatus());
        }

        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO updatePaymentStatus(Long id, UpdatePaymentStatusDTO updatePaymentStatusDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        try {
            Order.PaymentStatus newStatus = Order.PaymentStatus.valueOf(updatePaymentStatusDTO.getPaymentStatus().toLowerCase());
            order.setPaymentStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment status: " + updatePaymentStatusDTO.getPaymentStatus());
        }

        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        order.setStatus(Order.OrderStatus.cancelled);
        order = orderRepository.save(order);

        return convertToDTO(order);
    }

    public OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().toString());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus().toString());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserName(order.getUser().getFirstname() + " " + order.getUser().getLastname());
        }

        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(this::convertOrderItemToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private OrderDTO.OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        OrderDTO.OrderItemDTO dto = new OrderDTO.OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());

        if (orderItem.getProduct() != null) {
            dto.setProductId(orderItem.getProduct().getId());
            dto.setProductName(orderItem.getProduct().getName());
            dto.setProductImageUrl(orderItem.getProduct().getImageUrl());
        }

        return dto;
    }
}