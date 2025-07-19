package com.example.back.dto.response.Product;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductHome {
    Integer id;
    String name;
    BigDecimal price;
    Integer quantity;
    Integer soldCount;
    List<String> images;
    Set<ProductSizeDTO> productSizeDTOS;
    Integer discountPercent;
}
