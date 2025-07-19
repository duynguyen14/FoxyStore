package com.example.back.dto.response.Bill;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillDetailDTO {
    private String productName;
    private String sizeName;
    private Integer quantity;
    private BigDecimal price;
}
