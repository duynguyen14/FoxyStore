//package com.example.back.mapper;
//
//
//
//import com.example.back.dto.response.Category.CategoryDTO;
//import com.example.back.entity.Catalog;
//import com.example.back.entity.Category;
//
//public class CategoryMapper {
//
//    public static CategoryDTO toDTO(Category category) {
//        if (category == null) return null;
//
//        return CategoryDTO.builder()
//                .categoryId(category.getCategoryId())
//                .name(category.getName())
//                .catalogId(category.getCatalog() != null ? category.getCatalog().getCatalogId() : null)
//                .catalogName(category.getCatalog() != null ? category.getCatalog().getName() : null)
//                .build();
//    }
//
//    public static Category toEntity(CategoryDTO dto, Catalog catalog) {
//        if (dto == null) return null;
//
//        return Category.builder()
//                .categoryId(dto.getCategoryId())
//                .name(dto.getName())
//                .catalog(catalog)
//                .build();
//    }
//}
