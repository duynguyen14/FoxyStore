package com.example.back.dto.response.Catalog;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CatalogDTO {
    private Integer id;
    private String name;
}
