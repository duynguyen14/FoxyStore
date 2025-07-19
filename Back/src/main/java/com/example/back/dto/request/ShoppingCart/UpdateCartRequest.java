package com.example.back.dto.request.ShoppingCart;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateCartRequest {
    Integer productSizeId;
    Integer quantity;
}
