package com.example.back.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name = "SHOPPINGCARTDETAIL")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShoppingCartDetail {
    @EmbeddedId
    ShoppingCartDetailId id;

    @Column(name = "Quantity")
    Integer quantity;

    @Column(name = "Total")
    BigDecimal total;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("shoppingCartId")
    @JoinColumn(name = "shopping_cart_id")
    ShoppingCart shoppingCart;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productSizeId")
    @JoinColumn(name = "product_size_id")
    ProductSize productSize;
}
