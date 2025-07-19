package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CATALOG")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Catalog {
    @Id
    @Column(name = "CatalogId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer catalogId;

    @Column(name = "Name")
    String name;

    @Column(name = "IsDeleted",nullable = false)
    @Builder.Default
    Boolean isDeleted = false;

    @OneToMany(mappedBy = "catalog", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Category> categories = new ArrayList<>();
}

