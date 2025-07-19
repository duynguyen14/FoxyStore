package com.example.back.controllers;

import com.example.back.dto.request.SaleDTO.SaleRequestDTO;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.SaleDTO.SaleResponseDTO;
import com.example.back.service.SaleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.key}/sale")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class SaleController {
    SaleService saleService;

    @GetMapping("/getAll")
    public APIResponse<List<SaleResponseDTO>> getAllSales() {
        List<SaleResponseDTO> sales = saleService.getAllSales();
        return APIResponse.<List<SaleResponseDTO>>builder()
                .code(1000)
                .message("Success")
                .result(sales)
                .build();
    }

    @PostMapping("/create")
    public APIResponse<SaleResponseDTO> createSale(@RequestBody SaleRequestDTO dto) {
        SaleResponseDTO sale = saleService.create(dto);
        return APIResponse.<SaleResponseDTO>builder()
                .code(1000)
                .message("Sale created successfully")
                .result(sale)
                .build();
    }

    @PutMapping("update/{id}")
    public APIResponse<SaleResponseDTO> updateSale(@PathVariable Integer id, @RequestBody SaleRequestDTO dto) {
        SaleResponseDTO sale = saleService.update(id, dto);
        return APIResponse.<SaleResponseDTO>builder()
                .code(1000)
                .message("Sale updated successfully")
                .result(sale)
                .build();
    }

    @DeleteMapping("delete/{id}")
    public APIResponse<Void> deleteSale(@PathVariable Integer id) {
        saleService.delete(id);
        return APIResponse.<Void>builder()
                .code(1000)
                .message("Sale deleted successfully")
                .result(null)
                .build();
    }
}
