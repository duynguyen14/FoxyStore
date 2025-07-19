package com.example.back.repository;

import com.example.back.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface BillDetailRepository extends JpaRepository<BillDetail,Integer> {
    @Query("SELECT COALESCE(SUM(bd.quantity * ps.product.price), 0) " +
            "FROM BillDetail bd " +
            "JOIN bd.productSize ps " +
            "JOIN bd.bill b " +
            "WHERE b.status = 'đã giao'")
    BigDecimal sumTotalRevenueFromCompletedBills();
}
