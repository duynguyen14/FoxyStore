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
public class DetailedRevenueDto {
    private Integer productId;
    private String productName;
    private String categoryName;
    private Integer quantitySold;
    private BigDecimal unitPrice;
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private Date firstSaleDate;
    private Date lastSaleDate;
}
