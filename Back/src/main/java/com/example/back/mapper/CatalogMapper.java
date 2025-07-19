package com.example.back.mapper;

import com.example.back.dto.response.Catalog.CatalogDTO;
import com.example.back.entity.Catalog;
import org.springframework.stereotype.Component;

@Component
public class CatalogMapper {
    public CatalogDTO toDto(Catalog catalog) {
        return CatalogDTO.builder()
                .id(catalog.getCatalogId())
                .name(catalog.getName())
                .build();
    }
}
