package com.example.back.dto.request.CategoryRequestDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryCreateUpdateDTO {
    String name;
    Integer catalogId;
}
