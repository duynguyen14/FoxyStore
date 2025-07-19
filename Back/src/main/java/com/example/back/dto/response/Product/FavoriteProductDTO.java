package com.example.back.dto.response.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoriteProductDTO {
    Integer id;
    String name;
    BigDecimal price;
    Integer quantity;
    Integer soldCount;
    List<String> images;
    Set<ProductSizeDTO> productSizeDTOS;
    Integer discountPercent;
}
