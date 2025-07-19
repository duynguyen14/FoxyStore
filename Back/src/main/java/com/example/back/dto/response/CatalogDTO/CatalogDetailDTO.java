package com.example.back.dto.response.CatalogDTO;

import com.example.back.dto.response.Category.CategoryDTOWithCTLid;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CatalogDetailDTO {
    Integer catalogId;
    String name;
    Boolean isDeleted;
    Integer categoryCount;
    List<CategoryDTOWithCTLid> categories;
}
