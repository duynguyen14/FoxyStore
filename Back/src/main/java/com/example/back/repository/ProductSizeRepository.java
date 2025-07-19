package com.example.back.repository;

import com.example.back.entity.Product;
import com.example.back.entity.ProductSize;
import com.example.back.entity.ShoppingCartDetail;
import com.example.back.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductSizeRepository extends JpaRepository<ProductSize,Integer> {
    Optional<ProductSize> findBySizeAndProduct(Size size, Product product);
//    Optional<ProductSize> findByShoppingCartDetail(ShoppingCartDetail shoppingCartDetail);
    Optional<ProductSize> findById(Integer id);

    @Query("SELECT ps from ProductSize ps JOIN FETCH ps.product WHERE ps.id =:id")
    Optional<ProductSize> findByIdWithProduct(@Param("id") Integer id);
    @Query("SELECT ps FROM ProductSize ps JOIN FETCH ps.product JOIN FETCH ps.size WHERE ps.id = :id")
    Optional<ProductSize> findWithProductAndSizeById(@Param("id") Integer id);
    void deleteByProduct(Product product);
}
