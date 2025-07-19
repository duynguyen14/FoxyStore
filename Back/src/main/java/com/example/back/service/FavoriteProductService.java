package com.example.back.service;

import com.example.back.dto.request.User.ActionDTO;
import com.example.back.dto.response.Product.FavoriteProductDTO;
import com.example.back.entity.FavoriteProduct;
import com.example.back.entity.FavoriteProductId;
import com.example.back.entity.Product;
import com.example.back.entity.User;
import com.example.back.enums.ActionUser;
import com.example.back.enums.ErrorCodes;
import com.example.back.exception.AppException;
import com.example.back.mapper.ProductMapper;
import com.example.back.repository.FavoriteProductRepository;
import com.example.back.repository.ProductRepository;
import com.example.back.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class FavoriteProductService {
    UserRepository userRepository;
    FavoriteProductRepository favoriteProductRepository;
    ProductMapper productMapper;
    ProductRepository productRepository;
    BehaviorService behaviorService;
    User getCurrentUser() {
        Integer userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCodes.USER_NOT_FOUND));
    }
    public List<FavoriteProductDTO>  getFavoriteProducts(){
        User user =getCurrentUser();
        Set<FavoriteProduct> favoriteProducts = favoriteProductRepository.getFavoriteProductByUser(user);
        return favoriteProducts.stream().map(productMapper::toFavoriteProduct).toList();
    }
    @Transactional
    public List<FavoriteProductDTO> addFavoriteProduct(Integer id){
        User user =getCurrentUser();
        Product product = productRepository.findProductWithDetail(id).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        FavoriteProductId favoriteProductId = new FavoriteProductId(user.getId(), product.getProductId());
        FavoriteProduct favoriteProduct =FavoriteProduct.builder()
                .favoriteProductId(favoriteProductId)
                .product(product)
                .user(user)
                .createdDate(LocalDateTime.now())
                .build();
//        log behavior
        ActionUser actionUser = ActionUser.ADD_TO_WISHLIST;
        ActionDTO actionDTO = ActionDTO.builder()
                .productId(product.getProductId())
                .action(actionUser.getAction())
                .build();
        behaviorService.createBehavior(actionDTO);

        favoriteProductRepository.save(favoriteProduct);
        Set<FavoriteProduct> favoriteProducts = favoriteProductRepository.getFavoriteProductByUser(user);
        return favoriteProducts.stream().map(productMapper::toFavoriteProduct).toList();
    }
    @Transactional
    public List<FavoriteProductDTO> deleteFavoriteProduct(Integer id){
        User user =getCurrentUser();
        Product product = productRepository.findProductWithDetail(id).orElseThrow(()-> new AppException(ErrorCodes.PRODUCT_NOT_FOUND));
        FavoriteProduct favoriteProduct =favoriteProductRepository.findByUserAndProduct(user,product).orElseThrow(()-> new AppException(ErrorCodes.FAVORITE_PRODUCT_NOT_FOUND));
        favoriteProductRepository.delete(favoriteProduct);
        Set<FavoriteProduct> favoriteProducts = favoriteProductRepository.getFavoriteProductByUser(user);
        return favoriteProducts.stream().map(productMapper::toFavoriteProduct).toList();
    }
}
