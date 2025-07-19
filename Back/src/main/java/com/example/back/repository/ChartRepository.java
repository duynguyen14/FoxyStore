package com.example.back.repository;

import com.example.back.dto.response.Chart.CatalogProductCountDTO;
import com.example.back.dto.response.Chart.CatalogRevenueDTO;
import com.example.back.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChartRepository extends JpaRepository<Bill,Integer> {
    // 1. Lấy doanh thu theo NGÀY
    @Query(value = """
    SELECT 
        DATE(b.time) as date,
        COALESCE(SUM(bd.quantity * p.price), 0) as totalRevenue,
        COUNT(DISTINCT b.bill_id) as totalOrder
    FROM bill b
    LEFT JOIN billdetail bd ON b.bill_id = bd.bill_id
    LEFT JOIN product_size ps ON bd.product_size_id = ps.product_size_id
    LEFT JOIN product p ON ps.product_id = p.product_id
    WHERE b.time >= :startDate 
      AND b.time <= :endDate
      AND b.status = 'đã giao'
    GROUP BY DATE(b.time)
    ORDER BY DATE(b.time)
    """, nativeQuery = true)
    List<Object[]> getDailyRevenue(@Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    // 2. Lấy doanh thu theo THÁNG
    @Query(value = """
    SELECT 
        DATE_FORMAT(b.time, '%Y-%m') as month,
        COALESCE(SUM(bd.quantity * p.price), 0) as totalRevenue,
        COUNT(DISTINCT b.bill_id) as totalOrder
    FROM bill b
    LEFT JOIN billdetail bd ON b.bill_id = bd.bill_id
    LEFT JOIN product_size ps ON bd.product_size_id = ps.product_size_id
    LEFT JOIN product p ON ps.product_id = p.product_id
    WHERE b.time >= :startDate AND b.time <= :endDate
     AND b.status = 'đã giao'
    GROUP BY DATE_FORMAT(b.time, '%Y-%m')
    ORDER BY DATE_FORMAT(b.time, '%Y-%m')
    """, nativeQuery = true)
    List<Object[]> getMonthlyRevenue(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);


    // 3. Lấy doanh thu theo QUÝ
    @Query(value = """
    SELECT 
        CONCAT(YEAR(b.time), '-Q', QUARTER(b.time)) as quarter,
        COALESCE(SUM(bd.quantity * p.price), 0) as totalRevenue,
        COUNT(DISTINCT b.bill_id) as totalOrder
    FROM bill b
    LEFT JOIN billdetail bd ON b.bill_id = bd.bill_id
    LEFT JOIN product_size ps ON bd.product_size_id = ps.product_size_id
    LEFT JOIN product p ON ps.product_id = p.product_id
    WHERE b.time >= :startDate AND b.time <= :endDate
     AND b.status = 'đã giao'
    GROUP BY YEAR(b.time), QUARTER(b.time)
    ORDER BY YEAR(b.time), QUARTER(b.time)
    """, nativeQuery = true)
    List<Object[]> getQuarterlyRevenue(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);
    // 4. Phân tích danh mục - Số lượng sản phẩm theo danh mục
    @Query(value = """
    SELECT
        cat.name AS catalogName,
        COUNT(p.product_id) AS productCount
    FROM catalog cat
    LEFT JOIN category c ON cat.catalog_id = c.catalog_id
    LEFT JOIN product p ON c.category_id = p.category_id
    GROUP BY cat.catalog_id, cat.name
    ORDER BY productCount DESC
    """, nativeQuery = true)
    List<CatalogProductCountDTO> getProductCountByCatalog();
    // 5. Phân tích danh mục - Doanh thu theo danh mục
    @Query(value = """
            SELECT cat.name AS catalogName,
                   COALESCE(SUM(bd.quantity * p.price), 0.0) AS totalRevenue
            FROM catalog cat
            LEFT JOIN category c ON cat.catalog_id = c.catalog_id
            LEFT JOIN product p ON c.category_id = p.category_id
            LEFT JOIN product_size ps ON p.product_id = ps.product_id
            LEFT JOIN billdetail bd ON ps.product_size_id = bd.product_size_id
            LEFT JOIN bill b ON bd.bill_id = b.bill_id
            WHERE b.status = 'đã giao' OR b.status IS NULL
            GROUP BY cat.catalog_id, cat.name
            ORDER BY totalRevenue DESC
    """, nativeQuery = true)
    List<CatalogRevenueDTO> getRevenueByCatalog();

}
