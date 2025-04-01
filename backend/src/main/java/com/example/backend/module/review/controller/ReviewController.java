package com.example.backend.module.review.controller;

import com.example.backend.module.review.dto.CreateReviewRequest;
import com.example.backend.module.review.dto.ReviewDTO;
import com.example.backend.module.review.dto.UpdateReviewRequest;
import com.example.backend.module.review.service.ReviewService;
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
@RequestMapping("/api/v1/review")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getReviewsByProductId(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        logger.info("Fetching reviews for product id: {} with page: {}, limit: {}, sortBy: {}, direction: {}",
                productId, page, limit, sortBy, direction);

        try {
            Page<ReviewDTO> reviewsPage = reviewService.getReviewsByProductId(productId, page, limit, sortBy, direction);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviewsPage.getContent());
            response.put("currentPage", reviewsPage.getNumber());
            response.put("totalItems", reviewsPage.getTotalElements());
            response.put("totalPages", reviewsPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Reviews retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving reviews: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getReviewsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        logger.info("Fetching reviews for user id: {} with page: {}, limit: {}", userId, page, limit);

        try {
            Page<ReviewDTO> reviewsPage = reviewService.getReviewsByUserId(userId, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviewsPage.getContent());
            response.put("currentPage", reviewsPage.getNumber());
            response.put("totalItems", reviewsPage.getTotalElements());
            response.put("totalPages", reviewsPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Reviews retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving reviews: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseResource<ReviewDTO>> getReviewById(@PathVariable Long id) {
        logger.info("Fetching review with id: {}", id);

        try {
            ReviewDTO review = reviewService.getReviewById(id);
            return ResponseEntity.ok(ResponseResource.success(review, "Review retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving review: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @GetMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<ResponseResource<ReviewDTO>> getUserReviewForProduct(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        logger.info("Fetching review for user id: {} and product id: {}", userId, productId);

        try {
            ReviewDTO review = reviewService.getUserReviewForProduct(userId, productId);
            return ResponseEntity.ok(ResponseResource.success(review, "Review retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving review: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @GetMapping("/product/{productId}/statistics")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getProductRatingStatistics(@PathVariable Long productId) {
        logger.info("Fetching rating statistics for product id: {}", productId);

        try {
            Map<String, Object> statistics = reviewService.getProductRatingStatistics(productId);
            return ResponseEntity.ok(ResponseResource.success(statistics, "Rating statistics retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving rating statistics: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @PostMapping
    public ResponseEntity<ResponseResource<ReviewDTO>> createReview( @RequestBody CreateReviewRequest request) {
        logger.info("Creating review for product id: {} by user id: {}", request.getProductId(), request.getUserId());

        ResponseResource<ReviewDTO> response = reviewService.createReview(request);

        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseResource<ReviewDTO>> updateReview(
            @PathVariable Long id,
             @RequestBody UpdateReviewRequest request) {

        logger.info("Updating review with id: {}", id);

        ResponseResource<ReviewDTO> response = reviewService.updateReview(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseResource<String>> deleteReview(@PathVariable Long id) {
        logger.info("Deleting review with id: {}", id);

        ResponseResource<String> response = reviewService.deleteReview(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}