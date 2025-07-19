package com.example.back.entity;

import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShoppingCartDetailId implements Serializable {
//    @Column(name = "ShoppingCartId")
    Integer shoppingCartId;

//    @Column(name = "ProductId")
    Integer productSizeId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShoppingCartDetailId that = (ShoppingCartDetailId) o;
        return Objects.equals(shoppingCartId, that.shoppingCartId) &&
                Objects.equals(productSizeId, that.productSizeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(shoppingCartId, productSizeId);
    }
}
