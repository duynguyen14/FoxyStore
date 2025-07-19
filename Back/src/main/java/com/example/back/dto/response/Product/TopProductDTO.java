package com.example.back.dto.response.Product;

import com.example.back.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopProductDTO {
    private Long id;
    private String name;
    private String description;
    private String image;
    private BigDecimal price;
    private Integer soldCount;
    private Double averageRating;
    private LocalDateTime createdAt;
    private String category;
}
