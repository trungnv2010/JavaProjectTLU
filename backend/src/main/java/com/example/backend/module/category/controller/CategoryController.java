package com.example.backend.module.category.controller;

import com.example.backend.module.category.dto.CategoryDTO;
import com.example.backend.module.category.service.CategoryService;
import com.example.backend.resource.ResponseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ResponseResource<List<CategoryDTO>>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        logger.info("Fetching all categories with page: {}, limit: {}, search: {}", page, limit, search);

        List<CategoryDTO> categories = categoryService.getAllCategories(page, limit, search);
        ResponseResource<List<CategoryDTO>> responseResource = ResponseResource.success(
                categories,
                "Categories retrieved successfully"
        );
        responseResource.setStatus(200);

        return ResponseEntity.ok(responseResource);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseResource<CategoryDTO>> getCategoryById(@PathVariable Long id) {
        logger.info("Fetching category with id: {}", id);
        try {
            CategoryDTO category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(ResponseResource.success(category, "Category retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving category: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ResponseResource<CategoryDTO>> getCategoryBySlug(@PathVariable String slug) {
        logger.info("Fetching category with slug: {}", slug);
        try {
            CategoryDTO category = categoryService.getCategoryBySlug(slug);
            return ResponseEntity.ok(ResponseResource.success(category, "Category retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving category: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @PostMapping
    public ResponseEntity<ResponseResource<CategoryDTO>> createCategory(@RequestBody CategoryDTO categoryDTO) {
        logger.info("Creating category with name: {}", categoryDTO.getName());
        ResponseResource<CategoryDTO> response = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseResource<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDTO categoryDTO) {
        logger.info("Updating category with id: {} and new name: {}", id, categoryDTO.getName());
        ResponseResource<CategoryDTO> response = categoryService.updateCategory(id, categoryDTO);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseResource<String>> deleteCategory(@PathVariable Long id) {
        logger.info("Deleting category with id: {}", id);
        ResponseResource<String> response = categoryService.deleteCategory(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}