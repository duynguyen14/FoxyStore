package com.example.back.repository;

import com.example.back.entity.ShoppingCart;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Integer> {
    Optional<ShoppingCart> findByUser(User user);
    void deleteByUser(User user);

}
