package com.example.back.dto.response.Product;

import com.example.back.entity.Category;
import com.example.back.entity.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SummaryProduct {
    Long totalProduct;
    Long totalQuantity;
    BigDecimal totalPrice;
    List<Category> categories;
    List<Size> sizes;
}
