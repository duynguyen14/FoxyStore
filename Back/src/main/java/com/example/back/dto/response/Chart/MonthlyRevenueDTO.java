package com.example.back.dto.response.Chart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRevenueDTO {
    private String month;       // "2025-05"
    private BigDecimal totalRevenue;
    private Long totalOrder;
}
