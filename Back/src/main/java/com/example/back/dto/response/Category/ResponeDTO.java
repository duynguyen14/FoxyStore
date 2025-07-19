package com.example.back.dto.response.Category;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResponeDTO {
    Integer categoryId;
    String name;
    String catalogName;
}
