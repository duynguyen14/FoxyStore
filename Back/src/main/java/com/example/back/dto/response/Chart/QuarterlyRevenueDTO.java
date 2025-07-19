package com.example.back.dto.response.Chart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuarterlyRevenueDTO {
    private String quarter;     // "2025-Q1"
    private BigDecimal totalRevenue;
    private Long totalOrder;
}
