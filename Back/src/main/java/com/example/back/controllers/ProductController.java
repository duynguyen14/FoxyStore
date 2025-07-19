package com.example.back.controllers;

import com.example.back.dto.request.Products.ProductRequestDTO;
import com.example.back.dto.request.Products.ProductUpdateRequest;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Product.*;
import com.example.back.exception.AppException;
import com.example.back.service.ProductService;
import com.example.back.service.RecommendService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLOutput;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.key}/")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductController {
    ProductService productService;
    RecommendService recommendService;

    @GetMapping("products/home")
    public APIResponse<HomeResponseDTO> products(){
        return APIResponse.<HomeResponseDTO>builder()
                .result(productService.getProductHome())
                .build();
    }

    @GetMapping("product/{id}")
    public APIResponse<ProductDetail> getProductDetail(@PathVariable Integer id){
        System.out.println("productId "+id);
        return APIResponse.<ProductDetail>builder()
                .result(productService.getProductDetail(id))
                .build();
    }
    @GetMapping("product/{id}/related")
    public APIResponse<List<ProductHome>> getRelatedProduct(@PathVariable Integer id){
        return APIResponse.<List<ProductHome>>builder()
                .result(productService.getRelatedProduct(id))
                .build();
    }
    @GetMapping("products")
    public APIResponse<List<ProductHome>> getAllProduct(
            @RequestParam(defaultValue = "0") int page
    ){
        return  APIResponse.<List<ProductHome>>builder()
                .result(productService.getAllProduct(page))
                .build();
    }
    @GetMapping("category/{id}")
    public APIResponse<List<ProductHome>> getByCategory(@PathVariable Integer id ,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(required = false, defaultValue = "newest") String sort
    ){
        return APIResponse.<List<ProductHome>>builder()
                .result(productService.getByCategoryId(id,page,sort))
                .build();
    }
    //admin
    @GetMapping("products/tops")
    public APIResponse<List<TopProductDTO>> getFeaturedProducts() {
        return APIResponse.<List<TopProductDTO>>builder()
                .result(productService.getTopRatedProducts())
                .build();
    }
    @GetMapping("products/search")
    public APIResponse<Page<ProductInfoDTO>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductInfoDTO> result = productService.searchProducts(name, pageable,minPrice,maxPrice,categoryId);
        return APIResponse.<Page<ProductInfoDTO>>builder()
                .code(1000)
                .result(result)
                .build();
    }
    @GetMapping("products/summary")
    public APIResponse<SummaryProduct> getSummaryProduct(){
        return APIResponse.<SummaryProduct>builder()
                .result(productService.getSummaryProduct())
                .build();
    }
    // add
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<ProductInfoDTO> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart("images") List<MultipartFile> images
    ) {
        System.out.println("product"+productJson);
        System.out.println("files"+images);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ProductRequestDTO request = objectMapper.readValue(productJson, ProductRequestDTO.class);

//            productService.createProduct(request, images);
            return APIResponse.<ProductInfoDTO>builder()
                    .result(productService.createProductAdmin(request,images))
                    .build();

        } catch (Exception e) {
            return APIResponse.error("Error: " + e.getMessage());
        }
    }


    //update
    @PutMapping(value = "products/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<ProductInfoDTO> updateProduct(
            @PathVariable Integer productId,
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages
//            @RequestPart(value= "imagesToDelete", required = false) List<String> imagesToDelete
    ) {
        System.out.println("productJson"+productJson);
        System.out.println("images: "+newImages);
        try {   
            ObjectMapper mapper = new ObjectMapper();
            ProductUpdateRequest request = mapper.readValue(productJson, ProductUpdateRequest.class);
            return APIResponse.<ProductInfoDTO>builder()
                    .result(productService.updateProduct(productId,request,newImages))
                    .build();

        } catch (Exception e) {
            return APIResponse.error("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/products/{productId}")
    public APIResponse<String> deleteProduct(@PathVariable("productId") Integer productId){
        return APIResponse.<String>builder()
                .result(productService.deleteProduct(productId))
                .build();
    }
    @GetMapping("product/recommend")
    public APIResponse<List<ProductHome>> getRecommend(
            @RequestParam(value = "sessionId",required = false) String sessionId
    ){
        return APIResponse.<List<ProductHome>>builder()
                .result(recommendService.getRecommend(sessionId))
                .build();
    }
}
