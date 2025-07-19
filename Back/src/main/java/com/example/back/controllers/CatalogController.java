package com.example.back.controllers;

import com.example.back.dto.request.CatalogRequestDTO.CatalogRequestDTO;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.CatalogDTO.CatalogDTO;
import com.example.back.dto.response.CatalogDTO.CatalogDetailDTO;
import com.example.back.dto.response.CatalogDTO.CatalogNameDTO;
import com.example.back.entity.Catalog;
import com.example.back.service.CatalogService;
import com.example.back.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.key}/catalog")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CatalogController {
    CatalogService catalogService;
    @GetMapping("/getAll")
    public APIResponse<List<CatalogDetailDTO>> getAllCatalogs() {
        return APIResponse.<List<CatalogDetailDTO>>builder()
                .result(catalogService.getCatalogDetail())
                .build();
    }
    @GetMapping("/active")
    public APIResponse<List<CatalogNameDTO>> getActiveCatalogs() {
        return APIResponse.<List<CatalogNameDTO>>builder()
                .result(catalogService.getAllActiveCatalogs())
                .build();
    }
    @PostMapping("/create")
    public APIResponse<CatalogDTO> createCatalog(@RequestBody CatalogRequestDTO dto) {
        CatalogDTO created = catalogService.createCatalog(dto);
        return APIResponse.<CatalogDTO>builder()
                .result(created)
                .build();
    }
    @PutMapping("/update/{id}")
    public APIResponse<CatalogDTO> updateCatalog(@PathVariable Integer id,
                                                 @RequestBody CatalogRequestDTO updateDto) {
            CatalogDTO updatedCatalog = catalogService.updateCatalog(id, updateDto);
            return APIResponse.<CatalogDTO>builder()
                    .result(updatedCatalog)
                    .build();
    }
    @DeleteMapping("/delete/{id}")
    public APIResponse<Void> deleteCatalog(@PathVariable Integer id) {
            catalogService.deleteCatalog(id);
            return APIResponse.<Void>builder()
                    .code(1000)
                    .result(null)
                    .build();
    }

//    @GetMapping("/admin")
//    public APIResponse<List<CatalogDTO>> getAll() {
//        return new APIResponse<>(1000, "OK", catalogService.getAllCatalogs());
//    }
//
//    @PostMapping("/admin")
//    public APIResponse<CatalogDTO> create(@RequestBody CatalogDTO dto) {
//        CatalogDTO created = catalogService.createCatalog(dto);
//        return new APIResponse<>(1000, "Created", created);
//    }
//
//    @PutMapping("/admin/{catalogId}")
//    public APIResponse<CatalogDTO> update(@PathVariable Integer catalogId, @RequestBody CatalogDTO dto) {
//        CatalogDTO updated = catalogService.updateCatalog(catalogId, dto);
//        return new APIResponse<>(1000, "Updated", updated);
//    }
//
//    @DeleteMapping("/admin/{catalogId}")
//    public APIResponse<Void> delete(@PathVariable Integer catalogId) {
//        catalogService.deleteCatalog(catalogId);
//        return new APIResponse<>(1000, "Deleted", null);
//    }
////    @GetMapping("/paged")
////    public APIResponse<Page<CatalogDTO>> getPagedCatalogs(
////            @RequestParam(required = false) String search,
////            @RequestParam(defaultValue = "0") int page,
////            @RequestParam(defaultValue = "10") int size) {
////
////        Pageable pageable = PageRequest.of(page, size);
////        Page<CatalogDTO> pagedResult = catalogService.getCatalogsPage(search, pageable);
////        return new APIResponse<>(1000, "OK", pagedResult);
////    }
}
