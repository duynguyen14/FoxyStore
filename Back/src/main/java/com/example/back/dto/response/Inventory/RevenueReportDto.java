package com.example.back.dto.response.Inventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RevenueReportDto {
    private Date reportDate;
    private String period;
    private Integer totalOrders;
    private Integer totalProducts;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
    private String topSellingProduct;
    private String topCategory;
}