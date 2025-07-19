package com.example.back.dto.response.CatalogDTO;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CatalogDTO {
    Integer catalogId;
    String name;
    Boolean isDeleted;
    Integer categoryCount;
}
