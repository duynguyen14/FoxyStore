package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "SIZE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Size {
    @Id
    @Column(name = "SizeId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer sizeId;

    @Column(name = "SizeName")
    String sizeName;

    @JsonIgnore
    @OneToMany(mappedBy = "size")
    Set<ProductSize> productSizes;

}
