package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "SALE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    Integer id;

    @Column(name = "sale_name")
    String name;

    @Column(name = "start_date")
    LocalDateTime start;

    @Column(name = "end_date")
    LocalDateTime end;
    @Column(name = "discount_percent")
    Integer discountPercent;

    @Column(name = "is_deleted")
    @Builder.Default
    Boolean isDeleted = false;

    @OneToMany(mappedBy = "sale",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<Product> products;

}
