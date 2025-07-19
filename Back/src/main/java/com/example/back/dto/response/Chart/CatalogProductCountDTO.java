package com.example.back.dto.response.Chart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatalogProductCountDTO {
    private String catalogName;
    private Long productCount;
}
