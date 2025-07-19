package com.example.back.controllers;

import com.example.back.dto.response.Inventory.DetailedRevenueDto;
import com.example.back.dto.response.Inventory.InventoryReportDto;
import com.example.back.dto.response.Inventory.RevenueReportDto;
import com.example.back.service.ReportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.key}/")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ReportController {
    @Autowired
    ReportService reportService;

    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryReportDto>> getInventoryReport() {
        try {
            List<InventoryReportDto> report = reportService.getInventoryReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueReportDto>> getRevenueReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            List<RevenueReportDto> report = reportService.getRevenueReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/revenue/detail")
    public ResponseEntity<List<DetailedRevenueDto>> getDetailedRevenueReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            List<DetailedRevenueDto> report = reportService.getDetailedRevenueReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/inventory/export")
    public ResponseEntity<Resource> exportInventoryReport() {
        try {
            ByteArrayInputStream data = reportService.exportInventoryToExcel();
            InputStreamResource resource = new InputStreamResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao-cao-ton-kho.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/revenue/export")
    public ResponseEntity<Resource> exportRevenueReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            ByteArrayInputStream data = reportService.exportRevenueToExcel(startDate, endDate);
            InputStreamResource resource = new InputStreamResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao-cao-doanh-thu.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getReportSummary() {
        try {
            List<InventoryReportDto> inventory = reportService.getInventoryReport();
            Date endDate = new Date();
            Date startDate = new Date(endDate.getTime() - 30L * 24 * 60 * 60 * 1000); // 30 days ago
            List<RevenueReportDto> revenue = reportService.getRevenueReport(startDate, endDate);

            Map<String, Object> summary = new HashMap<>();

            // Inventory summary
            long outOfStock = inventory.stream().filter(i -> "OUT_OF_STOCK".equals(i.getStockStatus())).count();
            long lowStock = inventory.stream().filter(i -> "LOW_STOCK".equals(i.getStockStatus())).count();
            BigDecimal totalInventoryValue = inventory.stream()
                    .map(InventoryReportDto::getTotalValue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Revenue summary
            BigDecimal totalRevenue = revenue.stream()
                    .map(RevenueReportDto::getTotalRevenue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            int totalOrders = revenue.stream()
                    .mapToInt(RevenueReportDto::getTotalOrders)
                    .sum();

            summary.put("totalProducts", inventory.size());
            summary.put("outOfStockProducts", outOfStock);
            summary.put("lowStockProducts", lowStock);
            summary.put("totalInventoryValue", totalInventoryValue);
            summary.put("totalRevenue30Days", totalRevenue);
            summary.put("totalOrders30Days", totalOrders);
            summary.put("averageOrderValue", totalOrders > 0 ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
