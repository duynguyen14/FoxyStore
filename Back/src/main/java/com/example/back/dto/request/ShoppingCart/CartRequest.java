package com.example.back.dto.request.ShoppingCart;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {
    Integer productId;
    String sizeName;
    Integer quantity;
}
