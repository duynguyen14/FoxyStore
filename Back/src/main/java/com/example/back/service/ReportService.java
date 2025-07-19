package com.example.back.service;

import com.example.back.dto.response.Inventory.DetailedRevenueDto;
import com.example.back.dto.response.Inventory.InventoryReportDto;
import com.example.back.dto.response.Inventory.RevenueReportDto;
import com.example.back.repository.ReportRepository;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public List<InventoryReportDto> getInventoryReport() {
        List<Object[]> results = reportRepository.getInventoryReport();
        return results.stream().map(row -> new InventoryReportDto(
                ((Number) row[0]).intValue(),
                (String) row[1],
                (String) row[2],
                (String) row[3],
                ((Number) row[4]).intValue(),
                ((Number) row[5]).intValue(),
                (BigDecimal) row[6],
                (BigDecimal) row[7],
                (String) row[8],
                (Date) row[9]
        )).collect(Collectors.toList());
    }

    public List<RevenueReportDto> getRevenueReport(Date startDate, Date endDate) {
        List<Object[]> results = reportRepository.getRevenueReport(startDate, endDate);
        return results.stream().map(row -> new RevenueReportDto(
                (Date) row[0],
                (String) row[1],
                ((Number) row[2]).intValue(),
                ((Number) row[3]).intValue(),
                (BigDecimal) row[4],
                (BigDecimal) row[5],
                (String) row[6],
                (String) row[7]
        )).collect(Collectors.toList());
    }

    public List<DetailedRevenueDto> getDetailedRevenueReport(Date startDate, Date endDate) {
        List<Object[]> results = reportRepository.getDetailedRevenueReport(startDate, endDate);
        return results.stream().map(row -> new DetailedRevenueDto(
                ((Number) row[0]).intValue(),
                (String) row[1],
                (String) row[2],
                ((Number) row[3]).intValue(),
                (BigDecimal) row[4],
                (BigDecimal) row[5],
                ((Number) row[6]).intValue(),
                (Date) row[7],
                (Date) row[8]
        )).collect(Collectors.toList());
    }

    //
    public ByteArrayInputStream exportInventoryToExcel() {
        List<InventoryReportDto> data = getInventoryReport();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Báo cáo tồn kho");

            // Tạo các style một lần
            StyleCollection styles = createInventoryStyles(workbook);

            // Header
            createInventoryHeader(sheet, styles);

            // Data rows với màu xen kẽ
            int rowIdx = 1;
            InventorySummary summary = new InventorySummary();

            for (InventoryReportDto item : data) {
                createInventoryDataRow(sheet, item, rowIdx, styles, summary);
                rowIdx++;
            }

            // Thêm dòng tổng kết
            createInventorySummary(sheet, rowIdx + 1, styles, summary);

            // Finishing touches
            finalizeSheet(sheet, new String[]{"Mã SP", "Tên sản phẩm", "Thể loại", "Danh mục", "Tồn kho", "Đã bán", "Giá", "Giá trị tồn", "Trạng thái", "Cập nhật"});

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export Excel file", e);
        }
    }
//
//
public ByteArrayInputStream exportRevenueToExcel(Date startDate, Date endDate) {
    List<DetailedRevenueDto> data = getDetailedRevenueReport(startDate, endDate);

    try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
        Sheet sheet = workbook.createSheet("Báo cáo doanh thu");

        // Tạo các style một lần
        StyleCollection styles = createRevenueStyles(workbook);

        // Header
        createRevenueHeader(sheet, styles);

        // Data rows với màu xen kẽ
        int rowIdx = 1;
        RevenueSummary summary = new RevenueSummary();

        for (DetailedRevenueDto item : data) {
            createRevenueDataRow(sheet, item, rowIdx, styles, summary);
            rowIdx++;
        }

        // Thêm dòng tổng kết
        createRevenueSummary(sheet, rowIdx + 1, styles, summary, data.size());

        // Finishing touches
        finalizeSheet(sheet, new String[]{"Mã SP", "Tên sản phẩm", "Thể loại", "Số lượng bán", "Giá", "Doanh thu", "Số đơn", "Bán đầu", "Bán cuối"});

        workbook.write(out);
        return new ByteArrayInputStream(out.toByteArray());
    } catch (IOException e) {
        throw new RuntimeException("Failed to export Excel file", e);
    }
}
    // Base class hoặc utility class cho Excel export

        // ==== INVENTORY REPORT ====
        public ByteArrayInputStream exportInventoryToExcel1() {
            List<InventoryReportDto> data = getInventoryReport();

            try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                Sheet sheet = workbook.createSheet("Báo cáo tồn kho");

                // Tạo các style một lần
                StyleCollection styles = createInventoryStyles(workbook);

                // Header
                createInventoryHeader(sheet, styles);

                // Data rows với màu xen kẽ
                int rowIdx = 1;
                InventorySummary summary = new InventorySummary();

                for (InventoryReportDto item : data) {
                    createInventoryDataRow(sheet, item, rowIdx, styles, summary);
                    rowIdx++;
                }

                // Thêm dòng tổng kết
                createInventorySummary(sheet, rowIdx + 1, styles, summary);

                // Finishing touches
                finalizeSheet(sheet, new String[]{"Mã SP", "Tên sản phẩm", "Thể loại", "Danh mục", "Tồn kho", "Đã bán", "Giá", "Giá trị tồn", "Trạng thái", "Cập nhật"});

                workbook.write(out);
                return new ByteArrayInputStream(out.toByteArray());
            } catch (IOException e) {
                throw new RuntimeException("Failed to export Excel file", e);
            }
        }

        // ==== REVENUE REPORT ====
        public ByteArrayInputStream exportRevenueToExcel1(Date startDate, Date endDate) {
            List<DetailedRevenueDto> data = getDetailedRevenueReport(startDate, endDate);

            try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                Sheet sheet = workbook.createSheet("Báo cáo doanh thu");

                // Tạo các style một lần
                StyleCollection styles = createRevenueStyles(workbook);

                // Header
                createRevenueHeader(sheet, styles);

                // Data rows với màu xen kẽ
                int rowIdx = 1;
                RevenueSummary summary = new RevenueSummary();

                for (DetailedRevenueDto item : data) {
                    createRevenueDataRow(sheet, item, rowIdx, styles, summary);
                    rowIdx++;
                }

                // Thêm dòng tổng kết
                createRevenueSummary(sheet, rowIdx + 1, styles, summary, data.size());

                // Finishing touches
                finalizeSheet(sheet, new String[]{"Mã SP", "Tên sản phẩm", "Thể loại", "Số lượng bán", "Giá", "Doanh thu", "Số đơn", "Bán đầu", "Bán cuối"});

                workbook.write(out);
                return new ByteArrayInputStream(out.toByteArray());
            } catch (IOException e) {
                throw new RuntimeException("Failed to export Excel file", e);
            }
        }
        // ==== STYLE COLLECTIONS ====
        private StyleCollection createInventoryStyles(Workbook workbook) {
            StyleCollection styles = new StyleCollection();
            styles.header = createHeaderStyle(workbook);
            styles.dataEven = createDataStyle(workbook);
            styles.dataOdd = createAlternateRowStyle(workbook);
            styles.numberEven = createNumberStyle(workbook);
            styles.numberOdd = createAlternateNumberStyle(workbook);
            styles.currencyEven = createCurrencyStyle(workbook);
            styles.currencyOdd = createAlternateCurrencyStyle(workbook);
            styles.dateEven = createDateStyle(workbook);
            styles.dateOdd = createAlternateDateStyle(workbook);
            styles.centerEven = createCenterStyle(workbook);
            styles.centerOdd = createAlternateCenterStyle(workbook);
            styles.summaryLabel = createSummaryLabelStyle(workbook);
            styles.summaryValue = createSummaryValueStyle(workbook);
            styles.summaryValueCurrency = createSummaryValueCurrencyStyle(workbook);
            return styles;
        }

        private StyleCollection createRevenueStyles(Workbook workbook) {
            StyleCollection styles = new StyleCollection();
            styles.header = createHeaderStyle(workbook);
            styles.dataEven = createDataStyle(workbook);
            styles.dataOdd = createAlternateRowStyle(workbook);
            styles.numberEven = createNumberStyle(workbook);
            styles.numberOdd = createAlternateNumberStyle(workbook);
            styles.currencyEven = createCurrencyStyle(workbook);
            styles.currencyOdd = createAlternateCurrencyStyle(workbook);
            styles.dateEven = createDateStyle(workbook);
            styles.dateOdd = createAlternateDateStyle(workbook);
            styles.centerEven = createCenterStyle(workbook);
            styles.centerOdd = createAlternateCenterStyle(workbook);
            styles.summaryLabel = createSummaryLabelStyle(workbook);
            styles.summaryValue = createSummaryValueStyle(workbook);
            styles.summaryValueCurrency = createSummaryValueCurrencyStyle(workbook);
            return styles;
        }

        // ==== HEADER CREATION ====
        private void createInventoryHeader(Sheet sheet, StyleCollection styles) {
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Mã SP", "Tên sản phẩm", "Thể loại", "Danh mục", "Tồn kho", "Đã bán", "Giá", "Giá trị tồn", "Trạng thái", "Cập nhật"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(styles.header);
            }
        }

        private void createRevenueHeader(Sheet sheet, StyleCollection styles) {
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Mã SP", "Tên sản phẩm", "Thể loại", "Số lượng bán", "Giá", "Doanh thu", "Số đơn", "Bán đầu", "Bán cuối"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(styles.header);
            }
        }

        // ==== DATA ROW CREATION ====
        private void createInventoryDataRow(Sheet sheet, InventoryReportDto item, int rowIdx, StyleCollection styles, InventorySummary summary) {
            Row row = sheet.createRow(rowIdx);
            boolean isOdd = (rowIdx % 2 == 1);

            // Cập nhật summary
            summary.totalValue += item.getTotalValue().doubleValue();
            summary.totalProducts++;
            summary.totalStock += item.getCurrentStock();
            summary.totalSold += item.getTotalSold();

            // Tạo cells với style phù hợp
            createCell(row, 0, item.getProductId(), isOdd ? styles.centerOdd : styles.centerEven);
            createCell(row, 1, item.getProductName(), isOdd ? styles.dataOdd : styles.dataEven);
            createCell(row, 2, item.getCategoryName(), isOdd ? styles.dataOdd : styles.dataEven);
            createCell(row, 3, item.getCatalogName(), isOdd ? styles.dataOdd : styles.dataEven);
            createCell(row, 4, item.getCurrentStock(), isOdd ? styles.numberOdd : styles.numberEven);
            createCell(row, 5, item.getTotalSold(), isOdd ? styles.numberOdd : styles.numberEven);
            createCell(row, 6, item.getUnitPrice().doubleValue(), isOdd ? styles.currencyOdd : styles.currencyEven);
            createCell(row, 7, item.getTotalValue().doubleValue(), isOdd ? styles.currencyOdd : styles.currencyEven);

            // Status với màu sắc đặc biệt
            String status = getStockStatusVietnamese(item.getStockStatus());
            createCell(row, 8, status, getStatusStyle(sheet.getWorkbook(), status, isOdd));

            createCell(row, 9, item.getLastUpdateDate(), isOdd ? styles.dateOdd : styles.dateEven);
        }

        private void createRevenueDataRow(Sheet sheet, DetailedRevenueDto item, int rowIdx, StyleCollection styles, RevenueSummary summary) {
            Row row = sheet.createRow(rowIdx);
            boolean isOdd = (rowIdx % 2 == 1);

            // Cập nhật summary
            summary.totalQuantitySold += item.getQuantitySold();
            summary.totalRevenue += item.getTotalRevenue().doubleValue();
            summary.totalOrders += item.getTotalOrders();

            // Tạo cells với style phù hợp
            createCell(row, 0, item.getProductId(), isOdd ? styles.centerOdd : styles.centerEven);
            createCell(row, 1, item.getProductName(), isOdd ? styles.dataOdd : styles.dataEven);
            createCell(row, 2, item.getCategoryName(), isOdd ? styles.dataOdd : styles.dataEven);
            createCell(row, 3, item.getQuantitySold(), isOdd ? styles.numberOdd : styles.numberEven);
            createCell(row, 4, item.getUnitPrice().doubleValue(), isOdd ? styles.currencyOdd : styles.currencyEven);
            createCell(row, 5, item.getTotalRevenue().doubleValue(), isOdd ? styles.currencyOdd : styles.currencyEven);
            createCell(row, 6, item.getTotalOrders(), isOdd ? styles.numberOdd : styles.numberEven);
            createCell(row, 7, item.getFirstSaleDate(), isOdd ? styles.dateOdd : styles.dateEven);
            createCell(row, 8, item.getLastSaleDate(), isOdd ? styles.dateOdd : styles.dateEven);
        }

        // ==== SUMMARY CREATION ====
        private void createInventorySummary(Sheet sheet, int startRow, StyleCollection styles, InventorySummary summary) {
            // Dòng tổng kết 1
            Row summaryRow1 = sheet.createRow(startRow);
            createCell(summaryRow1, 0, "TỔNG KẾT:", styles.summaryLabel);
            createCell(summaryRow1, 1, "Số sản phẩm:", styles.summaryLabel);
            createCell(summaryRow1, 2, summary.totalProducts, styles.summaryValue);
            createCell(summaryRow1, 3, "Tồn kho:", styles.summaryLabel);
            createCell(summaryRow1, 4, summary.totalStock, styles.summaryValue);
            createCell(summaryRow1, 5, "Đã bán:", styles.summaryLabel);
            createCell(summaryRow1, 6, summary.totalSold, styles.summaryValue);

            // Dòng tổng kết 2
            Row summaryRow2 = sheet.createRow(startRow + 1);
            createCell(summaryRow2, 6, "TỔNG GIÁ TRỊ:", styles.summaryLabel);
            createCell(summaryRow2, 7, summary.totalValue, styles.summaryValueCurrency);
        }

        private void createRevenueSummary(Sheet sheet, int startRow, StyleCollection styles, RevenueSummary summary, int totalProducts) {
            // Dòng tổng kết 1
            Row summaryRow1 = sheet.createRow(startRow);
            createCell(summaryRow1, 0, "TỔNG CỘNG", styles.summaryLabel);
            createCell(summaryRow1, 3, summary.totalQuantitySold, styles.summaryValue);
            createCell(summaryRow1, 5, summary.totalRevenue, styles.summaryValueCurrency);
            createCell(summaryRow1, 6, summary.totalOrders, styles.summaryValue);

            // Dòng tổng kết 2
            Row summaryRow2 = sheet.createRow(startRow + 1);
            createCell(summaryRow2, 0, "Tổng sản phẩm: " + totalProducts, styles.summaryLabel);
            createCell(summaryRow2, 3, "Doanh thu TB/SP: " + String.format("%.2f VNĐ", summary.totalRevenue / totalProducts), styles.summaryLabel);
        }

        // ==== UTILITY METHODS ====
        private void createCell(Row row, int columnIndex, Object value, CellStyle style) {
            Cell cell = row.createCell(columnIndex);

            if (value instanceof String) {
                cell.setCellValue((String) value);
            } else if (value instanceof Integer) {
                cell.setCellValue((Integer) value);
            } else if (value instanceof Double) {
                cell.setCellValue((Double) value);
            } else if (value instanceof Date) {
                cell.setCellValue((Date) value);
            } else if (value != null) {
                cell.setCellValue(value.toString());
            }

            cell.setCellStyle(style);
        }

        private void finalizeSheet(Sheet sheet, String[] headers) {
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                if (sheet.getColumnWidth(i) < 2500) {
                    sheet.setColumnWidth(i, 2500);
                }
            }

            // Freeze header row
            sheet.createFreezePane(0, 1);
        }

        // ==== HELPER CLASSES ====
        private static class StyleCollection {
            CellStyle header;
            CellStyle dataEven, dataOdd;
            CellStyle numberEven, numberOdd;
            CellStyle currencyEven, currencyOdd;
            CellStyle dateEven, dateOdd;
            CellStyle centerEven, centerOdd;
            CellStyle summaryLabel, summaryValue, summaryValueCurrency;
        }

        private static class InventorySummary {
            double totalValue = 0;
            int totalProducts = 0;
            int totalStock = 0;
            int totalSold = 0;
        }

        private static class RevenueSummary {
            int totalQuantitySold = 0;
            double totalRevenue = 0;
            int totalOrders = 0;
        }

        // ==== EXISTING STYLE METHODS (giữ nguyên) ====
        private CellStyle createHeaderStyle(Workbook workbook) {
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            font.setColor(IndexedColors.WHITE.getIndex());
            font.setFontHeightInPoints((short) 12);

            style.setFont(font);
            style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setBorderBottom(BorderStyle.THIN);
            style.setBorderTop(BorderStyle.THIN);
            style.setBorderRight(BorderStyle.THIN);
            style.setBorderLeft(BorderStyle.THIN);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);

            return style;
        }

        private CellStyle createDataStyle(Workbook workbook) {
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setFontHeightInPoints((short) 11);

            style.setAlignment(HorizontalAlignment.LEFT);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            style.setBorderTop(BorderStyle.THIN);
            style.setBorderBottom(BorderStyle.THIN);
            style.setBorderLeft(BorderStyle.THIN);
            style.setBorderRight(BorderStyle.THIN);
            style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());

            style.setFont(font);
            return style;
        }

        private CellStyle createAlternateRowStyle(Workbook workbook) {
            CellStyle style = createDataStyle(workbook);
            style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            return style;
        }

        private CellStyle createNumberStyle(Workbook workbook) {
            CellStyle style = createDataStyle(workbook);
            style.setAlignment(HorizontalAlignment.RIGHT);
            style.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
            return style;
        }

        private CellStyle createAlternateNumberStyle(Workbook workbook) {
            CellStyle style = createAlternateRowStyle(workbook);
            style.setAlignment(HorizontalAlignment.RIGHT);
            style.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
            return style;
        }

        private CellStyle createCurrencyStyle(Workbook workbook) {
            CellStyle style = createDataStyle(workbook);
            style.setAlignment(HorizontalAlignment.RIGHT);
            style.setDataFormat(workbook.createDataFormat().getFormat("#,##0\" VNĐ\""));
            return style;
        }

        private CellStyle createAlternateCurrencyStyle(Workbook workbook) {
            CellStyle style = createAlternateRowStyle(workbook);
            style.setAlignment(HorizontalAlignment.RIGHT);
            style.setDataFormat(workbook.createDataFormat().getFormat("#,##0\" VNĐ\""));
            return style;
        }

        private CellStyle createDateStyle(Workbook workbook) {
            CellStyle style = createDataStyle(workbook);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setDataFormat(workbook.createDataFormat().getFormat("dd/mm/yyyy"));
            return style;
        }

        private CellStyle createAlternateDateStyle(Workbook workbook) {
            CellStyle style = createAlternateRowStyle(workbook);
            style.setAlignment(HorizontalAlignment.CENTER);
            style.setDataFormat(workbook.createDataFormat().getFormat("dd/mm/yyyy"));
            return style;
        }

        private CellStyle createCenterStyle(Workbook workbook) {
            CellStyle style = createDataStyle(workbook);
            style.setAlignment(HorizontalAlignment.CENTER);
            return style;
        }

        private CellStyle createAlternateCenterStyle(Workbook workbook) {
            CellStyle style = createAlternateRowStyle(workbook);
            style.setAlignment(HorizontalAlignment.CENTER);
            return style;
        }

        private CellStyle createSummaryLabelStyle(Workbook workbook) {
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            font.setFontHeightInPoints((short) 12);
            font.setColor(IndexedColors.DARK_BLUE.getIndex());

            style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setAlignment(HorizontalAlignment.LEFT);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            style.setBorderTop(BorderStyle.MEDIUM);
            style.setBorderBottom(BorderStyle.MEDIUM);
            style.setBorderLeft(BorderStyle.MEDIUM);
            style.setBorderRight(BorderStyle.MEDIUM);

            style.setFont(font);
            return style;
        }

        private CellStyle createSummaryValueStyle(Workbook workbook) {
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            font.setFontHeightInPoints((short) 12);
            font.setColor(IndexedColors.DARK_RED.getIndex());

            style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setAlignment(HorizontalAlignment.RIGHT);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            style.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));
            style.setBorderTop(BorderStyle.MEDIUM);
            style.setBorderBottom(BorderStyle.MEDIUM);
            style.setBorderLeft(BorderStyle.MEDIUM);
            style.setBorderRight(BorderStyle.MEDIUM);

            style.setFont(font);
            return style;
        }

        private CellStyle createSummaryValueCurrencyStyle(Workbook workbook) {
            CellStyle style = createSummaryValueStyle(workbook);
            style.setDataFormat(workbook.createDataFormat().getFormat("#,##0\" VNĐ\""));
            return style;
        }

        private CellStyle getStatusStyle(Workbook workbook, String status, boolean isOdd) {
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            font.setFontHeightInPoints((short) 11);

            style.setAlignment(HorizontalAlignment.CENTER);
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            style.setBorderTop(BorderStyle.THIN);
            style.setBorderBottom(BorderStyle.THIN);
            style.setBorderLeft(BorderStyle.THIN);
            style.setBorderRight(BorderStyle.THIN);
            style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
            style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());

            switch (status.toLowerCase()) {
                case "hết hàng":
                    style.setFillForegroundColor(IndexedColors.RED.getIndex());
                    font.setColor(IndexedColors.WHITE.getIndex());
                    break;
                case "sắp hết":
                case "ít hàng":
                    style.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
                    font.setColor(IndexedColors.BLACK.getIndex());
                    break;
                case "còn hàng":
                case "đủ hàng":
                    style.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
                    font.setColor(IndexedColors.BLACK.getIndex());
                    break;
                default:
                    style.setFillForegroundColor(isOdd ? IndexedColors.GREY_25_PERCENT.getIndex() : IndexedColors.WHITE.getIndex());
                    font.setColor(IndexedColors.BLACK.getIndex());
            }

            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setFont(font);
            return style;
        }

        private String getStockStatusVietnamese(String status) {
            switch (status) {
                case "OUT_OF_STOCK":
                    return "Hết hàng";
                case "LOW_STOCK":
                    return "Sắp hết";
                case "MEDIUM_STOCK":
                    return "Vừa phải";
                case "HIGH_STOCK":
                    return "Nhiều";
                default:
                    return "Không xác định";
            }
        }

}
