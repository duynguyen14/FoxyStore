package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "IMAGE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Image {
    @Id
    @Column(name = "ImageId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer imageId;

    @Column(name = "Image")
    String image;

    @Column(name = "Description")
    String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ProductId")
    Product product;
}

