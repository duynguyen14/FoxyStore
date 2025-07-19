package com.example.back.dto.request.Products;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequestDTO {
    String name;
    BigDecimal price;
    Integer quantity;
    String description;
    Integer categoryId;
    List<Integer> sizeIds;
//    @Data
//    public static class ImageDTO {
//        String image;
//    }

}
