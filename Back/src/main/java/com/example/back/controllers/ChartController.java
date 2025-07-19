package com.example.back.controllers;

import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Chart.*;
import com.example.back.service.ChartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.key}/chart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ChartController {

    @Autowired
    private ChartService chartService;
    @GetMapping("/revenue/daily")
    public APIResponse<List<DailyRevenueDTO>> getDailyRevenue(
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<DailyRevenueDTO> result = chartService.getDailyRevenue(days);
            return APIResponse.<List<DailyRevenueDTO>>builder()
                    .code(1000)
                    .message("Lấy dữ liệu doanh thu theo ngày thành công")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return APIResponse.<List<DailyRevenueDTO>>builder()
                    .code(500)
                    .message("Lỗi khi lấy dữ liệu doanh thu theo ngày")
                    .result(null)
                    .build();
        }
    }
    @GetMapping("/revenue/monthly")
    public APIResponse<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam(defaultValue = "12") int months) {
        try {
            List<MonthlyRevenueDTO> result = chartService.getMonthlyRevenue(months);
            return APIResponse.<List<MonthlyRevenueDTO>>builder()
                    .code(1000)
                    .message("Lấy dữ liệu doanh thu theo tháng thành công")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return APIResponse.<List<MonthlyRevenueDTO>>builder()
                    .code(500)
                    .message("Lỗi khi lấy dữ liệu doanh thu theo tháng")
                    .result(null)
                    .build();
        }
    }
    @GetMapping("/revenue/quarterly")
    public APIResponse<List<QuarterlyRevenueDTO>> getQuarterlyRevenue(
            @RequestParam(defaultValue = "4") int quarters) {
        try {
            List<QuarterlyRevenueDTO> result = chartService.getQuarterlyRevenue(quarters);
            return APIResponse.<List<QuarterlyRevenueDTO>>builder()
                    .code(1000)
                    .message("Lấy dữ liệu doanh thu theo quý thành công")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return APIResponse.<List<QuarterlyRevenueDTO>>builder()
                    .code(500)
                    .message("Lỗi khi lấy dữ liệu doanh thu theo quý")
                    .result(null)
                    .build();
        }
    }
    @GetMapping("/catalog/products")
    public APIResponse<List<CatalogProductCountDTO>> getProductCountByCatalog() {
        List<CatalogProductCountDTO> stats = chartService.getProductCountByCatalog();
        return APIResponse.<List<CatalogProductCountDTO>>builder()
                .result(stats)
                .build();
    }

    @GetMapping("/catalog/revenue")
    public APIResponse<List<CatalogRevenueDTO>> getRevenueByCatalog() {
        List<CatalogRevenueDTO> stats = chartService.getRevenueByCatalog();
        return APIResponse.<List<CatalogRevenueDTO>>builder()
                .result(stats)
                .build();
    }

}
