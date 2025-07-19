package com.example.back.dto.response.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductInfoDTO {
    Integer productId;
    String name;
    BigDecimal price;
    Integer quantity;
    Integer soldCount;
    String description;
    Integer categoryId;
//    String category;
    List<Integer> sizes;
    List<String> images;
}
