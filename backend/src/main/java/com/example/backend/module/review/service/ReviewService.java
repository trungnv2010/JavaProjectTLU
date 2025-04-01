package com.example.backend.module.review.service;

import com.example.backend.module.product.entity.Product;
import com.example.backend.module.product.repository.ProductRepository;
import com.example.backend.module.review.dto.CreateReviewRequest;
import com.example.backend.module.review.dto.ReviewDTO;
import com.example.backend.module.review.dto.UpdateReviewRequest;
import com.example.backend.module.review.entity.Review;
import com.example.backend.module.review.repository.ReviewRepository;
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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<ReviewDTO> getReviewsByProductId(Long productId, int page, int limit, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, limit, sort);

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }

        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
        return reviews.map(this::convertToDTO);
    }

    public Page<ReviewDTO> getReviewsByUserId(Long userId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
        return reviews.map(this::convertToDTO);
    }

    public ReviewDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        return convertToDTO(review);
    }

    public ReviewDTO getUserReviewForProduct(Long userId, Long productId) {
        Review review = reviewRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for user id: " + userId + " and product id: " + productId));

        return convertToDTO(review);
    }

    @Transactional
    public ResponseResource<ReviewDTO> createReview(CreateReviewRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

            if (reviewRepository.existsByUserIdAndProductId(request.getUserId(), request.getProductId())) {
                return ResponseResource.fail("User has already reviewed this product", 400);
            }

            Review review = new Review();
            review.setUser(user);
            review.setProduct(product);
            review.setRating(request.getRating());
            review.setComment(request.getComment());

            Review savedReview = reviewRepository.save(review);

            return ResponseResource.success(convertToDTO(savedReview), "Review created successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error creating review: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    @Transactional
    public ResponseResource<ReviewDTO> updateReview(Long id, UpdateReviewRequest request) {
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

            review.setRating(request.getRating());
            review.setComment(request.getComment());
            review.setUpdatedAt(LocalDateTime.now());

            Review updatedReview = reviewRepository.save(review);

            return ResponseResource.success(convertToDTO(updatedReview), "Review updated successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error updating review: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    @Transactional
    public ResponseResource<String> deleteReview(Long id) {
        try {
            if (!reviewRepository.existsById(id)) {
                return ResponseResource.fail("Review not found with id: " + id, 404);
            }

            reviewRepository.deleteById(id);

            return ResponseResource.success("Review deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting review: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public Map<String, Object> getProductRatingStatistics(Long productId) {
        Map<String, Object> statistics = new HashMap<>();

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }

        // Get average rating
        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
        statistics.put("averageRating", averageRating == null ? 0.0 : averageRating);

        // Get total number of reviews
        Long totalReviews = reviewRepository.countByProductId(productId);
        statistics.put("totalReviews", totalReviews);

        // Get rating distribution
        List<Object[]> ratingDistribution = reviewRepository.getProductRatingDistribution(productId);
        Map<Integer, Long> distributionMap = new HashMap<>();

        // Initialize distribution with 0 counts for all ratings
        for (int i = 1; i <= 5; i++) {
            distributionMap.put(i, 0L);
        }

        // Update with actual counts
        for (Object[] row : ratingDistribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            distributionMap.put(rating, count);
        }

        statistics.put("ratingDistribution", distributionMap);

        return statistics;
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        BeanUtils.copyProperties(review, reviewDTO);

        if (review.getProduct() != null) {
            reviewDTO.setProductId(review.getProduct().getId());
            reviewDTO.setProductName(review.getProduct().getName());
        }

        if (review.getUser() != null) {
            reviewDTO.setUserId(review.getUser().getId());
            reviewDTO.setUserName(review.getUser().getUsername());
        }

        return reviewDTO;
    }
}