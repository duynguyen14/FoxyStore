package com.example.back.repository;

import com.example.back.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ReportRepository extends JpaRepository<Product, Integer> {

    @Query(value = """
        SELECT
            p.product_id AS productId,
            p.name AS productName,
            c.name AS categoryName,
            cat.name AS catalogName,
            p.quantity AS currentStock,
            COALESCE(SUM(bd.quantity), 0) AS totalSold,
            p.price AS unitPrice,
            (p.quantity * p.price) AS totalValue,
            CASE
                WHEN p.quantity = 0 THEN 'OUT_OF_STOCK'
                WHEN p.quantity <= 10 THEN 'LOW_STOCK'
                WHEN p.quantity <= 50 THEN 'MEDIUM_STOCK'
                ELSE 'HIGH_STOCK'
            END AS stockStatus,
            NOW() AS lastUpdateDate
        FROM product p
        LEFT JOIN category c ON p.category_id = c.category_id
        LEFT JOIN catalog cat ON c.catalog_id = cat.catalog_id
        LEFT JOIN product_size ps ON ps.product_id = p.product_id
        LEFT JOIN billdetail bd ON bd.product_size_id = ps.product_size_id
        LEFT JOIN bill b ON bd.bill_id = b.bill_id AND b.status = 'đã giao'
        GROUP BY
            p.product_id,
            p.name,
            c.name,
            cat.name,
            p.quantity,
            p.price
        ORDER BY p.quantity ASC
        """, nativeQuery = true)
    List<Object[]> getInventoryReport();

    @Query(value = """
        SELECT
            DATE(b.time) AS reportDate,
            'DAILY' AS period,
            COUNT(DISTINCT b.bill_id) AS totalOrders,
            SUM(bd.quantity) AS totalProducts,
            SUM(bd.quantity * p.price) AS totalRevenue,
            AVG(bd.quantity * p.price) AS averageOrderValue,
            (
                SELECT p2.name
                FROM product p2
                JOIN product_size ps2 ON ps2.product_id = p2.product_id
                JOIN billdetail bd2 ON bd2.product_size_id = ps2.product_size_id
                JOIN bill b2 ON bd2.bill_id = b2.bill_id
                WHERE DATE(b2.time) = DATE(b.time)
                  AND b2.status = 'đã giao'
                GROUP BY p2.product_id
                ORDER BY SUM(bd2.quantity) DESC
                LIMIT 1
            ) AS topSellingProduct,
            (
                SELECT c2.name
                FROM category c2
                JOIN product p3 ON c2.category_id = p3.category_id
                JOIN product_size ps3 ON ps3.product_id = p3.product_id
                JOIN billdetail bd3 ON bd3.product_size_id = ps3.product_size_id
                JOIN bill b3 ON bd3.bill_id = b3.bill_id
                WHERE DATE(b3.time) = DATE(b.time)
                  AND b3.status = 'đã giao'
                GROUP BY c2.category_id
                ORDER BY SUM(bd3.quantity) DESC
                LIMIT 1
            ) AS topCategory
        FROM bill b
        JOIN billdetail bd ON bd.bill_id = b.bill_id
        JOIN product_size ps ON ps.product_size_id = bd.product_size_id
        JOIN product p ON ps.product_id = p.product_id
        WHERE b.status = 'đã giao'
          AND b.time >= :startDate
          AND b.time <= :endDate
        GROUP BY DATE(b.time)
        ORDER BY DATE(b.time) DESC
        """, nativeQuery = true)
    List<Object[]> getRevenueReport(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query(value = """
        SELECT
            p.product_id AS productId,
            p.name AS productName,
            c.name AS categoryName,
            SUM(bd.quantity) AS quantitySold,
            p.price AS unitPrice,
            SUM(bd.quantity * p.price) AS totalRevenue,
            COUNT(DISTINCT b.bill_id) AS totalOrders,
            MIN(b.time) AS firstSaleDate,
            MAX(b.time) AS lastSaleDate
        FROM product p
        JOIN product_size ps ON ps.product_id = p.product_id
        JOIN billdetail bd ON bd.product_size_id = ps.product_size_id
        JOIN bill b ON bd.bill_id = b.bill_id
        JOIN category c ON p.category_id = c.category_id
        WHERE b.status = 'đã giao'
          AND b.time >= :startDate
          AND b.time <= :endDate
        GROUP BY p.product_id, p.name, c.name, p.price
        ORDER BY SUM(bd.quantity * p.price) DESC
        """, nativeQuery = true)
    List<Object[]> getDetailedRevenueReport(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
