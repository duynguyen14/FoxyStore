package com.example.back.dto.request.SaleDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SaleRequestDTO {
    String name;
    LocalDateTime start;
    LocalDateTime end;
    Integer discountPercent;
    List<Integer> categoryIds;
}
