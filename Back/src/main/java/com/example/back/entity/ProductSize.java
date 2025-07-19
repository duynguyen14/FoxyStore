package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_size_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "size_id")
    Size size;

    @ManyToOne
    @JoinColumn(name = "product_id")
    Product product;

    Integer quantity;

//    @OneToMany(mappedBy = "productSize",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
//    ShoppingCartDetail shoppingCartDetail;

    @OneToMany(mappedBy = "productSize",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    List<BillDetail> billDetail;
}
