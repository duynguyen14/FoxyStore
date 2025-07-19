package com.example.back.dto.response.Chart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.AttributeAccessor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyRevenueDTO {
    private String date;        // "2025-05-01"
    private BigDecimal totalRevenue;
    private Long totalOrder;

}
