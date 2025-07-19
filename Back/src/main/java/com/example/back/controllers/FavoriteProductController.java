package com.example.back.controllers;

import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Product.FavoriteProductDTO;
import com.example.back.service.FavoriteProductService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.PackagePrivate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.key}/favorite")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class FavoriteProductController {
    FavoriteProductService favoriteProductService;
    @GetMapping("/getAll")
    public APIResponse<List<FavoriteProductDTO>> getAllFavoriteProduct(){
        return APIResponse.<List<FavoriteProductDTO>>builder()
                .result(favoriteProductService.getFavoriteProducts())
                .build();
    }

    @PostMapping("/{id}")
    public APIResponse<List<FavoriteProductDTO>> addFavoriteProduct(@PathVariable Integer id){
        return APIResponse.<List<FavoriteProductDTO>>builder()
                .result(favoriteProductService.addFavoriteProduct(id))
                .build();
    }
    @DeleteMapping("/{id}")
    public APIResponse<List<FavoriteProductDTO>> deleteFavoriteProduct(@PathVariable Integer id){
        return APIResponse.<List<FavoriteProductDTO>>builder()
                .result(favoriteProductService.deleteFavoriteProduct(id))
                .build();
    }
}
