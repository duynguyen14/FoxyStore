package com.example.back.service;

import com.example.back.dto.response.Chart.*;
import com.example.back.repository.ChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChartService {

    @Autowired
    private ChartRepository dashboardRepository;

    // Lấy dữ liệu doanh thu theo ngày
    public List<DailyRevenueDTO> getDailyRevenue(int days) {
        LocalDateTime endDate = LocalDateTime.now();           // Ngày hiện tại
        LocalDateTime startDate = endDate.minusDays(days);     // Lùi về {days} ngày trước
        List<Object[]> rawData = dashboardRepository.getDailyRevenue(startDate, endDate);

        return rawData.stream()
                .map(row -> new DailyRevenueDTO(
                        row[0].toString(),
                        new BigDecimal(row[1].toString()),
                        ((Number) row[2]).longValue()
                ))
                .collect(Collectors.toList());
    }

    // PHƯƠNG THỨC MỚI: Cho phép truyền startDate và endDate tùy chỉnh
//    public List<DailyRevenueDTO> getDailyRev enue(LocalDateTime startDate, LocalDateTime endDate) {
//        List<Object[]> rawData = dashboardRepository.getDailyRevenue(startDate, endDate);
//
//        return rawData.stream()
//                .map(row -> new DailyRevenueDTO(
//                        row[0].toString(),
//                        new BigDecimal(row[1].toString()),
//                        ((Number) row[2]).longValue()
//                ))
//                .collect(Collectors.toList());
//    }

    // Lấy dữ liệu doanh thu theo tháng
    public List<MonthlyRevenueDTO> getMonthlyRevenue(int months) {
        LocalDateTime endDate = LocalDateTime.now();           // Thời điểm hiện tại
        LocalDateTime startDate = endDate.minusMonths(months); // Lùi về {months} tháng trước
        List<Object[]> rawData = dashboardRepository.getMonthlyRevenue(startDate, endDate);
        return rawData.stream()
                .map(row -> new MonthlyRevenueDTO(
                        row[0].toString(),
                        new BigDecimal(row[1].toString()),
                        ((Number) row[2]).longValue()
                ))
                .collect(Collectors.toList());
    }

    // PHƯƠNG THỨC MỚI: Cho phép truyền startDate và endDate tùy chỉnh
//    public List<MonthlyRevenueDTO> getMonthlyRevenue(LocalDateTime startDate, LocalDateTime endDate) {
//        List<Object[]> rawData = dashboardRepository.getMonthlyRevenue(startDate, endDate);
//
//        return rawData.stream()
//                .map(row -> new MonthlyRevenueDTO(
//                        row[0].toString(),
//                        new BigDecimal(row[1].toString()),
//                        ((Number) row[2]).longValue()
//                ))
//                .collect(Collectors.toList());
//    }

    // Lấy dữ liệu doanh thu theo quý
    public List<QuarterlyRevenueDTO> getQuarterlyRevenue(int quarters) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(quarters * 3);

        List<Object[]> rawData = dashboardRepository.getQuarterlyRevenue(startDate, endDate);

        return rawData.stream()
                .map(row -> new QuarterlyRevenueDTO(
                        row[0].toString(),
                        new BigDecimal(row[1].toString()),
                        ((Number) row[2]).longValue()
                ))
                .collect(Collectors.toList());
    }
    // Lấy số lượng sản phẩm theo danh mục
    public List<CatalogProductCountDTO> getProductCountByCatalog() {
        return dashboardRepository.getProductCountByCatalog();
    }

    // Lấy doanh thu theo danh mục
    public List<CatalogRevenueDTO> getRevenueByCatalog() {
        return dashboardRepository.getRevenueByCatalog();
    }
}

