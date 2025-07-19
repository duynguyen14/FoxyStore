package com.example.back.repository;

import com.example.back.entity.FavoriteProduct;
import com.example.back.entity.FavoriteProductId;
import com.example.back.entity.Product;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, FavoriteProductId> {
    @Query("SELECT f from FavoriteProduct f " +
            "JOIN FETCH f.product p " +
            "JOIN FETCH p.images WHERE f.user = :user")
    Set<FavoriteProduct> getFavoriteProductByUser(@Param("user") User user);

    Optional<FavoriteProduct> findByUserAndProduct(User user, Product product);

}
