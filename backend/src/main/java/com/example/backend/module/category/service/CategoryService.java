package com.example.backend.module.category.service;

import com.example.backend.module.category.dto.CategoryDTO;
import com.example.backend.module.category.entity.Category;
import com.example.backend.module.category.repository.CategoryRepository;
import com.example.backend.resource.ResourceNotFoundException;
import com.example.backend.resource.ResponseResource;
import org.hibernate.service.spi.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories(int page, int limit, String search) {
        if (page < 0) {
            page = 0;
        }
        if (limit <= 0) {
            limit = 10;
        }
        Pageable pageable = PageRequest.of(page, limit);

        Page<Category> categoryPage;
        if (search != null && !search.trim().isEmpty()) {
            categoryPage = categoryRepository.searchCategories(search.trim(), pageable);
        } else {
            categoryPage = categoryRepository.findAll(pageable);
        }

        return categoryPage.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToDTO(category);
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return convertToDTO(category);
    }

    public ResponseResource<CategoryDTO> createCategory(CategoryDTO categoryDTO) {
        try {
            String slug = generateSlug(categoryDTO.getName());
            if (categoryRepository.existsBySlug(slug)) {
                slug = slug + "-" + System.currentTimeMillis();
            }

            logger.info("Creating category with name: {} and generated slug: {}", categoryDTO.getName(), slug);

            Category category = convertToEntity(categoryDTO);
            category.setSlug(slug);
            category.setCreatedAt(LocalDateTime.now());
            category.setUpdatedAt(LocalDateTime.now());

            Category savedCategory = categoryRepository.save(category);
            return ResponseResource.success(convertToDTO(savedCategory), "Category created successfully");
        } catch (Exception e) {
            logger.error("Error creating category: ", e);
            throw new ServiceException("An unexpected error occurred during category creation", e);
        }
    }

    public ResponseResource<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO) {
        try {
            Category existingCategory = categoryRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
            if (categoryDTO.getName() != null && !categoryDTO.getName().equals(existingCategory.getName())) {
                existingCategory.setName(categoryDTO.getName());
                String newSlug = generateSlug(categoryDTO.getName());
                if (!newSlug.equals(existingCategory.getSlug()) && categoryRepository.existsBySlug(newSlug)) {
                    newSlug = newSlug + "-" + System.currentTimeMillis();
                }

                existingCategory.setSlug(newSlug);
                logger.info("Updating category name to: {} and generated new slug: {}", categoryDTO.getName(), newSlug);
            }
            if (categoryDTO.getDescription() != null) {
                existingCategory.setDescription(categoryDTO.getDescription());
            }

            existingCategory.setUpdatedAt(LocalDateTime.now());

            Category updatedCategory = categoryRepository.save(existingCategory);
            return ResponseResource.success(convertToDTO(updatedCategory), "Category updated successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseResource.fail(e.getMessage(), 404);
        } catch (Exception e) {
            logger.error("Error updating category: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    public ResponseResource<String> deleteCategory(Long id) {
        try {
            if (!categoryRepository.existsById(id)) {
                return ResponseResource.fail("Category not found", 404);
            }
            categoryRepository.deleteById(id);
            return ResponseResource.success("Category deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting category: ", e);
            return ResponseResource.fail("Server error: " + e.getMessage(), 500);
        }
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO categoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(category, categoryDTO);
        return categoryDTO;
    }

    private Category convertToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category);
        return category;
    }

    private String generateSlug(String name) {
        if (name == null || name.isEmpty()) {
            return "";
        }
        String slug = name.toLowerCase();
        slug = slug.replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a")
                .replaceAll("[èéẹẻẽêềếệểễ]", "e")
                .replaceAll("[ìíịỉĩ]", "i")
                .replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o")
                .replaceAll("[ùúụủũưừứựửữ]", "u")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("[đ]", "d");
        slug = slug.replaceAll("\\s+", "-");
        slug = slug.replaceAll("[^a-z0-9-]", "");
        slug = slug.replaceAll("-+", "-");
        slug = slug.replaceAll("^-|-$", "");
        return slug;
    }
}