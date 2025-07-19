package com.example.back.repository;

import com.example.back.entity.Sale;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale,Integer> {
    @EntityGraph(attributePaths = {"products", "products.category"})
    Optional<Sale> findWithProductsById(Integer id);
    List<Sale> findByIsDeletedFalse();
    Optional<Sale> findByIdAndIsDeletedFalse(Integer id);

}
