package com.example.back.repository;

import com.example.back.dto.response.Product.ProductInfoDTO;
import com.example.back.dto.response.Product.SummaryProduct;
import com.example.back.entity.Category;
import com.example.back.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Integer> {

    @EntityGraph(attributePaths = {"images", "productSizes", "productSizes.size", "sale"})
    @Query("SELECT DISTINCT p FROM Product p ORDER BY p.createdDate DESC")
    List<Product> findProductNew(Pageable pageable);


    @EntityGraph(attributePaths = {"images", "productSizes","productSizes.size", "sale"})
    @Query("SELECT distinct p FROM Product p  JOIN p.sale s WHERE s.id=1")
    List<Product> findProductSale(Pageable pageable);

    @EntityGraph(attributePaths = {"images", "category", "reviews", "productSizes"})
    @Query("SELECT p FROM Product p WHERE p.productId = :id")
    Optional<Product> findProductWithDetail(@Param("id") Integer id);

    Optional<Product> findByProductId(Integer id);

    @EntityGraph(attributePaths = {"images", "productSizes","productSizes.size",  "sale"})
    @Query("SELECT distinct p FROM Product p ORDER BY p.createdDate DESC")
    List<Product> findAllProduct(Pageable pageable);

    @EntityGraph(attributePaths = {"images", "productSizes","productSizes.size",  "sale"})
    @Query("SELECT distinct p FROM Product p WHERE p.category = :category ")
    List<Product> findByCategory(@Param("category") Category category, Pageable pageable);

    @Query("SELECT p from Product p WHERE p.productId in :productIds")
    List<Product> findByProductIds(@Param("productIds") List<Integer> productIds);

    // admin
    @Query("""
        SELECT p FROM Product p
        JOIN p.reviews r
        GROUP BY p.id
        ORDER BY AVG(r.rating) DESC
    """)
    List<Product> findTopRatedProducts(Pageable pageable);
    // product
//    @Query(value = """
//    SELECT GROUP_CONCAT(DISTINCT img.image) AS images,
//           p.name AS name,
//           p.price AS price,
//           p.quantity AS quantity,
//           c.name AS category,
//           p.sold_count AS soldCount,
//           GROUP_CONCAT(DISTINCT s.size_name) AS sizes,
//           p.product_id AS ProductId
//    FROM product p
//    JOIN category c ON p.category_id = c.category_id
//    JOIN image img ON img.product_id = p.product_id
//    JOIN product_size ps ON ps.product_id = p.product_id
//    JOIN size s ON s.size_id = ps.size_id
//    WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name , '%')))
//    GROUP BY p.product_id
//    LIMIT :limit OFFSET :offset
//""", nativeQuery = true)
//    List<Object[]> searchProducts(
//            @Param("name") String name,
//            @Param("limit") int limit,
//            @Param("offset") int offset
//    );
//
//    @Query(value = """
//    SELECT COUNT(DISTINCT p.product_id)
//    FROM product p
//    WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
//
//""", nativeQuery = true)
//    int countFilteredProducts(
//            @Param("name") String name
//
//    );
    // giảm giá
    List<Product> findByProductIdInAndIsDeletedFalse(List<Integer> ids);
    List<Product> findByCategoryCategoryIdInAndIsDeletedFalse(List<Integer> categoryIds);
    List<Product> findBySaleIdAndIsDeletedFalse(Integer saleId);


//    List<Product> findByName(String name);/
    @Query("""
            SELECT new com.example.back.dto.response.Product.ProductInfoDTO(
            p.productId,p.name,p.price,p.quantity,p.soldCount,p.description,c.categoryId,null,null
            )
            FROM Product p
            LEFT JOIN p.category c
            WHERE
            (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name , '%')))
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
            """)
    Page<ProductInfoDTO> getAllProductByAdmin(Pageable pageable,
                                              @Param("name") String name,
                                              @Param("minPrice") BigDecimal minPrice,
                                              @Param("maxPrice") BigDecimal maxPrice,
                                              @Param("categoryId") Integer categoryId

    );

    @Query("""
            SELECT ps.product.productId, s.sizeId
            FROM ProductSize ps LEFT JOIN ps.size s
            WHERE ps.product.productId in :productIds
            """)
    List<Object[]> getSizesByProductIds(@Param("productIds") List<Integer> productIds);

    @Query("""
            SELECT i.product.productId, i.image
            FROM Image i
            WHERE i.product.productId IN :productIds
            """)
    List<Object[]> getImagesByProductIds(@Param("productIds") List<Integer> productIds);

    @Query("""
    SELECT new com.example.back.dto.response.Product.SummaryProduct(
    count(p),
    SUM(p.quantity),
    SUM(p.quantity * p.price),
    null,
    null
    )
    from Product p
    """)
    SummaryProduct summaryProduct();

}
