package com.example.back.repository;

import com.example.back.entity.ProductSize;
import com.example.back.entity.ShoppingCart;
import com.example.back.entity.ShoppingCartDetail;
import com.example.back.entity.ShoppingCartDetailId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ShoppingCartDetailRepository extends JpaRepository<ShoppingCartDetail, ShoppingCartDetailId> {

    Optional<ShoppingCartDetail> findByProductSizeAndShoppingCart(ProductSize productSize, ShoppingCart shoppingCart);
    @Query("SELECT scd FROM ShoppingCartDetail scd " +
            "JOIN FETCH scd.productSize ps " +
            "JOIN FETCH ps.product p " +
            "LEFT JOIN FETCH p.images " +
            "JOIN FETCH ps.size " +
            "WHERE scd.shoppingCart = :shoppingCart")
    List<ShoppingCartDetail> findByShoppingCart(ShoppingCart shoppingCart);

    void deleteByProductSizeAndShoppingCart(ProductSize productSize, ShoppingCart shoppingCart);

}
