package com.example.back.service;

import com.example.back.dto.request.CatalogRequestDTO.CatalogRequestDTO;
import com.example.back.dto.response.CatalogDTO.CatalogDTO;
import com.example.back.dto.response.CatalogDTO.CatalogDetailDTO;
import com.example.back.dto.response.CatalogDTO.CatalogNameDTO;
import com.example.back.dto.response.Category.CategoryDTOWithCTLid;
import com.example.back.entity.Catalog;
import com.example.back.repository.CatalogRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CatalogService {
    private final CatalogRepository catalogRepository;

    public List<CatalogDTO> getAllCatalogs() {
        return catalogRepository.findAllWithCategories()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    public List<CatalogNameDTO> getAllActiveCatalogs() {
        List<Object[]> rawList = catalogRepository.findByIsDeletedFalse();
        return rawList.stream()
                .map(row -> new CatalogNameDTO(
                        (Integer) row[0],
                        (String) row[1]
                ))
                .collect(Collectors.toList());
    }
        public CatalogDTO createCatalog(CatalogRequestDTO createDto) {
            Catalog catalog = Catalog.builder()
                    .name(createDto.getName())
                    .isDeleted(false)
                    .build();
            Catalog savedCatalog = catalogRepository.save(catalog);
            return convertToDto(savedCatalog);
        }

    public CatalogDTO updateCatalog(Integer id, CatalogRequestDTO updateDto) {
        Catalog catalog = catalogRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new RuntimeException("K tìm thấy danh mục hoặc đã bị xóa"));
        catalog.setName(updateDto.getName());
        Catalog updatedCatalog = catalogRepository.save(catalog);
        return convertToDto(updatedCatalog);
    }

    public void deleteCatalog(Integer id) {
        Catalog catalog = catalogRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new RuntimeException("K tìm thấy danh mục hoặc đã bị xóa"));
        catalog.setIsDeleted(true);
        catalogRepository.save(catalog);
    }

    private CatalogDTO convertToDto(Catalog catalog) {
        return CatalogDTO.builder()
                .catalogId(catalog.getCatalogId())
                .name(catalog.getName())
                .isDeleted(catalog.getIsDeleted())
                .categoryCount(catalog.getCategories() != null ? catalog.getCategories().size() : 0)
                .build();
    }

    public List<CatalogDetailDTO> getCatalogDetail() {
        List<Catalog> catalogs = catalogRepository.findAllActiveWithCategories();

        return catalogs.stream().map(catalog -> {
            List<CategoryDTOWithCTLid> categoryDtos = catalog.getCategories().stream()
                    .map(cat -> {
                        CategoryDTOWithCTLid dto = new CategoryDTOWithCTLid();
                        dto.setCategoryId(cat.getCategoryId());
                        dto.setName(cat.getName());
                        dto.setCatalogId(catalog.getCatalogId());
                        return dto;
                    }).collect(Collectors.toList());

            CatalogDetailDTO dto = new CatalogDetailDTO();
            dto.setCatalogId(catalog.getCatalogId());
            dto.setName(catalog.getName());
            dto.setIsDeleted(catalog.getIsDeleted());
            dto.setCategories(categoryDtos);
            dto.setCategoryCount(categoryDtos.size());

            return dto;
        }).collect(Collectors.toList());
    }
}
