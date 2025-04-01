package com.example.backend.module.product.controller;

import com.example.backend.module.product.dto.ProductDTO;
import com.example.backend.module.product.service.ProductService;
import com.example.backend.resource.ResponseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ResponseResource<Map<String, Object>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        logger.info("Fetching all products with page: {}, limit: {}, search: {}, sortBy: {}, direction: {}",
                page, limit, search, sortBy, direction);

        try {
            Page<ProductDTO> productPage = productService.getAllProducts(page, limit, search, sortBy, direction);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productPage.getContent());
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Products retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving products: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        logger.info("Fetching products by category id: {} with page: {}, limit: {}", categoryId, page, limit);

        try {
            Page<ProductDTO> productPage = productService.getProductsByCategory(categoryId, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productPage.getContent());
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Products retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving products by category: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/price-range")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        logger.info("Fetching products by price range: {} - {} with page: {}, limit: {}",
                minPrice, maxPrice, page, limit);

        try {
            Page<ProductDTO> productPage = productService.getProductsByPriceRange(minPrice, maxPrice, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productPage.getContent());
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Products retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving products by price range: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<ResponseResource<Map<String, Object>>> getProductsByBrand(
            @PathVariable String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        logger.info("Fetching products by brand: {} with page: {}, limit: {}", brand, page, limit);

        try {
            Page<ProductDTO> productPage = productService.getProductsByBrand(brand, page, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productPage.getContent());
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());

            ResponseResource<Map<String, Object>> responseResource = ResponseResource.success(
                    response,
                    "Products retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving products by brand: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/brands")
    public ResponseEntity<ResponseResource<List<String>>> getAllBrands() {
        logger.info("Fetching all brands");

        try {
            List<String> brands = productService.getAllBrands();

            ResponseResource<List<String>> responseResource = ResponseResource.success(
                    brands,
                    "Brands retrieved successfully"
            );
            responseResource.setStatus(200);

            return ResponseEntity.ok(responseResource);
        } catch (Exception e) {
            logger.error("Error retrieving brands: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseResource.fail("Server error: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseResource<ProductDTO>> getProductById(@PathVariable Long id) {
        logger.info("Fetching product with id: {}", id);

        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(ResponseResource.success(product, "Product retrieved successfully"));
        } catch (Exception e) {
            logger.error("Error retrieving product: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseResource.fail(e.getMessage(), 404));
        }
    }

    @PostMapping
    public ResponseEntity<ResponseResource<ProductDTO>> createProduct(@RequestBody ProductDTO productDTO) {
        logger.info("Creating product with name: {}", productDTO.getName());

        ResponseResource<ProductDTO> response = productService.createProduct(productDTO);

        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseResource<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO productDTO) {

        logger.info("Updating product with id: {}", id);

        ResponseResource<ProductDTO> response = productService.updateProduct(id, productDTO);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ResponseResource<ProductDTO>> updateProductStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        logger.info("Updating product stock for id: {} with quantity: {}", id, quantity);

        ResponseResource<ProductDTO> response = productService.updateProductStock(id, quantity);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseResource<String>> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product with id: {}", id);

        ResponseResource<String> response = productService.deleteProduct(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else if (response.getStatus() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}