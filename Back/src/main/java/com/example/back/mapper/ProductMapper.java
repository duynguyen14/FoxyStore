package com.example.back.mapper;

import com.example.back.dto.response.Product.*;
import com.example.back.dto.response.Review.ReviewDetail;
import com.example.back.entity.*;
import com.example.back.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    ReviewMapper reviewMapper;

    public ProductHome  toProductHomeDTO(Product product){
        return ProductHome.builder()
                .id(product.getProductId())
                .price(product.getPrice())
                .name(product.getName())
                .quantity(product.getQuantity())
                .soldCount(product.getSoldCount())
                .images(product.getImages().stream().map(Image::getImage).collect(Collectors.toList()))
                .productSizeDTOS(product.getProductSizes().stream().map(ps->
                                ProductSizeDTO.builder()
                                        .sizeName(ps.getSize().getSizeName())
                                        .quantity(ps.getQuantity())
                                        .build()
                        ).collect(Collectors.toSet()))
                .discountPercent(product.getSale()!=null ? product.getSale().getDiscountPercent():null)
                .build();
    }
    public ProductDetail toProductDetail(Product product){
        Set<ReviewDetail> reviewDetails =product.getReviews().stream().map(review->reviewMapper.toReviewDetail(review)).collect(Collectors.toSet());
        return ProductDetail.builder()
                .id(product.getProductId())
                .name(product.getName())
                .categoryName(product.getCategory().getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .soldCount(product.getSoldCount())
                .quantity(product.getQuantity())
                .images(product.getImages().stream().map(Image::getImage).toList())
                .productSizeDTOS(product.getProductSizes().stream().map(ps->
                        ProductSizeDTO.builder()
                                .productSizeId(ps.getId())
                                .sizeName(ps.getSize().getSizeName())
                                .quantity(ps.getQuantity())
                                .build()
                ).collect(Collectors.toSet()))
                .reviews(reviewDetails)
                .build();
    }
    public FavoriteProductDTO toFavoriteProduct(FavoriteProduct favoriteProduct){
        return FavoriteProductDTO.builder()
                .id(favoriteProduct.getProduct().getProductId())
                .price(favoriteProduct.getProduct().getPrice())
                .name(favoriteProduct.getProduct().getName())
                .quantity(favoriteProduct.getProduct().getQuantity())
                .soldCount(favoriteProduct.getProduct().getSoldCount())
                .images(favoriteProduct.getProduct().getImages().stream().map(Image::getImage).collect(Collectors.toList()))
                .productSizeDTOS(favoriteProduct.getProduct().getProductSizes().stream().map(ps->
                        ProductSizeDTO.builder()
                                .sizeName(ps.getSize().getSizeName())
                                .quantity(ps.getQuantity())
                                .build()
                ).collect(Collectors.toSet()))
                .discountPercent(favoriteProduct.getProduct().getSale()!=null ? favoriteProduct.getProduct().getSale().getDiscountPercent():null)
                .build();
    }
    public ProductInfoDTO toProductInfoDTO(Product product){
        return ProductInfoDTO.builder()
                .productId(product.getProductId())
                .sizes(product.getProductSizes().stream().map(productSize -> productSize.getSize().getSizeId()).toList())
//                .category(product.getCategory().getName())
                .categoryId(product.getCategory().getCategoryId())
                .images(product.getImages().stream().map(Image::getImage).toList())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .soldCount(product.getSoldCount())
                .name(product.getName())
                .description(product.getDescription())
                .build();
    }
}
