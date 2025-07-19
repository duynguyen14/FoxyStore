package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ADDRESS")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AddressId")
    Integer addressId;

    @Column(name = "City")
    String city;

    @Column(name = "Street")
    String street;

    @Column(name = "DetailedAddress")
    String detailedAddress;

    @Column(name = "Name")
    String name;

    @Column(name = "PhoneNumber")
    Integer phoneNumber;

    @Column(name = "isDefault")
    Boolean isDefault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Bill> bills = new ArrayList<>();
}
