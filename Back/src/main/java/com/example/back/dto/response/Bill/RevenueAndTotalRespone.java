package com.example.back.dto.response.Bill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RevenueAndTotalRespone {
    private BigDecimal totalRevenue;
    private Long totalOrder;

}
