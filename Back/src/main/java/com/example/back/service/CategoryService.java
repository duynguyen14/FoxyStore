package com.example.back.service;

import com.example.back.dto.request.CategoryRequestDTO.CategoryCreateUpdateDTO;
import com.example.back.dto.response.Category.CategoryDTO;
import com.example.back.dto.response.Category.CategoryDTOWithCTLid;
import com.example.back.dto.response.Category.CategoryDetailDTO;
import com.example.back.dto.response.Category.ResponeDTO;
import com.example.back.entity.Catalog;
import com.example.back.entity.Category;
import com.example.back.repository.CatalogRepository;
import com.example.back.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;
    private final CatalogRepository catalogRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllRawCategories();
    }
    public List<CategoryDTOWithCTLid> getAllCategoriesWithCatalogID() {
        return categoryRepository.findAllWithActiveCatalog()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CategoryDTOWithCTLid convertToDto(Category category) {
        return CategoryDTOWithCTLid.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .catalogId(category.getCatalog().getCatalogId())
                .build();
    }
    public List<CategoryDetailDTO> getAllCategoryDetails() {
        List<Category> categories = categoryRepository.findAllByIsDeletedFalse();
        return categories.stream().map(category -> CategoryDetailDTO.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getName())
                .catalogName(category.getCatalog().getName())
                .totalProducts(category.getProducts().size())
                .build()
        ).collect(Collectors.toList());
    }
    public ResponeDTO createCategory(CategoryCreateUpdateDTO dto) {
        Catalog catalog = catalogRepository.findByIdAndNotDeleted(dto.getCatalogId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        Category category = Category.builder()
                .name(dto.getName())
                .catalog(catalog)
                .build();

        Category saved = categoryRepository.save(category);

        return ResponeDTO.builder()
                .categoryId(saved.getCategoryId())
                .name(saved.getName())
                .catalogName(saved.getCatalog().getName())
                .build();
    }
    public CategoryDTOWithCTLid updateCategory(Integer id, CategoryCreateUpdateDTO updateDto) {
        Category category = categoryRepository.findByCategoryIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category hoặc đã bị xóa"));

        if (updateDto.getCatalogId() != null
                && !updateDto.getCatalogId().equals(category.getCatalog().getCatalogId())) {

            Catalog newCatalog = catalogRepository.findByIdAndNotDeleted(updateDto.getCatalogId())
                    .orElseThrow(() -> new RuntimeException("Catalog mới không tồn tại hoặc đã bị xóa"));

            category.setCatalog(newCatalog);
        }

        if (updateDto.getName() != null) {
            category.setName(updateDto.getName());
        }

        Category updatedCategory = categoryRepository.save(category);

        // Tạo DTO trả về trực tiếp tại đây
        return CategoryDTOWithCTLid.builder()
                .categoryId(updatedCategory.getCategoryId())
                .name(updatedCategory.getName())
                .catalogId(updatedCategory.getCatalog().getCatalogId())
                .build();
    }

    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findByCategoryIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setIsDeleted(true);
        categoryRepository.save(category);
    }
}
