package com.example.back.service;

import com.example.back.dto.request.SaleDTO.SaleRequestDTO;
import com.example.back.dto.response.SaleDTO.SaleResponseDTO;
import com.example.back.entity.Product;
import com.example.back.entity.Sale;
import com.example.back.repository.ProductRepository;
import com.example.back.repository.SaleRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class SaleService {
    SaleRepository saleRepository;
    ProductRepository productRepository;

    public List<SaleResponseDTO> getAllSales() {
        return saleRepository.findByIsDeletedFalse().stream().map(this::toDto).toList();
    }
    public SaleResponseDTO create(SaleRequestDTO dto) {
        Sale sale = Sale.builder()
                .name(dto.getName())
                .start(dto.getStart())
                .end(dto.getEnd())
                .discountPercent(dto.getDiscountPercent())
                .isDeleted(false)
                .build();
        Sale saved = saleRepository.save(sale);
        applySaleToProductsAndCategories(saved,dto.getCategoryIds());
        Sale reloaded = saleRepository.findWithProductsById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Sale not found"));
        return toDto(reloaded);
    }

    public SaleResponseDTO update(Integer id, SaleRequestDTO dto) {
        Sale sale = saleRepository.findByIdAndIsDeletedFalse(id).orElseThrow();
        sale.setName(dto.getName());
        sale.setStart(dto.getStart());
        sale.setEnd(dto.getEnd());
        sale.setDiscountPercent(dto.getDiscountPercent());
        saleRepository.save(sale);

        // Xóa sale khỏi các sản phẩm cũ
        List<Product> allProducts = productRepository.findBySaleIdAndIsDeletedFalse(id);
        log.info("allProducts: {}", allProducts);
        for (Product p : allProducts) {
            if (p.getSale() != null && p.getSale().getId().equals(id)) {
                p.setSale(null);
            }
        }
        productRepository.saveAll(allProducts);

        // Gán sale mới
        applySaleToProductsAndCategories(sale, dto.getCategoryIds());
        return toDto(sale);
    }

//    public void delete(Integer id) {
//        Sale sale = saleRepository.findByIdAndIsDeletedFalse(id)
//                .orElseThrow(() -> new RuntimeException("Sale không tồn tại hoặc đã bị xóa"));
//        sale.setIsDeleted(true);
//        saleRepository.save(sale);
//    }
@Transactional
public void delete(Integer id) {
    Sale sale = saleRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new RuntimeException("Sale không tồn tại hoặc đã bị xóa"));

    // Bỏ liên kết sale ở các sản phẩm
    List<Product> products = productRepository.findBySaleIdAndIsDeletedFalse(sale.getId());
    for (Product product : products) {
        product.setSale(null); // Bỏ liên kết
    }
    productRepository.saveAll(products);

    // Đánh dấu sale là đã xóa
    sale.setIsDeleted(true);
    saleRepository.save(sale);
}
    private void applySaleToProductsAndCategories(Sale sale, List<Integer> categoryIds) {
        Set<Product> products = new HashSet<>();
        // Áp dụng với tất cả sản phẩm thuộc các thể loại được chỉ định
        if (categoryIds != null && !categoryIds.isEmpty()) {
            List<Product> categoryProducts = productRepository.findByCategoryCategoryIdInAndIsDeletedFalse(categoryIds);
            log.info("categoryProducts: {}", categoryProducts);
            products.addAll(categoryProducts);
        }
//         Áp dụng sale cho tất cả sản phẩm thu thập được
        if (!products.isEmpty()) {
            for (Product product : products) {
                product.setSale(sale);
            }
            productRepository.saveAll(products);
            sale.setProducts(new ArrayList<>(products));

        }
    }


    private SaleResponseDTO toDto(Sale sale) {
        List<Integer> productIds = sale.getProducts() != null
                ? sale.getProducts().stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()))
                .map(Product::getProductId)
                .toList()
                : List.of();

        Set<Integer> categoryIds = sale.getProducts() != null
                ? sale.getProducts().stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()))
                .map(p -> p.getCategory().getCategoryId())
                .collect(Collectors.toSet())
                : Set.of();

        return SaleResponseDTO.builder()
                .id(sale.getId())
                .name(sale.getName())
                .start(sale.getStart())
                .end(sale.getEnd())
                .discountPercent(sale.getDiscountPercent())
                .products(productIds)
                .categories(new ArrayList<>(categoryIds))
                .totalAppliedProducts(productIds.size())
                .build();
    }
}
