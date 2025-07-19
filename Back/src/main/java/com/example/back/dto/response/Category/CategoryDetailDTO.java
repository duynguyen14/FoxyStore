package com.example.back.dto.response.Category;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDetailDTO {
    Integer categoryId;
    String categoryName;
    String catalogName;
    Integer totalProducts;
}
