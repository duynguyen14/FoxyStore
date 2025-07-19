package com.example.back.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class FavoriteProduct {

    @EmbeddedId
    FavoriteProductId favoriteProductId;

    @Column(name = "created_date")
    LocalDateTime createdDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @MapsId("userId")
    User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @MapsId("productId")
    Product product;
}
