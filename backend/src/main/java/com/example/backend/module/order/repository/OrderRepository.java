package com.example.backend.module.order.repository;

import com.example.backend.module.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
            "(:userId IS NULL OR o.user.id = :userId) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR o.createdAt <= :endDate)")
    Page<Order> searchOrders(
            @Param("userId") Long userId,
            @Param("status") Order.OrderStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    @Query(value = "SELECT COUNT(*) FROM `order` WHERE status = :status", nativeQuery = true)
    Long countByStatus(@Param("status") String status);

    @Query(value = "SELECT COUNT(*) FROM `order` WHERE DATE(created_at) = CURDATE()", nativeQuery = true)
    Long countTodayOrders();

    @Query(value = "SELECT SUM(total_amount) FROM `order` WHERE status != 'cancelled'", nativeQuery = true)
    Double getTotalRevenue();

    @Query(value = "SELECT SUM(total_amount) FROM `order` WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'", nativeQuery = true)
    Double getTodayRevenue();
}