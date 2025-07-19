package com.example.back.dto.request.Products;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    String name;
    BigDecimal price;
    Integer quantity;
    String description;
    Integer categoryId;
    List<Integer> sizeIds; // cập nhật lại size
    List<String> oldImageNames; // giữ lại ảnh cũ
}
