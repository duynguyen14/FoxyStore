package com.example.back.repository;

import com.example.back.dto.response.Category.CategoryDTO;
import com.example.back.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer> {
    Optional<Category> findByCategoryId(Integer id);
    @Query(value = "SELECT category_id, name FROM category", nativeQuery = true)
    List<CategoryDTO> findAllRawCategories();
    Optional<Category> findByCategoryIdAndIsDeletedFalse(Integer categoryId);
    @Query("SELECT c FROM Category c WHERE c.catalog.isDeleted = false")
    List<Category> findAllWithActiveCatalog();

    List<Category> findAllByIsDeletedFalse();




}
