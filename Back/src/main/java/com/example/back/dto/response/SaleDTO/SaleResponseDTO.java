package com.example.back.dto.response.SaleDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SaleResponseDTO {
    Integer id;
    String name;
    LocalDateTime start;
    LocalDateTime end;
    Integer discountPercent;
    List<Integer> products;
    List<Integer> categories;
    Integer totalAppliedProducts;
}
