package com.example.back.controllers;

import com.example.back.dto.request.ShoppingCart.CartRequest;
import com.example.back.dto.request.ShoppingCart.UpdateCartRequest;
import com.example.back.dto.response.APIResponse;
import com.example.back.dto.response.Cart.CartResponse;
import com.example.back.service.ShoppingCartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.key}/")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ShoppingCartController {

    ShoppingCartService shoppingCartService;

    @PostMapping("cart")
    public APIResponse<CartResponse> addCartResponseAPIResponse(@RequestBody @Valid CartRequest cartRequest){
        System.out.println("id: "+cartRequest.getProductId());
        System.out.println("quantity: "+cartRequest.getQuantity());
        System.out.println("size name :"+cartRequest.getSizeName());
        return APIResponse.<CartResponse>builder()
                .result(shoppingCartService.addCartResponse(cartRequest))
                .build();
    }
    @GetMapping("cart")
    public APIResponse<List<CartResponse>> getCartResponse(){

        return  APIResponse.<List<CartResponse>>builder()
                .result(shoppingCartService.getCart())
                .build();
    }
    @DeleteMapping("cart/{productSizeId}")
    public APIResponse<List<CartResponse>> deleteProductSizeInCart(@PathVariable Integer productSizeId){
        return APIResponse.<List<CartResponse>>builder()
                .result(shoppingCartService.deleteShoppingCartDetail(productSizeId))
                .build();
    }
    @PatchMapping("cart/update")
    public APIResponse<List<CartResponse>> updateCartDetail(@RequestBody @Valid UpdateCartRequest updateCartRequest){
        return APIResponse.<List<CartResponse>>builder()
                .result(shoppingCartService.updateShoppingCartDetail(updateCartRequest))
                .build();
    }
}
