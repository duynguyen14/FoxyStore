package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Entity
@Table(name = "BILLDETAIL")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetail {
    @EmbeddedId
     BillDetailId id;

    @Column(name = "Quantity")
    Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("billId")
    @JoinColumn(name = "bill_id")
    Bill bill;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productSizeId")
    @JoinColumn(name = "product_size_id")
    ProductSize productSize;
}
