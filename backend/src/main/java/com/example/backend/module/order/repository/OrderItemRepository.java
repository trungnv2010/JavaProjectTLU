package com.example.backend.module.order.repository;

import com.example.backend.module.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findAllByOrderId(@Param("orderId") Long orderId);

    @Query(value = "SELECT p.id as productId, p.name as productName, SUM(oi.quantity) as totalQuantity " +
            "FROM order_item oi JOIN product p ON oi.product_id = p.id " +
            "GROUP BY p.id, p.name ORDER BY totalQuantity DESC LIMIT :limit", nativeQuery = true)
    List<Map<String, Object>> findTopSellingProducts(@Param("limit") int limit);
}