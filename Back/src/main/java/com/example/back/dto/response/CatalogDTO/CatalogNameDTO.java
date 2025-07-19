package com.example.back.dto.response.CatalogDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CatalogNameDTO {
    Integer catalogId;
    String name;
}
