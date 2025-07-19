package com.example.back.dto.response.Chart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatalogRevenueDTO {
    private String catalogName;
    private BigDecimal totalRevenue;
}
