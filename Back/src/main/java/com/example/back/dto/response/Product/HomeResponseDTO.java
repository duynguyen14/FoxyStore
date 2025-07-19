package com.example.back.dto.response.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeResponseDTO {
    List<ProductHome> productsNew;
    List<ProductHome> productsSale;
}
