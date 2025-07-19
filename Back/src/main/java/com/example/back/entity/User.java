package com.example.back.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.LazyToOne;
import org.hibernate.annotations.LazyToOneOption;

import java.time.LocalDate;
import java.util.*;


@Entity
@Table(name = "USER",
    indexes = {@Index(name = "idx_user_name", columnList = "user_name")}
)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "Email")
    String email;

    @Column(name = "user_name",unique = true)
    String userName;

    @Column(name = "Password")
    String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider")
    AuthProvider authProvider;
    @Column(nullable = false)
    private Boolean emailVerified = false;
    @Column(name = "provider_id")
    String providerId;

    @Column(name = "Status")
    String status;

    @Column(name = "Gender")
    String gender;

    @Column(name = "DOB")
    LocalDate dob;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Address> addresses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Bill> bills;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Review> reviews;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @LazyToOne(LazyToOneOption.PROXY)
    ShoppingCart shoppingCart;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<FavoriteProduct> favoriteProducts;
}

