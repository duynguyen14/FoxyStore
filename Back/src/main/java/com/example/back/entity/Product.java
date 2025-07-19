package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "PRODUCT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @Column(name = "ProductId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer productId;

    @Column(name = "Name")
    String name;

    @Column(name = "Price")
    BigDecimal price;

    @Column(name = "Quantity")
    Integer quantity;

    @Column(name = "Description")
    String description;

    @Column(name = "CreatedDate")
    LocalDateTime createdDate;

    @Column(name = "SoldCount")
    Integer soldCount;

    @Column(name = "is_deleted")
    @Builder.Default
    Boolean isDeleted = false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryId")
    Category category;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL,orphanRemoval = true,fetch = FetchType.LAZY)
    Set<Image> images = new HashSet<>();

    @JsonIgnore
    @OrderBy("time DESC")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Review> reviews = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    Set<ProductSize> productSizes;


    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<FavoriteProduct> favoriteProducts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    Sale sale;
}
