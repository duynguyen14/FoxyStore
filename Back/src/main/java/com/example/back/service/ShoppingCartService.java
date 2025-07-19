package com.example.back.service;

import com.example.back.dto.request.ShoppingCart.CartRequest;
import com.example.back.dto.request.ShoppingCart.UpdateCartRequest;
import com.example.back.dto.request.User.ActionDTO;
import com.example.back.dto.response.Cart.CartResponse;
import com.example.back.entity.*;
import com.example.back.enums.ActionUser;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ShoppingCartService {

    ProductRepository productRepository;
    SizeRepository sizeRepository;
    ProductSizeRepository productSizeRepository;
    UserRepository userRepository;
    ShoppingCartRepository shoppingCartRepository;
    ShoppingCartDetailRepository shoppingCartDetailRepository;
    BehaviorService behaviorService;
    User getCurrentUser() {
        Integer userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));
    }
    @Transactional
    public CartResponse addCartResponse(CartRequest cartRequest) {
        User user =getCurrentUser();
        ShoppingCart shoppingCart =shoppingCartRepository.findByUser(user).orElseGet(()->
                shoppingCartRepository.save(ShoppingCart.builder()
                        .user(user)
                        .build())
        );
//        System.out.println(cartRequest.getProductId());
        Product product =productRepository.findProductWithDetail(cartRequest.getProductId()).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        Size size =sizeRepository.findBySizeName(cartRequest.getSizeName()).orElseThrow(()-> new AppException(ErrorCodes.SIZE_NOT_FOUND));
        ProductSize productSize =productSizeRepository.findBySizeAndProduct(size,product).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        if(productSize.getQuantity()<cartRequest.getQuantity()){
            throw new AppException(ErrorCodes.PRODUCT_QUANTITY_UNAVAILABLE);
        }
        ShoppingCartDetailId shoppingCartDetailId =ShoppingCartDetailId.builder()
                .shoppingCartId(shoppingCart.getShoppingCartId())
                .productSizeId(productSize.getId())
                .build();
        ShoppingCartDetail shoppingCartDetail =shoppingCartDetailRepository.findByProductSizeAndShoppingCart(productSize,shoppingCart).orElseGet(ShoppingCartDetail::new);
        Integer quantity = shoppingCartDetail.getQuantity()==null? cartRequest.getQuantity() : cartRequest.getQuantity()+shoppingCartDetail.getQuantity();
        shoppingCartDetail =ShoppingCartDetail.builder()
                .id(shoppingCartDetailId)
                .shoppingCart(shoppingCart)
                .productSize(productSize)
                .quantity(quantity)
                .total(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                .build();
        shoppingCartDetailRepository.save(shoppingCartDetail);
//        log behavior
        ActionUser actionUser = ActionUser.ADD_TO_CART;
        ActionDTO actionDTO = ActionDTO.builder()
                .action(actionUser.getAction())
                .productId(product.getProductId())
                .build();
        behaviorService.createBehavior(actionDTO);
        return CartResponse.builder()
                .quantity(quantity)
                .price(shoppingCartDetail.getTotal())
                .productSizeId(productSize.getId())
                .images(product.getImages().stream().map(Image::getImage).collect(Collectors.toSet()))
                .productName(product.getName())
                .sizeName(size.getSizeName())
                .build();
    }

    @Transactional
    public List<CartResponse> getCart(){
        User user =getCurrentUser();
        ShoppingCart shoppingCart =shoppingCartRepository.findByUser(user).orElseGet(()->
                shoppingCartRepository.save(ShoppingCart.builder()
                        .user(user)
                        .build())
        );
        List<ShoppingCartDetail> shoppingCartDetail=shoppingCartDetailRepository.findByShoppingCart(shoppingCart);
        return shoppingCartDetail.stream().map(detail->{
            ProductSize productSize =detail.getProductSize();
            Product product= productSize.getProduct();
            Size size = productSize.getSize();
            return CartResponse.builder()
                    .productSizeId(productSize.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .images(product.getImages().stream().map(Image::getImage).collect(Collectors.toSet()))
                    .quantity(detail.getQuantity())
                    .sizeName(size.getSizeName())
                    .build();
        }).toList();
    }

    @Transactional
    public List<CartResponse> deleteShoppingCartDetail(Integer productSizeId){
        User user =getCurrentUser();
        ShoppingCart shoppingCart =shoppingCartRepository.findByUser(user).orElseThrow(()-> new AppException(ErrorCodes.SHOPPING_CART_NOT_FOUND));
        ProductSize productSize =productSizeRepository.findById(productSizeId).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        ShoppingCartDetail shoppingCartDetail =shoppingCartDetailRepository.findByProductSizeAndShoppingCart(productSize,shoppingCart).orElseThrow(()-> new AppException(ErrorCodes.SHOPPING_CART_DETAIL_NOT_FOUND));
        shoppingCartDetailRepository.delete(shoppingCartDetail);
        List<ShoppingCartDetail> shoppingCartDetails =shoppingCartDetailRepository.findByShoppingCart(shoppingCart);
        return shoppingCartDetails.stream().map(detail->{
            Product product =detail.getProductSize().getProduct();
            Size size =detail.getProductSize().getSize();
            ProductSize productSize2 =detail.getProductSize();
            return CartResponse.builder()
                    .productSizeId(productSize2.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .images(product.getImages().stream().map(Image::getImage).collect(Collectors.toSet()))
                    .quantity(detail.getQuantity())
                    .sizeName(size.getSizeName())
                    .build();
        }).toList();
    }
    public List<CartResponse> updateShoppingCartDetail(UpdateCartRequest updateCartRequest){
        User user =getCurrentUser();
        ShoppingCart shoppingCart =shoppingCartRepository.findByUser(user).orElseThrow(()-> new AppException(ErrorCodes.SHOPPING_CART_NOT_FOUND));
        ProductSize productSize =productSizeRepository.findById(updateCartRequest.getProductSizeId()).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        ShoppingCartDetail shoppingCartDetail =shoppingCartDetailRepository.findByProductSizeAndShoppingCart(productSize, shoppingCart).orElseThrow(()-> new AppException(ErrorCodes.SHOPPING_CART_DETAIL_NOT_FOUND));
        shoppingCartDetail.setQuantity(updateCartRequest.getQuantity());
        shoppingCartDetailRepository.save(shoppingCartDetail);
        List<ShoppingCartDetail> shoppingCartDetails =shoppingCartDetailRepository.findByShoppingCart(shoppingCart);
        return shoppingCartDetails.stream().map(detail->{
            Product product =detail.getProductSize().getProduct();
            Size size =detail.getProductSize().getSize();
            ProductSize productSize2 =detail.getProductSize();
            return CartResponse.builder()
                    .productSizeId(productSize2.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .images(product.getImages().stream().map(Image::getImage).collect(Collectors.toSet()))
                    .quantity(detail.getQuantity())
                    .sizeName(size.getSizeName())
                    .build();
        }).toList();
    }
}