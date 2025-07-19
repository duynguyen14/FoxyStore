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
public class InventoryReportDto {
    private Integer productId;
    private String productName;
    private String categoryName;
    private String catalogName;
    private Integer currentStock;
    private Integer totalSold;
    private BigDecimal unitPrice;
    private BigDecimal totalValue;
    private String stockStatus;
    private Date lastUpdateDate;
}
