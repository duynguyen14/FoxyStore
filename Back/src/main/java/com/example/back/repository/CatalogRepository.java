package com.example.back.repository;
import com.example.back.entity.Catalog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public interface CatalogRepository extends JpaRepository<Catalog,Integer> {
    @Query("SELECT DISTINCT c FROM Catalog c LEFT JOIN FETCH c.categories WHERE c.isDeleted = false")
    List<Catalog> findAllActiveWithCategories();
    @Query(value = "SELECT c.catalog_id AS catalogId, c.name AS name FROM CATALOG c WHERE c.is_deleted = false", nativeQuery = true)
    List<Object[]> findByIsDeletedFalse();

    Page<Catalog> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT c FROM Catalog c LEFT JOIN FETCH c.categories")
    List<Catalog> findAllWithCategories();

    @Query("SELECT c FROM Catalog c WHERE c.catalogId = :id AND c.isDeleted = false")
    Optional<Catalog> findByIdAndNotDeleted(Integer id);
    List<Catalog> findAllByIsDeletedFalse();
}
