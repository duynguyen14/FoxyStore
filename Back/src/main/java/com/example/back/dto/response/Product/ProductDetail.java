package com.example.back.dto.response.Product;

import com.example.back.dto.response.Review.ReviewDetail;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetail {
    Integer id;
    String name;
    Integer quantity;
    Integer soldCount;
    BigDecimal price;
    String description;
    String categoryName;
    List<String> images;
    Set<ProductSizeDTO> productSizeDTOS;
    Set<ReviewDetail> reviews;
}
