package com.example.backend.module.product.service;

import com.example.backend.module.category.entity.Category;
import com.example.backend.module.category.repository.CategoryRepository;
import com.example.backend.module.product.dto.ProductDTO;
import com.example.backend.module.product.entity.Product;
import com.example.backend.module.product.repository.ProductRepository;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<ProductDTO> getAllProducts(int page, int limit, String search, String sortBy, String direction) {
        if (page < 0) {
            page = 0;
        }
        if (limit <= 0) {
            limit = 10;
        }

        Sort sort = Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, limit, sort);

        Page<Product> productPage;
        if (search != null && !search.trim().isEmpty()) {
            productPage = productRepository.searchProducts(search.trim(), pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        return productPage.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByCategory(Long categoryId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, pageable);
        return productPage.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Product> productPage = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        return productPage.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByBrand(String brand, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Product> productPage = productRepository.findByBrand(brand, pageable);
        return productPage.map(this::convertToDTO);
    }

    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    public ResponseResource<ProductDTO> createProduct(ProductDTO productDTO) {
        try {
            logger.info("Creating product with name: {}", productDTO.getName());

            // Verify category exists
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));

            Product product = convertToEntity(productDTO);
            product.setCategory(category);
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());

            Product savedProduct = productRepository.save(product);
            return ResponseResource.success(convertToDTO(savedProduct), "Product created successfully");
        } catch (ResourceNotFoundException e) {
            logger.error("Error creating product: ", e);
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error creating product: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public ResponseResource<ProductDTO> updateProduct(Long id, ProductDTO productDTO) {
        try {
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

            // Update category if it's changed
            if (productDTO.getCategoryId() != null &&
                    (existingProduct.getCategory() == null ||
                            !productDTO.getCategoryId().equals(existingProduct.getCategory().getId()))) {

                Category category = categoryRepository.findById(productDTO.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));

                existingProduct.setCategory(category);
            }

            // Only update fields that are provided (not null)
            if (productDTO.getName() != null) {
                existingProduct.setName(productDTO.getName());
            }
            if (productDTO.getDescription() != null) {
                existingProduct.setDescription(productDTO.getDescription());
            }
            if (productDTO.getPrice() != null) {
                existingProduct.setPrice(productDTO.getPrice());
            }
            if (productDTO.getDiscountPrice() != null) {
                existingProduct.setDiscountPrice(productDTO.getDiscountPrice());
            }
            if (productDTO.getStockQuantity() != null) {
                existingProduct.setStockQuantity(productDTO.getStockQuantity());
            }
            if (productDTO.getImageUrl() != null) {
                existingProduct.setImageUrl(productDTO.getImageUrl());
            }
            if (productDTO.getBrand() != null) {
                existingProduct.setBrand(productDTO.getBrand());
            }
            if (productDTO.getModel() != null) {
                existingProduct.setModel(productDTO.getModel());
            }
            if (productDTO.getSpecifications() != null) {
                existingProduct.setSpecifications(productDTO.getSpecifications());
            }

            existingProduct.setUpdatedAt(LocalDateTime.now());

            Product updatedProduct = productRepository.save(existingProduct);
            return ResponseResource.success(convertToDTO(updatedProduct), "Product updated successfully");
        } catch (ResourceNotFoundException e) {
            logger.error("Error updating product: ", e);
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error updating product: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public ResponseResource<String> deleteProduct(Long id) {
        try {
            if (!productRepository.existsById(id)) {
                return ResponseResource.fail("Product not found with id: " + id, 404);
            }
            productRepository.deleteById(id);
            return ResponseResource.success("Product deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting product: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public ResponseResource<ProductDTO> updateProductStock(Long id, Integer quantity) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

            product.setStockQuantity(quantity);
            product.setUpdatedAt(LocalDateTime.now());

            Product updatedProduct = productRepository.save(product);
            return ResponseResource.success(convertToDTO(updatedProduct), "Product stock updated successfully");
        } catch (ResourceNotFoundException e) {
            logger.error("Error updating product stock: ", e);
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error updating product stock: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);

        if (product.getCategory() != null) {
            productDTO.setCategoryId(product.getCategory().getId());
            productDTO.setCategoryName(product.getCategory().getName());
        }

        return productDTO;
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        return product;
    }
}